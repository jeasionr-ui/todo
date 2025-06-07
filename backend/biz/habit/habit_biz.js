import HabitDB from '../../db/habit/habit_db.js';
import { HabitDTO, HabitCompletionDTO } from '../../dto/habit/HabitDTO.js';

/**
 * 习惯业务逻辑类
 */
class HabitBiz {
  constructor(connection) {
    this.habitDB = new HabitDB(connection);
  }

  /**
   * 创建新习惯
   * @param {Object} habitData - 前端传入的习惯数据
   * @returns {Promise<Object>} 返回创建结果
   */
  async createHabit(habitData) {
    try {
      // 验证和转换数据
      const { habit, isValid, errors } = HabitDTO.validateAndCreateHabit(habitData);
      
      if (!isValid) {
        return {
          success: false,
          message: '习惯数据验证失败',
          errors
        };
      }

      // 创建习惯
      const habitId = await this.habitDB.createHabit(habit);
      
      // 获取创建的习惯详情
      const createdHabit = await this.habitDB.getHabitById(habitId);
      
      return {
        success: true,
        message: '习惯创建成功',
        data: HabitDTO.toResponse(createdHabit)
      };
    } catch (error) {
      console.error('创建习惯失败:', error);
      return {
        success: false,
        message: '创建习惯失败',
        error: error.message
      };
    }
  }

  /**
   * 获取习惯详情
   * @param {string} habitId - 习惯ID
   * @param {boolean} includeHistory - 是否包含完成历史
   * @returns {Promise<Object>} 返回习惯详情
   */
  async getHabitById(habitId, includeHistory = false) {
    try {
      if (!habitId) {
        return {
          success: false,
          message: '习惯ID不能为空'
        };
      }

      const habit = await this.habitDB.getHabitById(habitId);
      
      if (!habit) {
        return {
          success: false,
          message: '习惯不存在'
        };
      }

      let completionHistory = [];
      if (includeHistory) {
        completionHistory = await this.habitDB.getCompletionHistory(habitId);
        completionHistory = HabitCompletionDTO.toResponseList(completionHistory);
      }

      return {
        success: true,
        message: '获取习惯详情成功',
        data: HabitDTO.toResponse(habit, completionHistory)
      };
    } catch (error) {
      console.error('获取习惯详情失败:', error);
      return {
        success: false,
        message: '获取习惯详情失败',
        error: error.message
      };
    }
  }

  /**
   * 获取习惯列表
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 返回习惯列表
   */
  async getAllHabits(options = {}) {
    try {
      const habits = await this.habitDB.getAllHabits(options);
      
      // 为每个习惯计算当前状态
      const enrichedHabits = await Promise.all(
        habits.map(async (habit) => {
          // 获取今天的完成状态
          const today = new Date().toISOString().split('T')[0];
          const todayCompletion = await this.getTodayCompletion(habit.id, today);
          
          const habitResponse = HabitDTO.toResponse(habit);
          habitResponse.todayCompleted = todayCompletion?.isCompleted || false;
          
          return habitResponse;
        })
      );

      return {
        success: true,
        message: '获取习惯列表成功',
        data: enrichedHabits
      };
    } catch (error) {
      console.error('获取习惯列表失败:', error);
      return {
        success: false,
        message: '获取习惯列表失败',
        error: error.message
      };
    }
  }

  /**
   * 更新习惯
   * @param {string} habitId - 习惯ID
   * @param {Object} habitData - 更新的习惯数据
   * @returns {Promise<Object>} 返回更新结果
   */
  async updateHabit(habitId, habitData) {
    try {
      if (!habitId) {
        return {
          success: false,
          message: '习惯ID不能为空'
        };
      }

      // 获取现有习惯
      const existingHabit = await this.habitDB.getHabitById(habitId);
      if (!existingHabit) {
        return {
          success: false,
          message: '习惯不存在'
        };
      }

      // 验证和转换数据
      const { habit, isValid, errors } = HabitDTO.validateAndUpdateHabit(habitData, existingHabit);
      
      if (!isValid) {
        return {
          success: false,
          message: '习惯数据验证失败',
          errors
        };
      }

      // 更新习惯
      const updateSuccess = await this.habitDB.updateHabit(habitId, habit);
      
      if (!updateSuccess) {
        return {
          success: false,
          message: '更新习惯失败'
        };
      }

      // 获取更新后的习惯详情
      const updatedHabit = await this.habitDB.getHabitById(habitId);
      
      return {
        success: true,
        message: '习惯更新成功',
        data: HabitDTO.toResponse(updatedHabit)
      };
    } catch (error) {
      console.error('更新习惯失败:', error);
      return {
        success: false,
        message: '更新习惯失败',
        error: error.message
      };
    }
  }

