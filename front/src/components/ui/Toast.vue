<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-2 opacity-0"
    >
      <div
        v-if="visible"
        :class="[
          'fixed top-4 right-4 z-999999 rounded-xl border p-4 shadow-md max-w-md',
          variantClasses[variant].container
        ]"
      >
        <div class="flex items-start gap-3">
          <div :class="['-mt-0.5', variantClasses[variant].icon]">
            <component :is="icons[variant]" />
          </div>

          <div>
            <h4 v-if="title" class="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">
              {{ title }}
            </h4>

            <p class="text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
            <div v-if="showCountdown && remainingTime > 0" class="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {{ Math.ceil(remainingTime / 1000) }}秒后关闭
            </div>
          </div>

          <button 
            @click="close" 
            class="-mr-1 -mt-1 ml-auto text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { SuccessIcon, ErrorIcon, WarningIcon, InfoCircleIcon } from '@/icons'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

interface ToastProps {
  variant: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  visible?: boolean
  showCountdown?: boolean
}

const props = withDefaults(defineProps<ToastProps>(), {
  title: '',
  duration: 3000,
  visible: false,
  showCountdown: true,
})

const emit = defineEmits(['update:visible'])

const visible = ref(props.visible)
const remainingTime = ref(props.duration)

// 监听 visible 属性变化
watch(() => props.visible, (newValue) => {
  visible.value = newValue
  if (newValue && props.duration > 0) {
    remainingTime.value = props.duration
    startTimer()
    startCountdown()
  }
})

let timer: number | null = null
let countdownTimer: number | null = null

/**
 * 开始计时器，在指定时间后自动关闭消息
 */
function startTimer() {
  // 清除之前的计时器
  if (timer) {
    clearTimeout(timer)
  }
  
  // 设置新的计时器
  timer = window.setTimeout(() => {
    close()
  }, props.duration)
}

/**
 * 开始倒计时，每秒更新剩余时间
 */
function startCountdown() {
  // 清除之前的倒计时
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  
  // 设置新的倒计时，每100毫秒更新一次
  countdownTimer = window.setInterval(() => {
    remainingTime.value = Math.max(0, remainingTime.value - 100)
    
    // 当倒计时结束时清除定时器
    if (remainingTime.value <= 0 && countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 100)
}

/**
 * 关闭消息提示
 */
function close() {
  visible.value = false
  emit('update:visible', false)
  
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

// 组件挂载时，如果默认可见则启动计时器
onMounted(() => {
  if (props.visible && props.duration > 0) {
    startTimer()
  }
})

// 组件卸载前清除计时器
onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
})

const variantClasses = {
  success: {
    container: 'border-success-500 bg-success-50 dark:border-success-500/30 dark:bg-success-500/15',
    icon: 'text-success-500',
  },
  error: {
    container: 'border-error-500 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15',
    icon: 'text-error-500',
  },
  warning: {
    container: 'border-warning-500 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/15',
    icon: 'text-warning-500',
  },
  info: {
    container:
      'border-blue-light-500 bg-blue-light-50 dark:border-blue-light-500/30 dark:bg-blue-light-500/15',
    icon: 'text-blue-light-500',
  },
}

const icons = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoCircleIcon,
}
</script>