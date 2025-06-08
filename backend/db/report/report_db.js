import { query, execute, execSql } from '../exec_api.js';
import dayjs from 'dayjs';

/**
 * 获取任务统计数据
 */
const getTaskStatistics = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      COUNT(*) as totalTasks,
      SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as completedTasks,
      SUM(CASE WHEN status = 'working' THEN 1 ELSE 0 END) as inProgressTasks,
      SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todoTasks,
      SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as highPriorityTasks,
      SUM(CASE WHEN priority = 'medium' THEN 1 ELSE 0 END) as mediumPriorityTasks,
      SUM(CASE WHEN priority = 'low' THEN 1 ELSE 0 END) as lowPriorityTasks,
      SUM(CASE WHEN dueDate < CURDATE() AND status != 'done' THEN 1 ELSE 0 END) as overdueTasks
    FROM task 
    WHERE (createdAt BETWEEN ? AND ? OR updatedAt BETWEEN ? AND ?)
      ${userId ? 'AND userId = ?' : ''}
  `;
  
  const params = [startDate, endDate, startDate, endDate];
  if (userId) params.push(userId);
  
  const result = await execSql(sql, params);
  const stats = result[0] || {};
  
  return {
    ...stats,
    completionRate: stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks * 100).toFixed(2) : 0,
    overdueRate: stats.totalTasks > 0 ? (stats.overdueTasks / stats.totalTasks * 100).toFixed(2) : 0
  };
};

/**
 * 获取习惯统计数据
 */
const getHabitStatistics = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      COUNT(DISTINCT h.id) as totalHabits,
      COUNT(DISTINCT CASE WHEN hc.isCompleted = 1 THEN hc.habitId END) as habitsWithCompletions,
      COUNT(hc.id) as totalCompletions,
      SUM(CASE WHEN hc.isCompleted = 1 THEN 1 ELSE 0 END) as successfulCompletions,
      AVG(h.streakCount) as averageStreak,
      MAX(h.longestStreak) as maxStreak,
      SUM(h.totalCompletions) as allTimeCompletions
    FROM habit h
    LEFT JOIN habit_completion hc ON h.id = hc.habitId 
      AND hc.date BETWEEN ? AND ?
    WHERE h.createdAt <= ?
      ${userId ? 'AND h.userId = ?' : ''}
    GROUP BY ${userId ? 'h.userId' : '1'}
  `;
  
  const params = [startDate, endDate, endDate];
  if (userId) params.push(userId);
  
  const result = await execSql(sql, params);
  const stats = result[0] || {};
  
  return {
    ...stats,
    completionRate: stats.totalCompletions > 0 ? (stats.successfulCompletions / stats.totalCompletions * 100).toFixed(2) : 0,
    activeHabitsRate: stats.totalHabits > 0 ? (stats.habitsWithCompletions / stats.totalHabits * 100).toFixed(2) : 0
  };
};

/**
 * 获取番茄钟统计数据
 */
const getPomodoroStatistics = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      COUNT(*) as totalSessions,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedSessions,
      SUM(CASE WHEN type = 'work' THEN actualDuration ELSE 0 END) as totalWorkTime,
      SUM(CASE WHEN type IN ('short_break', 'long_break') THEN actualDuration ELSE 0 END) as totalBreakTime,
      SUM(pausedDuration) as totalPauseTime,
      SUM(interruptions) as totalInterruptions,
      AVG(CASE WHEN productivity IS NOT NULL THEN 
        CASE productivity 
          WHEN 'very_low' THEN 1 
          WHEN 'low' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'high' THEN 4 
          WHEN 'very_high' THEN 5 
        END 
      END) as averageProductivity,
      AVG(CASE WHEN mood IS NOT NULL THEN 
        CASE mood 
          WHEN 'very_bad' THEN 1 
          WHEN 'bad' THEN 2 
          WHEN 'neutral' THEN 3 
          WHEN 'good' THEN 4 
          WHEN 'very_good' THEN 5 
        END 
      END) as averageMood,
      MAX(actualDuration) as longestSession
    FROM pomodoro_session 
    WHERE startTime BETWEEN ? AND ?
      ${userId ? 'AND userId = ?' : ''}
  `;
  
  const params = [startDate, endDate];
  if (userId) params.push(userId);
  
  const result = await execSql(sql, params);
  const stats = result[0] || {};
  
  return {
    ...stats,
    completionRate: stats.totalSessions > 0 ? (stats.completedSessions / stats.totalSessions * 100).toFixed(2) : 0,
    efficiency: stats.averageProductivity ? (stats.averageProductivity / 5 * 100).toFixed(2) : 0,
    timeUtilization: stats.totalWorkTime && stats.totalBreakTime ? 
      (stats.totalWorkTime / (stats.totalWorkTime + stats.totalBreakTime) * 100).toFixed(2) : 0
  };
};

/**
 * 获取目标统计数据
 */
const getGoalStatistics = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      COUNT(*) as totalGoals,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedGoals,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as activeGoals,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelledGoals,
      AVG(progress) as averageProgress,
      SUM(CASE WHEN actualCompletionDate <= targetDate AND status = 'completed' THEN 1 ELSE 0 END) as onTimeCompletions,
      SUM(CASE WHEN actualCompletionDate > targetDate AND status = 'completed' THEN 1 ELSE 0 END) as lateCompletions
    FROM goal 
    WHERE (createdAt BETWEEN ? AND ? OR updatedAt BETWEEN ? AND ?)
      ${userId ? 'AND userId = ?' : ''}
  `;
  
  const params = [startDate, endDate, startDate, endDate];
  if (userId) params.push(userId);
  
  const result = await execSql(sql, params);
  const stats = result[0] || {};
  
  return {
    ...stats,
    completionRate: stats.totalGoals > 0 ? (stats.completedGoals / stats.totalGoals * 100).toFixed(2) : 0,
    onTimeCompletionRate: stats.completedGoals > 0 ? (stats.onTimeCompletions / stats.completedGoals * 100).toFixed(2) : 0
  };
};

