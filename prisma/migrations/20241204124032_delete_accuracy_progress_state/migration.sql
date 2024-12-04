/*
  Warnings:

  - You are about to drop the column `accuracy` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `progress_state` on the `users_musics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `evaluations` DROP COLUMN `accuracy`;

-- AlterTable
ALTER TABLE `users_musics` DROP COLUMN `progress_state`;
