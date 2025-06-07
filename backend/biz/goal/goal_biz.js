import {
  getAllGoalsDb,
  countGoalsDb,
  getGoalByIdDb,
  createGoalDb,
  updateGoalDb,
  deleteGoalDb,
  getGoalMilestonesDb,
  getGoalMilestoneByIdDb,
  createGoalMilestoneDb,
  updateGoalMilestoneDb,
  deleteGoalMilestoneDb,
  getGoalTasksDb,
  linkGoalTaskDb,
  unlinkGoalTaskDb,
  getGoalReviewsDb,
  createGoalReviewDb,
  updateGoalReviewDb,
  deleteGoalReviewDb,
  getGoalReviewByIdDb,
  getGoalStatsDb
} from '../../db/goal/goal_db.js';
import { GoalDTO, GoalMilestoneDTO, GoalReviewDTO, GoalStatsDTO } from '../../dto/goal/GoalDTO.js';
import { Goal, GoalMilestone, GoalReview } from '../../entity/goal/GoalType.js';

/**
 * 获取目标列表
 */
export async function getGoals(options = {}) {
  try {
    const goals = await getAllGoalsDb(options);
    const total = await countGoalsDb(options);
    const page = options.page || 1;
    const pageSize = options.limit || 10;
    const totalPages = Math.ceil(total / pageSize);
    
    return {
      success: true,
      data: goals.map(goal => new GoalDTO(goal)),
      pagination: {
        total: total,
        currentPage: page,
        totalPages: totalPages,
        pageSize: pageSize
      }
    };
  } catch (error) {
    console.error('获取目标列表失败:', error);
    return {
      success: false,
      message: error.message || '获取目标列表失败'
    };
  }
}

/**
 * 根据ID获取目标详情
 */
export async function getGoalById(goalId) {
  try {
    const goal = await getGoalByIdDb(goalId);
    if (!goal) {
      return {
        success: false,
        message: '目标不存在'
      };
    }
    
    return {
      success: true,
      data: new GoalDTO(goal)
    };
  } catch (error) {
    console.error('获取目标详情失败:', error);
    return {
      success: false,
      message: error.message || '获取目标详情失败'
    };
  }
}

/**
 * 创建新目标
 */
export async function createGoal(goalData) {
  try {
    // 验证必填字段
    if (!goalData.title || !goalData.category || !goalData.startDate) {
      return {
        success: false,
        message: '目标标题、分类和开始日期不能为空'
      };
    }
    
    const goal = new Goal();
    Object.assign(goal, goalData);
    
    // 验证日期逻辑
    if (goal.targetDate && goal.startDate > goal.targetDate) {
      return {
        success: false,
        message: '开始日期不能晚于目标日期'
      };
    }
    
    const goalId = await createGoalDb(goal);
    const createdGoal = await getGoalByIdDb(goalId);
    
    return {
      success: true,
      data: new GoalDTO(createdGoal),
      message: '目标创建成功'
    };
  } catch (error) {
    console.error('创建目标失败:', error);
    return {
      success: false,
      message: error.message || '创建目标失败'
    };
  }
}

/**
 * 更新目标
 */
export async function updateGoal(goalId, updateData) {
  try {
    const existingGoal = await getGoalByIdDb(goalId);
    if (!existingGoal) {
      return {
        success: false,
        message: '目标不存在'
      };
    }
    
    // 验证日期逻辑
    const startDate = updateData.startDate || existingGoal.startDate;
    const targetDate = updateData.targetDate || existingGoal.targetDate;
    
    if (targetDate && startDate > targetDate) {
      return {
        success: false,
        message: '开始日期不能晚于目标日期'
      };
    }
    
    // 如果状态变为完成，自动设置完成日期
    if (updateData.status === 'completed' && !updateData.actualCompletionDate) {
      updateData.actualCompletionDate = new Date().toISOString().slice(0, 10);
      updateData.progress = 100.00;
    }
    
    const updated = await updateGoalDb(goalId, updateData);
    if (!updated) {
      return {
        success: false,
        message: '更新目标失败'
      };
    }
    
    const updatedGoal = await getGoalByIdDb(goalId);
    return {
      success: true,
      data: new GoalDTO(updatedGoal),
      message: '目标更新成功'
    };
  } catch (error) {
    console.error('更新目标失败:', error);
    return {
      success: false,
      message: error.message || '更新目标失败'
    };
  }
}

/**
 * 删除目标
 */