/**
 * 获取习惯概览
 */
const getHabitOverview = async (startDate, endDate, userId, habitId) => {
  const sql = `
    SELECT 
      h.id,
      h.name,
      h.category,
      h.frequencyType,
      h.streakCount,
      h.longestStreak,
      h.totalCompletions,
      COUNT(hc.id) as periodCompletions,
      SUM(CASE WHEN hc.isCompleted = 1 THEN 1 ELSE 0 END) as periodSuccesses
    FROM habit h
    LEFT JOIN habit_completion hc ON h.id = hc.habitId 
      AND hc.date BETWEEN ? AND ?
    WHERE h.createdAt <= ?
      ${userId ? 'AND h.userId = ?' : ''}
      ${habitId ? 'AND h.id = ?' : ''}
    GROUP BY h.id, h.name, h.category, h.frequencyType, h.streakCount, h.longestStreak, h.totalCompletions
  `;
  
  const params = [startDate, endDate, endDate];
  if (userId) params.push(userId);
  if (habitId) params.push(habitId);
  
  const result = await execSql(sql, params);
  
  return result.map(habit => ({
    ...habit,
    completionRate: habit.periodCompletions > 0 ? 
      (habit.periodSuccesses / habit.periodCompletions * 100).toFixed(2) : 0
  }));
};

/**
 * 获取习惯完成趋势
 */
const getHabitCompletionTrends = async (startDate, endDate, userId, habitId) => {
  const sql = `
    SELECT 
      hc.date,
      COUNT(hc.id) as totalAttempts,
      SUM(CASE WHEN hc.isCompleted = 1 THEN 1 ELSE 0 END) as completions,
      COUNT(DISTINCT hc.habitId) as activeHabits
    FROM habit_completion hc
    JOIN habit h ON hc.habitId = h.id
    WHERE hc.date BETWEEN ? AND ?
      ${userId ? 'AND h.userId = ?' : ''}
      ${habitId ? 'AND hc.habitId = ?' : ''}
    GROUP BY hc.date
    ORDER BY hc.date
  `;
  
  const params = [startDate, endDate];
  if (userId) params.push(userId);
  if (habitId) params.push(habitId);
  
  const result = await execSql(sql, params);
  
  return result.map(day => ({
    ...day,
    completionRate: day.totalAttempts > 0 ? (day.completions / day.totalAttempts * 100).toFixed(2) : 0
  }));
};

/**
 * 获取习惯分类统计
 */