  /**
   * 归档习惯
   * @param {string} habitId - 习惯ID
   * @returns {Promise<Object>} 返回归档结果
   */
  async archiveHabit(habitId) {
    try {
      if (!habitId) {
        return {
          success: false,
          message: '习惯ID不能为空'
        };
      }

      const habit = await this.habitDB.getHabitById(habitId);
      if (!habit) {
        return {
          success: false,
          message: '习惯不存在'
        };
      }

      if (habit.isArchived) {
        return {
          success: false,
          message: '习惯已经是归档状态'
        };
      }

      // 更新归档状态
      const updateSuccess = await this.habitDB.updateHabit(habitId, { 
        isArchived: true,
        archivedAt: new Date().toISOString().slice(0, 19).replace('T', ' ') // 转换为 MySQL DATETIME 格式
      });

      if (!updateSuccess) {
        return {
          success: false,
          message: '归档习惯失败'
        };
      }

      return {
        success: true,
        message: '习惯已归档'
      };
    } catch (error) {
      console.error('归档习惯失败:', error);
      return {
        success: false,
        message: '归档习惯失败',
        error: error.message
      };
    }
  }

  /**
   * 取消归档习惯
   * @param {string} habitId - 习惯ID
   * @returns {Promise<Object>} 返回取消归档结果
   */
  async unarchiveHabit(habitId) {
    try {
      if (!habitId) {
        return {
          success: false,
          message: '习惯ID不能为空'
        };
      }

      const habit = await this.habitDB.getHabitById(habitId);
      if (!habit) {
        return {
          success: false,
          message: '习惯不存在'
        };
      }

      if (!habit.isArchived) {
        return {
          success: false,
          message: '习惯未处于归档状态'
        };
      }

      // 更新归档状态
      const updateSuccess = await this.habitDB.updateHabit(habitId, { 
        isArchived: false,
        archivedAt: null
      });

      if (!updateSuccess) {
        return {
          success: false,
          message: '取消归档习惯失败'
        };
      }

      return {
        success: true,
        message: '习惯已取消归档'
      };
    } catch (error) {
      console.error('取消归档习惯失败:', error);
      return {
        success: false,
        message: '取消归档习惯失败',
        error: error.message
      };
    }
  }

  /**
   * 删除习惯
   * @param {string} habitId - 习惯ID
   * @param {boolean} permanent - 是否永久删除
   * @returns {Promise<Object>} 返回删除结果
   */
  async deleteHabit(habitId, permanent = false) {
    try {
      if (!habitId) {
        return {
          success: false,
          message: '习惯ID不能为空'
        };
      }

      const habit = await this.habitDB.getHabitById(habitId);
      if (!habit) {
        return {
          success: false,
          message: '习惯不存在'
        };
      }

      let deleteSuccess;
      if (permanent) {
        deleteSuccess = await this.habitDB.permanentDeleteHabit(habitId);
      } else {
        deleteSuccess = await this.habitDB.deleteHabit(habitId);
      }

      if (!deleteSuccess) {
        return {
          success: false,
          message: '删除习惯失败'
        };
      }

      return {
        success: true,
        message: permanent ? '习惯已永久删除' : '习惯已归档'
      };
    } catch (error) {
      console.error('删除习惯失败:', error);
      return {
        success: false,
        message: '删除习惯失败',
        error: error.message
      };
    }
  }

