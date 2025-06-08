/**
 * 报表数据传输对象
 */

/**
 * 生产力报表数据结构
 */
class ProductivityReportDTO {
  constructor(data) {
    this.period = data.period;
    this.metrics = data.metrics;
    this.taskStats = data.taskStats;
    this.habitStats = data.habitStats;
    this.pomodoroStats = data.pomodoroStats;
    this.goalStats = data.goalStats;
    this.trends = data.trends;
  }
}

/**
 * 习惯报表数据结构
 */
class HabitReportDTO {
  constructor(data) {
    this.period = data.period;
    this.overview = data.overview;
    this.trends = data.trends;
    this.categoryStats = data.categoryStats;
    this.streakStats = data.streakStats;
    this.heatmapData = data.heatmapData;
    this.insights = data.insights;
  }
}

/**
 * 目标报表数据结构
 */
class GoalReportDTO {
  constructor(data) {
    this.period = data.period;
    this.overview = data.overview;
    this.progressTrends = data.progressTrends;
    this.timeDeviation = data.timeDeviation;
    this.milestoneStats = data.milestoneStats;
    this.reviewStats = data.reviewStats;
    this.categoryStats = data.categoryStats;
    this.insights = data.insights;
  }
}

/**
 * 时间效率报表数据结构
 */
class TimeEfficiencyReportDTO {
  constructor(data) {
    this.period = data.period;
    this.timeStats = data.timeStats;
    this.focusDistribution = data.focusDistribution;
    this.efficiencyTrends = data.efficiencyTrends;
    this.interruptionAnalysis = data.interruptionAnalysis;
    this.optimalWorkingHours = data.optimalWorkingHours;
    this.insights = data.insights;
  }
}

/**
 * 任务报表数据结构
 */
class TaskReportDTO {
  constructor(data) {
    this.period = data.period;
    this.overview = data.overview;
    this.trends = data.trends;
    this.priorityAnalysis = data.priorityAnalysis;
    this.tagStats = data.tagStats;
    this.overdueAnalysis = data.overdueAnalysis;
    this.insights = data.insights;
  }
}

/**
 * 番茄钟报表数据结构
 */
class PomodoroReportDTO {
  constructor(data) {
    this.period = data.period;
    this.sessionStats = data.sessionStats;
    this.productivityTrends = data.productivityTrends;
    this.moodEnergyAnalysis = data.moodEnergyAnalysis;
    this.focusAnalysis = data.focusAnalysis;
    this.taskIntegrationStats = data.taskIntegrationStats;
    this.insights = data.insights;
  }
}

/**
 * 仪表板报表数据结构
 */
class DashboardReportDTO {
  constructor(data) {
    this.period = data.period;
    this.keyMetrics = data.keyMetrics;
    this.recentTrends = data.recentTrends;
    this.todayStats = data.todayStats;
    this.weekComparison = data.weekComparison;
    this.recommendations = data.recommendations;
    this.lastUpdated = data.lastUpdated;
  }
}

/**
 * 报表导出数据结构
 */
class ReportExportDTO {
  constructor(data) {
    this.success = data.success;
    this.exportData = data.exportData;
    this.generatedAt = data.generatedAt;
  }
}

/**
 * 关键指标数据结构
 */
class KeyMetricsDTO {
  constructor(data) {
    this.productivityScore = data.productivityScore;
    this.taskCompletionRate = data.taskCompletionRate;
    this.habitCompletionRate = data.habitCompletionRate;
    this.focusEfficiency = data.focusEfficiency;
    this.goalProgress = data.goalProgress;
    this.totalFocusTime = data.totalFocusTime;
    this.activeHabits = data.activeHabits;
    this.activeGoals = data.activeGoals;
  }
}

/**
 * 趋势数据结构
 */
class TrendDataDTO {
  constructor(data) {
    this.productivityTrend = data.productivityTrend;
    this.taskTrend = data.taskTrend;
    this.habitTrend = data.habitTrend;
    this.focusTrend = data.focusTrend;
    this.goalTrend = data.goalTrend;
  }
}

/**
 * 洞察建议数据结构
 */
class InsightDTO {
  constructor(data) {
    this.type = data.type; // 'positive', 'warning', 'achievement', 'improvement'
    this.message = data.message;
    this.suggestion = data.suggestion;
  }
}

/**
 * 推荐建议数据结构
 */
