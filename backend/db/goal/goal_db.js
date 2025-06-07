import { query, execute } from '../exec_api.js';
import { generateId } from '../../utils/common.js';
import { Goal, GoalMilestone, GoalReview } from '../../entity/goal/GoalType.js';

/**
 * 获取所有目标
 */
export async function getAllGoalsDb(options = {}) {
  try {
    let sql = 'SELECT * FROM goal WHERE 1=1';
    const values = [];
    
    // 是否包含已归档的目标
    if (!options.includeArchived) {
      sql += ' AND isArchived = FALSE';
    }
    
    // 按分类筛选
    if (options.category) {
      sql += ' AND category = ?';
      values.push(options.category);
    }
    
    // 按状态筛选
    if (options.status) {
      sql += ' AND status = ?';
      values.push(options.status);
    }
    
    // 按优先级筛选
    if (options.priority) {
      sql += ' AND priority = ?';
      values.push(options.priority);
    }
    
    // 父目标筛选（获取子目标或顶级目标）
    if (options.parentGoalId === null) {
      sql += ' AND parentGoalId IS NULL';
    } else if (options.parentGoalId) {
      sql += ' AND parentGoalId = ?';
      values.push(options.parentGoalId);
    }
    
    // 排序
    sql += ' ORDER BY priority DESC, targetDate ASC, createdAt DESC';
    
    // 分页
    if (options.limit) {
      sql += ' LIMIT ?';
      values.push(options.limit);
      
      if (options.offset) {
        sql += ' OFFSET ?';
        values.push(options.offset);
      }
    }
    
    const rows = await query(sql, values);
    const goals = [];
    
    for (const row of rows) {
      const goal = Goal.fromDatabaseFormat(row);
      // 加载关联数据
      await enrichGoalWithRelatedData(goal);
      goals.push(goal);
    }
    
    return goals;
  } catch (error) {
    console.error('获取目标列表失败:', error);
    throw new Error('获取目标列表失败');
  }
}

/**
 * 获取目标总数（用于分页）
 */
export async function countGoalsDb(options = {}) {
  try {
    let sql = 'SELECT COUNT(*) as total FROM goal WHERE 1=1';
    const values = [];
    
    if (!options.includeArchived) {
      sql += ' AND isArchived = FALSE';
    }
    
    if (options.category) {
      sql += ' AND category = ?';
      values.push(options.category);
    }
    
    if (options.status) {
      sql += ' AND status = ?';
      values.push(options.status);
    }
    
    const [result] = await query(sql, values);
    return result.total;
  } catch (error) {
    console.error('获取目标总数失败:', error);
    throw new Error('获取目标总数失败');
  }
}

/**
 * 根据ID获取目标
 */
export async function getGoalByIdDb(goalId) {
  try {
    const sql = 'SELECT * FROM goal WHERE id = ? AND isArchived = FALSE';
    const rows = await query(sql, [goalId]);
    
    if (rows.length === 0) {
      return null;
    }
    
    const goal = Goal.fromDatabaseFormat(rows[0]);
    await enrichGoalWithRelatedData(goal);
    return goal;
  } catch (error) {
    console.error('获取目标失败:', error);
    throw new Error('获取目标失败');
  }
}

/**
 * 创建新目标
 */
