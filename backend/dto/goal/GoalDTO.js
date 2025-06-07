import { Goal, GoalMilestone, GoalReview } from '../../entity/goal/GoalType.js';

/**
 * 目标数据传输对象类
 */
class GoalDTO {
  constructor(goal) {
    this.id = goal.id;
    this.title = goal.title;
    this.description = goal.description;
    this.category = goal.category;
    this.status = goal.status;
    this.priority = goal.priority;
    this.startDate = goal.startDate;
    this.targetDate = goal.targetDate;
    this.actualCompletionDate = goal.actualCompletionDate;
    this.progress = goal.progress;
    this.progressPercentage = goal.progress || 0; // 添加进度百分比属性
    this.parentGoalId = goal.parentGoalId;
    this.tags = goal.tags;
    this.color = goal.color;
    this.icon = goal.icon;
    this.isArchived = goal.isArchived;
    this.createdAt = goal.createdAt;
    this.updatedAt = goal.updatedAt;
    
    // 关联数据
    this.milestones = goal.milestones || [];
    this.tasks = goal.tasks || [];
    this.subGoals = goal.subGoals || [];
    this.reviews = goal.reviews || [];
    
    // 计算属性
    this.isOverdue = goal.isOverdue ? goal.isOverdue() : false;
    this.daysRemaining = goal.getDaysRemaining ? goal.getDaysRemaining() : null;
  }

  /**
   * 从原始数据创建DTO实例
   */
  static fromRawData(data) {
    const goal = Goal.fromDatabaseFormat(data);
    return new GoalDTO(goal);
  }

  /**
   * 创建简化版本（用于列表显示）
   */
  toSummary() {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
      status: this.status,
      priority: this.priority,
      progress: this.progress,
      progressPercentage: this.progressPercentage,
      targetDate: this.targetDate,
      color: this.color,
      icon: this.icon,
      isOverdue: this.isOverdue,
      daysRemaining: this.daysRemaining,
      subGoalsCount: this.subGoals.length,
      tasksCount: this.tasks.length,
      milestonesCount: this.milestones.length
    };
  }
}

/**
 * 目标里程碑数据传输对象类
 */
class GoalMilestoneDTO {
  constructor(milestone) {
    this.id = milestone.id;
    this.goalId = milestone.goalId;
    this.title = milestone.title;
    this.description = milestone.description;
    this.targetDate = milestone.targetDate;
    this.isCompleted = milestone.isCompleted;
    this.completedAt = milestone.completedAt;
    this.sortOrder = milestone.sortOrder;
    this.createdAt = milestone.createdAt;
    this.updatedAt = milestone.updatedAt;
  }

  /**
   * 从原始数据创建DTO实例
   */
  static fromRawData(data) {
    const milestone = GoalMilestone.fromDatabaseFormat(data);
    return new GoalMilestoneDTO(milestone);
  }
}

/**
 * 目标回顾数据传输对象类
 */
class GoalReviewDTO {
  constructor(review) {
    this.id = review.id;
    this.goalId = review.goalId;
    this.reviewDate = review.reviewDate;
    this.reviewType = review.reviewType;
    this.progress = review.progress;
    this.achievements = review.achievements;
    this.challenges = review.challenges;
    this.improvements = review.improvements;
    this.nextSteps = review.nextSteps;
    this.mood = review.mood;
    this.rating = review.rating;
    this.createdAt = review.createdAt;
    this.updatedAt = review.updatedAt;
  }

  /**
   * 从原始数据创建DTO实例
   */
  static fromRawData(data) {
    const review = GoalReview.fromDatabaseFormat(data);
    return new GoalReviewDTO(review);
  }

  /**
   * 验证和更新评价数据
   */
  static validateAndUpdateReview(updateData, existingReview) {
    const errors = [];
    
    // 创建更新后的评价对象
    const updatedReview = new GoalReview(existingReview);
    
    // 更新字段
    if (updateData.reviewDate !== undefined) {
      if (!updateData.reviewDate) {
        errors.push('评价日期不能为空');
      } else {
        updatedReview.reviewDate = updateData.reviewDate;
      }
    }
    
    if (updateData.reviewType !== undefined) {
      if (!['daily', 'weekly', 'monthly', 'quarterly', 'custom'].includes(updateData.reviewType)) {
        errors.push('评价类型无效');
      } else {
        updatedReview.reviewType = updateData.reviewType;
      }
    }
    
    if (updateData.progress !== undefined) {
      const progress = parseFloat(updateData.progress);
      if (isNaN(progress) || progress < 0 || progress > 100) {
        errors.push('进度必须是0-100之间的数字');
      } else {
        updatedReview.progress = progress;
      }
    }
    
    if (updateData.achievements !== undefined) {
      updatedReview.achievements = updateData.achievements || '';
    }
    
    if (updateData.challenges !== undefined) {
      updatedReview.challenges = updateData.challenges || '';
    }
    
    if (updateData.improvements !== undefined) {
      updatedReview.improvements = updateData.improvements || '';
    }
    
    if (updateData.nextSteps !== undefined) {
      updatedReview.nextSteps = updateData.nextSteps || '';
    }
    
    if (updateData.mood !== undefined) {
      if (updateData.mood && !['very_bad', 'bad', 'neutral', 'good', 'very_good'].includes(updateData.mood)) {
        errors.push('心情状态无效');
      } else {
        updatedReview.mood = updateData.mood;
      }
    }
    
    if (updateData.rating !== undefined) {
      if (updateData.rating !== null) {
        const rating = parseInt(updateData.rating);
        if (isNaN(rating) || rating < 1 || rating > 5) {
          errors.push('评分必须是1-5之间的整数');
        } else {
          updatedReview.rating = rating;
        }
      } else {
        updatedReview.rating = null;
      }
    }
    
    return {
      review: updatedReview,
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

/**
 * 目标统计数据传输对象类
 */
class GoalStatsDTO {
  constructor(stats) {
    this.totalGoals = stats.totalGoals || 0;
    this.activeGoals = stats.activeGoals || 0;
    this.completedGoals = stats.completedGoals || 0;
    this.pausedGoals = stats.pausedGoals || 0;
    this.overdueGoals = stats.overdueGoals || 0;
    this.averageProgress = stats.averageProgress || 0;
    this.completionRate = stats.completionRate || 0;
    this.categoryStats = stats.categoryStats || [];
    this.priorityStats = stats.priorityStats || [];
    this.monthlyProgress = stats.monthlyProgress || [];
  }
}

export { GoalDTO, GoalMilestoneDTO, GoalReviewDTO, GoalStatsDTO };
