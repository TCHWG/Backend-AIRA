-- CreateTable
CREATE TABLE `Courses` (
    `course_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(60) NOT NULL,
    `difficulty` ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'easy',
    `course_description` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
