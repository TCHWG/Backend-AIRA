-- CreateTable
CREATE TABLE `users` (
    `uid` VARCHAR(36) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NULL,
    `photo_url` VARCHAR(512) NULL,
    `provider_id` VARCHAR(20) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `last_login_at` DATETIME(3) NULL,

    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
