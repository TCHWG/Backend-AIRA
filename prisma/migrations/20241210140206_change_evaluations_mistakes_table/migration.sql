/*
  Warnings:

  - You are about to drop the column `timestamp` on the `mistakes` table. All the data in the column will be lost.
  - You are about to drop the column `user_note_path` on the `users_musics` table. All the data in the column will be lost.
  - Added the required column `description` to the `evaluations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `note_index` to the `mistakes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_midi_path` to the `mistakes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_record_path` to the `users_musics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `evaluations` ADD COLUMN `description` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `mistakes` DROP COLUMN `timestamp`,
    ADD COLUMN `note_index` VARCHAR(8) NOT NULL,
    ADD COLUMN `user_midi_path` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `users_musics` DROP COLUMN `user_note_path`,
    ADD COLUMN `user_record_path` VARCHAR(255) NOT NULL;
