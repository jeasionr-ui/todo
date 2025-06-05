import { mockNotifications } from './mockData'
import type Notification from '@/services/types/NotificationType'
/**
 * 获取所有通知
 * @returns 通知列表
 */
export const getNotifications = (): Promise<Notification[]> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      resolve(mockNotifications)
    }, 300)
  })
}

/**
 * 获取未读通知数量
 * @returns 未读通知数量
 */
export const getUnreadNotificationsCount = (): Promise<number> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      // 这里可以根据实际需求修改逻辑
      resolve(mockNotifications.length)
    }, 200)
  })
}

/**
 * 标记通知为已读
 * @param id 通知ID
 * @returns 操作结果
 */
export const markNotificationAsRead = (id: number): Promise<boolean> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      // 这里可以根据实际需求修改逻辑
      console.log(`标记通知 ${id} 为已读`)
      resolve(true)
    }, 200)
  })
}
