-- 设置数据库字符集以支持emoji
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- 用户表结构
DROP TABLE IF EXISTS `user`;
CREATE TABLE
  IF NOT EXISTS `user` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '用户唯一标识',
    `firstName` VARCHAR(64) NOT NULL COMMENT '用户名字',
    `lastName` VARCHAR(64) NOT NULL COMMENT '用户姓氏',
    `email` VARCHAR(128) NOT NULL UNIQUE COMMENT '用户邮箱地址，唯一',
    `password` VARCHAR(128) NOT NULL COMMENT '用户密码（加密存储）',
    `avatar` VARCHAR(255) COMMENT '用户头像URL',
    `bio` TEXT COMMENT '用户个人简介',
    `phone` VARCHAR(32) COMMENT '用户手机号码',
    `country` VARCHAR(64) COMMENT '用户所在国家',
    `city` VARCHAR(64) COMMENT '用户所在城市',
    `state` VARCHAR(64) COMMENT '用户所在州/省',
    `postalCode` VARCHAR(32) COMMENT '用户邮政编码',
    `taxId` VARCHAR(64) COMMENT '用户税务ID',
    `createdAt` DATETIME NOT NULL COMMENT '用户创建时间',
    `updatedAt` DATETIME NOT NULL COMMENT '用户最后更新时间',
    `lastLogin` DATETIME COMMENT '用户最后登录时间',
    `twoFactorEnabled` BOOLEAN DEFAULT FALSE COMMENT '是否启用两步验证',
    `role` VARCHAR(32) DEFAULT 'user' COMMENT '用户角色（admin/user等）',
    `status` ENUM ('active', 'inactive') DEFAULT 'active' COMMENT '用户状态（激活/禁用）',
    `socialAccounts` JSON COMMENT '用户第三方社交账号信息',
    `loginHistory` JSON COMMENT '用户登录历史记录'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 文件表结构
DROP TABLE IF EXISTS `file`;
CREATE TABLE
  IF NOT EXISTS `file` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '文件唯一标识',
    `originalName` VARCHAR(255) NOT NULL COMMENT '文件原始名称',
    `fileName` VARCHAR(255) NOT NULL COMMENT '存储的文件名称',
    `filePath` VARCHAR(500) NOT NULL COMMENT '文件存储路径',
    `mimeType` VARCHAR(100) NOT NULL COMMENT '文件MIME类型',
    `size` BIGINT NOT NULL COMMENT '文件大小（字节）',
    `uploadedBy` VARCHAR(64) COMMENT '上传用户ID',
    `uploadedAt` DATETIME NOT NULL COMMENT '文件上传时间',
    `hash` VARCHAR(128) COMMENT '文件哈希值，用于去重',
    `status` ENUM ('active', 'deleted') DEFAULT 'active' COMMENT '文件状态'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 任务表结构
DROP TABLE IF EXISTS `task`;
CREATE TABLE
  IF NOT EXISTS `task` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '任务唯一标识',
    `name` VARCHAR(255) NOT NULL COMMENT '任务名称标题',
    `description` TEXT COMMENT '任务详细描述，支持长文本',
    `status` ENUM ('todo', 'working', 'done') DEFAULT 'todo' COMMENT '任务状态：待办/进行中/已完成',
    `priority` ENUM ('high', 'medium', 'low') DEFAULT 'medium' COMMENT '任务优先级：高/中/低',
    `dueDate` VARCHAR(32) COMMENT '任务截止日期，格式YYYY-MM-DD',
    `reminderTime` VARCHAR(32) COMMENT '提醒时间，格式HH:MM，用于设置任务提醒',
    `tags` VARCHAR(255) COMMENT '任务标签列表，逗号分隔的字符串',
    `attachments` VARCHAR(1024) COMMENT '任务附件ID列表，逗号分隔的字符串',
    `userId` VARCHAR(64) COMMENT '用户ID',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 习惯表结构
