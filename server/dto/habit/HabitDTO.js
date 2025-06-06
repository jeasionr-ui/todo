import { Habit, HabitCompletion } from '../../entity/habit/HabitType.js';

/**
 * 习惯数据传输对象类
 */
class HabitDTO {
  /**
   * 将前端传入的习惯数据转换为实体对象
   * @param {Object} habitData - 前端传入的习惯数据
   * @returns {Habit} 习惯实体对象
   */
  static fromRequest(habitData) {
    const habit = new Habit();
    
    if (habitData.id) habit.id = habitData.id;
    if (habitData.name) habit.name = habitData.name.trim();
    if (habitData.description) habit.description = habitData.description.trim();
    if (habitData.category) habit.category = habitData.category.trim();
    if (habitData.tags) habit.tags = Array.isArray(habitData.tags) ? habitData.tags : [];
    if (habitData.frequency) habit.frequency = habitData.frequency;
    if (habitData.startDate) habit.startDate = habitData.startDate;
    if (habitData.endDate) habit.endDate = habitData.endDate;
    if (habitData.reminderTime) habit.reminderTime = habitData.reminderTime;
    if (habitData.reminderType) habit.reminderType = habitData.reminderType;
    if (habitData.reminderLocation) habit.reminderLocation = habitData.reminderLocation;
    if (habitData.color) habit.color = habitData.color;
    if (habitData.icon) habit.icon = habitData.icon;
    if (habitData.cronExpression) habit.cronExpression = habitData.cronExpression;
    if (typeof habitData.isArchived === 'boolean') habit.isArchived = habitData.isArchived;
    
    return habit;
  }

  /**
   * 将习惯实体对象转换为前端响应格式
   * @param {Habit} habit - 习惯实体对象
   * @param {Array} completionHistory - 完成历史记录（可选）
   * @returns {Object} 前端响应格式的习惯数据
   */
  static toResponse(habit, completionHistory = []) {
    if (!habit) return null;

    return {
      id: habit.id,
      name: habit.name,
      description: habit.description,
      category: habit.category,
      tags: habit.tags,
      frequency: habit.frequency,
      startDate: habit.startDate,
      endDate: habit.endDate,
      reminderTime: habit.reminderTime,
      reminderType: habit.reminderType,
      reminderLocation: habit.reminderLocation,
      color: habit.color,
      icon: habit.icon,
      cronExpression: habit.cronExpression,
      isArchived: habit.isArchived,
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt,
      streakCount: habit.streakCount,
      longestStreak: habit.longestStreak,
      totalCompletions: habit.totalCompletions,
      completionHistory: completionHistory,
      lastCompletedAt: habit.lastCompletedAt
    };
  }

  /**
   * 将习惯实体对象数组转换为前端响应格式
   * @param {Array} habits - 习惯实体对象数组
   * @returns {Array} 前端响应格式的习惯数据数组
   */
  static toResponseList(habits) {
    if (!Array.isArray(habits)) return [];
    
    return habits.map(habit => this.toResponse(habit));
  }

  /**
   * 创建习惯时的数据验证和转换
   * @param {Object} habitData - 前端传入的习惯数据
   * @returns {Object} 包含验证结果和转换后的习惯对象
   */
  static validateAndCreateHabit(habitData) {
    const habit = this.fromRequest(habitData);
    const validation = habit.validate();
    
    return {
      habit,
      isValid: validation.isValid,
      errors: validation.errors
    };
  }

  /**
   * 更新习惯时的数据验证和转换
   * @param {Object} habitData - 前端传入的习惯数据
   * @param {Habit} existingHabit - 现有的习惯对象
   * @returns {Object} 包含验证结果和更新后的习惯对象
   */
  static validateAndUpdateHabit(habitData, existingHabit) {
    // 保留现有数据，只更新传入的字段
    const updatedHabit = new Habit(existingHabit);
    
    if (habitData.name !== undefined) updatedHabit.name = habitData.name.trim();
    if (habitData.description !== undefined) updatedHabit.description = habitData.description.trim();
    if (habitData.category !== undefined) updatedHabit.category = habitData.category.trim();
    if (habitData.tags !== undefined) updatedHabit.tags = Array.isArray(habitData.tags) ? habitData.tags : [];
    if (habitData.frequency !== undefined) updatedHabit.frequency = habitData.frequency;
    if (habitData.startDate !== undefined) updatedHabit.startDate = habitData.startDate;
    if (habitData.endDate !== undefined) updatedHabit.endDate = habitData.endDate;
    if (habitData.reminderTime !== undefined) updatedHabit.reminderTime = habitData.reminderTime;
    if (habitData.reminderType !== undefined) updatedHabit.reminderType = habitData.reminderType;
    if (habitData.reminderLocation !== undefined) updatedHabit.reminderLocation = habitData.reminderLocation;
    if (habitData.color !== undefined) updatedHabit.color = habitData.color;
    if (habitData.icon !== undefined) updatedHabit.icon = habitData.icon;
    if (habitData.cronExpression !== undefined) updatedHabit.cronExpression = habitData.cronExpression;
    if (typeof habitData.isArchived === 'boolean') updatedHabit.isArchived = habitData.isArchived;
    
    updatedHabit.updatedAt = new Date().toISOString();
    
    const validation = updatedHabit.validate();
    
    return {
      habit: updatedHabit,
      isValid: validation.isValid,
      errors: validation.errors
    };
  }
}

/**
 * 习惯完成记录数据传输对象类
 */
class HabitCompletionDTO {
  /**
   * 将前端传入的完成记录数据转换为实体对象
   * @param {Object} completionData - 前端传入的完成记录数据
   * @returns {HabitCompletion} 完成记录实体对象
   */
  static fromRequest(completionData) {
    const completion = new HabitCompletion();
    
    if (completionData.id) completion.id = completionData.id;
    if (completionData.habitId) completion.habitId = completionData.habitId;
    if (completionData.date) completion.date = completionData.date;
    if (typeof completionData.isCompleted === 'boolean') completion.isCompleted = completionData.isCompleted;
    if (completionData.note) completion.note = completionData.note.trim();
    
    return completion;
  }

  /**
   * 将完成记录实体对象转换为前端响应格式
   * @param {HabitCompletion} completion - 完成记录实体对象
   * @returns {Object} 前端响应格式的完成记录数据
   */
  static toResponse(completion) {
    if (!completion) return null;

    return {
      id: completion.id,
      habitId: completion.habitId,
      date: completion.date,
      isCompleted: completion.isCompleted,
      note: completion.note,
      createdAt: completion.createdAt,
      updatedAt: completion.updatedAt
    };
  }

  /**
   * 将完成记录实体对象数组转换为前端响应格式
   * @param {Array} completions - 完成记录实体对象数组
   * @returns {Array} 前端响应格式的完成记录数据数组
   */
  static toResponseList(completions) {
    if (!Array.isArray(completions)) return [];
    
    return completions.map(completion => this.toResponse(completion));
  }

  /**
   * 创建完成记录时的数据验证和转换
   * @param {Object} completionData - 前端传入的完成记录数据
   * @returns {Object} 包含验证结果和转换后的完成记录对象
   */
  static validateAndCreateCompletion(completionData) {
    const completion = this.fromRequest(completionData);
    const validation = completion.validate();
    
    return {
      completion,
      isValid: validation.isValid,
      errors: validation.errors
    };
  }
}

export { HabitDTO, HabitCompletionDTO };
