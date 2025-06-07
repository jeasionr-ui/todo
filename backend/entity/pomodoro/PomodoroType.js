// 番茄钟相关实体类定义

/**
 * 番茄钟模板实体类
 */
export class PomodoroTemplate {
  constructor() {
    this.id = null;
    this.name = '';
    this.description = '';
    this.workDuration = 25; // 工作时长（分钟）
    this.shortBreakDuration = 5; // 短休息时长（分钟）
    this.longBreakDuration = 15; // 长休息时长（分钟）
    this.roundsBeforeLongBreak = 4; // 长休息前的轮数
    this.autoStartBreak = true; // 自动开始休息
    this.autoStartWork = false; // 自动开始工作
    this.enableNotifications = true; // 启用通知
    this.enableSounds = true; // 启用声音
    this.focusMode = false; // 专注模式
    this.isDefault = false; // 是否为默认模板
    this.isArchived = false; // 是否已归档
    this.createdAt = null;
    this.updatedAt = null;
  }

  /**
   * 验证番茄钟模板数据
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push('模板名称不能为空');
    }

    if (this.workDuration <= 0 || this.workDuration > 120) {
      errors.push('工作时长必须在1-120分钟之间');
    }

    if (this.shortBreakDuration <= 0 || this.shortBreakDuration > 60) {
      errors.push('短休息时长必须在1-60分钟之间');
    }

    if (this.longBreakDuration <= 0 || this.longBreakDuration > 120) {
      errors.push('长休息时长必须在1-120分钟之间');
    }

    if (this.roundsBeforeLongBreak <= 0 || this.roundsBeforeLongBreak > 10) {
      errors.push('长休息前轮数必须在1-10之间');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 转换为数据库存储格式
   */
  toDatabaseFormat() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      workDuration: this.workDuration,
      shortBreakDuration: this.shortBreakDuration,
      longBreakDuration: this.longBreakDuration,
      roundsBeforeLongBreak: this.roundsBeforeLongBreak,
      autoStartBreak: this.autoStartBreak,
      autoStartWork: this.autoStartWork,
      enableNotifications: this.enableNotifications,
      enableSounds: this.enableSounds,
      focusMode: this.focusMode,
      isDefault: this.isDefault,
      isArchived: this.isArchived,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 从数据库格式创建模板实例
   */
  static fromDatabaseFormat(data) {
    if (!data) return null;

    const template = new PomodoroTemplate();
    template.id = data.id;
    template.name = data.name;
    template.description = data.description;
    template.workDuration = data.workDuration;
    template.shortBreakDuration = data.shortBreakDuration;
    template.longBreakDuration = data.longBreakDuration;
    template.roundsBeforeLongBreak = data.roundsBeforeLongBreak;
    template.autoStartBreak = data.autoStartBreak;
    template.autoStartWork = data.autoStartWork;
    template.enableNotifications = data.enableNotifications;
    template.enableSounds = data.enableSounds;
    template.focusMode = data.focusMode;
    template.isDefault = data.isDefault;
    template.isArchived = data.isArchived;
    template.createdAt = data.createdAt;
    template.updatedAt = data.updatedAt;

    return template;
  }
}

/**
 * 番茄钟会话实体类
 */
export class PomodoroSession {
  constructor() {
    this.id = null;
    this.templateId = null;
    this.taskId = null;
    this.type = 'work'; // work, short_break, long_break
    this.status = 'pending'; // pending, running, paused, completed, cancelled
    this.plannedDuration = 25; // 计划时长（分钟）
    this.actualDuration = null; // 实际时长（分钟）
    this.startTime = null;
    this.endTime = null;
    this.pausedDuration = 0; // 暂停总时长（分钟）
    this.pauseCount = 0; // 暂停次数
    this.interruptions = 0; // 中断次数
    this.notes = '';
    this.productivity = null; // very_low, low, medium, high, very_high
    this.mood = null; // very_bad, bad, neutral, good, very_good
    this.energy = null; // very_low, low, medium, high, very_high
    this.tags = [];
    this.isArchived = false;
    this.createdAt = null;
    this.updatedAt = null;
  }

