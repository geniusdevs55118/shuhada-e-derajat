ALTER TABLE `User`
  ADD COLUMN `mustChangePassword` BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE `Hospital`
  ADD COLUMN `healthDeskLocation` VARCHAR(191) NULL,
  ADD COLUMN `healthDeskContact` VARCHAR(191) NULL,
  ADD COLUMN `orientationCompleted` BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE `Visit`
  ADD COLUMN `ambulanceStatus` VARCHAR(191) NULL;

CREATE TABLE `Document` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `familyId` INTEGER NOT NULL,
  `publicId` VARCHAR(191) NOT NULL,
  `secureUrl` TEXT NOT NULL,
  `resourceType` VARCHAR(191) NOT NULL,
  `docType` VARCHAR(191) NOT NULL,
  `originalFilename` VARCHAR(191) NOT NULL,
  `isSensitive` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdBy` VARCHAR(191) NULL,
  INDEX `Document_familyId_idx` (`familyId`),
  INDEX `Document_docType_idx` (`docType`),
  UNIQUE INDEX `Document_publicId_key` (`publicId`),
  PRIMARY KEY (`id`),
  CONSTRAINT `Document_familyId_fkey` FOREIGN KEY (`familyId`) REFERENCES `Family` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Notification` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `userId` INTEGER NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `message` TEXT NOT NULL,
  `href` VARCHAR(191) NULL,
  `hospitalId` INTEGER NULL,
  `entity` VARCHAR(191) NULL,
  `entityId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `readAt` DATETIME(3) NULL,
  INDEX `Notification_userId_readAt_createdAt_idx` (`userId`, `readAt`, `createdAt`),
  INDEX `Notification_entity_entityId_idx` (`entity`, `entityId`),
  PRIMARY KEY (`id`),
  CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `WorkingGroupMember` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `designation` VARCHAR(191) NULL,
  `roleTitle` VARCHAR(191) NOT NULL,
  `hospital` VARCHAR(191) NULL,
  `email` VARCHAR(191) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `WorkingGroupMember_isActive_idx` (`isActive`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `TorItem` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `number` INTEGER NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `owner` VARCHAR(191) NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `TorItem_number_key` (`number`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `MeetingMinute` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `meetingDate` DATETIME(3) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `attendees` TEXT NULL,
  `decisions` TEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdBy` VARCHAR(191) NULL,
  INDEX `MeetingMinute_meetingDate_idx` (`meetingDate`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Setting` (
  `key` VARCHAR(191) NOT NULL,
  `value` TEXT NOT NULL,
  `updatedAt` DATETIME(3) NOT NULL,
  `updatedBy` VARCHAR(191) NULL,
  PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