const getHabitCategoryStats = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      h.category,
      COUNT(DISTINCT h.id) as habitCount,
      COUNT(hc.id) as totalAttempts,
      SUM(CASE WHEN hc.isCompleted = 1 THEN 1 ELSE 0 END) as completions,
      AVG(h.streakCount) as averageStreak
    FROM habit h
    LEFT JOIN habit_completion hc ON h.id = hc.habitId 
      AND hc.date BETWEEN ? AND ?
    WHERE h.createdAt <= ?
      ${userId ? 'AND h.userId = ?' : ''}
    GROUP BY h.category
  `;
  
  const params = [startDate, endDate, endDate];
  if (userId) params.push(userId);
  
  const result = await execSql(sql, params);
  
  return result.map(category => ({
    ...category,
    completionRate: category.totalAttempts > 0 ? 
      (category.completions / category.totalAttempts * 100).toFixed(2) : 0
  }));
};

/**
 * 获取习惯连续完成统计
 */
const getHabitStreakStats = async (startDate, endDate, userId, habitId) => {
  const sql = `
    SELECT 
      h.id,
      h.name,
      h.streakCount as currentStreak,
      h.longestStreak as maxStreak,
      h.lastCompletedAt
    FROM habit h
    WHERE h.createdAt <= ?
      ${userId ? 'AND h.userId = ?' : ''}
      ${habitId ? 'AND h.id = ?' : ''}
    ORDER BY h.longestStreak DESC
  `;
  
  const params = [endDate];
  if (userId) params.push(userId);
  if (habitId) params.push(habitId);
  
  return await execSql(sql, params);
};

/**
 * 获取习惯完成热力图数据
 */
const getHabitHeatmapData = async (startDate, endDate, userId, habitId) => {
  const sql = `
    SELECT 
      hc.date,
      hc.habitId,
      h.name as habitName,
      hc.isCompleted
    FROM habit_completion hc
    JOIN habit h ON hc.habitId = h.id
    WHERE hc.date BETWEEN ? AND ?
      ${userId ? 'AND h.userId = ?' : ''}
      ${habitId ? 'AND hc.habitId = ?' : ''}
    ORDER BY hc.date, h.name
  `;
  
  const params = [startDate, endDate];
  if (userId) params.push(userId);
  if (habitId) params.push(habitId);
  
  return await execSql(sql, params);
};

/**
 * 获取目标概览
 */
const getGoalOverview = async (startDate, endDate, userId, goalId) => {
  const sql = `
    SELECT 
      g.id,
      g.title,
      g.category,
      g.status,
      g.priority,
      g.progress,
      g.startDate,
      g.targetDate,
      g.actualCompletionDate,
      DATEDIFF(g.actualCompletionDate, g.targetDate) as daysDifference
    FROM goal g
    WHERE (g.createdAt BETWEEN ? AND ? OR g.updatedAt BETWEEN ? AND ?)
      ${userId ? 'AND g.userId = ?' : ''}
      ${goalId ? 'AND g.id = ?' : ''}
    ORDER BY g.createdAt DESC
  `;
  
  const params = [startDate, endDate, startDate, endDate];
  if (userId) params.push(userId);
  if (goalId) params.push(goalId);
  
  return await execSql(sql, params);
};

/**
 * 获取目标进度趋势
 */
const getGoalProgressTrends = async (startDate, endDate, userId, goalId) => {
  const sql = `
    SELECT 
      DATE(g.updatedAt) as date,
      AVG(g.progress) as averageProgress,
      COUNT(*) as activeGoals,
      SUM(CASE WHEN g.status = 'completed' THEN 1 ELSE 0 END) as completedGoals
    FROM goal g
    WHERE g.updatedAt BETWEEN ? AND ?
      ${userId ? 'AND g.userId = ?' : ''}
      ${goalId ? 'AND g.id = ?' : ''}
    GROUP BY DATE(g.updatedAt)
    ORDER BY date
  `;
  
  const params = [startDate, endDate];
  if (userId) params.push(userId);
  if (goalId) params.push(goalId);
  
  return await execSql(sql, params);
};

/**
 * 获取目标时间偏差分析
 */
const getGoalTimeDeviation = async (startDate, endDate, userId, goalId) => {
  const sql = `
    SELECT 
      COUNT(*) as totalCompleted,
      SUM(CASE WHEN actualCompletionDate <= targetDate THEN 1 ELSE 0 END) as onTime,
      SUM(CASE WHEN actualCompletionDate > targetDate THEN 1 ELSE 0 END) as delayed,
      AVG(DATEDIFF(actualCompletionDate, targetDate)) as averageDelay,
      MAX(DATEDIFF(actualCompletionDate, targetDate)) as maxDelay,
      MIN(DATEDIFF(actualCompletionDate, targetDate)) as minDelay
    FROM goal
    WHERE status = 'completed' 
      AND actualCompletionDate IS NOT NULL
      AND targetDate IS NOT NULL
      AND (createdAt BETWEEN ? AND ? OR actualCompletionDate BETWEEN ? AND ?)
      ${userId ? 'AND userId = ?' : ''}
      ${goalId ? 'AND id = ?' : ''}
  `;
  
  const params = [startDate, endDate, startDate, endDate];
  if (userId) params.push(userId);
  if (goalId) params.push(goalId);
  
  return await execSql(sql, params);
};

/**
 * 获取目标里程碑统计
 */
const getGoalMilestoneStats = async (startDate, endDate, userId, goalId) => {
  const sql = `
    SELECT 
      COUNT(*) as totalMilestones,
      SUM(CASE WHEN isCompleted = 1 THEN 1 ELSE 0 END) as completedMilestones,
      SUM(CASE WHEN isCompleted = 1 AND completedAt <= targetDate THEN 1 ELSE 0 END) as onTimeMilestones,
      AVG(DATEDIFF(completedAt, targetDate)) as averageMilestoneDelay
    FROM goal_milestone gm
    JOIN goal g ON gm.goalId = g.id
    WHERE gm.createdAt BETWEEN ? AND ?
      ${userId ? 'AND g.userId = ?' : ''}
      ${goalId ? 'AND gm.goalId = ?' : ''}
  `;
  
  const params = [startDate, endDate];
  if (userId) params.push(userId);
  if (goalId) params.push(goalId);
  
  return await execSql(sql, params);
};

/**
 * 获取目标回顾统计
 */
const getGoalReviewStats = async (startDate, endDate, userId, goalId) => {
  const sql = `
    SELECT 
      COUNT(*) as totalReviews,
      AVG(progress) as averageReviewProgress,
      AVG(CASE WHEN mood IS NOT NULL THEN 
        CASE mood 
          WHEN 'very_bad' THEN 1 
          WHEN 'bad' THEN 2 
          WHEN 'neutral' THEN 3 
          WHEN 'good' THEN 4 
          WHEN 'very_good' THEN 5 
        END 
      END) as averageMood,
      AVG(rating) as averageRating,
      COUNT(DISTINCT goalId) as reviewedGoals
    FROM goal_review gr
    JOIN goal g ON gr.goalId = g.id
    WHERE gr.reviewDate BETWEEN ? AND ?
      ${userId ? 'AND g.userId = ?' : ''}
      ${goalId ? 'AND gr.goalId = ?' : ''}
  `;
  
  const params = [startDate, endDate];
  if (userId) params.push(userId);
  if (goalId) params.push(goalId);
  
  return await execSql(sql, params);
};

/**
 * 获取目标分类统计
 */
const getGoalCategoryStats = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      category,
      COUNT(*) as goalCount,
      AVG(progress) as averageProgress,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedCount,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as activeCount
    FROM goal
    WHERE (createdAt BETWEEN ? AND ? OR updatedAt BETWEEN ? AND ?)
      ${userId ? 'AND userId = ?' : ''}
    GROUP BY category
  `;
  
  const params = [startDate, endDate, startDate, endDate];
  if (userId) params.push(userId);
  
  const result = await execSql(sql, params);
  
  return result.map(category => ({
    ...category,
    completionRate: category.goalCount > 0 ? 
      (category.completedCount / category.goalCount * 100).toFixed(2) : 0
  }));
};

