// 通知数据类型定义
export default interface Notification {
    id: number
    userName: string
    userImage: string
    action: string
    project: string
    type: string
    time: string
    status: 'online' | 'offline'
  }