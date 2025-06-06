/**
 * 习惯实体类型定义
 */

// 习惯频率类型枚举
const FrequencyType = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
};

// 提醒类型枚举
const ReminderType = {
  TIME: 'time',
  LOCATION: 'location'
};

/**
 * 习惯实体类
 */
class Habit {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.category = data.category || '';
    this.tags = data.tags || [];
    this.frequency = data.frequency || { type: FrequencyType.DAILY };
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.reminderTime = data.reminderTime || null;
    this.reminderType = data.reminderType || null;
    this.reminderLocation = data.reminderLocation || null;
    this.color = data.color || '#3B82F6';
    this.icon = data.icon || '🎯';
    this.cronExpression = data.cronExpression || null;
    this.isArchived = data.isArchived || false;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
    this.streakCount = data.streakCount || 0;
    this.longestStreak = data.longestStreak || 0;
    this.totalCompletions = data.totalCompletions || 0;
    this.completionHistory = data.completionHistory || [];
    this.lastCompletedAt = data.lastCompletedAt || null;
  }

  /**
   * 验证习惯数据是否有效
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push('习惯名称不能为空');
    }

    if (!this.category || this.category.trim().length === 0) {
      errors.push('习惯分类不能为空');
    }

    if (!Object.values(FrequencyType).includes(this.frequency.type)) {
      errors.push('无效的习惯频率类型');
    }

    if (!this.startDate) {
      errors.push('习惯开始日期不能为空');
    }

    if (!this.color || !/^#[0-9A-Fa-f]{6}$/.test(this.color)) {
      errors.push('无效的颜色代码');
    }

    if (!this.icon || this.icon.trim().length === 0) {
      errors.push('习惯图标不能为空');
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
      category: this.category,
      tags: Array.isArray(this.tags) ? this.tags.join(',') : this.tags,
      frequencyType: this.frequency.type,
      daysOfWeek: this.frequency.daysOfWeek ? this.frequency.daysOfWeek.join(',') : null,
      daysOfMonth: this.frequency.daysOfMonth ? this.frequency.daysOfMonth.join(',') : null,
      startDate: this.startDate,
      endDate: this.endDate,
      reminderTime: this.reminderTime,
      reminderType: this.reminderType,
      reminderLocation: this.reminderLocation,
      color: this.color,
      icon: this.icon,
      cronExpression: this.cronExpression,
      isArchived: this.isArchived,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      streakCount: this.streakCount,
      longestStreak: this.longestStreak,
      totalCompletions: this.totalCompletions,
      lastCompletedAt: this.lastCompletedAt
    };
  }

  /**
   * 从数据库格式创建习惯实例
   */
  static fromDatabaseFormat(data) {
    if (!data) return null;

    const habit = new Habit();
    habit.id = data.id;
    habit.name = data.name;
    habit.description = data.description;
    habit.category = data.category;
    habit.tags = data.tags ? data.tags.split(',').filter(tag => tag.trim()) : [];
    habit.frequency = {
      type: data.frequencyType,
      daysOfWeek: data.daysOfWeek ? data.daysOfWeek.split(',').map(Number) : null,
      daysOfMonth: data.daysOfMonth ? data.daysOfMonth.split(',').map(Number) : null
    };
    habit.startDate = data.startDate;
    habit.endDate = data.endDate;
    habit.reminderTime = data.reminderTime;
    habit.reminderType = data.reminderType;
    habit.reminderLocation = data.reminderLocation;
    habit.color = data.color;
    habit.icon = data.icon;
    habit.cronExpression = data.cronExpression;
    habit.isArchived = data.isArchived;
    habit.createdAt = data.createdAt;
    habit.updatedAt = data.updatedAt;
    habit.streakCount = data.streakCount || 0;
    habit.longestStreak = data.longestStreak || 0;
    habit.totalCompletions = data.totalCompletions || 0;
    habit.lastCompletedAt = data.lastCompletedAt;
    
    return habit;
  }
}

/**
 * 习惯完成记录实体类
 */
class HabitCompletion {
  constructor(data = {}) {
    this.id = data.id || null;
    this.habitId = data.habitId || null;
    this.date = data.date || null;
    this.isCompleted = data.isCompleted || false;
    this.note = data.note || null;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  /**
   * 验证完成记录数据是否有效
   */
  validate() {
    const errors = [];

    if (!this.habitId) {
      errors.push('习惯ID不能为空');
    }

    if (!this.date) {
      errors.push('完成日期不能为空');
    }

    if (typeof this.isCompleted !== 'boolean') {
      errors.push('完成状态必须为布尔值');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export { Habit, HabitCompletion, FrequencyType, ReminderType };