/**
 * 获取番茄钟时间分析
 */
const getPomodoroTimeAnalysis = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      DATE(startTime) as date,
      SUM(CASE WHEN type = 'work' THEN actualDuration ELSE 0 END) as dailyWorkTime,
      SUM(CASE WHEN type IN ('short_break', 'long_break') THEN actualDuration ELSE 0 END) as dailyBreakTime,
      COUNT(CASE WHEN type = 'work' AND status = 'completed' THEN 1 END) as completedWorkSessions,
      AVG(CASE WHEN type = 'work' THEN actualDuration END) as averageWorkSessionLength
    FROM pomodoro_session
    WHERE startTime BETWEEN ? AND ?
      ${userId ? 'AND userId = ?' : ''}
    GROUP BY DATE(startTime)
    ORDER BY date
  `;
  
  const params = [startDate, endDate];
  if (userId) params.push(userId);
  
  return await execSql(sql, params);
};

/**
 * 获取专注时间分布
 */
const getFocusTimeDistribution = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      HOUR(startTime) as hour,
      COUNT(*) as sessionCount,
      SUM(actualDuration) as totalDuration,
      AVG(CASE WHEN productivity IS NOT NULL THEN 
        CASE productivity 
          WHEN 'very_low' THEN 1 
          WHEN 'low' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'high' THEN 4 
          WHEN 'very_high' THEN 5 
        END 
      END) as averageProductivity
    FROM pomodoro_session
    WHERE type = 'work' 
      AND startTime BETWEEN ? AND ?
      ${userId ? 'AND userId = ?' : ''}
    GROUP BY HOUR(startTime)
    ORDER BY hour
  `;
  
  const params = [startDate, endDate];
  if (userId) params.push(userId);
  
  return await execSql(sql, params);
};

