SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `todo`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `todo`;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `username` VARCHAR(50),
  `password` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(20) UNIQUE,
  `address` VARCHAR(100),
  `birthday` DATE,
  `gender` ENUM('Male', 'Female', 'Other') DEFAULT NULL,
  `avatar_public_id` VARCHAR(255),
  `github_access_token` VARCHAR(255),
  `role` ENUM('Admin', 'User') NOT NULL DEFAULT 'User',
  `github_id` VARCHAR(255),
  `avatar_url` VARCHAR(255),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reset_token` VARCHAR(10),
  `reset_expires` DATETIME,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- WORKSPACES
-- ============================================================
CREATE TABLE IF NOT EXISTS `workspaces` (
  `workspace_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `workspace_token` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`workspace_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- WORKSPACE MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS `workspace_members` (
  `workspace_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `workspace_role` ENUM('Owner', 'Admin', 'Member', 'Viewer') NOT NULL DEFAULT 'Member',
  `joined_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`workspace_id`, `user_id`),

  FOREIGN KEY (`workspace_id`)
    REFERENCES `workspaces` (`workspace_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  FOREIGN KEY (`user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- GROUPS
-- ============================================================
CREATE TABLE IF NOT EXISTS `groups` (
  `group_id` INT NOT NULL AUTO_INCREMENT,
  `workspace_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`group_id`),

  FOREIGN KEY (`workspace_id`)
    REFERENCES `workspaces` (`workspace_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- GROUP MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS `group_members` (
  `group_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `role` ENUM('Owner', 'Manager', 'Member', 'Viewer') NOT NULL DEFAULT 'Member',
  `joined_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`group_id`, `user_id`),
  INDEX `idx_gm_user` (`user_id`),

  FOREIGN KEY (`group_id`)
    REFERENCES `groups` (`group_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  FOREIGN KEY (`user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS `projects` (
  `project_id` INT NOT NULL AUTO_INCREMENT,
  `workspace_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `status` ENUM('To Do', 'In Progress', 'Completed') NOT NULL DEFAULT 'To Do',
  `priority` ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium',
  `owner_id` INT NOT NULL,
  `assigned_group_id` INT NULL,
  `assigned_user_id` INT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `start_date` DATE,
  `due_date` DATE,
  `attachment_url` VARCHAR(255),
  `attachment_public_id` VARCHAR(255),
  PRIMARY KEY (`project_id`),

  INDEX `idx_proj_owner` (`owner_id`),
  INDEX `idx_proj_group_assign` (`assigned_group_id`),
  INDEX `idx_proj_user_assign` (`assigned_user_id`),

  FOREIGN KEY (`workspace_id`)
    REFERENCES `workspaces` (`workspace_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  FOREIGN KEY (`owner_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  FOREIGN KEY (`assigned_group_id`)
    REFERENCES `groups` (`group_id`)
    ON DELETE SET NULL ON UPDATE CASCADE,

  FOREIGN KEY (`assigned_user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PROJECT - GROUPS (Many-to-Many)
-- ============================================================
CREATE TABLE IF NOT EXISTS `project_groups` (
  `project_id` INT NOT NULL,
  `group_id` INT NOT NULL,
  PRIMARY KEY (`project_id`, `group_id`),
  INDEX `idx_pg_group` (`group_id`),

  FOREIGN KEY (`project_id`)
    REFERENCES `projects` (`project_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  FOREIGN KEY (`group_id`)
    REFERENCES `groups` (`group_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PROJECT MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS `project_members` (
  `project_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `role` ENUM('Owner', 'Manager', 'Contributor', 'Viewer') NOT NULL DEFAULT 'Contributor',
  `joined_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`, `user_id`),

  FOREIGN KEY (`project_id`)
    REFERENCES `projects` (`project_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  FOREIGN KEY (`user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- MILESTONES
-- ============================================================
CREATE TABLE IF NOT EXISTS `milestones` (
  `milestone_id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `start_date` DATE,
  `due_date` DATE,
  `is_completed` TINYINT(1) DEFAULT 0,
  `completed_at` DATETIME,
  PRIMARY KEY (`milestone_id`),

  FOREIGN KEY (`project_id`)
    REFERENCES `projects` (`project_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- WORKFLOWS
-- ============================================================
CREATE TABLE IF NOT EXISTS `workflows` (
  `workflow_id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  PRIMARY KEY (`workflow_id`),

  FOREIGN KEY (`project_id`)
    REFERENCES `projects` (`project_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `workflow_steps` (
  `step_id` INT NOT NULL AUTO_INCREMENT,
  `workflow_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `step_order` INT NOT NULL,
  PRIMARY KEY (`step_id`),

  FOREIGN KEY (`workflow_id`)
    REFERENCES `workflows` (`workflow_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TASKS
-- ============================================================
CREATE TABLE IF NOT EXISTS `tasks` (
  `task_id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NULL,
  `milestone_id` INT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `priority` ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium',
  `task_progress` DECIMAL(5,2) DEFAULT 0.00,
  `created_by` INT NOT NULL,
  `assigned_to` INT NULL,
  `status` ENUM('To Do', 'In Progress', 'Done'),
  `step_id` INT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `start_date` DATE,
  `due_date` DATE,
  `completed_at` DATE,
  PRIMARY KEY (`task_id`),

  FOREIGN KEY (`project_id`)
    REFERENCES `projects` (`project_id`)
    ON DELETE SET NULL ON UPDATE CASCADE,

  FOREIGN KEY (`milestone_id`)
    REFERENCES `milestones` (`milestone_id`)
    ON DELETE SET NULL ON UPDATE CASCADE,

  FOREIGN KEY (`created_by`)
    REFERENCES `users` (`user_id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  FOREIGN KEY (`assigned_to`)
    REFERENCES `users` (`user_id`)
    ON DELETE SET NULL ON UPDATE CASCADE,

  FOREIGN KEY (`step_id`)
    REFERENCES `workflow_steps` (`step_id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SUBTASKS
-- ============================================================
CREATE TABLE IF NOT EXISTS `subtasks` (
  `subtask_id` INT NOT NULL AUTO_INCREMENT,
  `task_id` INT NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `priority` ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium',
  `description` TEXT,
  `status` ENUM('To Do', 'In Progress', 'Review', 'Done', 'Blocked') NOT NULL DEFAULT 'To Do',
  `due_date` DATE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`subtask_id`),
  FOREIGN KEY (`task_id`)
    REFERENCES `tasks` (`task_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TASK HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS `task_history` (
  `history_id` INT NOT NULL AUTO_INCREMENT,
  `task_id` INT NOT NULL,
  `changed_by_user_id` INT NOT NULL,
  `field_name` VARCHAR(50) NOT NULL,
  `old_value` TEXT,
  `new_value` TEXT,
  `changed_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`history_id`),

  FOREIGN KEY (`task_id`)
    REFERENCES `tasks` (`task_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  FOREIGN KEY (`changed_by_user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- COMMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS `comments` (
  `comment_id` INT NOT NULL AUTO_INCREMENT,
  `task_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),

  FOREIGN KEY (`task_id`)
    REFERENCES `tasks` (`task_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  FOREIGN KEY (`user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- COMMENT HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS `comments_history` (
  `comment_history_id` INT NOT NULL AUTO_INCREMENT,
  `comment_id` INT NOT NULL,
  `edited_by_user_id` INT NOT NULL,
  `old_content` TEXT NOT NULL,
  `edited_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_history_id`),

  FOREIGN KEY (`comment_id`)
    REFERENCES `comments` (`comment_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  FOREIGN KEY (`edited_by_user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PERFORMANCE RECORDS
-- ============================================================
CREATE TABLE IF NOT EXISTS `performance_record` (
  `performance_id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NULL,
  `group_id` INT NULL,
  `user_id` INT NOT NULL,
  `score` DECIMAL(5,2) NOT NULL,
  `comment` TEXT DEFAULT NULL,
  `created_by` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`performance_id`),

  FOREIGN KEY (`project_id`)
    REFERENCES `projects` (`project_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  FOREIGN KEY (`group_id`)
    REFERENCES `groups` (`group_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  FOREIGN KEY (`user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  FOREIGN KEY (`created_by`)
    REFERENCES `users` (`user_id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- REFRESH TOKENS
-- ============================================================
CREATE TABLE IF NOT EXISTS `refresh_token` (
  `refresh_token_id` INT NOT NULL AUTO_INCREMENT,
  `token` VARCHAR(512) NOT NULL UNIQUE,
  `user_id` INT NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `is_revoked` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`refresh_token_id`),

  FOREIGN KEY (`user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
