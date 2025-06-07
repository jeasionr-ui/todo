import axios from 'axios'
import type Goal from '@/services/types/GoalType'
import type {
  GoalMilestone,
  GoalReview,
  GoalStats,
  CreateGoalRequest,
  UpdateGoalRequest,
  CreateMilestoneRequest,
  UpdateMilestoneRequest,
  CreateReviewRequest,
  GoalFilters
} from '@/services/types/GoalType'

// 定义分页结果接口
export interface PaginationResult<T> {
  data: T[]
  pagination: {
    total: number
    pageSize: number
    currentPage: number
    totalPages: number
  }
}

const API_BASE = '/api/goals'

/**
 * 获取目标列表
 */
export const getGoals = async (filters?: GoalFilters): Promise<PaginationResult<Goal>> => {
  const params = new URLSearchParams()

  if (filters?.status) {
    params.append('status', filters.status)
  }
  if (filters?.category) {
    params.append('category', filters.category)
  }
  if (filters?.priority) {
    params.append('priority', filters.priority)
  }
  if (filters?.parentGoalId !== undefined) {
    params.append('parentGoalId', filters.parentGoalId || '')
  }
  if (filters?.search) {
    params.append('search', filters.search)
  }
  if (filters?.page) {
    params.append('page', filters.page.toString())
  }
  if (filters?.pageSize) {
    params.append('pageSize', filters.pageSize.toString())
  }

  const response = await axios.get(`${API_BASE}?${params.toString()}`)
  
  // 后端现在返回嵌套的pagination对象结构
  return {
    data: response.data.data,
    pagination: response.data.pagination
  }
}

/**
 * 获取目标详情
 */
export const getGoal = async (id: string): Promise<Goal> => {
  const response = await axios.get(`${API_BASE}/${id}`)
  return response.data.data
}

/**
 * 创建目标
 */
export const createGoal = async (goalData: CreateGoalRequest): Promise<Goal> => {
  const response = await axios.post(API_BASE, goalData)
  return response.data.data
}

/**
 * 更新目标
 */
export const updateGoal = async (id: string, goalData: UpdateGoalRequest): Promise<Goal> => {
  const response = await axios.put(`${API_BASE}/${id}`, goalData)
  return response.data.data
}

/**
 * 更新目标进度
 */
export const updateGoalProgress = async (id: string): Promise<Goal> => {
  const response = await axios.post(`${API_BASE}/${id}/update-progress`)
  return response.data.data
}

/**
 * 删除目标
 */
export const deleteGoal = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/${id}`)
}

/**
 * 获取目标统计
 */
export const getGoalStats = async (): Promise<GoalStats> => {
  const response = await axios.get(`${API_BASE}/statistics/overview`)
  return response.data.data
}

// 里程碑管理
/**
 * 获取目标的里程碑列表
 */
export const getGoalMilestones = async (goalId: string): Promise<GoalMilestone[]> => {
  const response = await axios.get(`${API_BASE}/${goalId}/milestones`)
  return response.data.data
}

/**
 * 创建里程碑
 */
export const createMilestone = async (goalId: string, milestoneData: CreateMilestoneRequest): Promise<GoalMilestone> => {
  const response = await axios.post(`${API_BASE}/${goalId}/milestones`, milestoneData)
  return response.data.data
}

/**
 * 更新里程碑
 */
export const updateMilestone = async (goalId: string, milestoneId: string, milestoneData: UpdateMilestoneRequest): Promise<GoalMilestone> => {
  const response = await axios.put(`${API_BASE}/milestones/${milestoneId}`, milestoneData)
  return response.data.data
}

/**
 * 删除里程碑
 */
export const deleteMilestone = async (goalId: string, milestoneId: string): Promise<void> => {
  await axios.delete(`${API_BASE}/milestones/${milestoneId}`)
}

// 目标回顾管理
/**
 * 获取目标的回顾列表
 */
export const getGoalReviews = async (goalId: string): Promise<GoalReview[]> => {
  const response = await axios.get(`${API_BASE}/${goalId}/reviews`)
  return response.data.data
}

/**
 * 创建回顾
 */
export const createReview = async (goalId: string, reviewData: CreateReviewRequest): Promise<GoalReview> => {
  const response = await axios.post(`${API_BASE}/${goalId}/reviews`, reviewData)
  return response.data.data
}

/**
 * 更新回顾
 */
export const updateReview = async (goalId: string, reviewId: string, reviewData: Partial<CreateReviewRequest>): Promise<GoalReview> => {
  const response = await axios.put(`${API_BASE}/${goalId}/reviews/${reviewId}`, reviewData)
  return response.data.data
}

/**
 * 删除回顾
 */
export const deleteReview = async (goalId: string, reviewId: string): Promise<void> => {
  await axios.delete(`${API_BASE}/${goalId}/reviews/${reviewId}`)
}

// 任务关联管理
/**
 * 关联任务到目标
 */
export const associateTask = async (goalId: string, taskId: string): Promise<void> => {
  await axios.post(`${API_BASE}/${goalId}/tasks`, { taskId })
}

/**
 * 取消任务关联
 */
export const dissociateTask = async (goalId: string, taskId: string): Promise<void> => {
  await axios.delete(`${API_BASE}/${goalId}/tasks/${taskId}`)
}

/**
 * 获取目标的关联任务
 */
export const getGoalTasks = async (goalId: string): Promise<Array<{ id: string, name: string, status: string }>> => {
  const response = await axios.get(`${API_BASE}/${goalId}/tasks`)
  return response.data.data
}

// 导出服务对象
export const goalService = {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  getGoalStats,
  getGoalMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  getGoalReviews,
  createReview,
  updateReview,
  deleteReview,
  associateTask,
  dissociateTask,
  getGoalTasks,
  updateGoalProgress
}