  /**
   * 验证番茄钟会话数据
   */
  validate() {
    const errors = [];

    if (!['work', 'short_break', 'long_break'].includes(this.type)) {
      errors.push('会话类型必须是work、short_break或long_break');
    }

    if (!['pending', 'running', 'paused', 'completed', 'cancelled'].includes(this.status)) {
      errors.push('会话状态不合法');
    }

    if (this.plannedDuration <= 0 || this.plannedDuration > 480) {
      errors.push('计划时长必须在1-480分钟之间');
    }

    if (this.productivity && !['very_low', 'low', 'medium', 'high', 'very_high'].includes(this.productivity)) {
      errors.push('生产力评级不合法');
    }

    if (this.mood && !['very_bad', 'bad', 'neutral', 'good', 'very_good'].includes(this.mood)) {
      errors.push('心情状态不合法');
    }

    if (this.energy && !['very_low', 'low', 'medium', 'high', 'very_high'].includes(this.energy)) {
      errors.push('精力状态不合法');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 转换为数据库存储格式
   */
  toDatabaseFormat() {
    return {
      id: this.id,
      templateId: this.templateId,
      taskId: this.taskId,
      type: this.type,
      status: this.status,
      plannedDuration: this.plannedDuration,
      actualDuration: this.actualDuration,
      startTime: this.startTime,
      endTime: this.endTime,
      pausedDuration: this.pausedDuration,
      pauseCount: this.pauseCount,
      interruptions: this.interruptions,
      notes: this.notes,
      productivity: this.productivity,
      mood: this.mood,
      energy: this.energy,
      tags: Array.isArray(this.tags) ? this.tags.join(',') : this.tags,
      isArchived: this.isArchived,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 从数据库格式创建会话实例
   */
  static fromDatabaseFormat(data) {
    if (!data) return null;

    const session = new PomodoroSession();
    session.id = data.id;
    session.templateId = data.templateId;
    session.taskId = data.taskId;
    session.type = data.type;
    session.status = data.status;
    session.plannedDuration = data.plannedDuration;
    session.actualDuration = data.actualDuration;
    session.startTime = data.startTime;
    session.endTime = data.endTime;
    session.pausedDuration = data.pausedDuration || 0;
    session.pauseCount = data.pauseCount || 0;
    session.interruptions = data.interruptions || 0;
    session.notes = data.notes || '';
    session.productivity = data.productivity;
    session.mood = data.mood;
    session.energy = data.energy;
    session.tags = data.tags ? data.tags.split(',').filter(tag => tag.trim()) : [];
    session.isArchived = data.isArchived || false;
    session.createdAt = data.createdAt;
    session.updatedAt = data.updatedAt;

    return session;
  }
}

/**
 * 番茄钟暂停记录实体类
 */
export class PomodoroPause {
  constructor() {
    this.id = null;
    this.sessionId = null;
    this.pauseTime = null;
    this.resumeTime = null;
    this.duration = null; // 暂停时长（分钟）
    this.reason = '';
    this.createdAt = null;
  }

  /**
   * 转换为数据库存储格式
   */
  toDatabaseFormat() {
    return {
      id: this.id,
      sessionId: this.sessionId,
      pauseTime: this.pauseTime,
      resumeTime: this.resumeTime,
      duration: this.duration,
      reason: this.reason,
      createdAt: this.createdAt
    };
  }

  /**
   * 从数据库格式创建暂停记录实例
   */
  static fromDatabaseFormat(data) {
    if (!data) return null;

    const pause = new PomodoroPause();
    pause.id = data.id;
    pause.sessionId = data.sessionId;
    pause.pauseTime = data.pauseTime;
    pause.resumeTime = data.resumeTime;
    pause.duration = data.duration;
    pause.reason = data.reason || '';
    pause.createdAt = data.createdAt;

    return pause;
  }
}

/**
 * 番茄钟统计实体类
 */
export class PomodoroStats {
  constructor() {
    this.id = null;
    this.date = null; // YYYY-MM-DD格式
    this.totalSessions = 0;
    this.completedSessions = 0;
    this.totalWorkTime = 0; // 分钟
    this.totalBreakTime = 0; // 分钟
    this.totalPauseTime = 0; // 分钟
    this.averageProductivity = null;
    this.averageMood = null;
    this.averageEnergy = null;
    this.interruptions = 0;
    this.tasksCompleted = 0;
    this.longestFocusSession = 0; // 分钟
    this.createdAt = null;
    this.updatedAt = null;
  }

  /**
   * 转换为数据库存储格式
   */
  toDatabaseFormat() {
    return {
      id: this.id,
      date: this.date,
      totalSessions: this.totalSessions,
      completedSessions: this.completedSessions,
      totalWorkTime: this.totalWorkTime,
      totalBreakTime: this.totalBreakTime,
      totalPauseTime: this.totalPauseTime,
      averageProductivity: this.averageProductivity,
      averageMood: this.averageMood,
      averageEnergy: this.averageEnergy,
      interruptions: this.interruptions,
      tasksCompleted: this.tasksCompleted,
      longestFocusSession: this.longestFocusSession,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 从数据库格式创建统计实例
   */
  static fromDatabaseFormat(data) {
    if (!data) return null;

    const stats = new PomodoroStats();
    stats.id = data.id;
    stats.date = data.date;
    stats.totalSessions = data.totalSessions || 0;
    stats.completedSessions = data.completedSessions || 0;
    stats.totalWorkTime = data.totalWorkTime || 0;
    stats.totalBreakTime = data.totalBreakTime || 0;
    stats.totalPauseTime = data.totalPauseTime || 0;
    stats.averageProductivity = data.averageProductivity;
    stats.averageMood = data.averageMood;
    stats.averageEnergy = data.averageEnergy;
    stats.interruptions = data.interruptions || 0;
    stats.tasksCompleted = data.tasksCompleted || 0;
    stats.longestFocusSession = data.longestFocusSession || 0;
    stats.createdAt = data.createdAt;
    stats.updatedAt = data.updatedAt;

    return stats;
  }
}
