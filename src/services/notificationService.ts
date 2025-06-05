// TODO: 已废弃 mockData，需改为真实后端API，临时返回空数组/0，防止报错
import type Notification from '@/services/types/NotificationType'

/**
 * 获取所有通知
 * @returns 通知列表
 */
export const getNotifications = (): Promise<Notification[]> => {
  // TODO: 替换为真实API
  return Promise.resolve([])
}

/**
 * 获取未读通知数量
 * @returns 未读通知数量
 */
export const getUnreadNotificationsCount = (): Promise<number> => {
  // TODO: 替换为真实API
  return Promise.resolve(0)
}

/**
 * 标记通知为已读
 * @returns 操作结果
 */
export const markNotificationAsRead = (): Promise<boolean> => {
  // TODO: 替换为真实API
  return Promise.resolve(true)
}
