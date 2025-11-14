import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getOrCreateHousehold,
  getUserHousehold,
  addExpense,
  getExpenses,
  getExpensesByMonth,
  addFixedExpense,
  getFixedExpenses,
  addProject,
  getProjects,
  addItem,
  getItems,
  updateItemStatus,
  addDailyRevenue,
  getDailyRevenueByMonth,
  getOrCreateCategories,
  getTotalExpensesByMonth,
  getTotalFixedExpenses,
  getExpensesByCategory,
  addCreditCard,
  getCreditCards,
  addCreditCardPurchase,
  getCreditCardPurchasesByCard,
  getInstallmentsByPurchase,
  markInstallmentPaid,
  addDebt,
  getDebts,
  addDebtPayment,
  getDebtPayments,
  upsertCategoryLimit,
  getCategoryLimitsByMonth,
  addDueEvent,
  getDueEventsByMonth,
  updateDueEventStatus,
  getItemById,
  getCreditCardPurchaseById,
  getInstallmentById,
  getDebtById,
  getDueEventById,
} from "./db";
import { notifyExpenseAdded, notifyItemPaid, notifyMonthlySummary } from "./whatsapp";

const expenseRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        description: z.string().min(1),
        amount: z.number().positive(),
        categoryId: z.number().optional(),
        expenseDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userHousehold = await getUserHousehold(ctx.user.id);
      if (!userHousehold) throw new Error("User household not found");

      const result = await addExpense(
        userHousehold.householdId,
        ctx.user.id,
        input.description,
        Math.round(input.amount * 100),
        input.categoryId || null,
        input.expenseDate
      );

      await notifyExpenseAdded(ctx.user.name || "Usuario", input.description, input.amount);

      return result;
    }),

  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(100),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const userHousehold = await getUserHousehold(ctx.user.id);
      if (!userHousehold) throw new Error("User household not found");

      const expenses = await getExpenses(userHousehold.householdId, input.limit, input.offset);
      return expenses.map((exp) => ({
        ...exp,
        amount: exp.amount / 100, // convert back to dollars
      }));
    }),

  byMonth: protectedProcedure
    .input(
      z.object({
        year: z.number(),
        month: z.number().min(1).max(12),
      })
    )
    .query(async ({ ctx, input }) => {
      const userHousehold = await getUserHousehold(ctx.user.id);
      if (!userHousehold) throw new Error("User household not found");

      const expenses = await getExpensesByMonth(
        userHousehold.householdId,
        input.year,
        input.month
      );
      return expenses.map((exp) => ({
        ...exp,
        amount: exp.amount / 100,
      }));
    }),
});

const fixedExpenseRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        amount: z.number().positive(),
        dueDay: z.number().min(1).max(31),
        categoryId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userHousehold = await getUserHousehold(ctx.user.id);
      if (!userHousehold) throw new Error("User household not found");

      return addFixedExpense(
        userHousehold.householdId,
        input.name,
        Math.round(input.amount * 100),
        input.dueDay,
        input.categoryId || null
      );
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const userHousehold = await getUserHousehold(ctx.user.id);
    if (!userHousehold) throw new Error("User household not found");

    const expenses = await getFixedExpenses(userHousehold.householdId);
    return expenses.map((exp) => ({
      ...exp,
      amount: exp.amount / 100,
    }));
  }),
});

const projectRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        targetAmount: z.number().positive(),
        targetMonths: z.number().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userHousehold = await getUserHousehold(ctx.user.id);
      if (!userHousehold) throw new Error("User household not found");

      return addProject(
        userHousehold.householdId,
        input.name,
        Math.round(input.targetAmount * 100),
        input.targetMonths
      );
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const userHousehold = await getUserHousehold(ctx.user.id);
    if (!userHousehold) throw new Error("User household not found");

    const projects = await getProjects(userHousehold.householdId);
    return projects.map((proj) => ({
      ...proj,
      targetAmount: proj.targetAmount / 100,
      savedAmount: proj.savedAmount / 100,
    }));
  }),
});

const itemsRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        itemName: z.string().min(1),
        amount: z.number().optional(),
        dueDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userHousehold = await getUserHousehold(ctx.user.id);
      if (!userHousehold) throw new Error("User household not found");

      return addItem(
        userHousehold.householdId,
        input.itemName,
        input.amount ? Math.round(input.amount * 100) : null,
        input.dueDate || null
      );
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const userHousehold = await getUserHousehold(ctx.user.id);
    if (!userHousehold) throw new Error("User household not found");

    const items = await getItems(userHousehold.householdId);
    return items.map((item) => ({
      ...item,
      amount: item.amount ? item.amount / 100 : null,
    }));
  }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        itemId: z.number(),
        status: z.enum(["pending", "purchased", "paid"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userHousehold = await getUserHousehold(ctx.user.id);
      if (!userHousehold) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User household not found" });
      }

      const item = await getItemById(input.itemId);
      if (!item || item.householdId !== userHousehold.householdId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Item does not belong to this household" });
      }

      const result = await updateItemStatus(input.itemId, input.status);

      if (input.status === "paid") {
        await notifyItemPaid(
          item.itemName,
          item.amount ? item.amount / 100 : undefined
        );
      }

      return result;
    }),
});

const revenueRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        revenueDate: z.date().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userHousehold = await getUserHousehold(ctx.user.id);
      if (!userHousehold) throw new Error("User household not found");

      return addDailyRevenue(
        userHousehold.householdId,
        Math.round(input.amount * 100),
        input.revenueDate,
        input.description || ""
      );
    }),

  byMonth: protectedProcedure
    .input(
      z.object({
        year: z.number(),
        month: z.number().min(1).max(12),
      })
    )
    .query(async ({ ctx, input }) => {
      const userHousehold = await getUserHousehold(ctx.user.id);
      if (!userHousehold) throw new Error("User household not found");

      const revenue = await getDailyRevenueByMonth(
        userHousehold.householdId,
        input.year,
        input.month
      );
      return revenue.map((rev) => ({
        ...rev,
        amount: rev.amount / 100,
      }));
    }),
});

const dashboardRouter = router({
  summary: protectedProcedure
    .input(
      z.object({
        year: z.number(),
        month: z.number().min(1).max(12),
      })
    )
    .query(async ({ ctx, input }) => {
      const userHousehold = await getUserHousehold(ctx.user.id);
      if (!userHousehold) throw new Error("User household not found");

      const householdId = userHousehold.householdId;

      const totalExpenses = await getTotalExpensesByMonth(householdId, input.year, input.month);
      const totalFixedExpenses = await getTotalFixedExpenses(householdId);
      const revenue = await getDailyRevenueByMonth(householdId, input.year, input.month);
      const totalRevenue = revenue.reduce((sum, r) => sum + r.amount, 0);
      const balance = totalRevenue - totalExpenses - totalFixedExpenses;

      return {
        totalExpenses: totalExpenses / 100,
        totalFixedExpenses: totalFixedExpenses / 100,
        totalRevenue: totalRevenue / 100,
        balance: balance / 100,
      };
    }),
});

const categoriesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userHousehold = await getUserHousehold(ctx.user.id);
    if (!userHousehold) throw new Error("User household not found");

    return getOrCreateCategories(userHousehold.householdId);
  }),
});

// Credit Cards
const cardsRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        creditLimit: z.number().positive(),
        closingDay: z.number().min(1).max(31),
        dueDay: z.number().min(1).max(31),
        brand: z.enum(["visa","mastercard","elo","amex","hipercard","other"]).optional(),
        issuer: z.string().optional(),
        benefits: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const household = await getUserHousehold(ctx.user.id);
      if (!household) throw new Error("User household not found");
      return addCreditCard(
        household.householdId,
        input.name,
        Math.round(input.creditLimit * 100),
        input.closingDay,
        input.dueDay,
        { brand: input.brand, issuer: input.issuer, benefits: input.benefits }
      );
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const household = await getUserHousehold(ctx.user.id);
    if (!household) throw new Error("User household not found");
    const cards = await getCreditCards(household.householdId);
    return cards.map(c => ({
      ...c,
      creditLimit: c.creditLimit / 100,
    }));
  }),
});

