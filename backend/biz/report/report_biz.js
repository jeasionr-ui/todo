import reportDb from '../../db/report/report_db.js';
import dayjs from 'dayjs';

/**
 * 获取个人生产力分析报表
 * @param {Object} params - 查询参数
 * @returns {Object} 生产力分析数据
 */
const getProductivityReport = async (params) => {
  const { startDate, endDate, userId } = params;

  try {
    // 获取任务完成情况
    const taskStats = await reportDb.getTaskStatistics(startDate, endDate, userId);
    
    // 获取习惯完成情况
    const habitStats = await reportDb.getHabitStatistics(startDate, endDate, userId);
    
    // 获取番茄钟专注时间
    const pomodoroStats = await reportDb.getPomodoroStatistics(startDate, endDate, userId);
    
    // 获取目标进展情况
    const goalStats = await reportDb.getGoalStatistics(startDate, endDate, userId);

    // 计算生产力指标
    const productivityMetrics = calculateProductivityMetrics({
      taskStats,
      habitStats,
      pomodoroStats,
      goalStats
    });

    return {
      period: {
        startDate,
        endDate,
        days: dayjs(endDate).diff(dayjs(startDate), 'day') + 1
      },
      metrics: productivityMetrics,
      taskStats,
      habitStats,
      pomodoroStats,
      goalStats,
      trends: await getProductivityTrends(startDate, endDate, userId)
    };
  } catch (error) {
    throw new Error(`获取生产力报表失败: ${error.message}`);
  }
};

/**
 * 获取习惯养成趋势分析报表
 * @param {Object} params - 查询参数
 * @returns {Object} 习惯分析数据
 */
const getHabitReport = async (params) => {
  const { startDate, endDate, userId, habitId } = params;

  try {
    // 获取习惯基本统计
    const habitOverview = await reportDb.getHabitOverview(startDate, endDate, userId, habitId);
    
    // 获取习惯完成趋势
    const completionTrends = await reportDb.getHabitCompletionTrends(startDate, endDate, userId, habitId);
    
    // 获取习惯分类统计
    const categoryStats = await reportDb.getHabitCategoryStats(startDate, endDate, userId);
    
    // 获取连续完成记录
    const streakStats = await reportDb.getHabitStreakStats(startDate, endDate, userId, habitId);
    
    // 获取习惯完成热力图数据
    const heatmapData = await reportDb.getHabitHeatmapData(startDate, endDate, userId, habitId);

    return {
      period: {
        startDate,
        endDate,
        days: dayjs(endDate).diff(dayjs(startDate), 'day') + 1
      },
      overview: habitOverview,
      trends: completionTrends,
      categoryStats,
      streakStats,
      heatmapData,
      insights: generateHabitInsights(habitOverview, streakStats)
    };
  } catch (error) {
    throw new Error(`获取习惯报表失败: ${error.message}`);
  }
};

/**
 * 获取目标完成率与偏差分析报表
 * @param {Object} params - 查询参数
 * @returns {Object} 目标分析数据
 */
const getGoalReport = async (params) => {
  const { startDate, endDate, userId, goalId } = params;

  try {
    // 获取目标概览统计
    const goalOverview = await reportDb.getGoalOverview(startDate, endDate, userId, goalId);
    
    // 获取目标进度趋势
    const progressTrends = await reportDb.getGoalProgressTrends(startDate, endDate, userId, goalId);
    
    // 获取目标时间偏差分析
    const timeDeviationAnalysis = await reportDb.getGoalTimeDeviation(startDate, endDate, userId, goalId);
    
    // 获取里程碑完成情况
    const milestoneStats = await reportDb.getGoalMilestoneStats(startDate, endDate, userId, goalId);
    
    // 获取目标回顾分析
    const reviewStats = await reportDb.getGoalReviewStats(startDate, endDate, userId, goalId);
    
    // 获取目标分类统计
    const categoryStats = await reportDb.getGoalCategoryStats(startDate, endDate, userId);

    return {
      period: {
        startDate,
        endDate,
        days: dayjs(endDate).diff(dayjs(startDate), 'day') + 1
      },
      overview: goalOverview,
      progressTrends,
      timeDeviation: timeDeviationAnalysis,
      milestoneStats,
      reviewStats,
      categoryStats,
      insights: generateGoalInsights(goalOverview, timeDeviationAnalysis, reviewStats)
    };
  } catch (error) {
    throw new Error(`获取目标报表失败: ${error.message}`);
  }
};

/**
 * 获取时间利用效率报表
 * @param {Object} params - 查询参数
 * @returns {Object} 时间效率分析数据
 */
