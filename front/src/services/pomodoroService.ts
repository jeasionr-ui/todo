// 番茄钟服务
import type { 
  PomodoroTemplate, 
  PomodoroSession, 
  PomodoroStats, 
  FocusSettings,
  CreateTemplateRequest,
  CreateSessionRequest,
  CompleteSessionRequest,
  ApiResponse,
  PaginationResult
} from '@/types/pomodoro'

const API_BASE_URL = '/api/pomodoro'

// 错误处理类
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// 处理响应
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = '请求失败'
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorMessage
      throw new ApiError(errorMessage, response.status, errorData)
    } catch (e) {
      if (e instanceof ApiError) throw e
      throw new ApiError(errorMessage, response.status)
    }
  }
  return await response.json()
}

// 处理分页响应
async function handlePaginatedResponse<T>(response: Response): Promise<PaginationResult<T>> {
  return await handleResponse<PaginationResult<T>>(response)
}

// 通用请求函数
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
}

// 分页请求函数
async function apiPaginatedRequest<T>(endpoint: string, options: RequestInit = {}): Promise<PaginationResult<T>> {
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
    return await handlePaginatedResponse<T>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('网络错误', 0, { originalError: error })
  }
}

// ==================== 模板管理 ====================

/**
 * 获取所有番茄钟模板
 */
export const getAllTemplates = async (
  page: number = 1,
  pageSize: number = 10
): Promise<PaginationResult<PomodoroTemplate>> => {
  const offset = (page - 1) * pageSize
  return apiPaginatedRequest<PomodoroTemplate>(`/templates?limit=${pageSize}&offset=${offset}`)
}

/**
 * 获取模板详情
 */
export const getTemplateById = async (templateId: string): Promise<ApiResponse<PomodoroTemplate>> => {
  return apiRequest<ApiResponse<PomodoroTemplate>>(`/templates/${templateId}`)
}

/**
 * 创建新模板
 */
export const createTemplate = async (templateData: CreateTemplateRequest): Promise<ApiResponse<PomodoroTemplate>> => {
  return apiRequest<ApiResponse<PomodoroTemplate>>('/templates', {
    method: 'POST',
    body: JSON.stringify(templateData),
  })
}

/**
 * 更新模板
 */
export const updateTemplate = async (
  templateId: string,
  updates: Partial<CreateTemplateRequest>
): Promise<ApiResponse<PomodoroTemplate>> => {
  return apiRequest<ApiResponse<PomodoroTemplate>>(`/templates/${templateId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

/**
 * 删除模板
 */
export const deleteTemplate = async (templateId: string): Promise<ApiResponse<void>> => {
  return apiRequest<ApiResponse<void>>(`/templates/${templateId}`, {
    method: 'DELETE',
  })
}

/**
 * 获取所有番茄钟模板 (简化版本)
 */
export const getTemplates = async (): Promise<PomodoroTemplate[]> => {
  const result = await getAllTemplates(1, 100)
  return result.data
}

/**
 * 设置默认模板
 */
export const setDefaultTemplate = async (templateId: number): Promise<ApiResponse<void>> => {
  return apiRequest<ApiResponse<void>>(`/templates/${templateId}/set-default`, {
    method: 'POST',
  })
}

// ==================== 会话管理 ====================

/**
 * 获取当前活跃会话
 */
export const getActiveSession = async (): Promise<ApiResponse<PomodoroSession | null>> => {
  return apiRequest<ApiResponse<PomodoroSession | null>>('/sessions/active')
}

/**
 * 创建新会话
 */
export const createSession = async (sessionData: CreateSessionRequest): Promise<ApiResponse<PomodoroSession>> => {
  return apiRequest<ApiResponse<PomodoroSession>>('/sessions', {
    method: 'POST',
    body: JSON.stringify(sessionData),
  })
}

/**
 * 开始会话
 */
export const startSession = async (sessionId: string): Promise<ApiResponse<PomodoroSession>> => {
  return apiRequest<ApiResponse<PomodoroSession>>(`/sessions/${sessionId}/start`, {
    method: 'POST',
  })
}

/**
 * 暂停会话
 */
export const pauseSession = async (sessionId: string, reason?: string): Promise<ApiResponse<PomodoroSession>> => {
  return apiRequest<ApiResponse<PomodoroSession>>(`/sessions/${sessionId}/pause`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  })
}

/**
 * 恢复会话
 */
export const resumeSession = async (sessionId: string): Promise<ApiResponse<PomodoroSession>> => {
  return apiRequest<ApiResponse<PomodoroSession>>(`/sessions/${sessionId}/resume`, {
    method: 'POST',
  })
}

/**
 * 完成会话
 */
export const completeSession = async (
  sessionId: string,
  completionData: CompleteSessionRequest
): Promise<ApiResponse<PomodoroSession>> => {
  return apiRequest<ApiResponse<PomodoroSession>>(`/sessions/${sessionId}/complete`, {
    method: 'POST',
    body: JSON.stringify(completionData),
  })
}

/**
 * 取消会话
 */
export const cancelSession = async (sessionId: string, reason?: string): Promise<ApiResponse<PomodoroSession>> => {
  return apiRequest<ApiResponse<PomodoroSession>>(`/sessions/${sessionId}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  })
}

