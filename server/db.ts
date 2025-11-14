import { and, eq, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  InsertUser,
  users,
  households,
  userHouseholds,
  expenses,
  fixedExpenses,
  projects,
  itemsControl,
  dailyRevenue,
  expenseCategories,
  whatsappSettings,
  creditCards,
  creditCardStatements,
  creditCardPurchases,
  purchaseInstallments,
  debts,
  debtPayments,
  categoryLimits,
  dueEvents,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: mysql.Pool | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
	if (!_db && process.env.DATABASE_URL) {
		try {
			if (!_pool) {
				_pool = mysql.createPool(process.env.DATABASE_URL);
			}
			_db = drizzle(_pool);
		} catch (error) {
			console.warn("[Database] Failed to connect:", error);
			_db = null;
		}
	}
	return _db;
}

export async function closeDb() {
  if (_pool) {
    try {
      await _pool.end();
    } catch (error) {
      console.warn("[Database] Failed to close pool:", error);
    }
  }
  _pool = null;
  _db = null;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// === HOUSEHOLD QUERIES ===
export async function getOrCreateHousehold(userId: number, householdName: string = "Minha Família") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if user already has a household
  const existingUserHousehold = await db
    .select()
    .from(userHouseholds)
    .where(eq(userHouseholds.userId, userId))
    .limit(1);

  if (existingUserHousehold.length > 0) {
    return existingUserHousehold[0];
  }

  // Create new household
  const [household] = await db
    .insert(households)
    .values({ name: householdName })
    .execute();

  // Add user to household
  await db
    .insert(userHouseholds)
    .values({
      userId,
      householdId: household.insertId as number,
      role: "owner",
    })
    .execute();

  return { userId, householdId: household.insertId as number, role: "owner" as const };
}