export async function createGoalDb(goal) {
  try {
    const goalId = generateId();
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    goal.id = goalId;
    goal.createdAt = now;
    goal.updatedAt = now;
    
    const goalData = goal.toDatabaseFormat();
    
    const sql = `
      INSERT INTO goal (
        id, title, description, category, status, priority, startDate, targetDate,
        actualCompletionDate, progress, parentGoalId, tags, color, icon, isArchived,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      goalData.id, goalData.title, goalData.description, goalData.category,
      goalData.status, goalData.priority, goalData.startDate, goalData.targetDate,
      goalData.actualCompletionDate, goalData.progress, goalData.parentGoalId,
      goalData.tags, goalData.color, goalData.icon, goalData.isArchived,
      goalData.createdAt, goalData.updatedAt
    ];
    
    await execute(sql, values);
    return goalId;
  } catch (error) {
    console.error('创建目标失败:', error);
    throw new Error('创建目标失败');
  }
}

/**
 * 更新目标
 */
export async function updateGoalDb(goalId, updateData) {
  try {
    updateData.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    // 处理数组字段
    if (updateData.tags && Array.isArray(updateData.tags)) {
      updateData.tags = updateData.tags.join(',');
    }
    
    // 删除不存在于数据库表中的字段
    const allowedFields = [
      'title', 'description', 'category', 'status', 'priority', 'startDate',
      'targetDate', 'actualCompletionDate', 'progress', 'parentGoalId', 'tags',
      'color', 'icon', 'isArchived', 'updatedAt'
    ];
    
    const processedData = {};
    for (const field of allowedFields) {
      if (updateData.hasOwnProperty(field)) {
        processedData[field] = updateData[field];
      }
    }
    
    const fields = Object.keys(processedData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(processedData);
    values.push(goalId);
    
    const sql = `UPDATE goal SET ${fields} WHERE id = ?`;
    
    const result = await execute(sql, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('更新目标失败:', error);
    throw new Error('更新目标失败');
  }
}

/**
 * 删除目标
 */
export async function deleteGoalDb(goalId, permanent = false) {
  try {
    if (permanent) {
      // 永久删除
      await execute('DELETE FROM goal WHERE id = ?', [goalId]);
    } else {
      // 软删除：标记为已归档
      await execute('UPDATE goal SET isArchived = TRUE WHERE id = ?', [goalId]);
    }
    return true;
  } catch (error) {
    console.error('删除目标失败:', error);
    throw new Error('删除目标失败');
  }
}

/**
 * 获取目标的里程碑
 */
export async function getGoalMilestonesDb(goalId) {
  try {
    const sql = 'SELECT * FROM goal_milestone WHERE goalId = ? ORDER BY sortOrder ASC, targetDate ASC';
    const rows = await query(sql, [goalId]);
    return rows.map(row => GoalMilestone.fromDatabaseFormat(row));
  } catch (error) {
    console.error('获取目标里程碑失败:', error);
    throw new Error('获取目标里程碑失败');
  }
}

/**
 * 创建目标里程碑
 */
export async function createGoalMilestoneDb(milestone) {
  try {
    const milestoneId = generateId();
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    milestone.id = milestoneId;
    milestone.createdAt = now;
    milestone.updatedAt = now;
    
    const milestoneData = milestone.toDatabaseFormat();
    
    const sql = `
      INSERT INTO goal_milestone (
        id, goalId, title, description, targetDate, isCompleted, completedAt,
        sortOrder, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      milestoneData.id, milestoneData.goalId, milestoneData.title,
      milestoneData.description, milestoneData.targetDate, milestoneData.isCompleted,
      milestoneData.completedAt, milestoneData.sortOrder, milestoneData.createdAt,
      milestoneData.updatedAt
    ];
    
    await execute(sql, values);
    return milestoneId;
  } catch (error) {
    console.error('创建目标里程碑失败:', error);
    throw new Error('创建目标里程碑失败');
  }
}

/**
 * 更新目标里程碑
 */