class RecommendationDTO {
  constructor(data) {
    this.type = data.type; // 'improvement', 'habit', 'goal', 'task', 'time'
    this.priority = data.priority; // 'high', 'medium', 'low'
    this.title = data.title;
    this.description = data.description;
    this.actions = data.actions; // Array of action items
  }
}

/**
 * 周期数据结构
 */
class PeriodDTO {
  constructor(data) {
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.days = data.days;
  }
}

/**
 * 统计数据基础结构
 */
class StatisticsBaseDTO {
  constructor(data) {
    this.total = data.total;
    this.completed = data.completed;
    this.completionRate = data.completionRate;
    this.average = data.average;
  }
}

/**
 * 任务统计数据结构
 */
class TaskStatisticsDTO extends StatisticsBaseDTO {
  constructor(data) {
    super(data);
    this.totalTasks = data.totalTasks;
    this.completedTasks = data.completedTasks;
    this.inProgressTasks = data.inProgressTasks;
    this.todoTasks = data.todoTasks;
    this.highPriorityTasks = data.highPriorityTasks;
    this.mediumPriorityTasks = data.mediumPriorityTasks;
    this.lowPriorityTasks = data.lowPriorityTasks;
    this.overdueTasks = data.overdueTasks;
    this.overdueRate = data.overdueRate;
  }
}

/**
 * 习惯统计数据结构
 */
class HabitStatisticsDTO extends StatisticsBaseDTO {
  constructor(data) {
    super(data);
    this.totalHabits = data.totalHabits;
    this.habitsWithCompletions = data.habitsWithCompletions;
    this.totalCompletions = data.totalCompletions;
    this.successfulCompletions = data.successfulCompletions;
    this.averageStreak = data.averageStreak;
    this.maxStreak = data.maxStreak;
    this.allTimeCompletions = data.allTimeCompletions;
    this.activeHabitsRate = data.activeHabitsRate;
  }
}

/**
 * 番茄钟统计数据结构
 */
class PomodoroStatisticsDTO extends StatisticsBaseDTO {
  constructor(data) {
    super(data);
    this.totalSessions = data.totalSessions;
    this.completedSessions = data.completedSessions;
    this.totalWorkTime = data.totalWorkTime;
    this.totalBreakTime = data.totalBreakTime;
    this.totalPauseTime = data.totalPauseTime;
    this.totalInterruptions = data.totalInterruptions;
    this.averageProductivity = data.averageProductivity;
    this.averageMood = data.averageMood;
    this.longestSession = data.longestSession;
    this.efficiency = data.efficiency;
    this.timeUtilization = data.timeUtilization;
  }
}

/**
 * 目标统计数据结构
 */
class GoalStatisticsDTO extends StatisticsBaseDTO {
  constructor(data) {
    super(data);
    this.totalGoals = data.totalGoals;
    this.completedGoals = data.completedGoals;
    this.activeGoals = data.activeGoals;
    this.cancelledGoals = data.cancelledGoals;
    this.averageProgress = data.averageProgress;
    this.onTimeCompletions = data.onTimeCompletions;
    this.lateCompletions = data.lateCompletions;
    this.onTimeCompletionRate = data.onTimeCompletionRate;
  }
}

/**
 * 分类统计数据结构
 */
class CategoryStatisticsDTO {
  constructor(data) {
    this.category = data.category;
    this.count = data.count;
    this.completionRate = data.completionRate;
    this.averageProgress = data.averageProgress;
  }
}

/**
 * 热力图数据结构
 */
class HeatmapDataDTO {
  constructor(data) {
    this.date = data.date;
    this.value = data.value;
    this.intensity = data.intensity;
    this.details = data.details;
  }
}

/**
 * 时间分布数据结构
 */
class TimeDistributionDTO {
  constructor(data) {
    this.hour = data.hour;
    this.sessionCount = data.sessionCount;
    this.totalDuration = data.totalDuration;
    this.averageProductivity = data.averageProductivity;
  }
}

module.exports = {
  ProductivityReportDTO,
  HabitReportDTO,
  GoalReportDTO,
  TimeEfficiencyReportDTO,
  TaskReportDTO,
  PomodoroReportDTO,
  DashboardReportDTO,
  ReportExportDTO,
  KeyMetricsDTO,
  TrendDataDTO,
  InsightDTO,
  RecommendationDTO,
  PeriodDTO,
  StatisticsBaseDTO,
  TaskStatisticsDTO,
  HabitStatisticsDTO,
  PomodoroStatisticsDTO,
  GoalStatisticsDTO,
  CategoryStatisticsDTO,
  HeatmapDataDTO,
  TimeDistributionDTO
};
