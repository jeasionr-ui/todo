import axios from 'axios'
import type Task from '@/services/types/TaskType'

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

const API_BASE = '/api/tasks'

/**
 * 获取所有任务
 * @param options 查询选项
 * @returns 分页任务列表
 */
export const getTasks = async (options?: {
  status?: string,
  page?: number,
  pageSize?: number
}): Promise<PaginationResult<Task>> => {
  const params = new URLSearchParams()

  if (options?.status) {
    params.append('status', options.status)
  }
  
  // 添加分页参数
  if (options?.pageSize) {
    params.append('limit', String(options.pageSize))
    
    if (options?.page) {
      const offset = (options.page - 1) * options.pageSize
      params.append('offset', String(offset))
    }
  }

  const queryString = params.toString()
  const res = await axios.get(`${API_BASE}${queryString ? `?${queryString}` : ''}`)
  return res.data
}

/**
 * 获取任务详情
 * @param id 任务ID
 * @returns 任务详情
 */
export const getTaskById = async (id: string): Promise<Task | null> => {
  const res = await axios.get(`${API_BASE}/${id}`)
  return res.data as Task
}

/**
 * 创建新任务
 * @param task 任务数据（不包含id）
 * @returns 创建的任务
 */
export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const res = await axios.post(API_BASE, task)
  return res.data as Task
}

/**
 * 更新任务
 * @param id 任务ID
 * @param updates 更新的字段
 * @returns 更新后的任务
 */
export const updateTask = async (
  id: string,
  updates: Partial<Omit<Task, 'id'>>,
): Promise<Task | null> => {
  const res = await axios.put(`${API_BASE}/${id}`, updates)
  return res.data as Task
}

/**
 * 删除任务
 * @param id 任务ID
 * @returns 操作结果
 */
export const deleteTask = async (id: string): Promise<boolean> => {
  await axios.delete(`${API_BASE}/${id}`)
  return true
}

/**
 * 批量更新任务状态
 * @param ids 任务ID数组
 * @param status 新状态
 * @returns 操作结果
 */
export const batchUpdateTaskStatus = async (ids: string[], status: Task['status']): Promise<boolean> => {
  // 假设后端未实现批量接口，前端并发调用
  await Promise.all(ids.map(id => updateTask(id, { status })))
  return true
}

/**
 * 批量删除任务
 * @param ids 任务ID数组
 * @returns 操作结果
 */
export const batchDeleteTasks = async (ids: string[]): Promise<boolean> => {
  await Promise.all(ids.map(id => deleteTask(id)))
  return true
}

// 导出任务服务
export const taskService = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  batchUpdateTaskStatus,
  batchDeleteTasks,
}