const getTimeEfficiencyReport = async (params) => {
  const { startDate, endDate, userId } = params;

  try {
    // 获取番茄钟时间统计
    const pomodoroTimeStats = await reportDb.getPomodoroTimeAnalysis(startDate, endDate, userId);
    
    // 获取专注时间分布
    const focusTimeDistribution = await reportDb.getFocusTimeDistribution(startDate, endDate, userId);
    
    // 获取效率评级趋势
    const efficiencyTrends = await reportDb.getEfficiencyTrends(startDate, endDate, userId);
    
    // 获取中断分析
    const interruptionAnalysis = await reportDb.getInterruptionAnalysis(startDate, endDate, userId);
    
    // 获取最佳工作时段分析
    const optimalWorkingHours = await reportDb.getOptimalWorkingHours(startDate, endDate, userId);

    return {
      period: {
        startDate,
        endDate,
        days: dayjs(endDate).diff(dayjs(startDate), 'day') + 1
      },
      timeStats: pomodoroTimeStats,
      focusDistribution: focusTimeDistribution,
      efficiencyTrends,
      interruptionAnalysis,
      optimalWorkingHours,
      insights: generateTimeEfficiencyInsights(pomodoroTimeStats, efficiencyTrends, interruptionAnalysis)
    };
  } catch (error) {
    throw new Error(`获取时间效率报表失败: ${error.message}`);
  }
};

/**
 * 获取任务管理分析报表
 * @param {Object} params - 查询参数
 * @returns {Object} 任务分析数据
 */
const getTaskReport = async (params) => {
  const { startDate, endDate, userId } = params;

  try {
    // 获取任务概览统计
    const taskOverview = await reportDb.getTaskOverview(startDate, endDate, userId);
    
    // 获取任务完成趋势
    const completionTrends = await reportDb.getTaskCompletionTrends(startDate, endDate, userId);
    
    // 获取任务优先级分析
    const priorityAnalysis = await reportDb.getTaskPriorityAnalysis(startDate, endDate, userId);
    
    // 获取任务标签统计
    const tagStats = await reportDb.getTaskTagStats(startDate, endDate, userId);
    
    // 获取逾期任务分析
    const overdueAnalysis = await reportDb.getTaskOverdueAnalysis(startDate, endDate, userId);

    return {
      period: {
        startDate,
        endDate,
        days: dayjs(endDate).diff(dayjs(startDate), 'day') + 1
      },
      overview: taskOverview,
      trends: completionTrends,
      priorityAnalysis,
      tagStats,
      overdueAnalysis,
      insights: generateTaskInsights(taskOverview, priorityAnalysis, overdueAnalysis)
    };
  } catch (error) {
    throw new Error(`获取任务报表失败: ${error.message}`);
  }
};

/**
 * 获取番茄钟统计分析报表
 * @param {Object} params - 查询参数
 * @returns {Object} 番茄钟分析数据
 */
const getPomodoroReport = async (params) => {
  const { startDate, endDate, userId } = params;

  try {
    // 获取番茄钟会话统计
    const sessionStats = await reportDb.getPomodoroSessionStats(startDate, endDate, userId);
    
    // 获取生产力评级趋势
    const productivityTrends = await reportDb.getPomodoroProductivityTrends(startDate, endDate, userId);
    
    // 获取心情和精力状态分析
    const moodEnergyAnalysis = await reportDb.getPomodoroMoodEnergyAnalysis(startDate, endDate, userId);
    
    // 获取专注时长分析
    const focusAnalysis = await reportDb.getPomodoroFocusAnalysis(startDate, endDate, userId);
    
    // 获取番茄钟与任务关联分析
    const taskIntegrationStats = await reportDb.getPomodoroTaskIntegration(startDate, endDate, userId);

    return {
      period: {
        startDate,
        endDate,
        days: dayjs(endDate).diff(dayjs(startDate), 'day') + 1
      },
      sessionStats,
      productivityTrends,
      moodEnergyAnalysis,
      focusAnalysis,
      taskIntegrationStats,
      insights: generatePomodoroInsights(sessionStats, productivityTrends, moodEnergyAnalysis)
    };
  } catch (error) {
    throw new Error(`获取番茄钟报表失败: ${error.message}`);
  }
};

/**
 * 获取综合分析报表（仪表板）
 * @param {Object} params - 查询参数
 * @returns {Object} 仪表板数据
 */
