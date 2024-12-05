/*
  Warnings:

  - You are about to drop the column `music_id` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `evaluations` table. All the data in the column will be lost.
  - Added the required column `user_musics_id` to the `evaluations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `evaluations` DROP FOREIGN KEY `evaluations_music_id_fkey`;

-- DropForeignKey
ALTER TABLE `evaluations` DROP FOREIGN KEY `evaluations_user_id_fkey`;

-- AlterTable
ALTER TABLE `evaluations` DROP COLUMN `music_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `user_musics_id` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `users_musics` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `evaluations` ADD CONSTRAINT `evaluations_user_musics_id_fkey` FOREIGN KEY (`user_musics_id`) REFERENCES `users_musics`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