// Purchases & Installments
const purchasesRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        cardId: z.number(),
        description: z.string().min(1),
        totalAmount: z.number().positive(),
        purchaseDate: z.date().optional(),
        merchant: z.string().optional(),
        categoryId: z.number().optional(),
        installments: z.number().default(1),
        firstDueDate: z.date().optional(),
        statementMonthYear: z.string().regex(/^\d{4}-\d{2}$/).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const household = await getUserHousehold(ctx.user.id);
      if (!household) throw new Error("User household not found");
      const res = await addCreditCardPurchase(
        household.householdId,
        input.cardId,
        input.description,
        Math.round(input.totalAmount * 100),
        input.purchaseDate,
        {
          merchant: input.merchant,
          categoryId: input.categoryId ?? null,
          installments: input.installments,
          firstDueDate: input.firstDueDate ?? null,
          statementMonthYear: input.statementMonthYear ?? null,
        }
      );
      return res;
    }),

  byCard: protectedProcedure
    .input(z.object({ cardId: z.number() }))
    .query(async ({ ctx, input }) => {
      const household = await getUserHousehold(ctx.user.id);
      if (!household) throw new Error("User household not found");
      const purchases = await getCreditCardPurchasesByCard(household.householdId, input.cardId);
      return purchases.map(p => ({
        ...p,
        totalAmount: p.totalAmount / 100,
      }));
    }),

  installments: protectedProcedure
    .input(z.object({ purchaseId: z.number() }))
    .query(async ({ ctx, input }) => {
      const household = await getUserHousehold(ctx.user.id);
      if (!household) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User household not found" });
      }

      const purchase = await getCreditCardPurchaseById(input.purchaseId);
      if (!purchase || purchase.householdId !== household.householdId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Purchase does not belong to this household" });
      }

      const inst = await getInstallmentsByPurchase(input.purchaseId);
      return inst.map(i => ({ ...i, amount: i.amount / 100 }));
    }),

  markPaid: protectedProcedure
    .input(z.object({ installmentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const household = await getUserHousehold(ctx.user.id);
      if (!household) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User household not found" });
      }

      const installment = await getInstallmentById(input.installmentId);
      if (!installment || installment.householdId !== household.householdId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Installment does not belong to this household" });
      }

      return markInstallmentPaid(input.installmentId);
    }),
});

// Debts
const debtsRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        creditorName: z.string().min(1),
        principalAmount: z.number().positive(),
        interestRateBps: z.number().optional(),
        startDate: z.date().optional(),
        dueDate: z.date().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const h = await getUserHousehold(ctx.user.id);
      if (!h) throw new Error("User household not found");
      return addDebt(
        h.householdId,
        input.creditorName,
        Math.round(input.principalAmount * 100),
        {
          interestRateBps: input.interestRateBps,
          startDate: input.startDate,
          dueDate: input.dueDate,
          notes: input.notes,
        }
      );
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const h = await getUserHousehold(ctx.user.id);
    if (!h) throw new Error("User household not found");
    const rows = await getDebts(h.householdId);
    return rows.map(d => ({ ...d, principalAmount: d.principalAmount / 100 }));
  }),

  addPayment: protectedProcedure
    .input(z.object({ debtId: z.number(), amount: z.number().positive(), paymentDate: z.date().optional(), method: z.enum(["transfer","cash","card","other"]).default("transfer") }))
    .mutation(async ({ ctx, input }) => {
      const household = await getUserHousehold(ctx.user.id);
      if (!household) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User household not found" });
      }

      const debt = await getDebtById(input.debtId);
      if (!debt || debt.householdId !== household.householdId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Debt does not belong to this household" });
      }

      return addDebtPayment(input.debtId, Math.round(input.amount * 100), input.paymentDate, input.method);
    }),

  payments: protectedProcedure
    .input(z.object({ debtId: z.number() }))
    .query(async ({ ctx, input }) => {
      const household = await getUserHousehold(ctx.user.id);
      if (!household) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User household not found" });
      }

      const debt = await getDebtById(input.debtId);
      if (!debt || debt.householdId !== household.householdId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Debt does not belong to this household" });
      }

      const rows = await getDebtPayments(input.debtId);
      return rows.map(r => ({ ...r, amount: r.amount / 100 }));
    }),
});