/**
 * 获取会话详情
 */
export const getSessionById = async (sessionId: string): Promise<ApiResponse<PomodoroSession>> => {
  return apiRequest<ApiResponse<PomodoroSession>>(`/sessions/${sessionId}`)
}

/**
 * 获取会话历史
 */
export const getSessionHistory = async (options: {
  status?: string
  startDate?: string
  endDate?: string
  taskId?: string
  page?: number
  pageSize?: number
}): Promise<PaginationResult<PomodoroSession>> => {
  const params = new URLSearchParams()
  
  if (options.status) params.append('status', options.status)
  if (options.startDate) params.append('startDate', options.startDate)
  if (options.endDate) params.append('endDate', options.endDate)
  if (options.taskId) params.append('taskId', options.taskId)
  if (options.pageSize) params.append('limit', options.pageSize.toString())
  if (options.page) {
    const offset = (options.page - 1) * (options.pageSize || 10)
    params.append('offset', offset.toString())
  }

  const queryString = params.toString()
  const endpoint = `/sessions${queryString ? `?${queryString}` : ''}`
  
  return apiPaginatedRequest<PomodoroSession>(endpoint)
}

/**
 * 获取当前活跃会话 (数组版本)
 */
export const getActiveSessions = async (): Promise<PomodoroSession[]> => {
  const result = await getActiveSession()
  return result.data ? [result.data] : []
}

// ==================== 统计报告 ====================

/**
 * 获取每日统计
 */
export const getDailyStats = async (options: {
  date?: string
  startDate?: string
  endDate?: string
}): Promise<ApiResponse<PomodoroStats | PomodoroStats[]>> => {
  const params = new URLSearchParams()
  
  if (options.date) params.append('date', options.date)
  if (options.startDate) params.append('startDate', options.startDate)
  if (options.endDate) params.append('endDate', options.endDate)

  const queryString = params.toString()
  const endpoint = `/stats/daily${queryString ? `?${queryString}` : ''}`
  
  return apiRequest<ApiResponse<PomodoroStats | PomodoroStats[]>>(endpoint)
}

/**
 * 获取每周统计
 */
export const getWeeklyStats = async (options: {
  weekStart?: string
  weeksCount?: number
}): Promise<ApiResponse<any[]>> => {
  const params = new URLSearchParams()
  
  if (options.weekStart) params.append('weekStart', options.weekStart)
  if (options.weeksCount) params.append('weeksCount', options.weeksCount.toString())

  const queryString = params.toString()
  const endpoint = `/stats/weekly${queryString ? `?${queryString}` : ''}`
  
  return apiRequest<ApiResponse<any[]>>(endpoint)
}

/**
 * 获取每月统计
 */
export const getMonthlyStats = async (options: {
  year?: number
  month?: number
  monthsCount?: number
}): Promise<ApiResponse<any[]>> => {
  const params = new URLSearchParams()
  
  if (options.year) params.append('year', options.year.toString())
  if (options.month) params.append('month', options.month.toString())
  if (options.monthsCount) params.append('monthsCount', options.monthsCount.toString())

  const queryString = params.toString()
  const endpoint = `/stats/monthly${queryString ? `?${queryString}` : ''}`
  
  return apiRequest<ApiResponse<any[]>>(endpoint)
}

// ==================== 焦点模式 ====================

/**
 * 获取焦点模式设置
 */
export const getFocusSettings = async (): Promise<ApiResponse<FocusSettings>> => {
  return apiRequest<ApiResponse<FocusSettings>>('/focus-settings')
}

/**
 * 更新焦点模式设置
 */
export const updateFocusSettings = async (settings: Partial<FocusSettings>): Promise<ApiResponse<FocusSettings>> => {
  return apiRequest<ApiResponse<FocusSettings>>('/focus-settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  })
}

// ==================== 健康检查 ====================

/**
 * 健康检查
 */
export const healthCheck = async (): Promise<ApiResponse<any>> => {
  return apiRequest<ApiResponse<any>>('/health')
}

// 导出所有服务
export const pomodoroService = {
  // 模板管理
  getAllTemplates,
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  setDefaultTemplate,
  
  // 会话管理
  getActiveSession,
  getActiveSessions,
  createSession,
  startSession,
  pauseSession,
  resumeSession,
  completeSession,
  cancelSession,
  getSessionById,
  getSessionHistory,
  
  // 统计报告
  getDailyStats,
  getWeeklyStats,
  getMonthlyStats,
  
  // 焦点模式
  getFocusSettings,
  updateFocusSettings,
  
  // 健康检查
  healthCheck,
}

export { ApiError }
export default pomodoroService
