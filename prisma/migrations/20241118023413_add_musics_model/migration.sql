-- CreateTable
CREATE TABLE `Musics` (
    `music_id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(60) NOT NULL,
    `difficulty` ENUM('easy', 'medium', 'hard') NOT NULL,
    `music_description` VARCHAR(255) NULL,
    `music_path` VARCHAR(255) NOT NULL,
    `midi_path` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`music_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
