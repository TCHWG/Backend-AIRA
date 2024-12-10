/*
  Warnings:

  - Added the required column `confidence` to the `evaluations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `evaluations` ADD COLUMN `confidence` DOUBLE NOT NULL;
