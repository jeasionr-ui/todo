import { ref, reactive } from 'vue'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface ToastOptions {
  title?: string
  message: string
  variant: ToastVariant
  duration?: number
  showCountdown?: boolean
}

interface ToastState extends ToastOptions {
  visible: boolean
  showCountdown: boolean
}

/**
 * Toast 服务，用于在应用中显示消息提示
 */
const toast = reactive<ToastState>({
  title: '',
  message: '',
  variant: 'info',
  duration: 3000,
  visible: false,
  showCountdown: true,
})

/**
 * 显示一个消息提示
 * @param options - 消息提示选项
 */
function showToast(options: ToastOptions): void {
  // 设置 toast 属性
  toast.title = options.title || ''
  toast.message = options.message
  toast.variant = options.variant
  toast.duration = options.duration !== undefined ? options.duration : 3000
  toast.showCountdown = options.showCountdown !== undefined ? options.showCountdown : true
  
  // 显示 toast
  toast.visible = true
}

/**
 * 显示成功消息
 * @param message - 消息内容
 * @param title - 可选的标题
 * @param duration - 可选的显示时长（毫秒）
 * @param showCountdown - 是否显示倒计时，默认为 true
 */
function success(message: string, title?: string, duration?: number, showCountdown?: boolean): void {
  showToast({
    title,
    message,
    variant: 'success',
    duration,
    showCountdown,
  })
}

/**
 * 显示错误消息
 * @param message - 消息内容
 * @param title - 可选的标题
 * @param duration - 可选的显示时长（毫秒）
 * @param showCountdown - 是否显示倒计时，默认为 true
 */
function error(message: string, title?: string, duration?: number, showCountdown?: boolean): void {
  showToast({
    title,
    message,
    variant: 'error',
    duration,
    showCountdown,
  })
}

/**
 * 显示警告消息
 * @param message - 消息内容
 * @param title - 可选的标题
 * @param duration - 可选的显示时长（毫秒）
 * @param showCountdown - 是否显示倒计时，默认为 true
 */
function warning(message: string, title?: string, duration?: number, showCountdown?: boolean): void {
  showToast({
    title,
    message,
    variant: 'warning',
    duration,
    showCountdown,
  })
}

/**
 * 显示信息消息
 * @param message - 消息内容
 * @param title - 可选的标题
 * @param duration - 可选的显示时长（毫秒）
 * @param showCountdown - 是否显示倒计时，默认为 true
 */
function info(message: string, title?: string, duration?: number, showCountdown?: boolean): void {
  showToast({
    title,
    message,
    variant: 'info',
    duration,
    showCountdown,
  })
}

/**
 * 关闭当前显示的消息提示
 */
function close(): void {
  toast.visible = false
}

export const toastService = {
  toast,
  showToast,
  success,
  error,
  warning,
  info,
  close,
}