/**
 * 获取效率趋势
 */
const getEfficiencyTrends = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      DATE(startTime) as date,
      AVG(CASE WHEN productivity IS NOT NULL THEN 
        CASE productivity 
          WHEN 'very_low' THEN 1 
          WHEN 'low' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'high' THEN 4 
          WHEN 'very_high' THEN 5 
        END 
      END) as averageProductivity,
      AVG(CASE WHEN mood IS NOT NULL THEN 
        CASE mood 
          WHEN 'very_bad' THEN 1 
          WHEN 'bad' THEN 2 
          WHEN 'neutral' THEN 3 
          WHEN 'good' THEN 4 
          WHEN 'very_good' THEN 5 
        END 
      END) as averageMood,
      AVG(CASE WHEN energy IS NOT NULL THEN 
        CASE energy 
          WHEN 'very_low' THEN 1 
          WHEN 'low' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'high' THEN 4 
          WHEN 'very_high' THEN 5 
        END 
      END) as averageEnergy
    FROM pomodoro_session
    WHERE startTime BETWEEN ? AND ?
      ${userId ? 'AND userId = ?' : ''}
    GROUP BY DATE(startTime)
    ORDER BY date
  `;
  
  const params = [startDate, endDate];
  if (userId) params.push(userId);
  
  return await execSql(sql, params);
};

/**
 * 获取中断分析
 */
const getInterruptionAnalysis = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      DATE(startTime) as date,
      SUM(interruptions) as totalInterruptions,
      SUM(pausedDuration) as totalPauseTime,
      AVG(interruptions) as averageInterruptions,
      COUNT(*) as totalSessions
    FROM pomodoro_session
    WHERE startTime BETWEEN ? AND ?
      ${userId ? 'AND userId = ?' : ''}
    GROUP BY DATE(startTime)
    ORDER BY date
  `;
  
  const params = [startDate, endDate];
  if (userId) params.push(userId);
  
  return await execSql(sql, params);
};

/**
 * 获取最佳工作时段分析
 */
const getOptimalWorkingHours = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      HOUR(startTime) as hour,
      COUNT(*) as sessionCount,
      AVG(actualDuration) as averageDuration,
      AVG(CASE WHEN productivity IS NOT NULL THEN 
        CASE productivity 
          WHEN 'very_low' THEN 1 
          WHEN 'low' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'high' THEN 4 
          WHEN 'very_high' THEN 5 
        END 
      END) as productivityScore,
      SUM(interruptions) as totalInterruptions
    FROM pomodoro_session
    WHERE type = 'work' 
      AND startTime BETWEEN ? AND ?
      ${userId ? 'AND userId = ?' : ''}
    GROUP BY HOUR(startTime)
    HAVING sessionCount >= 3  -- 至少有3个会话才有统计意义
    ORDER BY productivityScore DESC, averageDuration DESC
  `;
  
  const params = [startDate, endDate];
  if (userId) params.push(userId);
  
  return await execSql(sql, params);
};

/**
 * 获取任务概览
 */
const getTaskOverview = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      COUNT(*) as totalTasks,
      SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as completedTasks,
      SUM(CASE WHEN status = 'working' THEN 1 ELSE 0 END) as inProgressTasks,
      SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todoTasks,
      SUM(CASE WHEN dueDate < CURDATE() AND status != 'done' THEN 1 ELSE 0 END) as overdueTasks,
      AVG(CASE WHEN status = 'done' THEN DATEDIFF(updatedAt, createdAt) END) as averageCompletionDays
    FROM task
    WHERE (createdAt BETWEEN ? AND ? OR updatedAt BETWEEN ? AND ?)
      ${userId ? 'AND userId = ?' : ''}
  `;
  
  const params = [startDate, endDate, startDate, endDate];
  if (userId) params.push(userId);
  
  const result = await execSql(sql, params);
  const stats = result[0] || {};
  
  return {
    ...stats,
    completionRate: stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks * 100).toFixed(2) : 0,
    overdueRate: stats.totalTasks > 0 ? (stats.overdueTasks / stats.totalTasks * 100).toFixed(2) : 0
  };
};

/**
 * 获取任务完成趋势
 */
