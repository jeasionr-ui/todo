-- 用户表结构
CREATE TABLE IF NOT EXISTS `user` (
  `id`  VARCHAR(64) NOT NULL PRIMARY KEY,
  `firstName` VARCHAR(64) NOT NULL,
  `lastName` VARCHAR(64) NOT NULL,
  `email` VARCHAR(128) NOT NULL UNIQUE,
  `password` VARCHAR(128) NOT NULL,
  `avatar` VARCHAR(255),
  `bio` TEXT,
  `phone` VARCHAR(32),
  `country` VARCHAR(64),
  `city` VARCHAR(64),
  `state` VARCHAR(64),
  `postalCode` VARCHAR(32),
  `taxId` VARCHAR(64),
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  `lastLogin` DATETIME,
  `twoFactorEnabled` BOOLEAN DEFAULT FALSE,
  `role` VARCHAR(32) DEFAULT 'user',
  `status` ENUM('active','inactive') DEFAULT 'active',
  `socialAccounts` JSON,
  `loginHistory` JSON
);