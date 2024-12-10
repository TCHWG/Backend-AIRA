/*
  Warnings:

  - You are about to drop the column `user_midi_path` on the `mistakes` table. All the data in the column will be lost.
  - Added the required column `additional_description` to the `mistakes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mistakes` DROP COLUMN `user_midi_path`,
    ADD COLUMN `additional_description` VARCHAR(255) NOT NULL;