// Category Limits
const limitsRouter = router({
  upsert: protectedProcedure
    .input(z.object({ categoryId: z.number(), monthYear: z.string().regex(/^\d{4}-\d{2}$/), monthlyLimit: z.number().positive(), notifyWhatsapp: z.boolean().default(true) }))
    .mutation(async ({ ctx, input }) => {
      const h = await getUserHousehold(ctx.user.id);
      if (!h) throw new Error("User household not found");
      return upsertCategoryLimit(h.householdId, input.categoryId, input.monthYear, Math.round(input.monthlyLimit * 100), input.notifyWhatsapp);
    }),

  byMonth: protectedProcedure
    .input(z.object({ monthYear: z.string().regex(/^\d{4}-\d{2}$/) }))
    .query(async ({ ctx, input }) => {
      const h = await getUserHousehold(ctx.user.id);
      if (!h) throw new Error("User household not found");
      const rows = await getCategoryLimitsByMonth(h.householdId, input.monthYear);
      return rows.map(r => ({ ...r, monthlyLimit: r.monthlyLimit / 100 }));
    }),
});

// Due Events
const duesRouter = router({
  add: protectedProcedure
    .input(z.object({ title: z.string().min(1), dueDate: z.date(), categoryId: z.number().optional(), amount: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      const h = await getUserHousehold(ctx.user.id);
      if (!h) throw new Error("User household not found");
      return addDueEvent(h.householdId, input.title, input.dueDate, { categoryId: input.categoryId ?? null, amount: input.amount ? Math.round(input.amount * 100) : null });
    }),

  byMonth: protectedProcedure
    .input(z.object({ year: z.number(), month: z.number().min(1).max(12) }))
    .query(async ({ ctx, input }) => {
      const h = await getUserHousehold(ctx.user.id);
      if (!h) throw new Error("User household not found");
      const rows = await getDueEventsByMonth(h.householdId, input.year, input.month);
      return rows.map(r => ({ ...r, amount: r.amount ? r.amount / 100 : null }));
    }),

  updateStatus: protectedProcedure
    .input(z.object({ eventId: z.number(), status: z.enum(["pending","paid","overdue"]) }))
    .mutation(async ({ ctx, input }) => {
      const household = await getUserHousehold(ctx.user.id);
      if (!household) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User household not found" });
      }

      const event = await getDueEventById(input.eventId);
      if (!event || event.householdId !== household.householdId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Due event does not belong to this household" });
      }

      return updateDueEventStatus(input.eventId, input.status);
    }),
});

// Alerts & summaries
const alertsRouter = router({
  dailySummary: protectedProcedure
    .mutation(async ({ ctx }) => {
      const userHousehold = await getUserHousehold(ctx.user.id);
      if (!userHousehold) throw new Error("User household not found");

      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const householdId = userHousehold.householdId;

      const totalExpenses = await getTotalExpensesByMonth(householdId, year, month);
      const totalFixed = await getTotalFixedExpenses(householdId);
      const revenue = await getDailyRevenueByMonth(householdId, year, month);
      const totalRevenue = revenue.reduce((sum, r) => sum + r.amount, 0);
      const balance = totalRevenue - totalExpenses - totalFixed;

      await notifyMonthlySummary(totalRevenue / 100, (totalExpenses + totalFixed) / 100, balance / 100);

      return {
        ok: true,
        totalRevenue: totalRevenue / 100,
        totalExpenses: totalExpenses / 100,
        totalFixed: totalFixed / 100,
        balance: balance / 100,
      } as const;
    }),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    initHousehold: protectedProcedure.mutation(async ({ ctx }) => {
      return getOrCreateHousehold(ctx.user.id);
    }),
  }),

  expenses: expenseRouter,
  fixedExpenses: fixedExpenseRouter,
  projects: projectRouter,
  items: itemsRouter,
  revenue: revenueRouter,
  dashboard: dashboardRouter,
  categories: categoriesRouter,
  alerts: alertsRouter,
  cards: cardsRouter,
  purchases: purchasesRouter,
  debts: debtsRouter,
  limits: limitsRouter,
  dues: duesRouter,
});

export type AppRouter = typeof appRouter;