export async function deleteGoal(goalId, permanent = false) {
  try {
    const goal = await getGoalByIdDb(goalId);
    if (!goal) {
      return {
        success: false,
        message: '目标不存在'
      };
    }
    
    await deleteGoalDb(goalId, permanent);
    
    return {
      success: true,
      message: permanent ? '目标已永久删除' : '目标已归档'
    };
  } catch (error) {
    console.error('删除目标失败:', error);
    return {
      success: false,
      message: error.message || '删除目标失败'
    };
  }
}

/**
 * 获取目标的里程碑列表
 */
export async function getGoalMilestones(goalId) {
  try {
    const goal = await getGoalByIdDb(goalId);
    if (!goal) {
      return {
        success: false,
        message: '目标不存在'
      };
    }
    
    const milestones = await getGoalMilestonesDb(goalId);
    
    return {
      success: true,
      data: milestones.map(milestone => new GoalMilestoneDTO(milestone))
    };
  } catch (error) {
    console.error('获取目标里程碑失败:', error);
    return {
      success: false,
      message: error.message || '获取目标里程碑失败'
    };
  }
}

/**
 * 创建目标里程碑
 */
export async function createGoalMilestone(goalId, milestoneData) {
  try {
    const goal = await getGoalByIdDb(goalId);
    if (!goal) {
      return {
        success: false,
        message: '目标不存在'
      };
    }
    
    if (!milestoneData.title || !milestoneData.targetDate) {
      return {
        success: false,
        message: '里程碑标题和目标日期不能为空'
      };
    }
    
    const milestone = new GoalMilestone();
    Object.assign(milestone, milestoneData);
    milestone.goalId = goalId;
    
    const milestoneId = await createGoalMilestoneDb(milestone);
    const createdMilestone = await getGoalMilestonesDb(goalId);
    const newMilestone = createdMilestone.find(m => m.id === milestoneId);
    
    return {
      success: true,
      data: new GoalMilestoneDTO(newMilestone),
      message: '里程碑创建成功'
    };
  } catch (error) {
    console.error('创建目标里程碑失败:', error);
    return {
      success: false,
      message: error.message || '创建目标里程碑失败'
    };
  }
}

/**
 * 更新目标里程碑
 */
export async function updateGoalMilestone(milestoneId, updateData) {
  try {
    const updated = await updateGoalMilestoneDb(milestoneId, updateData);
    if (!updated) {
      return {
        success: false,
        message: '里程碑不存在或更新失败'
      };
    }
    
    // 获取更新后的里程碑数据
    const updatedMilestone = await getGoalMilestoneByIdDb(milestoneId);
    
    return {
      success: true,
      data: new GoalMilestoneDTO(updatedMilestone),
      message: '里程碑更新成功'
    };
  } catch (error) {
    console.error('更新目标里程碑失败:', error);
    return {
      success: false,
      message: error.message || '更新目标里程碑失败'
    };
  }
}

/**
 * 删除目标里程碑
 */
export async function deleteGoalMilestone(milestoneId) {
  try {
    await deleteGoalMilestoneDb(milestoneId);
    
    return {
      success: true,
      message: '里程碑删除成功'
    };
  } catch (error) {
    console.error('删除目标里程碑失败:', error);
    return {
      success: false,
      message: error.message || '删除目标里程碑失败'
    };
  }
}

/**
 * 关联目标和任务
 */
export async function linkGoalTask(goalId, taskId) {
  try {
    const goal = await getGoalByIdDb(goalId);
    if (!goal) {
      return {
        success: false,
        message: '目标不存在'
      };
    }
    
    await linkGoalTaskDb(goalId, taskId);
    
    return {
      success: true,
      message: '任务关联成功'
    };
  } catch (error) {
    console.error('关联目标和任务失败:', error);
    return {
      success: false,
      message: error.message || '关联目标和任务失败'
    };
  }
}

/**
 * 取消目标和任务的关联
 */
export async function unlinkGoalTask(goalId, taskId) {
  try {
    await unlinkGoalTaskDb(goalId, taskId);
    
    return {
      success: true,
      message: '任务关联已取消'
    };
  } catch (error) {
    console.error('取消目标和任务关联失败:', error);
    return {
      success: false,
      message: error.message || '取消目标和任务关联失败'
    };
  }
}

/**
 * 获取目标的回顾记录
 */
export async function getGoalReviews(goalId) {
  try {
    const goal = await getGoalByIdDb(goalId);
    if (!goal) {
      return {
        success: false,
        message: '目标不存在'
      };
    }
    
    const reviews = await getGoalReviewsDb(goalId);
    
    return {
      success: true,
      data: reviews.map(review => new GoalReviewDTO(review))
    };
  } catch (error) {
    console.error('获取目标回顾记录失败:', error);
    return {
      success: false,
      message: error.message || '获取目标回顾记录失败'
    };
  }
}

