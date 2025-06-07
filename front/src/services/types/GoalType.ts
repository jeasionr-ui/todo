// 目标数据类型定义

export interface Goal {
  id: string
  title: string
  description: string | null
  category: string
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
  priority: 'high' | 'medium' | 'low'
  startDate: string | null
  targetDate: string | null
  completedDate: string | null
  progressPercentage: number
  parentGoalId: string | null
  userId: string
  createdAt: string
  updatedAt: string | null
  milestones?: GoalMilestone[]
  reviews?: GoalReview[]
  childGoals?: Goal[]
  associatedTasks?: Array<{
    id: string
    name: string
    status: string
  }>
}

export interface GoalMilestone {
  id: string
  goalId: string
  title: string
  description: string | null
  targetDate: string | null
  isCompleted: boolean
  completedDate: string | null
  order: number
  createdAt: string
  updatedAt: string | null
}

export interface GoalReview {
  id: string
  goalId: string
  reviewDate: string
  reviewType: 'weekly' | 'monthly' | 'quarterly' | 'custom'
  content: string
  rating: number
  lessonsLearned: string | null
  nextSteps: string | null
  createdAt: string
  updatedAt: string | null
}

export interface GoalStats {
  totalGoals: number
  activeGoals: number
  completedGoals: number
  averageProgress: number
  upcomingDeadlines: Array<{
    goalId: string
    title: string
    targetDate: string
    daysRemaining: number
  }>
  categoryStats: Array<{
    category: string
    count: number
    completionRate: number
  }>
}

export interface CreateGoalRequest {
  title: string
  description?: string
  category: string
  priority: 'high' | 'medium' | 'low'
  startDate?: string
  targetDate?: string
  parentGoalId?: string
}

export interface UpdateGoalRequest {
  title?: string
  description?: string
  category?: string
  status?: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
  priority?: 'high' | 'medium' | 'low'
  startDate?: string
  targetDate?: string
  progressPercentage?: number
}

export interface CreateMilestoneRequest {
  title: string
  description?: string
  targetDate?: string
  order: number
}

export interface UpdateMilestoneRequest {
  title?: string
  description?: string
  targetDate?: string
  isCompleted?: boolean
  order?: number
}

export interface CreateReviewRequest {
  reviewDate: string
  reviewType: 'weekly' | 'monthly' | 'quarterly' | 'custom'
  content: string
  rating: number
  lessonsLearned?: string
  nextSteps?: string
}

export interface GoalFilters {
  status?: string
  category?: string
  priority?: string
  parentGoalId?: string | null
  search?: string
  page?: number
  pageSize?: number
}

export type { Goal as default }
