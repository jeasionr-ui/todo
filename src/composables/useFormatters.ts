// src/composables/useFormatters.ts
import { i18n } from '@/i18n'

/**
 * 提供各种格式化函数的组合式函数
 * 包括日期、时间、数字等格式化功能
 */
export function useFormatters() {
  const i18nInstance = i18n.global

  /**
   * 格式化日期字符串为本地化日期格式
   * @param dateString - 日期字符串，如 ISO 格式的日期
   * @param options - 可选的 Intl.DateTimeFormatOptions 配置
   * @returns 格式化后的日期字符串
   */
  const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions) => {
    if (!dateString) return ''

    const date = new Date(dateString)
    // 检查日期是否有效
    if (isNaN(date.getTime())) return ''

    // 使用当前语言环境格式化日期
    const locale = i18nInstance.locale.value
    return date.toLocaleDateString(locale, options)
  }

  /**
   * 格式化日期时间字符串为本地化日期时间格式
   * @param dateTimeString - 日期时间字符串
   * @param options - 可选的 Intl.DateTimeFormatOptions 配置
   * @returns 格式化后的日期时间字符串
   */
  const formatDateTime = (dateTimeString: string, options?: Intl.DateTimeFormatOptions) => {
    if (!dateTimeString) return ''

    const date = new Date(dateTimeString)
    // 检查日期是否有效
    if (isNaN(date.getTime())) return ''

    // 默认配置包含日期和时间
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }

    // 合并默认配置和用户配置
    const mergedOptions = { ...defaultOptions, ...options }

    // 使用当前语言环境格式化日期时间
    const locale = i18nInstance.locale.value
    return date.toLocaleString(locale, mergedOptions)
  }

  return {
    formatDate,
    formatDateTime,
  }
}
