CREATE TABLE `creditCards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`householdId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`brand` enum('visa','mastercard','elo','amex','hipercard','other') DEFAULT 'other',
	`issuer` varchar(255),
	`creditLimit` int NOT NULL,
	`closingDay` int NOT NULL,
	`dueDay` int NOT NULL,
	`benefits` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `creditCards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creditCardStatements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`householdId` int NOT NULL,
	`cardId` int NOT NULL,
	`monthYear` varchar(7) NOT NULL,
	`totalAmount` int NOT NULL DEFAULT 0,
	`status` enum('open','closed','paid','overdue') DEFAULT 'open',
	`closingDate` timestamp,
	`dueDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `creditCardStatements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creditCardPurchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`householdId` int NOT NULL,
	`cardId` int NOT NULL,
	`statementId` int,
	`description` varchar(255) NOT NULL,
	`merchant` varchar(255),
	`categoryId` int,
	`totalAmount` int NOT NULL,
	`installments` int NOT NULL DEFAULT 1,
	`firstDueDate` timestamp,
	`status` enum('ongoing','completed','cancelled') DEFAULT 'ongoing',
	`purchaseDate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `creditCardPurchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `purchaseInstallments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`purchaseId` int NOT NULL,
	`installmentNumber` int NOT NULL,
	`amount` int NOT NULL,
	`dueDate` timestamp NOT NULL,
	`paidAt` timestamp,
	`status` enum('pending','paid','overdue') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `purchaseInstallments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `debts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`householdId` int NOT NULL,
	`creditorName` varchar(255) NOT NULL,
	`principalAmount` int NOT NULL,
	`interestRateBps` int,
	`startDate` timestamp,
	`dueDate` timestamp,
	`status` enum('ongoing','paid','overdue','cancelled') DEFAULT 'ongoing',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `debts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `debtPayments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`debtId` int NOT NULL,
	`amount` int NOT NULL,
	`paymentDate` timestamp NOT NULL,
	`method` enum('transfer','cash','card','other') DEFAULT 'transfer',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `debtPayments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categoryLimits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`householdId` int NOT NULL,
	`categoryId` int NOT NULL,
	`monthYear` varchar(7) NOT NULL,
	`monthlyLimit` int NOT NULL,
	`notifyWhatsapp` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categoryLimits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dueEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`householdId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`categoryId` int,
	`amount` int,
	`dueDate` timestamp NOT NULL,
	`status` enum('pending','paid','overdue') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dueEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `creditCards` ADD CONSTRAINT `creditCards_householdId_households_id_fk` FOREIGN KEY (`householdId`) REFERENCES `households`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `creditCardStatements` ADD CONSTRAINT `creditCardStatements_householdId_households_id_fk` FOREIGN KEY (`householdId`) REFERENCES `households`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `creditCardStatements` ADD CONSTRAINT `creditCardStatements_cardId_creditCards_id_fk` FOREIGN KEY (`cardId`) REFERENCES `creditCards`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `creditCardPurchases` ADD CONSTRAINT `creditCardPurchases_householdId_households_id_fk` FOREIGN KEY (`householdId`) REFERENCES `households`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `creditCardPurchases` ADD CONSTRAINT `creditCardPurchases_cardId_creditCards_id_fk` FOREIGN KEY (`cardId`) REFERENCES `creditCards`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `creditCardPurchases` ADD CONSTRAINT `creditCardPurchases_statementId_creditCardStatements_id_fk` FOREIGN KEY (`statementId`) REFERENCES `creditCardStatements`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `creditCardPurchases` ADD CONSTRAINT `creditCardPurchases_categoryId_expenseCategories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `expenseCategories`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `purchaseInstallments` ADD CONSTRAINT `purchaseInstallments_purchaseId_creditCardPurchases_id_fk` FOREIGN KEY (`purchaseId`) REFERENCES `creditCardPurchases`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `debts` ADD CONSTRAINT `debts_householdId_households_id_fk` FOREIGN KEY (`householdId`) REFERENCES `households`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `debtPayments` ADD CONSTRAINT `debtPayments_debtId_debts_id_fk` FOREIGN KEY (`debtId`) REFERENCES `debts`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `categoryLimits` ADD CONSTRAINT `categoryLimits_householdId_households_id_fk` FOREIGN KEY (`householdId`) REFERENCES `households`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `categoryLimits` ADD CONSTRAINT `categoryLimits_categoryId_expenseCategories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `expenseCategories`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `dueEvents` ADD CONSTRAINT `dueEvents_householdId_households_id_fk` FOREIGN KEY (`householdId`) REFERENCES `households`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `dueEvents` ADD CONSTRAINT `dueEvents_categoryId_expenseCategories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `expenseCategories`(`id`) ON DELETE no action ON UPDATE no action;