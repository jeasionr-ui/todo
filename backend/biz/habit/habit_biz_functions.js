import { 
  getAllHabitsDb, 
  getHabitByIdDb, 
  createHabitDb, 
  updateHabitDb, 
  deleteHabitDb,
  createCompletionDb,
  getCompletionHistoryDb,
  updateCompletionDb,
  getHabitStatsDb,
  countHabitsDb
} from '../../db/habit/habit_db_functions.js';
import { HabitDTO, HabitCompletionDTO } from '../../dto/habit/HabitDTO.js';

/**
 * 获取所有习惯（支持分页）
 */
export async function getAllHabits(options = {}) {
  try {
    // 获取总数（用于分页）
    const totalCount = await countHabitsDb(options);
    
    // 获取习惯列表
    const habits = await getAllHabitsDb(options);
    
    // 计算分页信息
    const pageInfo = {
      total: totalCount,
      pageSize: options.limit || totalCount,
      currentPage: options.offset ? Math.floor(options.offset / (options.limit || totalCount)) + 1 : 1,
      totalPages: options.limit ? Math.ceil(totalCount / options.limit) : 1
    };
    
    // 如果指定了包含历史记录
    if (options.includeHistory) {
      // 为每个习惯获取完成记录
      const habitsWithHistory = await Promise.all(habits.map(async (habit) => {
        // 获取完成历史记录，默认最近7天
        const now = new Date();
        const startDate = new Date();
        startDate.setDate(now.getDate() - 7);
        
        const completionHistory = await getCompletionHistoryDb(
          habit.id,
          startDate.toISOString().split('T')[0],
          now.toISOString().split('T')[0]
        );
        
        return {
          ...habit,
          completionHistory: completionHistory
        };
      }));
      
      return {
        success: true,
        message: '获取习惯列表成功',
        data: habitsWithHistory.map(habit => 
          HabitDTO.toResponse(habit, HabitCompletionDTO.toResponseList(habit.completionHistory))
        ),
        pagination: pageInfo
      };
    }
    
    // 默认不包含历史记录
    return {
      success: true,
      message: '获取习惯列表成功',
      data: HabitDTO.toResponseList(habits),
      pagination: pageInfo
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
 * 根据ID获取习惯
 */
export async function getHabitById(habitId, includeHistory = false) {
  try {
    if (!habitId) {
      return {
        success: false,
        message: '习惯ID不能为空'
      };
    }

    const habit = await getHabitByIdDb(habitId);
    if (!habit) {
      return {
        success: false,
        message: '习惯不存在'
      };
    }

    let completions = [];
    if (includeHistory) {
      completions = await getCompletionHistoryDb(habitId);
    }

    const response = HabitDTO.toResponse(habit, HabitCompletionDTO.toResponseList(completions));

    if (includeHistory) {
      response.completions = HabitCompletionDTO.toResponseList(completions);
    }

    return {
      success: true,
      message: '获取习惯详情成功',
      data: response
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
 * 创建新习惯
 */
export async function createHabit(habitData) {
  try {
    const { habit, isValid, errors } = HabitDTO.validateAndCreateHabit(habitData);
    
    if (!isValid) {
      return {
        success: false,
        message: '习惯数据验证失败',
        errors
      };
    }

    const habitId = await createHabitDb(habit);
    const createdHabit = await getHabitByIdDb(habitId);
    
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
 * 更新习惯
 */
export async function updateHabit(habitId, habitData) {
  try {
    if (!habitId) {
      return {
        success: false,
        message: '习惯ID不能为空'
      };
    }

    const existingHabit = await getHabitByIdDb(habitId);
    if (!existingHabit) {
      return {
        success: false,
        message: '习惯不存在'
      };
    }

    const { habit, isValid, errors } = HabitDTO.validateAndUpdateHabit(habitData, existingHabit);
    
    if (!isValid) {
      return {
        success: false,
        message: '习惯数据验证失败',
        errors
      };
    }

    const updateSuccess = await updateHabitDb(habitId, habit);
    
    if (!updateSuccess) {
      return {
        success: false,
        message: '更新习惯失败'
      };
    }

    const updatedHabit = await getHabitByIdDb(habitId);
    
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
 * 删除习惯
 */
export async function deleteHabit(habitId, permanent = false) {
  try {
    if (!habitId) {
      return {
        success: false,
        message: '习惯ID不能为空'
      };
    }

    const habit = await getHabitByIdDb(habitId);
    if (!habit) {
      return {
        success: false,
        message: '习惯不存在'
      };
    }

    const deleteSuccess = await deleteHabitDb(habitId, permanent);

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
 * 归档习惯
 */
export async function archiveHabit(habitId) {
  try {
    if (!habitId) {
      return {
        success: false,
        message: '习惯ID不能为空'
      };
    }

    const habit = await getHabitByIdDb(habitId);
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

    const updateSuccess = await updateHabitDb(habitId, { 
      isArchived: true
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
 */
export async function unarchiveHabit(habitId) {
  try {
    if (!habitId) {
      return {
        success: false,
        message: '习惯ID不能为空'
      };
    }

    const habit = await getHabitByIdDb(habitId);
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

    const updateSuccess = await updateHabitDb(habitId, { 
      isArchived: false
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
 * 记录习惯完成状态
 */
export async function recordCompletion(habitId, completionData) {
  try {
    if (!habitId) {
      return {
        success: false,
        message: '习惯ID不能为空'
      };
    }

    const habit = await getHabitByIdDb(habitId);
    if (!habit) {
      return {
        success: false,
        message: '习惯不存在'
      };
    }

    completionData.habitId = habitId;
    
    const { completion, isValid, errors } = HabitCompletionDTO.validateAndCreateCompletion(completionData);
    
    if (!isValid) {
      return {
        success: false,
        message: '完成记录数据验证失败',
        errors
      };
    }

    const completionId = await createCompletionDb(completion);

    // 更新习惯统计信息
    await updateHabitStats(habitId);

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
 */
export async function markHabitComplete(habitId, date = null) {
  try {
    if (!date) {
      date = new Date().toISOString().split('T')[0];
    }

    return await recordCompletion(habitId, {
      date,
      isCompleted: true,
      completedAt: new Date().toISOString().slice(0, 19).replace('T', ' ') // 转换为 MySQL DATETIME 格式
    });
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
 */
export async function unmarkHabitComplete(habitId, date = null) {
  try {
    if (!date) {
      date = new Date().toISOString().split('T')[0];
    }

    return await recordCompletion(habitId, {
      date,
      isCompleted: false,
      completedAt: null
    });
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
 */
export async function getCompletionHistory(habitId, startDate = null, endDate = null) {
  try {
    if (!habitId) {
      return {
        success: false,
        message: '习惯ID不能为空'
      };
    }

    const completions = await getCompletionHistoryDb(habitId, startDate, endDate);
    
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
 * 获取习惯统计信息
 */
export async function getHabitStats(habitId) {
  try {
    if (!habitId) {
      return {
        success: false,
        message: '习惯ID不能为空'
      };
    }

    const habit = await getHabitByIdDb(habitId);
    if (!habit) {
      return {
        success: false,
        message: '习惯不存在'
      };
    }

    const dbStats = await getHabitStatsDb(habitId);
    
    const stats = {
      habitId,
      totalCompletions: habit.totalCompletions || dbStats.completedCount || 0,
      streakCount: habit.streakCount || 0,
      longestStreak: habit.longestStreak || 0,
      lastCompletedAt: habit.lastCompletedAt,
      totalRecords: dbStats.totalRecords || 0,
      lastRecordDate: dbStats.lastRecordDate,
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

/**
 * 更新习惯统计信息
 */
export async function updateHabitStats(habitId) {
  try {
    const habit = await getHabitByIdDb(habitId);
    if (!habit) return;

    // 获取所有完成记录
    const completions = await getCompletionHistoryDb(habitId);
    
    // 计算总完成次数
    const totalCompletions = completions.filter(c => c.isCompleted).length;
    
    // 计算最后完成时间
    const completedRecords = completions.filter(c => c.isCompleted).sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    const lastCompleted = completedRecords.length > 0 ? completedRecords[0] : null;
    const lastCompletedAt = lastCompleted ? lastCompleted.createdAt : null;
    
    // 计算连续完成次数
    const { streakCount, longestStreak } = calculateStreaks(completions);
    
    // 更新习惯统计信息
    habit.totalCompletions = totalCompletions;
    habit.streakCount = streakCount;
    habit.longestStreak = longestStreak;
    habit.lastCompletedAt = lastCompletedAt;
    
    await updateHabitDb(habitId, habit);
  } catch (error) {
    console.error('更新习惯统计信息失败:', error);
  }
}

/**
 * 计算连续完成次数
 * @param {Array} completions - 完成记录数组
 * @returns {Object} 返回当前连续次数和最长连续次数
 */
function calculateStreaks(completions) {
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
  today.setHours(0, 0, 0, 0);
  
  let checkDate = new Date(today);
  
  for (const completion of sortedCompletions) {
    const completionDate = new Date(completion.date);
    completionDate.setHours(0, 0, 0, 0);
    
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
      currentDate.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(sortedCompletions[j].date);
      nextDate.setHours(0, 0, 0, 0);
      
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
