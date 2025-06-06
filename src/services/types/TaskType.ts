// 任务数据类型定义
export default interface Task {
  id: string
  name: string
  description: string
  status: 'todo' | 'working' | 'done'
  priority: 'high' | 'medium' | 'low'
  dueDate: string | null
  reminderTime: string | null // 提醒时间
  tags: string[]
  attachments: Array<{
    id: string
    name: string
    url: string
    type: string
    size: number
    uploadedAt: string
  }>
}