  /**
   * 记录习惯完成状态
   * @param {string} habitId - 习惯ID
   * @param {Object} completionData - 完成记录数据
   * @returns {Promise<Object>} 返回记录结果
   */
  async recordCompletion(habitId, completionData) {
    try {
      if (!habitId) {
        return {
          success: false,
          message: '习惯ID不能为空'
        };
      }

      // 验证习惯是否存在
      const habit = await this.habitDB.getHabitById(habitId);
      if (!habit) {
        return {
          success: false,
          message: '习惯不存在'
        };
      }

      // 设置习惯ID
      completionData.habitId = habitId;
      
      // 验证和转换数据
      const { completion, isValid, errors } = HabitCompletionDTO.validateAndCreateCompletion(completionData);
      
      if (!isValid) {
        return {
          success: false,
          message: '完成记录数据验证失败',
          errors
        };
      }

      // 创建完成记录
      const completionId = await this.habitDB.createCompletion(completion);
      
      // 更新习惯统计信息
      await this.updateHabitStats(habitId);

      return {
        success: true,
        message: '完成记录创建成功',
        data: { 
          id: completionId,
          habitId: completion.habitId,
          date: completion.date,
          isCompleted: completion.isCompleted
        }
      };
    } catch (error) {
      console.error('记录习惯完成状态失败:', error);
      return {
        success: false,
        message: '记录习惯完成状态失败',
        error: error.message
      };
    }
  }

  /**
   * 标记习惯为今日完成
   * @param {string} habitId - 习惯ID
   * @param {string} date - 日期（可选，默认今天）
   * @returns {Promise<Object>} 返回标记结果
   */
  async markHabitComplete(habitId, date = null) {
    try {
      if (!date) {
        date = new Date().toISOString().split('T')[0];
      }

      // 检查今天是否已经完成
      const existingCompletion = await this.getTodayCompletion(habitId, date);
      if (existingCompletion && existingCompletion.isCompleted) {
        return {
          success: false,
          message: '今日已完成该习惯'
        };
      }

      // 如果已存在记录但未完成，则更新；否则创建新记录
      if (existingCompletion) {
        const updateSuccess = await this.habitDB.updateCompletion(existingCompletion.id, {
          isCompleted: true,
          completedAt: new Date().toISOString()
        });

        if (!updateSuccess) {
          return {
            success: false,
            message: '标记完成失败'
          };
        }
      } else {
        // 创建新的完成记录
        const result = await this.recordCompletion(habitId, {
          date,
          isCompleted: true,
          completedAt: new Date().toISOString()
        });

        if (!result.success) {
          return result;
        }
      }

      return {
        success: true,
        message: '习惯已标记为完成'
      };
    } catch (error) {
      console.error('标记习惯完成失败:', error);
      return {
        success: false,
        message: '标记习惯完成失败',
        error: error.message
      };
    }
  }

  /**
   * 取消标记习惯完成
   * @param {string} habitId - 习惯ID
   * @param {string} date - 日期（可选，默认今天）
   * @returns {Promise<Object>} 返回取消标记结果
   */
  async unmarkHabitComplete(habitId, date = null) {
    try {
      if (!date) {
        date = new Date().toISOString().split('T')[0];
      }

      // 检查今天是否有完成记录
      const existingCompletion = await this.getTodayCompletion(habitId, date);
      if (!existingCompletion) {
        return {
          success: false,
          message: '今日无完成记录'
        };
      }

      if (!existingCompletion.isCompleted) {
        return {
          success: false,
          message: '今日未完成该习惯'
        };
      }

      // 更新完成记录
      const updateSuccess = await this.habitDB.updateCompletion(existingCompletion.id, {
        isCompleted: false,
        completedAt: null
      });

      if (!updateSuccess) {
        return {
          success: false,
          message: '取消标记失败'
        };
      }

      // 更新习惯统计信息
      await this.updateHabitStats(habitId);

      return {
        success: true,
        message: '习惯完成状态已取消'
      };
    } catch (error) {
      console.error('取消标记习惯完成失败:', error);
      return {
        success: false,
        message: '取消标记习惯完成失败',
        error: error.message
      };
    }
  }

  /**
   * 获取习惯完成历史
   * @param {string} habitId - 习惯ID
   * @param {string} startDate - 开始日期
   * @param {string} endDate - 结束日期
   * @returns {Promise<Object>} 返回完成历史
   */
  async getCompletionHistory(habitId, startDate = null, endDate = null) {
    try {
      if (!habitId) {
        return {
          success: false,
          message: '习惯ID不能为空'
        };
      }

      const completions = await this.habitDB.getCompletionHistory(habitId, startDate, endDate);
      
      return {
        success: true,
        message: '获取完成历史成功',
        data: HabitCompletionDTO.toResponseList(completions)
      };
    } catch (error) {
      console.error('获取完成历史失败:', error);
      return {
        success: false,
        message: '获取完成历史失败',
        error: error.message
      };
    }
  }