DROP TABLE IF EXISTS `habit`;
CREATE TABLE
  IF NOT EXISTS `habit` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '习惯唯一标识',
    `name` VARCHAR(255) NOT NULL COMMENT '习惯名称',
    `description` TEXT COMMENT '习惯详细描述',
    `category` VARCHAR(100) NOT NULL COMMENT '习惯分类',
    `tags` VARCHAR(255) COMMENT '习惯标签列表，逗号分隔的字符串',
    `frequencyType` ENUM ('daily', 'weekly', 'monthly') NOT NULL COMMENT '习惯频率类型：每日/每周/每月',
    `daysOfWeek` VARCHAR(32) COMMENT '每周的第几天（0-6），逗号分隔，0表示周日',
    `daysOfMonth` VARCHAR(128) COMMENT '每月的第几天（1-31），逗号分隔',
    `startDate` VARCHAR(32) NOT NULL COMMENT '习惯开始日期，格式YYYY-MM-DD',
    `endDate` VARCHAR(32) COMMENT '习惯结束日期，格式YYYY-MM-DD，null表示无结束日期',
    `reminderTime` VARCHAR(32) COMMENT '提醒时间，格式HH:MM',
    `reminderType` ENUM ('time', 'location') COMMENT '提醒类型：时间/位置',
    `reminderLocation` VARCHAR(255) COMMENT '提醒位置',
    `color` VARCHAR(16) NOT NULL COMMENT '习惯颜色代码',
    `icon` VARCHAR(16) NOT NULL COMMENT '习惯图标（emoji）',
    `cronExpression` VARCHAR(128) COMMENT 'cron表达式，用于定时任务',
    `isArchived` BOOLEAN DEFAULT FALSE COMMENT '是否已归档',
    `userId` VARCHAR(64) COMMENT '用户ID',
    `createdAt` DATETIME NOT NULL COMMENT '习惯创建时间',
    `updatedAt` DATETIME NOT NULL COMMENT '习惯最后更新时间',
    `streakCount` INT DEFAULT 0 COMMENT '当前连续完成次数',
    `longestStreak` INT DEFAULT 0 COMMENT '最长连续完成次数',
    `totalCompletions` INT DEFAULT 0 COMMENT '总完成次数',
    `lastCompletedAt` DATETIME COMMENT '最后完成时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 习惯完成历史表结构
