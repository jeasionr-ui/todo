// 番茄钟数据传输对象类

import { PomodoroTemplate, PomodoroSession, PomodoroPause, PomodoroStats } from '../../entity/pomodoro/PomodoroType.js';

/**
 * 番茄钟模板数据传输对象类
 */
export class PomodoroTemplateDTO {
  constructor(template) {
    if (template) {
      this.id = template.id;
      this.name = template.name;
      this.description = template.description;
      this.workDuration = template.workDuration;
      this.shortBreakDuration = template.shortBreakDuration;
      this.longBreakDuration = template.longBreakDuration;
      this.roundsBeforeLongBreak = template.roundsBeforeLongBreak;
      this.autoStartBreak = template.autoStartBreak;
      this.autoStartWork = template.autoStartWork;
      this.enableNotifications = template.enableNotifications;
      this.enableSounds = template.enableSounds;
      this.focusMode = template.focusMode;
      this.isDefault = template.isDefault;
      this.isArchived = template.isArchived;
      this.createdAt = template.createdAt;
      this.updatedAt = template.updatedAt;
    }
  }

  /**
   * 创建模板时的数据验证和转换
   */
  static validateAndCreateTemplate(templateData) {
    const template = new PomodoroTemplate();
    
    // 设置基本信息
    template.name = templateData.name?.trim() || '';
    template.description = templateData.description?.trim() || '';
    
    // 设置时长配置
    template.workDuration = parseInt(templateData.workDuration) || 25;
    template.shortBreakDuration = parseInt(templateData.shortBreakDuration) || 5;
    template.longBreakDuration = parseInt(templateData.longBreakDuration) || 15;
    template.roundsBeforeLongBreak = parseInt(templateData.roundsBeforeLongBreak) || 4;
    
    // 设置行为配置
    template.autoStartBreak = templateData.autoStartBreak === true;
    template.autoStartWork = templateData.autoStartWork === true;
    template.enableNotifications = templateData.enableNotifications !== false;
    template.enableSounds = templateData.enableSounds !== false;
    template.focusMode = templateData.focusMode === true;
    template.isDefault = templateData.isDefault === true;
    
    const validation = template.validate();
    
    return {
      template,
      isValid: validation.isValid,
      errors: validation.errors
    };
  }

  /**
   * 更新模板时的数据验证和转换
   */
  static validateAndUpdateTemplate(templateData, existingTemplate) {
    const updatedTemplate = new PomodoroTemplate();
    
    // 保留原有数据
    Object.assign(updatedTemplate, existingTemplate);
    
    // 更新传入的字段
    if (templateData.name !== undefined) {
      updatedTemplate.name = templateData.name.trim();
    }
    if (templateData.description !== undefined) {
      updatedTemplate.description = templateData.description.trim();
    }
    if (templateData.workDuration !== undefined) {
      updatedTemplate.workDuration = parseInt(templateData.workDuration);
    }
    if (templateData.shortBreakDuration !== undefined) {
      updatedTemplate.shortBreakDuration = parseInt(templateData.shortBreakDuration);
    }
    if (templateData.longBreakDuration !== undefined) {
      updatedTemplate.longBreakDuration = parseInt(templateData.longBreakDuration);
    }
    if (templateData.roundsBeforeLongBreak !== undefined) {
      updatedTemplate.roundsBeforeLongBreak = parseInt(templateData.roundsBeforeLongBreak);
    }
    if (templateData.autoStartBreak !== undefined) {
      updatedTemplate.autoStartBreak = templateData.autoStartBreak === true;
    }
    if (templateData.autoStartWork !== undefined) {
      updatedTemplate.autoStartWork = templateData.autoStartWork === true;
    }
    if (templateData.enableNotifications !== undefined) {
      updatedTemplate.enableNotifications = templateData.enableNotifications === true;
    }
    if (templateData.enableSounds !== undefined) {
      updatedTemplate.enableSounds = templateData.enableSounds === true;
    }
    if (templateData.focusMode !== undefined) {
      updatedTemplate.focusMode = templateData.focusMode === true;
    }
    if (templateData.isDefault !== undefined) {
      updatedTemplate.isDefault = templateData.isDefault === true;
    }
    
    // 更新时间戳
    updatedTemplate.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const validation = updatedTemplate.validate();
    
    return {
      template: updatedTemplate,
      isValid: validation.isValid,
      errors: validation.errors
    };
  }
}

/**
 * 番茄钟会话数据传输对象类
 */
export class PomodoroSessionDTO {
  constructor(session) {
    if (session) {
      this.id = session.id;
      this.templateId = session.templateId;
      this.taskId = session.taskId;
      this.type = session.type;
      this.status = session.status;
      this.plannedDuration = session.plannedDuration;
      this.actualDuration = session.actualDuration;
      this.startTime = session.startTime;
      this.endTime = session.endTime;
      this.pausedDuration = session.pausedDuration;
      this.pauseCount = session.pauseCount;
      this.interruptions = session.interruptions;
      this.notes = session.notes;
      this.productivity = session.productivity;
      this.mood = session.mood;
      this.energy = session.energy;
      this.tags = session.tags;
      this.isArchived = session.isArchived;
      this.createdAt = session.createdAt;
      this.updatedAt = session.updatedAt;
    }
  }