  /**
   * 获取今天的完成状态
   * @param {string} habitId - 习惯ID
   * @param {string} date - 日期
   * @returns {Promise<HabitCompletion|null>} 返回今天的完成记录
   */
  async getTodayCompletion(habitId, date) {
    try {
      const completions = await this.habitDB.getCompletionHistory(habitId, date, date);
      return completions.length > 0 ? completions[0] : null;
    } catch (error) {
      console.error('获取今天完成状态失败:', error);
      return null;
    }
  }

  /**
   * 更新习惯统计信息
   * @param {string} habitId - 习惯ID
   * @returns {Promise<void>}
   */
  async updateHabitStats(habitId) {
    try {
      const habit = await this.habitDB.getHabitById(habitId);
      if (!habit) return;

      // 获取所有完成记录
      const completions = await this.habitDB.getCompletionHistory(habitId);
      
      // 计算总完成次数
      const totalCompletions = completions.filter(c => c.isCompleted).length;
      
      // 计算最后完成时间
      const lastCompleted = completions.find(c => c.isCompleted);
      const lastCompletedAt = lastCompleted ? lastCompleted.createdAt : null;
      
      // 计算连续完成次数
      const { streakCount, longestStreak } = this.calculateStreaks(completions);
      
      // 更新习惯统计信息
      habit.totalCompletions = totalCompletions;
      habit.streakCount = streakCount;
      habit.longestStreak = longestStreak;
      habit.lastCompletedAt = lastCompletedAt;
      
      await this.habitDB.updateHabit(habitId, habit);
    } catch (error) {
      console.error('更新习惯统计信息失败:', error);
    }
  }

  /**
   * 计算连续完成次数
   * @param {Array} completions - 完成记录数组
   * @returns {Object} 返回当前连续次数和最长连续次数
   */
  calculateStreaks(completions) {
    if (completions.length === 0) {
      return { streakCount: 0, longestStreak: 0 };
    }

    // 按日期排序（最新的在前）
    const sortedCompletions = completions
      .filter(c => c.isCompleted)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // 计算当前连续次数
    const today = new Date();
    let checkDate = new Date(today);
    
    for (const completion of sortedCompletions) {
      const completionDate = new Date(completion.date);
      const diffDays = Math.floor((checkDate - completionDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0 || diffDays === 1) {
        currentStreak++;
        checkDate = completionDate;
      } else {
        break;
      }
    }

    // 计算最长连续次数
    for (let i = 0; i < sortedCompletions.length; i++) {
      tempStreak = 1;
      
      for (let j = i + 1; j < sortedCompletions.length; j++) {
        const currentDate = new Date(sortedCompletions[j - 1].date);
        const nextDate = new Date(sortedCompletions[j].date);
        const diffDays = Math.floor((currentDate - nextDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          break;
        }
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
      i += tempStreak - 1;
    }

    return { streakCount: currentStreak, longestStreak };
  }

  /**
   * 获取习惯统计信息
   * @param {string} habitId - 习惯ID
   * @returns {Promise<Object>} 返回统计信息
   */
  async getHabitStats(habitId) {
    try {
      if (!habitId) {
        return {
          success: false,
          message: '习惯ID不能为空'
        };
      }

      const habit = await this.habitDB.getHabitById(habitId);
      if (!habit) {
        return {
          success: false,
          message: '习惯不存在'
        };
      }

      // 获取数据库统计信息
      const dbStats = await this.habitDB.getHabitStats(habitId);
      
      // 获取完成历史用于计算连续天数
      const completions = await this.habitDB.getCompletionHistory(habitId);
      const { streakCount, longestStreak } = this.calculateStreaks(completions);

      const stats = {
        habitId,
        totalCompletions: habit.totalCompletions || dbStats.completedCount || 0,
        streakCount: habit.streakCount || streakCount,
        longestStreak: habit.longestStreak || longestStreak,
        lastCompletedAt: habit.lastCompletedAt,
        totalRecords: dbStats.totalRecords || 0,
        lastRecordDate: dbStats.lastRecordDate,
        // 计算完成率
        completionRate: dbStats.totalRecords > 0 
          ? Math.round((dbStats.completedCount / dbStats.totalRecords) * 100) 
          : 0
      };

      return {
        success: true,
        message: '获取统计信息成功',
        data: stats
      };
    } catch (error) {
      console.error('获取习惯统计信息失败:', error);
      return {
        success: false,
        message: '获取习惯统计信息失败',
        error: error.message
      };
    }
  }
}

export default HabitBiz;
