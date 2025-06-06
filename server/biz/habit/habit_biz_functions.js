import { 
  getAllHabitsDb, 
  getHabitByIdDb, 
  createHabitDb, 
  updateHabitDb, 
  deleteHabitDb,
  createCompletionDb,
  getCompletionHistoryDb,
  updateCompletionDb,
  getHabitStatsDb
} from '../../db/habit/habit_db_functions.js';
import { HabitDTO, HabitCompletionDTO } from '../../dto/habit/HabitDTO.js';

/**
 * 获取所有习惯
 */
export async function getAllHabits(options = {}) {
  try {
    const habits = await getAllHabitsDb(options);
    return {
      success: true,
      message: '获取习惯列表成功',
      data: HabitDTO.toResponseList(habits)
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

    const response = HabitDTO.toResponse(habit);

    if (includeHistory) {
      const completions = await getCompletionHistoryDb(habitId);
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
      isArchived: true,
      archivedAt: new Date().toISOString()
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
      completedAt: new Date().toISOString()
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