  /**
   * 创建会话时的数据验证和转换
   */
  static validateAndCreateSession(sessionData) {
    const session = new PomodoroSession();
    
    session.templateId = sessionData.templateId || null;
    session.taskId = sessionData.taskId || null;
    session.type = sessionData.type || 'work';
    session.plannedDuration = parseInt(sessionData.plannedDuration) || 25;
    session.notes = sessionData.notes?.trim() || '';
    
    // 处理标签
    if (sessionData.tags) {
      if (Array.isArray(sessionData.tags)) {
        session.tags = sessionData.tags.filter(tag => tag && tag.trim());
      } else if (typeof sessionData.tags === 'string') {
        session.tags = sessionData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
    }
    
    const validation = session.validate();
    
    return {
      session,
      isValid: validation.isValid,
      errors: validation.errors
    };
  }

  /**
   * 更新会话时的数据验证和转换
   */
  static validateAndUpdateSession(sessionData, existingSession) {
    const updatedSession = new PomodoroSession();
    
    // 保留原有数据
    Object.assign(updatedSession, existingSession);
    
    // 更新传入的字段
    if (sessionData.status !== undefined) {
      updatedSession.status = sessionData.status;
    }
    if (sessionData.actualDuration !== undefined) {
      updatedSession.actualDuration = parseInt(sessionData.actualDuration);
    }
    if (sessionData.startTime !== undefined) {
      updatedSession.startTime = sessionData.startTime;
    }
    if (sessionData.endTime !== undefined) {
      updatedSession.endTime = sessionData.endTime;
    }
    if (sessionData.pausedDuration !== undefined) {
      updatedSession.pausedDuration = parseInt(sessionData.pausedDuration);
    }
    if (sessionData.pauseCount !== undefined) {
      updatedSession.pauseCount = parseInt(sessionData.pauseCount);
    }
    if (sessionData.interruptions !== undefined) {
      updatedSession.interruptions = parseInt(sessionData.interruptions);
    }
    if (sessionData.notes !== undefined) {
      updatedSession.notes = sessionData.notes.trim();
    }
    if (sessionData.productivity !== undefined) {
      updatedSession.productivity = sessionData.productivity;
    }
    if (sessionData.mood !== undefined) {
      updatedSession.mood = sessionData.mood;
    }
    if (sessionData.energy !== undefined) {
      updatedSession.energy = sessionData.energy;
    }
    if (sessionData.tags !== undefined) {
      if (Array.isArray(sessionData.tags)) {
        updatedSession.tags = sessionData.tags.filter(tag => tag && tag.trim());
      } else if (typeof sessionData.tags === 'string') {
        updatedSession.tags = sessionData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
    }
    
    // 更新时间戳
    updatedSession.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const validation = updatedSession.validate();
    
    return {
      session: updatedSession,
      isValid: validation.isValid,
      errors: validation.errors
    };
  }
}

/**
 * 番茄钟暂停记录数据传输对象类
 */
export class PomodoroPauseDTO {
  constructor(pause) {
    if (pause) {
      this.id = pause.id;
      this.sessionId = pause.sessionId;
      this.pauseTime = pause.pauseTime;
      this.resumeTime = pause.resumeTime;
      this.duration = pause.duration;
      this.reason = pause.reason;
      this.createdAt = pause.createdAt;
    }
  }

  /**
   * 创建暂停记录时的数据验证和转换
   */
  static validateAndCreatePause(pauseData) {
    const pause = new PomodoroPause();
    
    pause.sessionId = pauseData.sessionId;
    pause.pauseTime = pauseData.pauseTime || new Date().toISOString().slice(0, 19).replace('T', ' ');
    pause.reason = pauseData.reason?.trim() || '';
    
    return {
      pause,
      isValid: !!pause.sessionId,
      errors: pause.sessionId ? [] : ['会话ID不能为空']
    };
  }
}

/**
 * 番茄钟统计数据传输对象类
 */
export class PomodoroStatsDTO {
  constructor(stats) {
    if (stats) {
      this.id = stats.id;
      this.date = stats.date;
      this.totalSessions = stats.totalSessions;
      this.completedSessions = stats.completedSessions;
      this.totalWorkTime = stats.totalWorkTime;
      this.totalBreakTime = stats.totalBreakTime;
      this.totalPauseTime = stats.totalPauseTime;
      this.averageProductivity = stats.averageProductivity;
      this.averageMood = stats.averageMood;
      this.averageEnergy = stats.averageEnergy;
      this.interruptions = stats.interruptions;
      this.tasksCompleted = stats.tasksCompleted;
      this.longestFocusSession = stats.longestFocusSession;
      this.createdAt = stats.createdAt;
      this.updatedAt = stats.updatedAt;
    }
  }

  /**
   * 创建统计记录时的数据验证和转换
   */
  static validateAndCreateStats(statsData) {
    const stats = new PomodoroStats();
    
    stats.date = statsData.date || new Date().toISOString().split('T')[0];
    stats.totalSessions = parseInt(statsData.totalSessions) || 0;
    stats.completedSessions = parseInt(statsData.completedSessions) || 0;
    stats.totalWorkTime = parseInt(statsData.totalWorkTime) || 0;
    stats.totalBreakTime = parseInt(statsData.totalBreakTime) || 0;
    stats.totalPauseTime = parseInt(statsData.totalPauseTime) || 0;
    stats.averageProductivity = statsData.averageProductivity ? parseFloat(statsData.averageProductivity) : null;
    stats.averageMood = statsData.averageMood ? parseFloat(statsData.averageMood) : null;
    stats.averageEnergy = statsData.averageEnergy ? parseFloat(statsData.averageEnergy) : null;
    stats.interruptions = parseInt(statsData.interruptions) || 0;
    stats.tasksCompleted = parseInt(statsData.tasksCompleted) || 0;
    stats.longestFocusSession = parseInt(statsData.longestFocusSession) || 0;
    
    return {
      stats,
      isValid: true,
      errors: []
    };
  }
}
