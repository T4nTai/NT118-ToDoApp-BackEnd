CREATE SCHEMA IF NOT EXISTS `todo_auth`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `todo_auth`;

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `username` VARCHAR(50),
  `password` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(20) UNIQUE,
  `address` VARCHAR(100),
  `birthday` DATE,
  `gender` ENUM('Male', 'Female', 'Other') DEFAULT NULL,
  `role` ENUM('Admin', 'User') NOT NULL DEFAULT 'User',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reset_token` VARCHAR(10),
  `reset_expires` DATETIME,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `refresh_token` (
  `refresh_token_id` INT NOT NULL AUTO_INCREMENT,
  `token` VARCHAR(512) NOT NULL UNIQUE,
  `user_id` INT NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `is_revoked` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`refresh_token_id`),
  CONSTRAINT `fk_rt_user`
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE SCHEMA IF NOT EXISTS `todo_workspace`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `todo_workspace`;

CREATE TABLE IF NOT EXISTS `workspaces` (
  `workspace_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `workspace_token` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`workspace_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `workspace_members` (
  `workspace_id` INT NOT NULL,
  `user_id` INT NOT NULL, -- user_id bên Auth, không FK
  `workspace_role` ENUM('Owner', 'Admin', 'Member', 'Viewer') NOT NULL DEFAULT 'Member',
  `joined_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`workspace_id`, `user_id`),

  CONSTRAINT `fk_wm_workspace`
    FOREIGN KEY (`workspace_id`)
    REFERENCES `workspaces` (`workspace_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX `idx_wm_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE SCHEMA IF NOT EXISTS `todo_group`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `todo_group`;

CREATE TABLE IF NOT EXISTS `groups` (
  `group_id` INT NOT NULL AUTO_INCREMENT,
  `workspace_id` INT NOT NULL, -- sang service workspace
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`group_id`),
  INDEX `idx_group_workspace` (`workspace_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `group_members` (
  `group_id` INT NOT NULL,
  `user_id` INT NOT NULL, -- sang service auth
  `role` ENUM('Owner', 'Manager', 'Member', 'Viewer') NOT NULL DEFAULT 'Member',
  `joined_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`group_id`, `user_id`),

  CONSTRAINT `fk_gm_group`
    FOREIGN KEY (`group_id`)
    REFERENCES `groups` (`group_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX `idx_gm_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE SCHEMA IF NOT EXISTS `todo_project`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `todo_project`;

CREATE TABLE IF NOT EXISTS `projects` (
  `project_id` INT NOT NULL AUTO_INCREMENT,
  `workspace_id` INT NOT NULL,    -- workspace service
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `status` ENUM('To Do','In Progress','Completed') NOT NULL DEFAULT 'To Do',
  `priority` ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium',
  `owner_id` INT NOT NULL,        -- auth service
  `assigned_group_id` INT NULL,   -- group service
  `assigned_user_id` INT NULL,    -- auth service
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `start_date` DATE,
  `due_date` DATE,
  PRIMARY KEY (`project_id`),

  INDEX `idx_proj_owner` (`owner_id`),
  INDEX `idx_proj_group_assign` (`assigned_group_id`),
  INDEX `idx_proj_user_assign` (`assigned_user_id`),
  INDEX `idx_proj_workspace` (`workspace_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `project_groups` (
  `project_id` INT NOT NULL,
  `group_id` INT NOT NULL, -- group service
  PRIMARY KEY (`project_id`, `group_id`),
  INDEX `idx_pg_group` (`group_id`),

  CONSTRAINT `fk_pg_project`
    FOREIGN KEY (`project_id`)
    REFERENCES `projects` (`project_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `project_members` (
  `project_id` INT NOT NULL,
  `user_id` INT NOT NULL, -- auth service
  `role` ENUM('Owner', 'Manager', 'Contributor', 'Viewer') NOT NULL DEFAULT 'Contributor',
  `joined_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`, `user_id`),

  CONSTRAINT `fk_pm_project`
    FOREIGN KEY (`project_id`)
    REFERENCES `projects` (`project_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX `idx_pm_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  CONSTRAINT `fk_ms_project`
    FOREIGN KEY (`project_id`)
    REFERENCES `projects` (`project_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `workflows` (
  `workflow_id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  PRIMARY KEY (`workflow_id`),
  CONSTRAINT `fk_wf_project`
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
  CONSTRAINT `fk_ws_workflow`
    FOREIGN KEY (`workflow_id`)
    REFERENCES `workflows` (`workflow_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `performance_record` (
  `performance_id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NULL,
  `group_id` INT NULL,  -- group service
  `user_id` INT NOT NULL, -- auth service
  `score` DECIMAL(5,2) NOT NULL,
  `comment` TEXT DEFAULT NULL,
  `created_by` INT NOT NULL, -- auth service
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`performance_id`),

  CONSTRAINT `fk_pr_project`
    FOREIGN KEY (`project_id`)
    REFERENCES `projects` (`project_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX `idx_pr_group` (`group_id`),
  INDEX `idx_pr_user` (`user_id`),
  INDEX `idx_pr_created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE SCHEMA IF NOT EXISTS `todo_task`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `todo_task`;

CREATE TABLE IF NOT EXISTS `tasks` (
  `task_id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NULL,     -- project service
  `milestone_id` INT NULL,   -- project service
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `priority` ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium',
  `task_progress` DECIMAL(5,2) DEFAULT 0.00,
  `created_by` INT NOT NULL, -- auth service
  `assigned_to` INT NULL,    -- auth service
  `status` ENUM('To Do', 'In Progress', 'Done'),
  `step_id` INT NULL,        -- project service (workflow_steps)
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `start_date` DATE,
  `due_date` DATE,
  PRIMARY KEY (`task_id`),

  INDEX `idx_task_project` (`project_id`),
  INDEX `idx_task_milestone` (`milestone_id`),
  INDEX `idx_task_created_by` (`created_by`),
  INDEX `idx_task_assigned_to` (`assigned_to`),
  INDEX `idx_task_step` (`step_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

  CONSTRAINT `fk_subtask_task`
    FOREIGN KEY (`task_id`)
    REFERENCES `tasks` (`task_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `task_history` (
  `history_id` INT NOT NULL AUTO_INCREMENT,
  `task_id` INT NOT NULL,
  `changed_by_user_id` INT NOT NULL, -- auth service
  `field_name` VARCHAR(50) NOT NULL,
  `old_value` TEXT,
  `new_value` TEXT,
  `changed_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`history_id`),

  CONSTRAINT `fk_th_task`
    FOREIGN KEY (`task_id`)
    REFERENCES `tasks` (`task_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX `idx_th_changed_by` (`changed_by_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `comments` (
  `comment_id` INT NOT NULL AUTO_INCREMENT,
  `task_id` INT NOT NULL,
  `user_id` INT NOT NULL, -- auth service
  `content` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),

  CONSTRAINT `fk_comment_task`
    FOREIGN KEY (`task_id`)
    REFERENCES `tasks` (`task_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX `idx_comment_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `comments_history` (
  `comment_history_id` INT NOT NULL AUTO_INCREMENT,
  `comment_id` INT NOT NULL,
  `edited_by_user_id` INT NOT NULL, -- auth service
  `old_content` TEXT NOT NULL,
  `edited_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_history_id`),

  CONSTRAINT `fk_ch_comment`
    FOREIGN KEY (`comment_id`)
    REFERENCES `comments` (`comment_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX `idx_ch_edited_by` (`edited_by_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE SCHEMA IF NOT EXISTS `todo_utility`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `todo_utility`;

CREATE TABLE IF NOT EXISTS `external_accounts` (
  `external_account_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL, -- ID từ Auth
  `provider` ENUM('github', 'google', 'gmail') NOT NULL,
  `external_user_id` VARCHAR(255) NULL,      -- github_id
  `access_token` TEXT NOT NULL,              -- github_access_token
  `refresh_token` TEXT NULL,
  `expires_at` DATETIME NULL,
  `scopes` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`external_account_id`),
  INDEX `idx_ea_user_provider` (`user_id`, `provider`)
);


CREATE TABLE IF NOT EXISTS `files` (
  `file_id` INT NOT NULL AUTO_INCREMENT,
  `owner_user_id` INT NOT NULL, -- auth service
  `provider` ENUM('cloudinary', 'local', 's3') NOT NULL,
  `public_id` VARCHAR(255) NULL,
  `url` VARCHAR(512) NOT NULL,
  `resource_type` ENUM('image', 'file', 'video', 'other') NOT NULL DEFAULT 'image',
  `context_type` ENUM('avatar', 'attachment', 'other') NOT NULL DEFAULT 'other',
  `context_id` INT NULL, -- ID của Task/Project/Comment,... tùy app dùng
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`file_id`),
  INDEX `idx_file_owner` (`owner_user_id`),
  INDEX `idx_file_context` (`context_type`, `context_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE SCHEMA IF NOT EXISTS `todo_notification`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `todo_notification`;


CREATE TABLE IF NOT EXISTS `notifications` (
  `notification_id` INT NOT NULL AUTO_INCREMENT,
  
  `user_id` INT NOT NULL,  -- auth-service (không FK)

  -- loại thông báo
  `type` ENUM(
      'project_assigned', 
      'task_assigned',
      'task_status_changed',
      'task_comment',
      'task_due_soon',
      'project_due_soon',
      'workspace_invite',
      'group_invite',
      'performance_review',
      'system'
  ) NOT NULL,

  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,

  -- context để biết thông báo này liên quan đến entity nào
  `context_type` ENUM('task', 'project', 'workspace', 'group', 'performance', 'system') DEFAULT NULL,
  `context_id` INT DEFAULT NULL,  -- id của entity bên service khác

  -- trạng thái người dùng
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `is_seen` TINYINT(1) NOT NULL DEFAULT 0,   -- đã hiện popup/real-time
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,

  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`notification_id`),
  INDEX `idx_notif_user` (`user_id`),
  INDEX `idx_notif_context` (`context_type`, `context_id`),
  INDEX `idx_notif_is_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
