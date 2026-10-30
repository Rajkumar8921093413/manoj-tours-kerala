-- Manoj Tours and Travels Kerala — Complete MySQL Schema & Initial Seed
-- Compatible with XAMPP MySQL (local) & Hostinger MySQL (production)

CREATE DATABASE IF NOT EXISTS `Manoj` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `Manoj`;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Rooms Table
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `price` INT DEFAULT 0,
  `show_price` BOOLEAN DEFAULT TRUE,
  `price_basis` VARCHAR(100) DEFAULT 'Per Room / Per Night',
  `capacity` VARCHAR(100) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `primary_image` VARCHAR(255) NOT NULL,
  `features` JSON NOT NULL,
  `dining_note` TEXT,
  `disclaimer` TEXT,
  `sort_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Room Images Table (Multi-photo per room)
CREATE TABLE IF NOT EXISTS `room_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `room_id` INT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `caption` VARCHAR(255) DEFAULT NULL,
  `is_primary` BOOLEAN DEFAULT FALSE,
  `sort_order` INT DEFAULT 0,
  FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE
);

-- 4. Jeep Safaris Table (10 official trails & highlights)
CREATE TABLE IF NOT EXISTS `jeep_safaris` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `title` VARCHAR(150) NOT NULL,
  `badge` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `duration` VARCHAR(100) NOT NULL,
  `terrain_tag` VARCHAR(100) NOT NULL,
  `price_info` VARCHAR(150) DEFAULT '₹2,500 – ₹4,500 per Jeep / Package',
  `weather_note` TEXT,
  `primary_image` VARCHAR(255) NOT NULL,
  `gallery_images` JSON DEFAULT NULL,
  `is_featured_trail` BOOLEAN DEFAULT TRUE,
  `sort_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Tour Packages Table
CREATE TABLE IF NOT EXISTS `tour_packages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `title` VARCHAR(150) NOT NULL,
  `subtitle` VARCHAR(255) NOT NULL,
  `badge` VARCHAR(100) NOT NULL,
  `duration` VARCHAR(100) NOT NULL,
  `price` INT DEFAULT 0,
  `show_price` BOOLEAN DEFAULT TRUE,
  `price_basis` VARCHAR(100) DEFAULT 'Per Person (Per Head)',
  `destinations` VARCHAR(255) NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `poster_image` VARCHAR(255) DEFAULT NULL,
  `itinerary` JSON DEFAULT NULL,
  `inclusions` JSON NOT NULL,
  `exclusions` JSON NOT NULL,
  `group_note` TEXT,
  `sort_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. Destinations Table
CREATE TABLE IF NOT EXISTS `destinations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `tamil` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `badge` VARCHAR(100) NOT NULL,
  `featured` BOOLEAN DEFAULT FALSE,
  `sort_order` INT DEFAULT 0
);

-- 7. Sightseeing Spots Table
CREATE TABLE IF NOT EXISTS `sightseeing_spots` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `timing` VARCHAR(100) NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `guidance` TEXT NOT NULL,
  `badge` VARCHAR(100) NOT NULL,
  `sort_order` INT DEFAULT 0
);

-- 8. Gallery Items Table
CREATE TABLE IF NOT EXISTS `gallery_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `src` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `sort_order` INT DEFAULT 0
);

-- 9. Reviews Table
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `location_tag` VARCHAR(150) NOT NULL,
  `rating` INT DEFAULT 5,
  `review_text` TEXT NOT NULL,
  `sort_order` INT DEFAULT 0
);

-- Insert Default Admin (username: admin, password: password [bcrypt hash])
INSERT INTO `admins` (`username`, `password_hash`)
VALUES ('admin', '$2a$10$v5yTf.WcM.98g9nO8iL.e.U7NlD.H41G4dE0tX7XpWbK9M3zR7oWq')
ON DUPLICATE KEY UPDATE `username`=`username`;