DROP TABLE IF EXISTS `habit_completion`;
CREATE TABLE
  IF NOT EXISTS `habit_completion` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '完成记录唯一标识',
    `habitId` VARCHAR(64) NOT NULL COMMENT '关联的习惯ID',
    `date` VARCHAR(32) NOT NULL COMMENT '完成日期，格式YYYY-MM-DD',
    `isCompleted` BOOLEAN NOT NULL COMMENT '是否完成',
    `note` TEXT COMMENT '完成备注',
    `createdAt` DATETIME NOT NULL COMMENT '记录创建时间',
    `updatedAt` DATETIME NOT NULL COMMENT '记录最后更新时间',
    FOREIGN KEY (`habitId`) REFERENCES `habit` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_habit_date` (`habitId`, `date`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 目标表结构
DROP TABLE IF EXISTS `goal`;
CREATE TABLE
  IF NOT EXISTS `goal` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '目标唯一标识',
    `title` VARCHAR(255) NOT NULL COMMENT '目标标题',
    `description` TEXT COMMENT '目标详细描述',
    `category` VARCHAR(100) NOT NULL COMMENT '目标分类',
    `status` ENUM ('draft', 'active', 'completed', 'cancelled', 'paused') DEFAULT 'draft' COMMENT '目标状态：草稿/活跃/已完成/已取消/暂停',
    `priority` ENUM ('low', 'medium', 'high', 'urgent') DEFAULT 'medium' COMMENT '目标优先级：低/中/高/紧急',
    `startDate` VARCHAR(32) NOT NULL COMMENT '目标开始日期，格式YYYY-MM-DD',
    `targetDate` VARCHAR(32) COMMENT '目标截止日期，格式YYYY-MM-DD',
    `actualCompletionDate` VARCHAR(32) COMMENT '实际完成日期，格式YYYY-MM-DD',
    `progress` DECIMAL(5,2) DEFAULT 0.00 COMMENT '目标进度百分比（0-100）',
    `parentGoalId` VARCHAR(64) COMMENT '父目标ID，用于目标分解',
    `tags` VARCHAR(255) COMMENT '目标标签列表，逗号分隔的字符串',
    `color` VARCHAR(16) DEFAULT '#3B82F6' COMMENT '目标颜色代码',
    `icon` VARCHAR(16) DEFAULT '🎯' COMMENT '目标图标（emoji）',
    `isArchived` BOOLEAN DEFAULT FALSE COMMENT '是否已归档',
    `createdAt` DATETIME NOT NULL COMMENT '目标创建时间',
    `updatedAt` DATETIME NOT NULL COMMENT '目标最后更新时间',
    FOREIGN KEY (`parentGoalId`) REFERENCES `goal` (`id`) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 目标里程碑表结构
DROP TABLE IF EXISTS `goal_milestone`;
CREATE TABLE
  IF NOT EXISTS `goal_milestone` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '里程碑唯一标识',
    `goalId` VARCHAR(64) NOT NULL COMMENT '关联的目标ID',
    `title` VARCHAR(255) NOT NULL COMMENT '里程碑标题',
    `description` TEXT COMMENT '里程碑描述',
    `targetDate` VARCHAR(32) NOT NULL COMMENT '里程碑目标日期，格式YYYY-MM-DD',
    `isCompleted` BOOLEAN DEFAULT FALSE COMMENT '是否已完成',
    `completedAt` DATETIME COMMENT '完成时间',
    `sortOrder` INT DEFAULT 0 COMMENT '排序顺序',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    FOREIGN KEY (`goalId`) REFERENCES `goal` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 目标与任务关联表
DROP TABLE IF EXISTS `goal_task_relation`;
CREATE TABLE
  IF NOT EXISTS `goal_task_relation` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '关联记录唯一标识',
    `goalId` VARCHAR(64) NOT NULL COMMENT '目标ID',
    `taskId` VARCHAR(64) NOT NULL COMMENT '任务ID',
    `createdAt` DATETIME NOT NULL COMMENT '关联创建时间',
    FOREIGN KEY (`goalId`) REFERENCES `goal` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`taskId`) REFERENCES `task` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_goal_task` (`goalId`, `taskId`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 目标回顾记录表
DROP TABLE IF EXISTS `goal_review`;
CREATE TABLE
  IF NOT EXISTS `goal_review` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '回顾记录唯一标识',
    `goalId` VARCHAR(64) NOT NULL COMMENT '关联的目标ID',
    `reviewDate` VARCHAR(32) NOT NULL COMMENT '回顾日期，格式YYYY-MM-DD',
    `reviewType` ENUM ('daily', 'weekly', 'monthly', 'quarterly', 'custom') NOT NULL COMMENT '回顾类型',
    `progress` DECIMAL(5,2) NOT NULL COMMENT '回顾时的进度百分比',
    `achievements` TEXT COMMENT '取得的成就',
    `challenges` TEXT COMMENT '遇到的挑战',
    `improvements` TEXT COMMENT '改进建议',
    `nextSteps` TEXT COMMENT '下一步计划',
    `mood` ENUM ('very_bad', 'bad', 'neutral', 'good', 'very_good') COMMENT '心情状态',
    `rating` INT COMMENT '满意度评分（1-5）',
    `createdAt` DATETIME NOT NULL COMMENT '记录创建时间',
    `updatedAt` DATETIME NOT NULL COMMENT '记录更新时间',
    FOREIGN KEY (`goalId`) REFERENCES `goal` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 番茄钟模板表结构
DROP TABLE IF EXISTS `pomodoro_template`;
CREATE TABLE
  IF NOT EXISTS `pomodoro_template` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '番茄钟模板唯一标识',
    `name` VARCHAR(255) NOT NULL COMMENT '模板名称',
    `description` TEXT COMMENT '模板描述',
    `workDuration` INT NOT NULL DEFAULT 25 COMMENT '工作时长（分钟）',
    `shortBreakDuration` INT NOT NULL DEFAULT 5 COMMENT '短休息时长（分钟）',
    `longBreakDuration` INT NOT NULL DEFAULT 15 COMMENT '长休息时长（分钟）',
    `roundsBeforeLongBreak` INT NOT NULL DEFAULT 4 COMMENT '长休息前的番茄钟轮数',
    `autoStartBreak` BOOLEAN DEFAULT TRUE COMMENT '是否自动开始休息',
    `autoStartWork` BOOLEAN DEFAULT FALSE COMMENT '是否自动开始工作',
    `enableNotifications` BOOLEAN DEFAULT TRUE COMMENT '是否启用通知',
    `enableSounds` BOOLEAN DEFAULT TRUE COMMENT '是否启用声音',
    `focusMode` BOOLEAN DEFAULT FALSE COMMENT '是否启用专注模式',
    `isDefault` BOOLEAN DEFAULT FALSE COMMENT '是否为默认模板',
    `isArchived` BOOLEAN DEFAULT FALSE COMMENT '是否已归档',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 番茄钟会话表结构
DROP TABLE IF EXISTS `pomodoro_session`;
CREATE TABLE
  IF NOT EXISTS `pomodoro_session` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '番茄钟会话唯一标识',
    `templateId` VARCHAR(64) COMMENT '使用的模板ID',
    `taskId` VARCHAR(64) COMMENT '关联的任务ID',
    `type` ENUM ('work', 'short_break', 'long_break') NOT NULL COMMENT '会话类型：工作/短休息/长休息',
    `status` ENUM ('pending', 'running', 'paused', 'completed', 'cancelled') DEFAULT 'pending' COMMENT '会话状态',
    `plannedDuration` INT NOT NULL COMMENT '计划时长（分钟）',
    `actualDuration` INT COMMENT '实际时长（分钟）',
    `startTime` DATETIME COMMENT '开始时间',
    `endTime` DATETIME COMMENT '结束时间',
    `pausedDuration` INT DEFAULT 0 COMMENT '暂停总时长（分钟）',
    `pauseCount` INT DEFAULT 0 COMMENT '暂停次数',
    `interruptions` INT DEFAULT 0 COMMENT '中断次数',
    `notes` TEXT COMMENT '会话备注',
    `productivity` ENUM ('very_low', 'low', 'medium', 'high', 'very_high') COMMENT '生产力评级',
    `mood` ENUM ('very_bad', 'bad', 'neutral', 'good', 'very_good') COMMENT '心情状态',
    `energy` ENUM ('very_low', 'low', 'medium', 'high', 'very_high') COMMENT '精力状态',
    `tags` VARCHAR(255) COMMENT '标签列表，逗号分隔',
    `isArchived` BOOLEAN DEFAULT FALSE COMMENT '是否已归档',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    FOREIGN KEY (`templateId`) REFERENCES `pomodoro_template` (`id`) ON DELETE SET NULL,
    FOREIGN KEY (`taskId`) REFERENCES `task` (`id`) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 番茄钟暂停记录表
DROP TABLE IF EXISTS `pomodoro_pause`;
CREATE TABLE
  IF NOT EXISTS `pomodoro_pause` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '暂停记录唯一标识',
    `sessionId` VARCHAR(64) NOT NULL COMMENT '关联的会话ID',
    `pauseTime` DATETIME NOT NULL COMMENT '暂停时间',
    `resumeTime` DATETIME COMMENT '恢复时间',
    `duration` INT COMMENT '暂停时长（分钟）',
    `reason` VARCHAR(255) COMMENT '暂停原因',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    FOREIGN KEY (`sessionId`) REFERENCES `pomodoro_session` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 番茄钟统计表结构
DROP TABLE IF EXISTS `pomodoro_stats`;
CREATE TABLE
  IF NOT EXISTS `pomodoro_stats` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '统计记录唯一标识',
    `date` VARCHAR(32) NOT NULL COMMENT '统计日期，格式YYYY-MM-DD',
    `totalSessions` INT DEFAULT 0 COMMENT '总会话数',
    `completedSessions` INT DEFAULT 0 COMMENT '完成的会话数',
    `totalWorkTime` INT DEFAULT 0 COMMENT '总工作时间（分钟）',
    `totalBreakTime` INT DEFAULT 0 COMMENT '总休息时间（分钟）',
    `totalPauseTime` INT DEFAULT 0 COMMENT '总暂停时间（分钟）',
    `averageProductivity` DECIMAL(3,2) COMMENT '平均生产力评级',
    `averageMood` DECIMAL(3,2) COMMENT '平均心情状态',
    `averageEnergy` DECIMAL(3,2) COMMENT '平均精力状态',
    `interruptions` INT DEFAULT 0 COMMENT '总中断次数',
    `tasksCompleted` INT DEFAULT 0 COMMENT '完成的任务数',
    `longestFocusSession` INT DEFAULT 0 COMMENT '最长专注时间（分钟）',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    UNIQUE KEY `unique_date` (`date`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;