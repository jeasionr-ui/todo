import axios from 'axios'

// 定义报表数据类型
export interface ProductivityReport {
  totalTasks: number
  completedTasks: number
  completionRate: number
  averageTime: number
  trendData: Array<{
    date: string
    tasks: number
    completed: number
    time: number
  }>
  insights: string[]
  recommendations: string[]
}

export interface HabitsReport {
  totalHabits: number
  activeHabits: number
  averageStreak: number
  completionRate: number
  trendData: Array<{
    date: string
    completed: number
    total: number
    streak: number
  }>
  insights: string[]
  recommendations: string[]
}

export interface GoalsReport {
  totalGoals: number
  completedGoals: number
  averageProgress: number
  onTrackGoals: number
  trendData: Array<{
    date: string
    total: number
    completed: number
    progress: number
  }>
  insights: string[]
  recommendations: string[]
}

export interface TimeEfficiencyReport {
  totalTime: number
  effectiveTime: number
  efficiency: number
  averageSessionTime: number
  trendData: Array<{
    date: string
    time: number
    sessions: number
    efficiency: number
  }>
  insights: string[]
  recommendations: string[]
}

export interface TasksReport {
  period: {
    startDate: string
    endDate: string
    days: number
  }
  overview: {
    totalTasks: number
    completedTasks: number
    inProgressTasks: number
    todoTasks: number
    overdueTasks: number
    averageCompletionDays: number
    completionRate: string
    overdueRate: string
  }
  trends: Array<{
    date: string
    totalTasks: number
    completedTasks: number
  }>
  priorityAnalysis: {
    high: number
    medium: number
    low: number
  }
  tagStats: Array<{
    tag: string
    count: number
  }>
  overdueAnalysis: {
    count: number
    averageDaysOverdue: number
    rate: string
  }
  insights: string[]
}

export interface PomodoroReport {
  totalSessions: number
  totalTime: number
  averageSessionTime: number
  completionRate: number
  trendData: Array<{
    date: string
    sessions: number
    time: number
  }>
}

export interface DashboardData {
  productivity: ProductivityReport
  habits: HabitsReport
  goals: GoalsReport
  timeEfficiency: TimeEfficiencyReport
  tasks: TasksReport
  pomodoro: PomodoroReport
}

export interface ExportOptions {
  types: string[]
  format: 'json' | 'csv'
  dateRange?: {
    start: string
    end: string
  }
}

class ReportService {
  private baseURL = '/api/report'

  // 获取个人生产力报告
  async getProductivityReport(dateRange?: { start: string; end: string }): Promise<ProductivityReport> {
    const params = dateRange ? { startDate: dateRange.start, endDate: dateRange.end } : {}
    const response = await axios.get(`${this.baseURL}/productivity`, { params })
    return response.data
  }

  // 获取习惯跟踪报告
  async getHabitsReport(dateRange?: { start: string; end: string }): Promise<HabitsReport> {
    const params = dateRange ? { startDate: dateRange.start, endDate: dateRange.end } : {}
    const response = await axios.get(`${this.baseURL}/habits`, { params })
    return response.data
  }

  // 获取目标完成分析
  async getGoalsReport(dateRange?: { start: string; end: string }): Promise<GoalsReport> {
    const params = dateRange ? { startDate: dateRange.start, endDate: dateRange.end } : {}
    const response = await axios.get(`${this.baseURL}/goals`, { params })
    return response.data
  }

  // 获取时间效率报告
  async getTimeEfficiencyReport(dateRange?: { start: string; end: string }): Promise<TimeEfficiencyReport> {
    const params = dateRange ? { startDate: dateRange.start, endDate: dateRange.end } : {}
    const response = await axios.get(`${this.baseURL}/time-efficiency`, { params })
    return response.data
  }

  // 获取任务统计报告
  async getTasksReport(dateRange?: { start: string; end: string }): Promise<TasksReport> {
    const params = dateRange ? { startDate: dateRange.start, endDate: dateRange.end } : {}
    const response = await axios.get(`${this.baseURL}/tasks`, { params })
    return response.data
  }

  // 获取番茄工作法报告
  async getPomodoroReport(dateRange?: { start: string; end: string }): Promise<PomodoroReport> {
    const params = dateRange ? { startDate: dateRange.start, endDate: dateRange.end } : {}
    const response = await axios.get(`${this.baseURL}/pomodoro`, { params })
    return response.data
  }

  // 获取仪表板数据
  async getDashboardData(dateRange?: { start: string; end: string }): Promise<DashboardData> {
    const params = dateRange ? { startDate: dateRange.start, endDate: dateRange.end } : {}
    const response = await axios.get(`${this.baseURL}/dashboard`, { params })
    return response.data
  }

  // 导出数据
  async exportData(options: ExportOptions): Promise<Blob> {
    const response = await axios.post(`${this.baseURL}/export`, options, {
      responseType: 'blob'
    })
    return response.data
  }

  // 下载导出的数据
  downloadExportedData(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }
}

export const reportService = new ReportService()