const getDashboardReport = async (params) => {
  const { startDate, endDate, userId } = params;

  try {
    // 获取关键指标概览
    const keyMetrics = await reportDb.getKeyMetrics(startDate, endDate, userId);
    
    // 获取近期趋势
    const recentTrends = await reportDb.getRecentTrends(startDate, endDate, userId);
    
    // 获取今日统计
    const todayStats = await reportDb.getTodayStats(userId);
    
    // 获取本周对比
    const weekComparison = await reportDb.getWeekComparison(startDate, endDate, userId);
    
    // 获取推荐建议
    const recommendations = await generateRecommendations(keyMetrics, recentTrends, userId);

    return {
      period: {
        startDate,
        endDate,
        days: dayjs(endDate).diff(dayjs(startDate), 'day') + 1
      },
      keyMetrics,
      recentTrends,
      todayStats,
      weekComparison,
      recommendations,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`获取仪表板报表失败: ${error.message}`);
  }
};

/**
 * 导出报表数据
 * @param {Object} params - 导出参数
 * @returns {Object} 导出结果
 */
const exportReport = async (params) => {
  const { reportType, startDate, endDate, userId, format } = params;

  try {
    let reportData;

    // 根据报表类型获取数据
    switch (reportType) {
      case 'productivity':
        reportData = await getProductivityReport({ startDate, endDate, userId });
        break;
      case 'habits':
        reportData = await getHabitReport({ startDate, endDate, userId });
        break;
      case 'goals':
        reportData = await getGoalReport({ startDate, endDate, userId });
        break;
      case 'time-efficiency':
        reportData = await getTimeEfficiencyReport({ startDate, endDate, userId });
        break;
      case 'tasks':
        reportData = await getTaskReport({ startDate, endDate, userId });
        break;
      case 'pomodoro':
        reportData = await getPomodoroReport({ startDate, endDate, userId });
        break;
      case 'dashboard':
        reportData = await getDashboardReport({ startDate, endDate, userId });
        break;
      default:
        throw new Error(`不支持的报表类型: ${reportType}`);
    }

    // 根据格式处理数据
    let exportData;
    const filename = `${reportType}_report_${startDate}_${endDate}`;

    switch (format) {
      case 'json':
        exportData = {
          type: 'json',
          filename: `${filename}.json`,
          data: JSON.stringify(reportData, null, 2)
        };
        break;
      case 'csv':
        exportData = {
          type: 'csv',
          filename: `${filename}.csv`,
          data: await convertToCSV(reportData, reportType)
        };
        break;
      default:
        exportData = {
          type: 'json',
          filename: `${filename}.json`,
          data: JSON.stringify(reportData, null, 2)
        };
    }

    return {
      success: true,
      exportData,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`导出报表失败: ${error.message}`);
  }
};

// 辅助函数 - 计算生产力指标
const calculateProductivityMetrics = (data) => {
  const { taskStats, habitStats, pomodoroStats, goalStats } = data;

  return {
    overallScore: calculateOverallProductivityScore(data),
    taskCompletionRate: taskStats.completionRate || 0,
    habitCompletionRate: habitStats.completionRate || 0,
    focusEfficiency: pomodoroStats.efficiency || 0,
    goalProgress: goalStats.averageProgress || 0,
    timeUtilization: pomodoroStats.timeUtilization || 0
  };
};

// 辅助函数 - 计算总体生产力分数
const calculateOverallProductivityScore = (data) => {
  const weights = {
    tasks: 0.25,
    habits: 0.25,
    pomodoro: 0.25,
    goals: 0.25
  };

  const scores = {
    tasks: data.taskStats.completionRate || 0,
    habits: data.habitStats.completionRate || 0,
    pomodoro: data.pomodoroStats.efficiency || 0,
    goals: data.goalStats.averageProgress || 0
  };

  return Object.keys(weights).reduce((total, key) => {
    return total + (scores[key] * weights[key]);
  }, 0);
};

// 辅助函数 - 获取生产力趋势
const getProductivityTrends = async (startDate, endDate, userId) => {
  // 这里实现趋势计算逻辑
  return await reportDb.getProductivityTrends(startDate, endDate, userId);
};

// 辅助函数 - 生成习惯洞察
const generateHabitInsights = (overview, streakStats) => {
  const insights = [];

  if (overview.completionRate > 80) {
    insights.push({
      type: 'positive',
      message: '习惯完成率表现优秀，请继续保持！',
      suggestion: '可以考虑增加新的习惯挑战。'
    });
  } else if (overview.completionRate < 50) {
    insights.push({
      type: 'warning',
      message: '习惯完成率偏低，需要关注。',
      suggestion: '建议简化习惯难度或减少习惯数量，专注核心习惯。'
    });
  }

  if (streakStats.maxStreak > 7) {
    insights.push({
      type: 'achievement',
      message: `恭喜！您的最长连续完成记录达到了${streakStats.maxStreak}天。`,
      suggestion: '继续努力，挑战更长的连续记录！'
    });
  }

  return insights;
};

