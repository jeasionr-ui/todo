// 任务数据类型定义
export default interface Task {
  id: string
  name: string
  description: string
  status: 'todo' | 'working' | 'done'
  priority: 'high' | 'medium' | 'low'
  dueDate: string | null
  dueTime: string | null
  createdAt: string
  updatedAt: string
  tags: string[]
  attachments: Array<{
    id: string
    name: string
    url: string
    type: string
    size: number
    uploadedAt: string
  }>
  comments: Array<{
    id: string
    userId: string
    content: string
    createdAt: string
  }>
  estimatedTime: number | null // 预计时间（小时）
  actualTime: number | null // 实际耗时（小时）
  dependencyIds: string[] // 依赖任务ID
  isRecurring: boolean // 是否循环任务
  recurringPattern: string | null // 循环模式
  reminderTime: string | null // 提醒时间
}
