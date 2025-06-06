import type Habit from '@/services/types/HabitType'

const API_BASE_URL = 'http://localhost:3001/api/habits'

/**
 * API 错误类
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message)
    this.name = 'ApiError'
  }
} /**
 * 处理API响应
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(errorData.message || '请求失败', response.status, errorData)
  }

  const responseData = await response.json()
  
  // 如果响应包含success字段，说明是标准的API响应格式
  if (responseData.success !== undefined) {
    if (!responseData.success) {
      throw new ApiError(responseData.message || '请求失败', response.status, responseData)
    }
    // 返回data字段中的实际数据
    return responseData.data
  }
  
  // 否则直接返回响应数据
  return responseData
} /**
 * 发送API请求
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, mergedOptions)
    return await handleResponse<T>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('网络错误', 0, { originalError: error })
  }
} /**
 * 获取所有习惯
 */
export const getHabits = async (): Promise<Habit[]> => {
  return apiRequest<Habit[]>('/')
}

/**
 * 获取习惯详情
 */
export const getHabitById = async (id: string): Promise<Habit> => {
  return apiRequest<Habit>(`/${id}`)
}

/**
 * 创建新习惯
 */
export const createHabit = async (
  habit: Omit<
    Habit,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'streakCount'
    | 'longestStreak'
    | 'totalCompletions'
    | 'completionHistory'
    | 'lastCompletedAt'
  >,
): Promise<Habit> => {
  return apiRequest<Habit>('/', {
    method: 'POST',
    body: JSON.stringify(habit),
  })
} /**
 * 更新习惯
 */
export const updateHabit = async (id: string, habit: Partial<Habit>): Promise<Habit> => {
  return apiRequest<Habit>(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(habit),
  })
}

/**
 * 删除习惯（软删除）
 */
export const deleteHabit = async (id: string): Promise<void> => {
  return apiRequest<void>(`/${id}`, {
    method: 'DELETE',
  })
}

/**
 * 彻底删除习惯
 */
export const permanentDeleteHabit = async (id: string): Promise<void> => {
  return apiRequest<void>(`/${id}/permanent`, {
    method: 'DELETE',
  })
} /**
 * 归档习惯
 */
export const archiveHabit = async (id: string): Promise<Habit> => {
  return apiRequest<Habit>(`/${id}/archive`, {
    method: 'PUT',
  })
}

/**
 * 取消归档习惯
 */
export const unarchiveHabit = async (id: string): Promise<Habit> => {
  return apiRequest<Habit>(`/${id}/unarchive`, {
    method: 'PUT',
  })
}

/**
 * 标记习惯完成
 */
export const markHabitComplete = async (
  habitId: string,
  date: string,
  note?: string,
): Promise<void> => {
  return apiRequest<void>(`/${habitId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ date, note }),
  })
} /**
 * 取消习惯完成
 */
export const unmarkHabitComplete = async (habitId: string, date: string): Promise<void> => {
  return apiRequest<void>(`/${habitId}/uncomplete`, {
    method: 'POST',
    body: JSON.stringify({ date }),
  })
}

/**
 * 获取习惯完成记录
 */
export const getHabitCompletions = async (
  habitId: string,
  startDate?: string,
  endDate?: string,
): Promise<any[]> => {
  const params = new URLSearchParams()
  if (startDate) params.append('startDate', startDate)
  if (endDate) params.append('endDate', endDate)

  const queryString = params.toString()
  const endpoint = `/${habitId}/completions${queryString ? `?${queryString}` : ''}`

  return apiRequest<any[]>(endpoint)
} /**
 * 获取习惯统计信息
 */
export const getHabitStats = async (habitId: string): Promise<any> => {
  return apiRequest<any>(`/${habitId}/stats`)
}

/**
 * 批量操作习惯
 */
export const batchUpdateHabits = async (
  habitIds: string[],
  updates: Partial<Habit>,
): Promise<Habit[]> => {
  return apiRequest<Habit[]>('/batch', {
    method: 'PUT',
    body: JSON.stringify({ habitIds, updates }),
  })
}

/**
 * 批量删除习惯
 */
export const batchDeleteHabits = async (habitIds: string[]): Promise<void> => {
  return apiRequest<void>('/batch', {
    method: 'DELETE',
    body: JSON.stringify({ habitIds }),
  })
} /**
 * 获取习惯分类列表
 */
export const getHabitCategories = async (): Promise<string[]> => {
  return apiRequest<string[]>('/categories')
}

/**
 * 搜索习惯
 */
export const searchHabits = async (
  query: string,
  category?: string,
  tags?: string[],
): Promise<Habit[]> => {
  const params = new URLSearchParams()
  params.append('q', query)
  if (category) params.append('category', category)
  if (tags && tags.length > 0) {
    tags.forEach((tag) => params.append('tags', tag))
  }

  return apiRequest<Habit[]>(`/search?${params.toString()}`)
}

/**
 * 导出习惯数据
 */
export const exportHabits = async (format: 'json' | 'csv' = 'json'): Promise<any> => {
  return apiRequest<any>(`/export?format=${format}`)
}

/**
 * 导入习惯数据
 */
export const importHabits = async (data: any[]): Promise<Habit[]> => {
  return apiRequest<Habit[]>('/import', {
    method: 'POST',
    body: JSON.stringify({ habits: data }),
  })
}
export default {
  getHabits,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit,
  permanentDeleteHabit,
  archiveHabit,
  unarchiveHabit,
  markHabitComplete,
  unmarkHabitComplete,
  getHabitCompletions,
  getHabitStats,
  batchUpdateHabits,
  batchDeleteHabits,
  getHabitCategories,
  searchHabits,
  exportHabits,
  importHabits,
}
