// 习惯数据类型定义
export default interface Todo {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  frequency: {
    type: 'daily' | 'weekly' | 'monthly'
    daysOfWeek?: number[] // 0-6 表示周日到周六
    daysOfMonth?: number[] // 1-31 表示每月的第几天
  }
  startDate: string
  endDate: string | null
  reminderTime: string | null
  reminderType: 'time' | 'location' | null
  reminderLocation?: string
  color: string
  icon: string // 使用emoji作为图标
  cronExpression?: string // cron表达式，用于定时任务
  isArchived: boolean
  createdAt: string
  updatedAt: string
  streakCount: number // 当前连续完成次数
  longestStreak: number // 最长连续完成次数
  totalCompletions: number // 总完成次数
  completionHistory: Array<{
    date: string
    isCompleted: boolean
    note: string | null
  }>
  lastCompletedAt: string | null
}