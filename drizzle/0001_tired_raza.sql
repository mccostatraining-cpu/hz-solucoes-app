CREATE TABLE `dailyRevenue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`householdId` int NOT NULL,
	`revenueDate` timestamp NOT NULL,
	`amount` int NOT NULL,
	`description` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dailyRevenue_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenseCategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`householdId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`color` varchar(7) DEFAULT '#3B82F6',
	`keywords` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `expenseCategories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`householdId` int NOT NULL,
	`userId` int NOT NULL,
	`categoryId` int,
	`description` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`expenseDate` timestamp NOT NULL,
	`source` enum('whatsapp','web','manual') DEFAULT 'web',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fixedExpenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`householdId` int NOT NULL,
	`categoryId` int,
	`name` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`dueDay` int NOT NULL,
	`status` enum('pending','paid','overdue') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fixedExpenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `households` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `households_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `itemsControl` (
	`id` int AUTO_INCREMENT NOT NULL,
	`householdId` int NOT NULL,
	`itemName` varchar(255) NOT NULL,
	`amount` int,
	`status` enum('pending','purchased','paid') DEFAULT 'pending',
	`dueDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `itemsControl_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`householdId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`targetAmount` int NOT NULL,
	`savedAmount` int NOT NULL DEFAULT 0,
	`targetMonths` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `revenueTargets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`householdId` int NOT NULL,
	`monthYear` varchar(7) NOT NULL,
	`targetAmount` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `revenueTargets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userHouseholds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`householdId` int NOT NULL,
	`role` enum('owner','member') NOT NULL DEFAULT 'member',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userHouseholds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `whatsappSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`householdId` int NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `whatsappSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `dailyRevenue` ADD CONSTRAINT `dailyRevenue_householdId_households_id_fk` FOREIGN KEY (`householdId`) REFERENCES `households`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expenseCategories` ADD CONSTRAINT `expenseCategories_householdId_households_id_fk` FOREIGN KEY (`householdId`) REFERENCES `households`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_householdId_households_id_fk` FOREIGN KEY (`householdId`) REFERENCES `households`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_categoryId_expenseCategories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `expenseCategories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fixedExpenses` ADD CONSTRAINT `fixedExpenses_householdId_households_id_fk` FOREIGN KEY (`householdId`) REFERENCES `households`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fixedExpenses` ADD CONSTRAINT `fixedExpenses_categoryId_expenseCategories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `expenseCategories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `itemsControl` ADD CONSTRAINT `itemsControl_householdId_households_id_fk` FOREIGN KEY (`householdId`) REFERENCES `households`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_householdId_households_id_fk` FOREIGN KEY (`householdId`) REFERENCES `households`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `revenueTargets` ADD CONSTRAINT `revenueTargets_householdId_households_id_fk` FOREIGN KEY (`householdId`) REFERENCES `households`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userHouseholds` ADD CONSTRAINT `userHouseholds_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userHouseholds` ADD CONSTRAINT `userHouseholds_householdId_households_id_fk` FOREIGN KEY (`householdId`) REFERENCES `households`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `whatsappSettings` ADD CONSTRAINT `whatsappSettings_householdId_households_id_fk` FOREIGN KEY (`householdId`) REFERENCES `households`(`id`) ON DELETE no action ON UPDATE no action;