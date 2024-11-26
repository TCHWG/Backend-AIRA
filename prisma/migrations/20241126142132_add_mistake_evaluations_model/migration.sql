/*
  Warnings:

  - You are about to drop the `Musics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Musics`;

-- CreateTable
CREATE TABLE `musics` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(60) NOT NULL,
    `author` VARCHAR(60) NOT NULL,
    `difficulty` ENUM('easy', 'medium', 'hard') NOT NULL,
    `music_description` VARCHAR(255) NULL,
    `music_path` VARCHAR(255) NOT NULL,
    `midi_path` VARCHAR(255) NOT NULL,
    `preview_path` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_musics` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(36) NOT NULL,
    `music_id` BIGINT NOT NULL,
    `progress_state` ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') NOT NULL,

    UNIQUE INDEX `users_musics_user_id_music_id_key`(`user_id`, `music_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evaluations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(36) NOT NULL,
    `music_id` BIGINT NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `accuracy` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mistakes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `evaluation_id` INTEGER NOT NULL,
    `timestamp` VARCHAR(8) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users_musics` ADD CONSTRAINT `users_musics_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_musics` ADD CONSTRAINT `users_musics_music_id_fkey` FOREIGN KEY (`music_id`) REFERENCES `musics`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluations` ADD CONSTRAINT `evaluations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluations` ADD CONSTRAINT `evaluations_music_id_fkey` FOREIGN KEY (`music_id`) REFERENCES `musics`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mistakes` ADD CONSTRAINT `mistakes_id_fkey` FOREIGN KEY (`id`) REFERENCES `evaluations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