export async function updateGoalMilestoneDb(milestoneId, updateData) {
  try {
    updateData.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    // 如果标记为完成，设置完成时间
    if (updateData.isCompleted && !updateData.completedAt) {
      updateData.completedAt = updateData.updatedAt;
    }
    
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(milestoneId);
    
    const sql = `UPDATE goal_milestone SET ${fields} WHERE id = ?`;
    
    const result = await execute(sql, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('更新目标里程碑失败:', error);
    throw new Error('更新目标里程碑失败');
  }
}

/**
 * 根据ID获取目标里程碑
 */
export async function getGoalMilestoneByIdDb(milestoneId) {
  try {
    const sql = 'SELECT * FROM goal_milestone WHERE id = ?';
    const rows = await query(sql, [milestoneId]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return GoalMilestone.fromDatabaseFormat(rows[0]);
  } catch (error) {
    console.error('获取目标里程碑失败:', error);
    throw new Error('获取目标里程碑失败');
  }
}

/**
 * 删除目标里程碑
 */
export async function deleteGoalMilestoneDb(milestoneId) {
  try {
    await execute('DELETE FROM goal_milestone WHERE id = ?', [milestoneId]);
    return true;
  } catch (error) {
    console.error('删除目标里程碑失败:', error);
    throw new Error('删除目标里程碑失败');
  }
}

/**
 * 获取目标的关联任务
 */
export async function getGoalTasksDb(goalId) {
  try {
    const sql = `
      SELECT t.* FROM task t
      INNER JOIN goal_task_relation gtr ON t.id = gtr.taskId
      WHERE gtr.goalId = ?
      ORDER BY t.dueDate ASC, t.priority DESC
    `;
    const rows = await query(sql, [goalId]);
    return rows;
  } catch (error) {
    console.error('获取目标关联任务失败:', error);
    throw new Error('获取目标关联任务失败');
  }
}

/**
 * 关联目标和任务
 */
export async function linkGoalTaskDb(goalId, taskId) {
  try {
    const relationId = generateId();
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const sql = 'INSERT INTO goal_task_relation (id, goalId, taskId, createdAt) VALUES (?, ?, ?, ?)';
    await execute(sql, [relationId, goalId, taskId, now]);
    return true;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // 关联已存在，忽略错误
      return true;
    }
    console.error('关联目标和任务失败:', error);
    throw new Error('关联目标和任务失败');
  }
}

/**
 * 取消目标和任务的关联
 */
export async function unlinkGoalTaskDb(goalId, taskId) {
  try {
    await execute('DELETE FROM goal_task_relation WHERE goalId = ? AND taskId = ?', [goalId, taskId]);
    return true;
  } catch (error) {
    console.error('取消目标和任务关联失败:', error);
    throw new Error('取消目标和任务关联失败');
  }
}

/**
 * 获取目标的回顾记录
 */
export async function getGoalReviewsDb(goalId) {
  try {
    const sql = 'SELECT * FROM goal_review WHERE goalId = ? ORDER BY reviewDate DESC';
    const rows = await query(sql, [goalId]);
    return rows.map(row => GoalReview.fromDatabaseFormat(row));
  } catch (error) {
    console.error('获取目标回顾记录失败:', error);
    throw new Error('获取目标回顾记录失败');
  }
}

/**
 * 创建目标回顾记录
 */
export async function createGoalReviewDb(review) {
  try {
    const reviewId = generateId();
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    review.id = reviewId;
    review.createdAt = now;
    review.updatedAt = now;
    
    const reviewData = review.toDatabaseFormat();
    
    const sql = `
      INSERT INTO goal_review (
        id, goalId, reviewDate, reviewType, progress, achievements, challenges,
        improvements, nextSteps, mood, rating, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      reviewData.id, reviewData.goalId, reviewData.reviewDate, reviewData.reviewType,
      reviewData.progress, reviewData.achievements, reviewData.challenges,
      reviewData.improvements, reviewData.nextSteps, reviewData.mood,
      reviewData.rating, reviewData.createdAt, reviewData.updatedAt
    ];
    
    await execute(sql, values);
    return reviewId;
  } catch (error) {
    console.error('创建目标回顾记录失败:', error);
    throw new Error('创建目标回顾记录失败');
  }
}

/**
 * 更新目标评价
 */
export async function updateGoalReviewDb(reviewId, updateData) {
  try {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    updateData.updatedAt = now;
    
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(reviewId);
    
    const sql = `UPDATE goal_review SET ${fields} WHERE id = ?`;
    const result = await execute(sql, values);
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error('更新目标评价失败:', error);
    throw new Error('更新目标评价失败');
  }
}

/**
 * 删除目标评价
 */
export async function deleteGoalReviewDb(reviewId) {
  try {
    const sql = 'DELETE FROM goal_review WHERE id = ?';
    const result = await execute(sql, [reviewId]);
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error('删除目标评价失败:', error);
    throw new Error('删除目标评价失败');
  }
}

/**
 * 根据ID获取单个目标评价
 */
export async function getGoalReviewByIdDb(reviewId) {
  try {
    const sql = 'SELECT * FROM goal_review WHERE id = ?';
    const rows = await query(sql, [reviewId]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return new GoalReview(rows[0]);
  } catch (error) {
    console.error('根据ID获取目标评价失败:', error);
    throw new Error('根据ID获取目标评价失败');
  }
}

/**
 * 获取目标统计信息
 */
export async function getGoalStatsDb() {
  try {
    const stats = {};
    
    // 基础统计
    const basicStatsQuery = `
      SELECT 
        COUNT(*) as totalGoals,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as activeGoals,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedGoals,
        SUM(CASE WHEN status = 'paused' THEN 1 ELSE 0 END) as pausedGoals,
        SUM(CASE WHEN targetDate < CURDATE() AND status != 'completed' THEN 1 ELSE 0 END) as overdueGoals,
        AVG(progress) as averageProgress
      FROM goal WHERE isArchived = FALSE
    `;
    
    const [basicStats] = await query(basicStatsQuery);
    Object.assign(stats, basicStats);
    
    // 完成率
    stats.completionRate = stats.totalGoals > 0 ? 
      Math.round((stats.completedGoals / stats.totalGoals) * 100) : 0;
    
    // 分类统计
    const categoryStatsQuery = `
      SELECT category, COUNT(*) as count, AVG(progress) as avgProgress
      FROM goal WHERE isArchived = FALSE
      GROUP BY category
      ORDER BY count DESC
    `;
    stats.categoryStats = await query(categoryStatsQuery);
    
    // 优先级统计
    const priorityStatsQuery = `
      SELECT priority, COUNT(*) as count, AVG(progress) as avgProgress
      FROM goal WHERE isArchived = FALSE
      GROUP BY priority
      ORDER BY FIELD(priority, 'urgent', 'high', 'medium', 'low')
    `;
    stats.priorityStats = await query(priorityStatsQuery);
    
    return stats;
  } catch (error) {
    console.error('获取目标统计信息失败:', error);
    throw new Error('获取目标统计信息失败');
  }
}

/**
 * 丰富目标数据，包含关联信息
 */
async function enrichGoalWithRelatedData(goal) {
  try {
    // 获取里程碑
    goal.milestones = await getGoalMilestonesDb(goal.id);
    
    // 获取关联任务
    goal.tasks = await getGoalTasksDb(goal.id);
    
    // 获取子目标
    const subGoals = await getAllGoalsDb({ 
      parentGoalId: goal.id, 
      includeArchived: false 
    });
    goal.subGoals = subGoals;
    
    // 重新计算进度
    goal.calculateProgress();
    
    return goal;
  } catch (error) {
    console.error('丰富目标数据失败:', error);
    throw error;
  }
}
