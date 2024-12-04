/*
  Warnings:

  - Added the required column `user_midi_path` to the `users_musics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_note_path` to the `users_musics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users_musics` ADD COLUMN `user_midi_path` VARCHAR(255) NOT NULL,
    ADD COLUMN `user_note_path` VARCHAR(255) NOT NULL;