const getTaskCompletionTrends = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      DATE(updatedAt) as date,
      COUNT(*) as totalTasks,
      SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as completedTasks
    FROM task
    WHERE updatedAt BETWEEN ? AND ?
      ${userId ? 'AND userId = ?' : ''}
    GROUP BY DATE(updatedAt)
    ORDER BY date
  `;
  
  const params = [startDate, endDate];
  if (userId) params.push(userId);
  
  const result = await execSql(sql, params);
  
  return result.map(day => ({
    ...day,
    completionRate: day.totalTasks > 0 ? (day.completedTasks / day.totalTasks * 100).toFixed(2) : 0
  }));
};

/**
 * 获取任务优先级分析
 */
const getTaskPriorityAnalysis = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      priority,
      COUNT(*) as totalTasks,
      SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as completedTasks,
      AVG(CASE WHEN status = 'done' THEN DATEDIFF(updatedAt, createdAt) END) as averageCompletionDays
    FROM task
    WHERE (createdAt BETWEEN ? AND ? OR updatedAt BETWEEN ? AND ?)
      ${userId ? 'AND userId = ?' : ''}
    GROUP BY priority
  `;
  
  const params = [startDate, endDate, startDate, endDate];
  if (userId) params.push(userId);
  
  const result = await execSql(sql, params);
  
  return result.map(priority => ({
    ...priority,
    completionRate: priority.totalTasks > 0 ? 
      (priority.completedTasks / priority.totalTasks * 100).toFixed(2) : 0
  }));
};

/**
 * 获取任务标签统计
 */
const getTaskTagStats = async (startDate, endDate, userId) => {
  // 由于tags字段是逗号分隔的字符串，需要特殊处理
  const sql = `
    SELECT 
      t.tags,
      COUNT(*) as taskCount,
      SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as completedCount
    FROM task t
    WHERE tags IS NOT NULL 
      AND tags != ''
      AND (createdAt BETWEEN ? AND ? OR updatedAt BETWEEN ? AND ?)
      ${userId ? 'AND userId = ?' : ''}
    GROUP BY t.tags
    ORDER BY taskCount DESC
    LIMIT 20
  `;
  
  const params = [startDate, endDate, startDate, endDate];
  if (userId) params.push(userId);
  
  const result = await execSql(sql, params);
  
  // 处理逗号分隔的标签
  const tagStats = {};
  result.forEach(row => {
    if (row.tags) {
      const tags = row.tags.split(',').map(tag => tag.trim());
      tags.forEach(tag => {
        if (!tagStats[tag]) {
          tagStats[tag] = { tag, taskCount: 0, completedCount: 0 };
        }
        tagStats[tag].taskCount += row.taskCount;
        tagStats[tag].completedCount += row.completedCount;
      });
    }
  });
  
  return Object.values(tagStats)
    .map(tag => ({
      ...tag,
      completionRate: tag.taskCount > 0 ? (tag.completedCount / tag.taskCount * 100).toFixed(2) : 0
    }))
    .sort((a, b) => b.taskCount - a.taskCount)
    .slice(0, 10);
};

/**
 * 获取逾期任务分析
 */
const getTaskOverdueAnalysis = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      priority,
      COUNT(*) as totalOverdue,
      AVG(DATEDIFF(CURDATE(), dueDate)) as averageDaysOverdue,
      MAX(DATEDIFF(CURDATE(), dueDate)) as maxDaysOverdue
    FROM task
    WHERE dueDate < CURDATE() 
      AND status != 'done'
      AND dueDate BETWEEN ? AND ?
      ${userId ? 'AND userId = ?' : ''}
    GROUP BY priority
  `;
  
  const params = [startDate, endDate];
  if (userId) params.push(userId);
  
  return await execSql(sql, params);
};

// 其他辅助查询函数...

/**
 * 获取番茄钟会话统计
 */
const getPomodoroSessionStats = async (startDate, endDate, userId) => {
  return await getPomodoroStatistics(startDate, endDate, userId);
};

/**
 * 获取番茄钟生产力趋势
 */
const getPomodoroProductivityTrends = async (startDate, endDate, userId) => {
  return await getEfficiencyTrends(startDate, endDate, userId);
};

/**
 * 获取番茄钟心情精力分析
 */
const getPomodoroMoodEnergyAnalysis = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      mood,
      energy,
      COUNT(*) as sessionCount,
      AVG(actualDuration) as averageDuration,
      AVG(CASE WHEN productivity IS NOT NULL THEN 
        CASE productivity 
          WHEN 'very_low' THEN 1 
          WHEN 'low' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'high' THEN 4 
          WHEN 'very_high' THEN 5 
        END 
      END) as averageProductivity
    FROM pomodoro_session
    WHERE startTime BETWEEN ? AND ?
      AND type = 'work'
      ${userId ? 'AND userId = ?' : ''}
    GROUP BY mood, energy
  `;
  
  const params = [startDate, endDate];
  if (userId) params.push(userId);
  
  return await execSql(sql, params);
};