/**
 * 创建目标回顾记录
 */
export async function createGoalReview(goalId, reviewData) {
  try {
    const goal = await getGoalByIdDb(goalId);
    if (!goal) {
      return {
        success: false,
        message: '目标不存在'
      };
    }
    
    if (!reviewData.reviewDate || !reviewData.reviewType) {
      return {
        success: false,
        message: '回顾日期和类型不能为空'
      };
    }
    
    const review = new GoalReview();
    Object.assign(review, reviewData);
    review.goalId = goalId;
    
    // 如果没有设置进度，使用当前目标进度
    if (review.progress === undefined || review.progress === null) {
      review.progress = goal.progress;
    }
    
    const reviewId = await createGoalReviewDb(review);
    const reviews = await getGoalReviewsDb(goalId);
    const newReview = reviews.find(r => r.id === reviewId);
    
    return {
      success: true,
      data: new GoalReviewDTO(newReview),
      message: '回顾记录创建成功'
    };
  } catch (error) {
    console.error('创建目标回顾记录失败:', error);
    return {
      success: false,
      message: error.message || '创建目标回顾记录失败'
    };
  }
}

/**
 * 更新目标评价
 */
export async function updateGoalReview(reviewId, updateData) {
  try {
    // 验证评价是否存在
    const existingReview = await getGoalReviewByIdDb(reviewId);
    if (!existingReview) {
      return {
        success: false,
        message: '评价记录不存在'
      };
    }
    
    // 验证数据
    const { review, isValid, errors } = GoalReviewDTO.validateAndUpdateReview(updateData, existingReview);
    
    if (!isValid) {
      return {
        success: false,
        message: '评价数据验证失败',
        errors: errors
      };
    }
    
    // 更新评价
    const updateSuccess = await updateGoalReviewDb(reviewId, review.toDatabaseFormat());
    
    if (!updateSuccess) {
      return {
        success: false,
        message: '更新评价失败'
      };
    }
    
    // 获取更新后的评价
    const updatedReview = await getGoalReviewByIdDb(reviewId);
    
    return {
      success: true,
      data: new GoalReviewDTO(updatedReview),
      message: '评价更新成功'
    };
  } catch (error) {
    console.error('更新目标评价失败:', error);
    return {
      success: false,
      message: error.message || '更新目标评价失败'
    };
  }
}

/**
 * 删除目标评价
 */
export async function deleteGoalReview(reviewId) {
  try {
    // 验证评价是否存在
    const existingReview = await getGoalReviewByIdDb(reviewId);
    if (!existingReview) {
      return {
        success: false,
        message: '评价记录不存在'
      };
    }
    
    // 删除评价
    const deleteSuccess = await deleteGoalReviewDb(reviewId);
    
    if (!deleteSuccess) {
      return {
        success: false,
        message: '删除评价失败'
      };
    }
    
    return {
      success: true,
      message: '评价删除成功'
    };
  } catch (error) {
    console.error('删除目标评价失败:', error);
    return {
      success: false,
      message: error.message || '删除目标评价失败'
    };
  }
}

/**
 * 获取目标统计信息
 */
export async function getGoalStats() {
  try {
    const stats = await getGoalStatsDb();
    
    return {
      success: true,
      data: new GoalStatsDTO(stats)
    };
  } catch (error) {
    console.error('获取目标统计信息失败:', error);
    return {
      success: false,
      message: error.message || '获取目标统计信息失败'
    };
  }
}

/**
 * 批量更新目标进度
 */
export async function updateGoalProgress(goalId) {
  try {
    const goal = await getGoalByIdDb(goalId);
    if (!goal) {
      return {
        success: false,
        message: '目标不存在'
      };
    }
    
    // 重新计算进度
    const newProgress = goal.calculateProgress();
    
    if (newProgress !== goal.progress) {
      await updateGoalDb(goalId, { progress: newProgress });
    }
    
    return {
      success: true,
      data: { progress: newProgress },
      message: '进度更新成功'
    };
  } catch (error) {
    console.error('更新目标进度失败:', error);
    return {
      success: false,
      message: error.message || '更新目标进度失败'
    };
  }
}

/**
 * 获取目标关联的任务列表
 */
export async function getGoalTasks(goalId) {
  try {
    // 首先验证目标是否存在
    const goal = await getGoalByIdDb(goalId);
    if (!goal) {
      return {
        success: false,
        message: '目标不存在'
      };
    }

    const tasks = await getGoalTasksDb(goalId);
    
    return {
      success: true,
      data: tasks
    };
  } catch (error) {
    console.error('获取目标任务失败:', error);
    return {
      success: false,
      message: error.message || '获取目标任务失败'
    };
  }
}
