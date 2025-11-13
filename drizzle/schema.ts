import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Household represents a family/couple unit
 * Multiple users can belong to one household
 */
export const households = mysqlTable("households", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Household = typeof households.$inferSelect;
export type InsertHousehold = typeof households.$inferInsert;

/**
 * Junction table: users to households (many-to-many)
 */
export const userHouseholds = mysqlTable("userHouseholds", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  householdId: int("householdId").notNull().references(() => households.id),
  role: mysqlEnum("role", ["owner", "member"]).default("member").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserHousehold = typeof userHouseholds.$inferSelect;
export type InsertUserHousehold = typeof userHouseholds.$inferInsert;

/**
 * Expense categories
 */
export const expenseCategories = mysqlTable("expenseCategories", {
  id: int("id").autoincrement().primaryKey(),
  householdId: int("householdId").notNull().references(() => households.id),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 7 }).default("#3B82F6"),
  keywords: text("keywords"), // comma-separated keywords for auto-categorization
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExpenseCategory = typeof expenseCategories.$inferSelect;
export type InsertExpenseCategory = typeof expenseCategories.$inferInsert;

/**
 * Variable expenses (from WhatsApp)
 */
export const expenses = mysqlTable("expenses", {
  id: int("id").autoincrement().primaryKey(),
  householdId: int("householdId").notNull().references(() => households.id),
  userId: int("userId").notNull().references(() => users.id),
  categoryId: int("categoryId").references(() => expenseCategories.id),
  description: varchar("description", { length: 255 }).notNull(),
  amount: int("amount").notNull(), // stored in cents to avoid float issues
  expenseDate: timestamp("expenseDate").notNull(),
  source: mysqlEnum("source", ["whatsapp", "web", "manual"]).default("web"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;

/**
 * Fixed monthly expenses
 */
export const fixedExpenses = mysqlTable("fixedExpenses", {
  id: int("id").autoincrement().primaryKey(),
  householdId: int("householdId").notNull().references(() => households.id),
  categoryId: int("categoryId").references(() => expenseCategories.id),
  name: varchar("name", { length: 255 }).notNull(),
  amount: int("amount").notNull(), // in cents
  dueDay: int("dueDay").notNull(), // day of month (1-31)
  status: mysqlEnum("status", ["pending", "paid", "overdue"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FixedExpense = typeof fixedExpenses.$inferSelect;
export type InsertFixedExpense = typeof fixedExpenses.$inferInsert;

/**
 * Projects and savings goals
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  householdId: int("householdId").notNull().references(() => households.id),
  name: varchar("name", { length: 255 }).notNull(),
  targetAmount: int("targetAmount").notNull(), // in cents
  savedAmount: int("savedAmount").default(0).notNull(),
  targetMonths: int("targetMonths").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Daily revenue/income
 */
export const dailyRevenue = mysqlTable("dailyRevenue", {
  id: int("id").autoincrement().primaryKey(),
  householdId: int("householdId").notNull().references(() => households.id),
  revenueDate: timestamp("revenueDate").notNull(),
  amount: int("amount").notNull(), // in cents
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DailyRevenue = typeof dailyRevenue.$inferSelect;
export type InsertDailyRevenue = typeof dailyRevenue.$inferInsert;

/**
 * Items control (shopping list / payment tracking)
 */
export const itemsControl = mysqlTable("itemsControl", {
  id: int("id").autoincrement().primaryKey(),
  householdId: int("householdId").notNull().references(() => households.id),
  itemName: varchar("itemName", { length: 255 }).notNull(),
  amount: int("amount"), // in cents, optional
  status: mysqlEnum("status", ["pending", "purchased", "paid"]).default("pending"),
  dueDate: timestamp("dueDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ItemsControl = typeof itemsControl.$inferSelect;
export type InsertItemsControl = typeof itemsControl.$inferInsert;

/**
 * Revenue targets/goals
 */
export const revenueTargets = mysqlTable("revenueTargets", {
  id: int("id").autoincrement().primaryKey(),
  householdId: int("householdId").notNull().references(() => households.id),
  monthYear: varchar("monthYear", { length: 7 }).notNull(), // YYYY-MM format
  targetAmount: int("targetAmount").notNull(), // in cents
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RevenueTarget = typeof revenueTargets.$inferSelect;
export type InsertRevenueTarget = typeof revenueTargets.$inferInsert;

/**
 * WhatsApp integration settings
 */
export const whatsappSettings = mysqlTable("whatsappSettings", {
  id: int("id").autoincrement().primaryKey(),
  householdId: int("householdId").notNull().references(() => households.id),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WhatsappSettings = typeof whatsappSettings.$inferSelect;
export type InsertWhatsappSettings = typeof whatsappSettings.$inferInsert;

/**
 * Credit Cards: base para parcelamentos
 */
export const creditCards = mysqlTable("creditCards", {
  id: int("id").autoincrement().primaryKey(),
  householdId: int("householdId").notNull().references(() => households.id),
  name: varchar("name", { length: 255 }).notNull(),
  brand: mysqlEnum("brand", [
    "visa",
    "mastercard",
    "elo",
    "amex",
    "hipercard",
    "other",
  ]).default("other"),
  issuer: varchar("issuer", { length: 255 }),
  creditLimit: int("creditLimit").notNull(), // em centavos
  closingDay: int("closingDay").notNull(), // dia de fechamento (1-31)
  dueDay: int("dueDay").notNull(), // dia de vencimento (1-31)
  benefits: text("benefits"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CreditCard = typeof creditCards.$inferSelect;
export type InsertCreditCard = typeof creditCards.$inferInsert;

/**
 * Faturas de cartões
 */
export const creditCardStatements = mysqlTable("creditCardStatements", {
  id: int("id").autoincrement().primaryKey(),
  householdId: int("householdId").notNull().references(() => households.id),
  cardId: int("cardId").notNull().references(() => creditCards.id),
  monthYear: varchar("monthYear", { length: 7 }).notNull(), // YYYY-MM
  totalAmount: int("totalAmount").default(0).notNull(), // em centavos
  status: mysqlEnum("status", ["open", "closed", "paid", "overdue"]).default("open"),
  closingDate: timestamp("closingDate"),
  dueDate: timestamp("dueDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CreditCardStatement = typeof creditCardStatements.$inferSelect;
export type InsertCreditCardStatement = typeof creditCardStatements.$inferInsert;

/**
 * Compras de cartão (com suporte a parcelamentos)
 */
export const creditCardPurchases = mysqlTable("creditCardPurchases", {
  id: int("id").autoincrement().primaryKey(),
  householdId: int("householdId").notNull().references(() => households.id),
  cardId: int("cardId").notNull().references(() => creditCards.id),
  statementId: int("statementId").references(() => creditCardStatements.id),
  description: varchar("description", { length: 255 }).notNull(),
  merchant: varchar("merchant", { length: 255 }),
  categoryId: int("categoryId").references(() => expenseCategories.id),
  totalAmount: int("totalAmount").notNull(), // em centavos
  installments: int("installments").default(1).notNull(),
  firstDueDate: timestamp("firstDueDate"),
  status: mysqlEnum("status", ["ongoing", "completed", "cancelled"]).default("ongoing"),
  purchaseDate: timestamp("purchaseDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CreditCardPurchase = typeof creditCardPurchases.$inferSelect;
export type InsertCreditCardPurchase = typeof creditCardPurchases.$inferInsert;

/**
 * Parcelas individuais de uma compra parcelada
 */
export const purchaseInstallments = mysqlTable("purchaseInstallments", {
  id: int("id").autoincrement().primaryKey(),
  purchaseId: int("purchaseId").notNull().references(() => creditCardPurchases.id),
  installmentNumber: int("installmentNumber").notNull(),
  amount: int("amount").notNull(), // em centavos
  dueDate: timestamp("dueDate").notNull(),
  paidAt: timestamp("paidAt"),
  status: mysqlEnum("status", ["pending", "paid", "overdue"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PurchaseInstallment = typeof purchaseInstallments.$inferSelect;
export type InsertPurchaseInstallment = typeof purchaseInstallments.$inferInsert;

/**
 * Sistema de dívidas (minhas dívidas + pessoas que me devem)
 */
export const debts = mysqlTable("debts", {
  id: int("id").autoincrement().primaryKey(),
  householdId: int("householdId").notNull().references(() => households.id),
  creditorName: varchar("creditorName", { length: 255 }).notNull(),
  principalAmount: int("principalAmount").notNull(), // em centavos
  interestRateBps: int("interestRateBps"), // taxa em basis points (ex: 1050 = 10.5%)
  startDate: timestamp("startDate"),
  dueDate: timestamp("dueDate"),
  status: mysqlEnum("status", ["ongoing", "paid", "overdue", "cancelled"]).default("ongoing"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Debt = typeof debts.$inferSelect;
export type InsertDebt = typeof debts.$inferInsert;

export const debtPayments = mysqlTable("debtPayments", {
  id: int("id").autoincrement().primaryKey(),
  debtId: int("debtId").notNull().references(() => debts.id),
  amount: int("amount").notNull(), // em centavos
  paymentDate: timestamp("paymentDate").notNull(),
  method: mysqlEnum("method", ["transfer", "cash", "card", "other"]).default("transfer"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DebtPayment = typeof debtPayments.$inferSelect;
export type InsertDebtPayment = typeof debtPayments.$inferInsert;

/**
 * Limites de gastos por categoria (mensal)
 */
export const categoryLimits = mysqlTable("categoryLimits", {
  id: int("id").autoincrement().primaryKey(),
  householdId: int("householdId").notNull().references(() => households.id),
  categoryId: int("categoryId").notNull().references(() => expenseCategories.id),
  monthYear: varchar("monthYear", { length: 7 }).notNull(), // YYYY-MM
  monthlyLimit: int("monthlyLimit").notNull(),
  notifyWhatsapp: boolean("notifyWhatsapp").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CategoryLimit = typeof categoryLimits.$inferSelect;
export type InsertCategoryLimit = typeof categoryLimits.$inferInsert;

/**
 * Eventos de vencimento avulsos (complementa fixedExpenses)
 */
export const dueEvents = mysqlTable("dueEvents", {
  id: int("id").autoincrement().primaryKey(),
  householdId: int("householdId").notNull().references(() => households.id),
  title: varchar("title", { length: 255 }).notNull(),
  categoryId: int("categoryId").references(() => expenseCategories.id),
  amount: int("amount"), // em centavos (opcional)
  dueDate: timestamp("dueDate").notNull(),
  status: mysqlEnum("status", ["pending", "paid", "overdue"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DueEvent = typeof dueEvents.$inferSelect;
export type InsertDueEvent = typeof dueEvents.$inferInsert;