/**
 * 获取番茄钟专注分析
 */
const getPomodoroFocusAnalysis = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      DATE(startTime) as date,
      MAX(actualDuration) as longestFocus,
      AVG(actualDuration) as averageFocus,
      SUM(actualDuration) as totalFocusTime,
      COUNT(*) as focusSessions
    FROM pomodoro_session
    WHERE type = 'work' 
      AND status = 'completed'
      AND startTime BETWEEN ? AND ?
      ${userId ? 'AND userId = ?' : ''}
    GROUP BY DATE(startTime)
    ORDER BY date
  `;
  
  const params = [startDate, endDate];
  if (userId) params.push(userId);
  
  return await execSql(sql, params);
};

/**
 * 获取番茄钟任务集成统计
 */
const getPomodoroTaskIntegration = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      COUNT(DISTINCT ps.taskId) as tasksWithPomodoro,
      COUNT(ps.id) as totalPomodoroSessions,
      AVG(ps.actualDuration) as averageSessionDuration,
      COUNT(DISTINCT CASE WHEN t.status = 'done' THEN ps.taskId END) as completedTasksWithPomodoro
    FROM pomodoro_session ps
    LEFT JOIN task t ON ps.taskId = t.id
    WHERE ps.startTime BETWEEN ? AND ?
      AND ps.taskId IS NOT NULL
      ${userId ? 'AND ps.userId = ?' : ''}
  `;
  
  const params = [startDate, endDate];
  if (userId) params.push(userId);
  
  return await execSql(sql, params);
};

/**
 * 获取关键指标（仪表板用）
 */
const getKeyMetrics = async (startDate, endDate, userId) => {
  const taskStats = await getTaskStatistics(startDate, endDate, userId);
  const habitStats = await getHabitStatistics(startDate, endDate, userId);
  const pomodoroStats = await getPomodoroStatistics(startDate, endDate, userId);
  const goalStats = await getGoalStatistics(startDate, endDate, userId);
  
  // 计算综合生产力分数
  const weights = { tasks: 0.25, habits: 0.25, pomodoro: 0.25, goals: 0.25 };
  const scores = {
    tasks: parseFloat(taskStats.completionRate) || 0,
    habits: parseFloat(habitStats.completionRate) || 0,
    pomodoro: parseFloat(pomodoroStats.efficiency) || 0,
    goals: parseFloat(goalStats.averageProgress) || 0
  };
  
  const productivityScore = Object.keys(weights).reduce((total, key) => {
    return total + (scores[key] * weights[key]);
  }, 0);
  
  return {
    productivityScore: productivityScore.toFixed(2),
    taskCompletionRate: taskStats.completionRate,
    habitCompletionRate: habitStats.completionRate,
    focusEfficiency: pomodoroStats.efficiency,
    goalProgress: goalStats.averageProgress,
    totalFocusTime: pomodoroStats.totalWorkTime || 0,
    activeHabits: habitStats.totalHabits || 0,
    activeGoals: goalStats.activeGoals || 0
  };
};

/**
 * 获取近期趋势
 */
const getRecentTrends = async (startDate, endDate, userId) => {
  // 获取前一个周期的数据进行对比
  const periodDays = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
  const previousStartDate = dayjs(startDate).subtract(periodDays, 'day').format('YYYY-MM-DD');
  const previousEndDate = dayjs(startDate).subtract(1, 'day').format('YYYY-MM-DD');
  
  const currentStats = await getKeyMetrics(startDate, endDate, userId);
  const previousStats = await getKeyMetrics(previousStartDate, previousEndDate, userId);
  
  return {
    productivityTrend: calculateTrend(currentStats.productivityScore, previousStats.productivityScore),
    taskTrend: calculateTrend(currentStats.taskCompletionRate, previousStats.taskCompletionRate),
    habitTrend: calculateTrend(currentStats.habitCompletionRate, previousStats.habitCompletionRate),
    focusTrend: calculateTrend(currentStats.focusEfficiency, previousStats.focusEfficiency),
    goalTrend: calculateTrend(currentStats.goalProgress, previousStats.goalProgress)
  };
};

/**
 * 获取今日统计
 */
const getTodayStats = async (userId) => {
  const today = dayjs().format('YYYY-MM-DD');
  return await getKeyMetrics(today, today, userId);
};

