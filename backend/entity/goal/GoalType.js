/**
 * 目标实体类
 */
class Goal {
  constructor() {
    this.id = null;
    this.title = '';
    this.description = '';
    this.category = '';
    this.status = 'draft'; // draft, active, completed, cancelled, paused
    this.priority = 'medium'; // low, medium, high, urgent
    this.startDate = null;
    this.targetDate = null;
    this.actualCompletionDate = null;
    this.progress = 0.00;
    this.parentGoalId = null;
    this.tags = [];
    this.color = '#3B82F6';
    this.icon = '🎯';
    this.isArchived = false;
    this.createdAt = null;
    this.updatedAt = null;
    this.milestones = [];
    this.tasks = [];
    this.subGoals = [];
    this.reviews = [];
  }

  /**
   * 转换为数据库存储格式
   */
  toDatabaseFormat() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      status: this.status,
      priority: this.priority,
      startDate: this.startDate,
      targetDate: this.targetDate,
      actualCompletionDate: this.actualCompletionDate,
      progress: this.progress,
      parentGoalId: this.parentGoalId,
      tags: Array.isArray(this.tags) ? this.tags.join(',') : this.tags,
      color: this.color,
      icon: this.icon,
      isArchived: this.isArchived,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 从数据库格式创建目标实例
   */
  static fromDatabaseFormat(data) {
    if (!data) return null;

    const goal = new Goal();
    goal.id = data.id;
    goal.title = data.title;
    goal.description = data.description;
    goal.category = data.category;
    goal.status = data.status;
    goal.priority = data.priority;
    goal.startDate = data.startDate;
    goal.targetDate = data.targetDate;
    goal.actualCompletionDate = data.actualCompletionDate;
    goal.progress = parseFloat(data.progress) || 0.00;
    goal.parentGoalId = data.parentGoalId;
    goal.tags = data.tags ? data.tags.split(',').filter(tag => tag.trim()) : [];
    goal.color = data.color;
    goal.icon = data.icon;
    goal.isArchived = data.isArchived;
    goal.createdAt = data.createdAt;
    goal.updatedAt = data.updatedAt;
    
    return goal;
  }

  /**
   * 计算目标完成度（基于子目标和任务）
   */
  calculateProgress() {
    if (this.subGoals.length > 0) {
      // 如果有子目标，基于子目标完成度计算
      const totalProgress = this.subGoals.reduce((sum, subGoal) => sum + subGoal.progress, 0);
      this.progress = Math.round((totalProgress / this.subGoals.length) * 100) / 100;
    } else if (this.tasks.length > 0) {
      // 如果有关联任务，基于任务完成度计算
      const completedTasks = this.tasks.filter(task => task.status === 'done').length;
      this.progress = Math.round((completedTasks / this.tasks.length * 100) * 100) / 100;
    }
    return this.progress;
  }

  /**
   * 检查目标是否逾期
   */
  isOverdue() {
    if (!this.targetDate || this.status === 'completed') {
      return false;
    }
    const today = new Date().toISOString().slice(0, 10);
    return this.targetDate < today;
  }

  /**
   * 获取目标剩余天数
   */
  getDaysRemaining() {
    if (!this.targetDate || this.status === 'completed') {
      return null;
    }
    const today = new Date();
    const target = new Date(this.targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}

/**
 * 目标里程碑实体类
 */
class GoalMilestone {
  constructor() {
    this.id = null;
    this.goalId = null;
    this.title = '';
    this.description = '';
    this.targetDate = null;
    this.isCompleted = false;
    this.completedAt = null;
    this.sortOrder = 0;
    this.createdAt = null;
    this.updatedAt = null;
  }

  /**
   * 转换为数据库存储格式
   */
  toDatabaseFormat() {
    return {
      id: this.id,
      goalId: this.goalId,
      title: this.title,
      description: this.description,
      targetDate: this.targetDate,
      isCompleted: this.isCompleted,
      completedAt: this.completedAt,
      sortOrder: this.sortOrder,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 从数据库格式创建里程碑实例
   */
  static fromDatabaseFormat(data) {
    if (!data) return null;

    const milestone = new GoalMilestone();
    milestone.id = data.id;
    milestone.goalId = data.goalId;
    milestone.title = data.title;
    milestone.description = data.description;
    milestone.targetDate = data.targetDate;
    milestone.isCompleted = data.isCompleted;
    milestone.completedAt = data.completedAt;
    milestone.sortOrder = data.sortOrder;
    milestone.createdAt = data.createdAt;
    milestone.updatedAt = data.updatedAt;
    
    return milestone;
  }
}

/**
 * 目标回顾实体类
 */
class GoalReview {
  constructor(data = {}) {
    this.id = data.id || null;
    this.goalId = data.goalId || null;
    this.reviewDate = data.reviewDate || null;
    this.reviewType = data.reviewType || 'weekly'; // daily, weekly, monthly, quarterly, custom
    this.progress = parseFloat(data.progress) || 0.00;
    this.achievements = data.achievements || '';
    this.challenges = data.challenges || '';
    this.improvements = data.improvements || '';
    this.nextSteps = data.nextSteps || '';
    this.mood = data.mood || 'neutral'; // very_bad, bad, neutral, good, very_good
    this.rating = data.rating || 3;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  /**
   * 转换为数据库存储格式
   */
  toDatabaseFormat() {
    return {
      id: this.id,
      goalId: this.goalId,
      reviewDate: this.reviewDate,
      reviewType: this.reviewType,
      progress: this.progress,
      achievements: this.achievements,
      challenges: this.challenges,
      improvements: this.improvements,
      nextSteps: this.nextSteps,
      mood: this.mood,
      rating: this.rating,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 从数据库格式创建回顾实例
   */
  static fromDatabaseFormat(data) {
    if (!data) return null;

    const review = new GoalReview();
    review.id = data.id;
    review.goalId = data.goalId;
    review.reviewDate = data.reviewDate;
    review.reviewType = data.reviewType;
    review.progress = parseFloat(data.progress) || 0.00;
    review.achievements = data.achievements;
    review.challenges = data.challenges;
    review.improvements = data.improvements;
    review.nextSteps = data.nextSteps;
    review.mood = data.mood;
    review.rating = data.rating;
    review.createdAt = data.createdAt;
    review.updatedAt = data.updatedAt;
    
    return review;
  }
}

export { Goal, GoalMilestone, GoalReview };
