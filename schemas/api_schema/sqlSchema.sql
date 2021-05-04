-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'questions'
--
-- ---
CREATE DATABASE 'SDC-qa';

DROP TABLE IF EXISTS `questions`;

CREATE TABLE `questions` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `product_id` INTEGER NULL DEFAULT NULL,
  `body` VARCHAR NULL DEFAULT NULL,
  `date` VARCHAR NULL DEFAULT NULL,
  `asker_name` VARCHAR NULL DEFAULT NULL,
  `helpfulness` INTEGER NULL DEFAULT NULL,
  `reported` TINYINT NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'answers'
--
-- ---

DROP TABLE IF EXISTS `answers`;

CREATE TABLE `answers` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `question_id` INTEGER NULL DEFAULT NULL,
  `body` VARCHAR NULL DEFAULT NULL,
  `date` VARCHAR NULL DEFAULT NULL,
  `answerer_name` VARCHAR NULL DEFAULT NULL,
  `helpfulness` INTEGER NULL DEFAULT NULL,
  `reported` TINYINT NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'photos'
--
-- ---

DROP TABLE IF EXISTS `photos`;

CREATE TABLE `photos` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `answer_id` INTEGER NULL DEFAULT NULL,
  `photo_url` VARCHAR NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE `answers` ADD FOREIGN KEY (question_id) REFERENCES `questions` (`id`);
ALTER TABLE `photos` ADD FOREIGN KEY (answer_id) REFERENCES `answers` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `questions` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `answers` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `photos` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `questions` (`id`,`product_id`,`body`,`date`,`asker_name`,`helpfulness`,`reported`) VALUES
-- ('','','','','','','');
-- INSERT INTO `answers` (`id`,`question_id`,`body`,`date`,`answerer_name`,`helpfulness`,`reported`) VALUES
-- ('','','','','','','');
-- INSERT INTO `photos` (`id`,`answer_id`,`photo_url`) VALUES
-- ('','','');