export async function getUserHousehold(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(userHouseholds)
    .where(eq(userHouseholds.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

// === EXPENSE QUERIES ===
export async function addExpense(
  householdId: number,
  userId: number,
  description: string,
  amount: number,
  categoryId: number | null,
  expenseDate: Date = new Date(),
  source: "whatsapp" | "web" | "manual" = "web"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(expenses)
    .values({
      householdId,
      userId,
      categoryId,
      description,
      amount,
      expenseDate,
      source,
    })
    .execute();

  return result;
}

export async function getExpenses(householdId: number, limit: number = 100, offset: number = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(expenses)
    .where(eq(expenses.householdId, householdId))
    .orderBy(expenses.expenseDate)
    .limit(limit)
    .offset(offset);
}

export async function getExpensesByMonth(householdId: number, year: number, month: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return db
    .select()
    .from(expenses)
    .where(
      and(
        eq(expenses.householdId, householdId),
        gte(expenses.expenseDate, startDate),
        lte(expenses.expenseDate, endDate)
      )
    )
    .orderBy(expenses.expenseDate);
}

// === FIXED EXPENSE QUERIES ===
export async function addFixedExpense(
  householdId: number,
  name: string,
  amount: number,
  dueDay: number,
  categoryId: number | null
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .insert(fixedExpenses)
    .values({
      householdId,
      categoryId,
      name,
      amount,
      dueDay,
      status: "pending",
    })
    .execute();
}

export async function getFixedExpenses(householdId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(fixedExpenses)
    .where(eq(fixedExpenses.householdId, householdId));
}

// === PROJECT QUERIES ===
export async function addProject(
  householdId: number,
  name: string,
  targetAmount: number,
  targetMonths: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .insert(projects)
    .values({
      householdId,
      name,
      targetAmount,
      targetMonths,
      savedAmount: 0,
    })
    .execute();
}

export async function getProjects(householdId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(projects)
    .where(eq(projects.householdId, householdId));
}

// === ITEMS CONTROL QUERIES ===
export async function addItem(
  householdId: number,
  itemName: string,
  amount: number | null = null,
  dueDate: Date | null = null
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .insert(itemsControl)
    .values({
      householdId,
      itemName,
      amount,
      dueDate,
      status: "pending",
    })
    .execute();
}

export async function getItems(householdId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(itemsControl)
    .where(eq(itemsControl.householdId, householdId))
    .orderBy(itemsControl.createdAt);
}

export async function getItemById(itemId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const rows = await db
    .select()
    .from(itemsControl)
    .where(eq(itemsControl.id, itemId))
    .limit(1);

  return rows.length > 0 ? rows[0] : null;
}

export async function updateItemStatus(
  itemId: number,
  status: "pending" | "purchased" | "paid"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(itemsControl)
    .set({ status, updatedAt: new Date() })
    .where(eq(itemsControl.id, itemId))
    .execute();
}

// === REVENUE QUERIES ===
export async function addDailyRevenue(
  householdId: number,
  amount: number,
  revenueDate: Date = new Date(),
  description: string = ""
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .insert(dailyRevenue)
    .values({
      householdId,
      amount,
      revenueDate,
      description,
    })
    .execute();
}

export async function getDailyRevenueByMonth(householdId: number, year: number, month: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return db
    .select()
    .from(dailyRevenue)
    .where(
      and(
        eq(dailyRevenue.householdId, householdId),
        gte(dailyRevenue.revenueDate, startDate),
        lte(dailyRevenue.revenueDate, endDate)
      )
    )
    .orderBy(dailyRevenue.revenueDate);
}

// === CATEGORY QUERIES ===
export async function getOrCreateCategories(householdId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(expenseCategories)
    .where(eq(expenseCategories.householdId, householdId));

  if (existing.length > 0) return existing;

  // Create default categories
  const defaultCategories = [
    { name: "Mercado", color: "#A8D08D", keywords: "comper,mercado,supermercado,biglar,atacadão" },
    { name: "Combustível", color: "#F4B183", keywords: "gasolina,combustível,posto,etanol,diesel" },
    { name: "Vestuário", color: "#C5E0B4", keywords: "renner,youcom,roupa,loja,calçado,sapato" },
    { name: "Alimentação", color: "#FFD966", keywords: "mc,almoço,jantar,lanche,açaí,dog,refri,restaurante,ifood" },
    { name: "Transporte", color: "#9DC3E6", keywords: "uber,estacionamento,taxi,ônibus,99,henry" },
    { name: "Saúde", color: "#F8CBAD", keywords: "remédio,farmácia,exame,médico,salão,hospital,dentista" },
    { name: "Educação", color: "#B4C7E7", keywords: "livro,leitura,curso,escola,faculdade" },
    { name: "Entretenimento", color: "#D5A6BD", keywords: "cinema,teatro,show,festa,parque" },
    { name: "Suplementos", color: "#C9C9C9", keywords: "suplemento,whey,creatina,vitamina" },
    { name: "Serviços", color: "#E7B8CE", keywords: "advogado,city" },
    { name: "Moradia", color: "#A8D08D", keywords: "aluguel,condomínio,energia,água" },
    { name: "Outros", color: "#E7E6E6", keywords: "" },
  ];

  await db
    .insert(expenseCategories)
    .values(defaultCategories.map((cat) => ({ ...cat, householdId })));

  return db
    .select()
    .from(expenseCategories)
    .where(eq(expenseCategories.householdId, householdId));
}

// === ANALYTICS QUERIES ===
export async function getTotalExpensesByMonth(householdId: number, year: number, month: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const expensesList = await getExpensesByMonth(householdId, year, month);
  return expensesList.reduce((sum: number, exp: { amount: number }) => sum + exp.amount, 0);
}

export async function getTotalFixedExpenses(householdId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const fixedList = await getFixedExpenses(householdId);
  return fixedList.reduce((sum: number, exp: { amount: number }) => sum + exp.amount, 0);
}

export async function getExpensesByCategory(householdId: number, year: number, month: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const expensesList = await getExpensesByMonth(householdId, year, month);
  const byCategory: Record<string, { amount: number; count: number }> = {};

  for (const exp of expensesList) {
    const cat = exp.categoryId ? `cat_${exp.categoryId}` : "uncategorized";
    if (!byCategory[cat]) {
      byCategory[cat] = { amount: 0, count: 0 };
    }
    byCategory[cat].amount += exp.amount;
    byCategory[cat].count += 1;
  }

  return byCategory;
}

// === WHATSAPP HELPERS ===
export async function getHouseholdByPhoneNumber(phoneRaw: string): Promise<number | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const phone = phoneRaw.replace(/^whatsapp:/, "").trim();

  const rows = await db
    .select()
    .from(whatsappSettings)
    .where(eq(whatsappSettings.phoneNumber, phone))
    .limit(1);

  if (rows.length === 0) return null;
  return rows[0].householdId;
}

export async function getDefaultActorUserId(householdId: number): Promise<number | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const members = await db
    .select()
    .from(userHouseholds)
    .where(eq(userHouseholds.householdId, householdId));

  if (members.length === 0) return null;
  const owner = members.find((m: { role: string }) => m.role === "owner");
  return (owner || members[0]).userId;
}

// === CREDIT CARDS ===
export async function addCreditCard(
  householdId: number,
  name: string,
  creditLimit: number,
  closingDay: number,
  dueDay: number,
  options?: { brand?: "visa"|"mastercard"|"elo"|"amex"|"hipercard"|"other"; issuer?: string; benefits?: string }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .insert(creditCards)
    .values({
      householdId,
      name,
      creditLimit,
      closingDay,
      dueDay,
      brand: options?.brand ?? "other",
      issuer: options?.issuer ?? null,
      benefits: options?.benefits ?? null,
      isActive: true,
    })
    .execute();
}

export async function getCreditCards(householdId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(creditCards).where(eq(creditCards.householdId, householdId));
}

export async function createOrGetStatement(
  householdId: number,
  cardId: number,
  monthYear: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(creditCardStatements)
    .where(and(eq(creditCardStatements.householdId, householdId), eq(creditCardStatements.cardId, cardId), eq(creditCardStatements.monthYear, monthYear)))
    .limit(1);
  if (existing.length > 0) return existing[0];

  const res = await db
    .insert(creditCardStatements)
    .values({ householdId, cardId, monthYear, totalAmount: 0, status: "open" })
    .execute();
  const id = (res as unknown as { insertId: number }).insertId;
  return { id, householdId, cardId, monthYear, totalAmount: 0, status: "open" as const };
}

export async function addCreditCardPurchase(
  householdId: number,
  cardId: number,
  description: string,
  totalAmount: number,
  purchaseDate: Date = new Date(),
  options?: {
    merchant?: string;
    categoryId?: number | null;
    installments?: number;
    firstDueDate?: Date | null;
    statementMonthYear?: string | null;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let statementId: number | null = null;
  if (options?.statementMonthYear) {
    const st = await createOrGetStatement(householdId, cardId, options.statementMonthYear);
    statementId = (st as any).id ?? (st as unknown as { id: number }).id;
  }

  const res = await db
    .insert(creditCardPurchases)
    .values({
      householdId,
      cardId,
      statementId,
      description,
      merchant: options?.merchant ?? null,
      categoryId: options?.categoryId ?? null,
      totalAmount,
      installments: options?.installments ?? 1,
      firstDueDate: options?.firstDueDate ?? null,
      status: "ongoing",
      purchaseDate,
    })
    .execute();

  const purchaseId = (res as unknown as { insertId: number }).insertId;

  const installments = options?.installments ?? 1;
  if (installments > 1) {
    const perInstallment = Math.floor(totalAmount / installments);
    const remainder = totalAmount - perInstallment * installments;
    const startDate = options?.firstDueDate ?? purchaseDate;
    for (let i = 1; i <= installments; i++) {
      const due = new Date(startDate);
      due.setMonth(startDate.getMonth() + (i - 1));
      const amount = perInstallment + (i === installments ? remainder : 0);
      await db
        .insert(purchaseInstallments)
        .values({
          purchaseId,
          installmentNumber: i,
          amount,
          dueDate: due,
          status: "pending",
        })
        .execute();
    }
  }

  return { insertId: purchaseId };
}

export async function getCreditCardPurchasesByCard(householdId: number, cardId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select()
    .from(creditCardPurchases)
    .where(and(eq(creditCardPurchases.householdId, householdId), eq(creditCardPurchases.cardId, cardId)))
    .orderBy(creditCardPurchases.purchaseDate);
}

export async function getInstallmentsByPurchase(purchaseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(purchaseInstallments).where(eq(purchaseInstallments.purchaseId, purchaseId));
}

export async function getCreditCardPurchaseById(purchaseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const rows = await db
    .select()
    .from(creditCardPurchases)
    .where(eq(creditCardPurchases.id, purchaseId))
    .limit(1);

  return rows.length > 0 ? rows[0] : null;
}

export async function getInstallmentById(installmentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const rows = await db
    .select()
    .from(purchaseInstallments)
    .where(eq(purchaseInstallments.id, installmentId))
    .limit(1);

  return rows.length > 0 ? rows[0] : null;
}

export async function markInstallmentPaid(installmentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(purchaseInstallments)
    .set({ status: "paid", paidAt: new Date(), updatedAt: new Date() })
    .where(eq(purchaseInstallments.id, installmentId))
    .execute();
}

// === DEBTS ===
export async function addDebt(
  householdId: number,
  creditorName: string,
  principalAmount: number,
  options?: { interestRateBps?: number; startDate?: Date; dueDate?: Date; notes?: string }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .insert(debts)
    .values({
      householdId,
      creditorName,
      principalAmount,
      interestRateBps: options?.interestRateBps ?? null,
      startDate: options?.startDate ?? null,
      dueDate: options?.dueDate ?? null,
      status: "ongoing",
      notes: options?.notes ?? null,
    })
    .execute();
}

export async function getDebts(householdId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(debts).where(eq(debts.householdId, householdId));
}

export async function getDebtById(debtId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const rows = await db
    .select()
    .from(debts)
    .where(eq(debts.id, debtId))
    .limit(1);

  return rows.length > 0 ? rows[0] : null;
}

export async function addDebtPayment(debtId: number, amount: number, paymentDate: Date = new Date(), method: "transfer"|"cash"|"card"|"other" = "transfer") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .insert(debtPayments)
    .values({ debtId, amount, paymentDate, method })
    .execute();
}

export async function getDebtPayments(debtId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(debtPayments).where(eq(debtPayments.debtId, debtId));
}

// === CATEGORY LIMITS ===
export async function upsertCategoryLimit(
  householdId: number,
  categoryId: number,
  monthYear: string,
  monthlyLimit: number,
  notifyWhatsapp: boolean = true
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Try update, otherwise insert
  const existing = await db
    .select()
    .from(categoryLimits)
    .where(and(eq(categoryLimits.householdId, householdId), eq(categoryLimits.categoryId, categoryId), eq(categoryLimits.monthYear, monthYear)))
    .limit(1);

  if (existing.length > 0) {
    return db
      .update(categoryLimits)
      .set({ monthlyLimit, notifyWhatsapp, updatedAt: new Date() })
      .where(eq(categoryLimits.id, existing[0].id as number))
      .execute();
  }

  return db
    .insert(categoryLimits)
    .values({ householdId, categoryId, monthYear, monthlyLimit, notifyWhatsapp })
    .execute();
}

export async function getCategoryLimitsByMonth(householdId: number, monthYear: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select()
    .from(categoryLimits)
    .where(and(eq(categoryLimits.householdId, householdId), eq(categoryLimits.monthYear, monthYear)));
}

// === DUE EVENTS ===
export async function addDueEvent(
  householdId: number,
  title: string,
  dueDate: Date,
  options?: { categoryId?: number | null; amount?: number | null }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .insert(dueEvents)
    .values({ householdId, title, categoryId: options?.categoryId ?? null, amount: options?.amount ?? null, dueDate, status: "pending" })
    .execute();
}

export async function getDueEventsByMonth(householdId: number, year: number, month: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  return db
    .select()
    .from(dueEvents)
    .where(and(eq(dueEvents.householdId, householdId), gte(dueEvents.dueDate, startDate), lte(dueEvents.dueDate, endDate)))
    .orderBy(dueEvents.dueDate);
}

export async function getDueEventById(eventId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const rows = await db
    .select()
    .from(dueEvents)
    .where(eq(dueEvents.id, eventId))
    .limit(1);

  return rows.length > 0 ? rows[0] : null;
}

export async function updateDueEventStatus(eventId: number, status: "pending"|"paid"|"overdue") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(dueEvents)
    .set({ status, updatedAt: new Date() })
    .where(eq(dueEvents.id, eventId))
    .execute();
}
