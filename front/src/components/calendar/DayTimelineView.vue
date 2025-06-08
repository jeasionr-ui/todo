<template>
  <div class="h-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
    <!-- 时间轴头部 -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h4 class="font-semibold text-gray-800 dark:text-white">
        {{ formatDate(currentDate) }}
      </h4>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ $t('taskCalendar.todayView') }}
      </p>
    </div>

    <!-- 时间轴容器 -->
    <div 
      ref="timelineContainer"
      class="relative overflow-auto" 
      style="height: calc(100vh - 300px);"
    >
      <!-- 当前时间指示线 -->
      <div 
        v-if="isToday"
        class="absolute left-0 right-0 z-20 h-0.5 bg-red-500"
        :style="{ top: currentTimePosition + 'px' }"
      >
        <div class="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full"></div>
        <div class="absolute left-2 -top-2 text-xs text-red-500 font-medium">
          {{ currentTimeString }}
        </div>
      </div>

      <!-- 时间刻度和任务 -->
      <div class="flex">
        <!-- 左侧时间刻度 -->
        <div class="w-16 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div 
            v-for="hour in 24" 
            :key="hour" 
            class="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center"
          >
            <span class="text-xs text-gray-600 dark:text-gray-400">
              {{ formatHour(hour - 1) }}
            </span>
          </div>
        </div>

        <!-- 右侧任务区域 -->
        <div class="flex-1 relative">
          <!-- 小时网格线 -->
          <div 
            v-for="hour in 24" 
            :key="hour" 
            class="h-16 border-b border-gray-100 dark:border-gray-800"
          ></div>

          <!-- 任务显示 -->
          <div 
            v-for="task in tasksWithPosition" 
            :key="task.id"
            class="absolute left-2 right-2 rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md overflow-hidden"
            :class="[getTaskClass(task), {
              'z-30': activeTaskId === task.id,
              'z-10': activeTaskId !== task.id
            }]"
            :style="{
              top: task.position.top + 'px',
              height: task.position.height + 'px',
              minHeight: '48px'
            }"
            @click="handleTaskClick(task)"
          >
            <div class="p-3 h-full flex flex-col justify-center">
              <div class="font-medium text-sm leading-tight mb-1" :class="getTaskTextClass(task)">
                {{ task.name }}
              </div>
              <div class="text-xs opacity-75 leading-tight" :class="getTaskTextClass(task)">
                {{ task.reminderTime ? formatTime(task.reminderTime) : $t('taskCalendar.noTime') }}
              </div>
              <div v-if="task.description" class="text-xs opacity-60 mt-1 leading-tight truncate" :class="getTaskTextClass(task)">
                {{ task.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type Task from '@/services/types/TaskType'

interface Props {
  tasks: Task[]
  currentDate: Date
}

interface TaskWithPosition extends Task {
  position: {
    top: number
    height: number
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  taskClick: [task: Task]
}>()

const currentTime = ref(new Date())
const timelineContainer = ref<HTMLElement | null>(null)
const activeTaskId = ref<string | null>(null)

// 是否是今天
const isToday = computed(() => {
  const today = new Date()
  return props.currentDate.toDateString() === today.toDateString()
})

// 当前时间字符串
const currentTimeString = computed(() => {
  return currentTime.value.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
})

// 当前时间在时间轴上的位置
const currentTimePosition = computed(() => {
  const hours = currentTime.value.getHours()
  const minutes = currentTime.value.getMinutes()
  return (hours * 64) + (minutes * 64 / 60) // 每小时64px
})

// 带位置信息的任务列表
const tasksWithPosition = computed(() => {
  const tasksWithTimeSlots: { [key: string]: Task[] } = {}
  const tasksWithoutTime: Task[] = []
  
  // 按时间分组任务
  props.tasks.forEach(task => {
    if (task.reminderTime) {
      const timeKey = task.reminderTime
      if (!tasksWithTimeSlots[timeKey]) {
        tasksWithTimeSlots[timeKey] = []
      }
      tasksWithTimeSlots[timeKey].push(task)
    } else {
      tasksWithoutTime.push(task)
    }
  })
  
  const result: TaskWithPosition[] = []
  
  // 处理有时间的任务
  Object.entries(tasksWithTimeSlots).forEach(([timeKey, tasks]) => {
    tasks.forEach((task, index) => {
      result.push({
        ...task,
        position: calculateTaskPosition(task, index)
      })
    })
  })
  
  // 处理没有时间的任务
  tasksWithoutTime.forEach((task, index) => {
    result.push({
      ...task,
      position: calculateNoTimeTaskPosition(index)
    })
  })
  
  return result
})

// 计算任务在时间轴上的位置
function calculateTaskPosition(task: Task, index: number = 0) {
  let top = 0
  let height = 48 // 增加高度避免折叠

  if (task.reminderTime) {
    const time = new Date(`${props.currentDate.toDateString()} ${task.reminderTime}`)
    const hours = time.getHours()
    const minutes = time.getMinutes()
    top = (hours * 64) + (minutes * 64 / 60) + (index * 52) // 同一时间的任务错开显示
    height = 48
  } else {
    // 没有时间的任务放在顶部，错开显示
    top = 8 + (index * 52)
    height = 48
  }

  return { top, height }
}

// 计算没有时间的任务位置
function calculateNoTimeTaskPosition(index: number) {
  return {
    top: 8 + (index * 52), // 每个任务间隔52px
    height: 48
  }
}

// 格式化日期
function formatDate(date: Date) {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

// 格式化小时
function formatHour(hour: number) {
  return hour.toString().padStart(2, '0') + ':00'
}

// 格式化时间
function formatTime(time: string) {
  return time.slice(0, 5) // HH:MM
}

// 获取任务样式类
function getTaskClass(task: Task) {
  const baseClass = 'border-l-4 border shadow-md'
  
  switch (task.priority) {
    case 'high':
      return `${baseClass} bg-red-100 border-red-500 border-red-200 dark:bg-red-900/30 dark:border-red-400 dark:border-red-800`
    case 'medium':
      return `${baseClass} bg-yellow-100 border-yellow-500 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-400 dark:border-yellow-800`
    case 'low':
      return `${baseClass} bg-blue-100 border-blue-500 border-blue-200 dark:bg-blue-900/30 dark:border-blue-400 dark:border-blue-800`
    default:
      return `${baseClass} bg-gray-100 border-gray-500 border-gray-200 dark:bg-gray-800/50 dark:border-gray-400 dark:border-gray-700`
  }
}

// 获取任务文本样式类
function getTaskTextClass(task: Task) {
  switch (task.priority) {
    case 'high':
      return 'text-red-800 dark:text-red-200'
    case 'medium':
      return 'text-yellow-800 dark:text-yellow-200'
    case 'low':
      return 'text-blue-800 dark:text-blue-200'
    default:
      return 'text-gray-800 dark:text-gray-200'
  }
}

// 处理任务点击
function handleTaskClick(task: Task) {
  // 切换活跃任务状态
  if (activeTaskId.value === task.id) {
    activeTaskId.value = null
  } else {
    activeTaskId.value = task.id
  }
  
  // 触发原始的任务点击事件
  emit('taskClick', task)
}

// 更新当前时间
function updateCurrentTime() {
  currentTime.value = new Date()
}

// 滚动到当前时间
function scrollToCurrentTime() {
  if (!timelineContainer.value || !isToday.value) return
  
  const containerHeight = timelineContainer.value.clientHeight
  const scrollTop = Math.max(0, currentTimePosition.value - containerHeight / 2)
  
  timelineContainer.value.scrollTo({
    top: scrollTop,
    behavior: 'smooth'
  })
}

let timeInterval: number

onMounted(() => {
  // 每分钟更新一次当前时间
  timeInterval = setInterval(updateCurrentTime, 60000)
  
  // 组件挂载后滚动到当前时间
  setTimeout(() => {
    scrollToCurrentTime()
  }, 100) // 稍微延迟确保DOM渲染完成
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>