// 辅助函数 - 生成目标洞察
const generateGoalInsights = (overview, timeDeviation, reviewStats) => {
  const insights = [];

  if (overview.onTimeCompletionRate > 80) {
    insights.push({
      type: 'positive',
      message: '目标按时完成率很高，时间规划能力优秀！',
      suggestion: '可以尝试设定更具挑战性的目标。'
    });
  }

  if (timeDeviation.averageDelay > 7) {
    insights.push({
      type: 'warning',
      message: `目标平均延期${timeDeviation.averageDelay}天，时间预估需要改进。`,
      suggestion: '建议在设定目标时留出更多缓冲时间。'
    });
  }

  if (reviewStats.averageRating < 3) {
    insights.push({
      type: 'warning',
      message: '目标满意度偏低，需要审视目标设定是否合理。',
      suggestion: '考虑调整目标难度或分解为更小的子目标。'
    });
  }

  return insights;
};

// 辅助函数 - 生成时间效率洞察
const generateTimeEfficiencyInsights = (timeStats, efficiencyTrends, interruptionAnalysis) => {
  const insights = [];

  if (timeStats.averageFocusTime > 20) {
    insights.push({
      type: 'positive',
      message: '平均专注时间表现良好，专注能力较强。',
      suggestion: '可以尝试延长单次专注时间以提高效率。'
    });
  }

  if (interruptionAnalysis.averageInterruptions > 3) {
    insights.push({
      type: 'warning',
      message: '中断次数较多，影响专注效果。',
      suggestion: '建议优化工作环境，减少外部干扰。'
    });
  }

  return insights;
};

// 辅助函数 - 生成任务洞察
const generateTaskInsights = (overview, priorityAnalysis, overdueAnalysis) => {
  const insights = [];

  if (overview.completionRate > 80) {
    insights.push({
      type: 'positive',
      message: '任务完成率很高，执行力很强！',
      suggestion: '可以考虑承担更多具挑战性的任务。'
    });
  }

  if (overdueAnalysis.overdueRate > 20) {
    insights.push({
      type: 'warning',
      message: '逾期任务比例较高，需要改善时间管理。',
      suggestion: '建议合理设置任务截止日期，优先处理高优先级任务。'
    });
  }

  return insights;
};

// 辅助函数 - 生成番茄钟洞察
const generatePomodoroInsights = (sessionStats, productivityTrends, moodEnergyAnalysis) => {
  const insights = [];

  if (sessionStats.completionRate > 80) {
    insights.push({
      type: 'positive',
      message: '番茄钟完成率很高，时间管理能力优秀！',
      suggestion: '保持当前的工作节奏。'
    });
  }

  if (moodEnergyAnalysis.averageMood < 3) {
    insights.push({
      type: 'warning',
      message: '工作时心情状态偏低，需要关注工作状态。',
      suggestion: '建议适当调整工作强度，注意休息和放松。'
    });
  }

  return insights;
};

// 辅助函数 - 生成推荐建议
const generateRecommendations = async (keyMetrics, recentTrends, userId) => {
  const recommendations = [];

  // 基于关键指标生成建议
  if (keyMetrics.productivityScore < 60) {
    recommendations.push({
      type: 'improvement',
      priority: 'high',
      title: '提升整体生产力',
      description: '您的生产力评分偏低，建议重点关注任务完成和时间管理。',
      actions: [
        '使用番茄钟技术提高专注度',
        '优先处理高优先级任务',
        '简化习惯目标，专注核心习惯'
      ]
    });
  }

  if (recentTrends.habitTrend === 'declining') {
    recommendations.push({
      type: 'habit',
      priority: 'medium',
      title: '改善习惯养成',
      description: '近期习惯完成情况有下降趋势。',
      actions: [
        '审视当前习惯是否过于困难',
        '考虑减少习惯数量',
        '设置习惯提醒'
      ]
    });
  }

  return recommendations;
};

// 辅助函数 - 转换为CSV格式
const convertToCSV = async (data, reportType) => {
  // 这里实现CSV转换逻辑
  // 根据不同的报表类型生成对应的CSV格式
  return '暂不支持CSV导出'; // 占位符
};

export default {
  getProductivityReport,
  getHabitReport,
  getGoalReport,
  getTimeEfficiencyReport,
  getTaskReport,
  getPomodoroReport,
  getDashboardReport,
  exportReport
};
