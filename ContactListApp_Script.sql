--CREATE DABATASE AND TABLES
CREATE SCHEMA `contact_list_app_db` ;

CREATE TABLE `contact_list_app_db`.`user_list` (
  `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(50) NOT NULL,
  `firstname` VARCHAR(50) NOT NULL,
  `lastname` VARCHAR(50) NOT NULL,
  `date_created` DATETIME NOT NULL DEFAULT NOW(),
  `last_sign_in` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE);

CREATE TABLE `contact_list_app_db`.`contact_list` (
  `contact_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `firstname` VARCHAR(50) NULL,
  `lastname` VARCHAR(50) NOT NULL,
  `email` VARCHAR(65) NULL,
  `phone_number` VARCHAR(15) NULL,
  `date_added` DATETIME NOT NULL DEFAULT NOW(),
  `last_modified` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`contact_id`),
  UNIQUE INDEX `contact_id_UNIQUE` (`contact_id` ASC) VISIBLE,
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `contact_list_app_db`.`user_list` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

--TEST RECORDS
USE contact_list_app_db;

INSERT INTO user_list (username, password, firstname, lastname) VALUES ('User_1', 'password123', 'Ashley', 'UserOne');
INSERT INTO user_list (username, password, firstname, lastname) VALUES ('User_2', 'password234', 'Brett', 'UserTwo');
INSERT INTO user_list (username, password, firstname, lastname) VALUES ('User_3', 'password345', 'Charlie', 'UserThree');

INSERT INTO contact_list (user_id, firstname, lastname, email, phone_number) VALUES (1, 'User 1', 'Contact 1', 'user_1_contact_1@mailsite.com', '1234567890');
INSERT INTO contact_list (user_id, firstname, lastname, email, phone_number) VALUES (1, 'User 1', 'Contact 2', 'user_1_contact_2@mailsite.com', '1234567890');
INSERT INTO contact_list (user_id, firstname, lastname, email, phone_number) VALUES (1, 'User 1', 'Contact 3', 'user_1_contact_3@mailsite.com', '1234567890');
INSERT INTO contact_list (user_id, firstname, lastname, email, phone_number) VALUES (2, 'User 2', 'Contact 1', 'user_2_contact_1@mailsite.com', '1234567890');
INSERT INTO contact_list (user_id, firstname, lastname, email, phone_number) VALUES (1, 'User 1', 'Contact 4', 'user_1_contact_4@mailsite.com', '1234567890');
INSERT INTO contact_list (user_id, firstname, lastname, email, phone_number) VALUES (3, 'User 3', 'Contact 1', 'user_3_contact_1@mailsite.com', '1234567890');
INSERT INTO contact_list (user_id, firstname, lastname, email, phone_number) VALUES (2, 'User 2', 'Contact 2', 'user_2_contact_2@mailsite.com', '1234567890');