/**
 * 获取本周对比
 */
const getWeekComparison = async (startDate, endDate, userId) => {
  const weekStart = dayjs().startOf('week').format('YYYY-MM-DD');
  const weekEnd = dayjs().endOf('week').format('YYYY-MM-DD');
  const lastWeekStart = dayjs().subtract(1, 'week').startOf('week').format('YYYY-MM-DD');
  const lastWeekEnd = dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DD');
  
  const thisWeek = await getKeyMetrics(weekStart, weekEnd, userId);
  const lastWeek = await getKeyMetrics(lastWeekStart, lastWeekEnd, userId);
  
  return {
    thisWeek,
    lastWeek,
    improvement: {
      productivity: calculateTrend(thisWeek.productivityScore, lastWeek.productivityScore),
      tasks: calculateTrend(thisWeek.taskCompletionRate, lastWeek.taskCompletionRate),
      habits: calculateTrend(thisWeek.habitCompletionRate, lastWeek.habitCompletionRate),
      focus: calculateTrend(thisWeek.focusEfficiency, lastWeek.focusEfficiency)
    }
  };
};

/**
 * 获取生产力趋势
 */
const getProductivityTrends = async (startDate, endDate, userId) => {
  const sql = `
    SELECT 
      DATE(date) as date,
      (SELECT AVG(CASE WHEN status = 'done' THEN 100 ELSE 0 END) 
       FROM task 
       WHERE DATE(updatedAt) = DATE(date) 
         ${userId ? 'AND userId = ?' : ''}) as taskScore,
      (SELECT AVG(CASE WHEN isCompleted = 1 THEN 100 ELSE 0 END) 
       FROM habit_completion hc 
       JOIN habit h ON hc.habitId = h.id 
       WHERE hc.date = DATE(date)
         ${userId ? 'AND h.userId = ?' : ''}) as habitScore,
      (SELECT AVG(CASE WHEN productivity IS NOT NULL THEN 
        CASE productivity 
          WHEN 'very_low' THEN 20 
          WHEN 'low' THEN 40 
          WHEN 'medium' THEN 60 
          WHEN 'high' THEN 80 
          WHEN 'very_high' THEN 100 
        END 
      END) 
       FROM pomodoro_session 
       WHERE DATE(startTime) = DATE(date)
         ${userId ? 'AND userId = ?' : ''}) as pomodoroScore
    FROM (
      SELECT DATE(?) + INTERVAL seq.seq DAY as date
      FROM (
        SELECT 0 as seq UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6
        UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13
        UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20
        UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25 UNION SELECT 26 UNION SELECT 27
        UNION SELECT 28 UNION SELECT 29 UNION SELECT 30
      ) seq
      WHERE DATE(?) + INTERVAL seq.seq DAY <= DATE(?)
    ) dates
    ORDER BY date
  `;
  
  const params = [startDate, endDate];
  if (userId) {
    params.push(userId, userId, userId);
  }
  
  return await execSql(sql, params);
};

// 辅助函数 - 计算趋势
const calculateTrend = (current, previous) => {
  if (!current || !previous) return 'stable';
  
  const currentVal = parseFloat(current);
  const previousVal = parseFloat(previous);
  const change = ((currentVal - previousVal) / previousVal) * 100;
  
  if (change > 5) return 'improving';
  if (change < -5) return 'declining';
  return 'stable';
};

export default {
  getTaskStatistics,
  getHabitStatistics,
  getPomodoroStatistics,
  getGoalStatistics,
  getHabitOverview,
  getHabitCompletionTrends,
  getHabitCategoryStats,
  getHabitStreakStats,
  getHabitHeatmapData,
  getGoalOverview,
  getGoalProgressTrends,
  getGoalTimeDeviation,
  getGoalMilestoneStats,
  getGoalReviewStats,
  getGoalCategoryStats,
  getPomodoroTimeAnalysis,
  getFocusTimeDistribution,
  getEfficiencyTrends,
  getInterruptionAnalysis,
  getOptimalWorkingHours,
  getTaskOverview,
  getTaskCompletionTrends,
  getTaskPriorityAnalysis,
  getTaskTagStats,
  getTaskOverdueAnalysis,
  getPomodoroSessionStats,
  getPomodoroProductivityTrends,
  getPomodoroMoodEnergyAnalysis,
  getPomodoroFocusAnalysis,
  getPomodoroTaskIntegration,
  getKeyMetrics,
  getRecentTrends,
  getTodayStats,
  getWeekComparison,
  getProductivityTrends
};
