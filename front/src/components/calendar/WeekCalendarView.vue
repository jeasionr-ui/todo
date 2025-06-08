<template>
  <div class="h-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-grconst props = defineProps<Props>()

const emit = defineEmits<{
  taskClick: [task: Task]
  dateClick: [date: string]
}>()">
    <!-- 周视图头部 -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h4 class="font-semibold text-gray-800 dark:text-white">
        {{ formatWeekRange() }}
      </h4>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ $t('taskCalendar.weekView') }}
      </p>
    </div>

    <!-- 日历网格 -->
    <div class="overflow-auto" style="height: calc(100vh - 300px);">
      <!-- 星期头部 -->
      <div class="grid grid-cols-8 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="p-3 text-center text-xs font-medium text-gray-600 dark:text-gray-400">
          <!-- 空白时间列 -->
        </div>
        <div 
          v-for="day in weekDays" 
          :key="day.date"
          class="p-3 text-center border-l border-gray-200 dark:border-gray-700"
        >
          <div class="text-xs font-medium text-gray-600 dark:text-gray-400">
            {{ day.dayName }}
          </div>
          <div 
            class="text-sm font-semibold mt-1"
            :class="day.isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-white'"
          >
            {{ day.dayNumber }}
          </div>
        </div>
      </div>

      <!-- 时间网格 -->
      <div class="grid grid-cols-8">
        <!-- 时间列 -->
        <div class="bg-gray-50 dark:bg-gray-800">
          <div 
            v-for="hour in displayHours" 
            :key="hour"
            class="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center"
          >
            <span class="text-xs text-gray-600 dark:text-gray-400">
              {{ formatHour(hour) }}
            </span>
          </div>
        </div>

        <!-- 日期列 -->
        <div 
          v-for="day in weekDays" 
          :key="day.date"
          class="relative border-l border-gray-200 dark:border-gray-700"
        >
          <!-- 小时网格线 -->
          <div 
            v-for="hour in displayHours" 
            :key="hour"
            class="h-16 border-b border-gray-100 dark:border-gray-800"
          ></div>

          <!-- 当前时间线 (仅显示在今天) -->
          <div 
            v-if="day.isToday"
            class="absolute left-0 right-0 z-10 h-0.5 bg-red-500"
            :style="{ top: currentTimePosition + 'px' }"
          >
            <div class="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </div>

          <!-- 任务显示 -->
          <div 
            v-for="task in getTasksForDay(day.date)" 
            :key="task.id"
            class="absolute left-1 right-1 rounded-md shadow-sm cursor-pointer transition-all hover:shadow-md overflow-hidden"
            :class="[getTaskClass(task), {
              'z-30': activeTaskId === task.id,
              'z-10': activeTaskId !== task.id
            }]"
            :style="getTaskStyle(task)"
            @click="handleTaskClick(task)"
          >
            <div class="p-2 h-full flex flex-col justify-center">
              <div class="font-medium text-xs leading-tight mb-1" :class="getTaskTextClass(task)">
                {{ task.name }}
              </div>
              <div v-if="task.reminderTime" class="text-xs opacity-75 leading-tight" :class="getTaskTextClass(task)">
                {{ formatTime(task.reminderTime) }}
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
import { useI18n } from '@/i18n'
import type Task from '@/services/types/TaskType'

interface Props {
  tasks: Task[]
  currentDate: Date
}

const props = defineProps<Props>()

const emit = defineEmits<{
  taskClick: [task: Task]
  dateClick: [date: string]
}>()

const { t, locale } = useI18n()
const currentTime = ref(new Date())
const activeTaskId = ref<string | null>(null)

// 显示的小时范围 (6:00 - 22:00)
const displayHours = Array.from({ length: 17 }, (_, i) => i + 6)

// 周的天数
const weekDays = computed(() => {
  const startOfWeek = getStartOfWeek(props.currentDate)
  const days = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    
    days.push({
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      isToday
    })
  }
  
  return days
})

// 当前时间在时间轴上的位置
const currentTimePosition = computed(() => {
  const hours = currentTime.value.getHours()
  const minutes = currentTime.value.getMinutes()
  
  // 只在显示范围内显示时间线
  if (hours < 6 || hours > 22) {
    return -100 // 隐藏
  }
  
  const relativeHour = hours - 6
  return (relativeHour * 64) + (minutes * 64 / 60)
})

// 获取周的开始日期 (周一)
function getStartOfWeek(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // 调整为周一开始
  return new Date(d.setDate(diff))
}

// 格式化周范围
function formatWeekRange() {
  const startOfWeek = getStartOfWeek(props.currentDate)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  
  return `${startOfWeek.toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' })}`
}

// 格式化小时
function formatHour(hour: number) {
  return hour.toString().padStart(2, '0') + ':00'
}

// 格式化时间
function formatTime(time: string) {
  return time.slice(0, 5)
}

// 获取指定日期的任务
function getTasksForDay(dateString: string) {
  return props.tasks.filter(task => {
    if (!task.dueDate) return false
    return task.dueDate === dateString
  })
}

// 获取任务样式
function getTaskStyle(task: Task) {
  let top = 0
  let height = 40 // 增加高度

  if (task.reminderTime) {
    const [hours, minutes] = task.reminderTime.split(':').map(Number)
    
    if (hours >= 6 && hours <= 22) {
      const relativeHour = hours - 6
      top = (relativeHour * 64) + (minutes * 64 / 60)
      height = 40 // 增加高度
    } else {
      // 超出显示范围的任务放在顶部
      top = 4
      height = 32
    }
  } else {
    top = 4
    height = 32
  }

  return {
    top: top + 'px',
    height: height + 'px',
    minHeight: '32px'
  }
}

// 获取任务样式类
function getTaskClass(task: Task) {
  const baseClass = 'border-l-3 border shadow-sm'
  
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

let timeInterval: number

onMounted(() => {
  timeInterval = setInterval(updateCurrentTime, 60000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>
