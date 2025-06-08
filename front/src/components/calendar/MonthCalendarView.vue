<template>
  <div class="h-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
    <!-- 月视图头部 -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h4 class="font-semibold text-gray-800 dark:text-white">
        {{ formatMonth() }}
      </h4>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ $t('taskCalendar.monthView') }}
      </p>
    </div>

    <!-- 月历网格 -->
    <div class="overflow-auto" style="height: calc(100vh - 300px);">
      <!-- 星期头部 -->
      <div class="grid grid-cols-7 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div 
          v-for="dayName in dayNames" 
          :key="dayName"
          class="p-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 last:border-r-0"
        >
          {{ dayName }}
        </div>
      </div>

      <!-- 日期网格 -->
      <div class="grid grid-cols-7 auto-rows-fr" style="min-height: calc(100vh - 400px);">
        <div 
          v-for="day in calendarDays" 
          :key="day.date"
          class="border-r border-b border-gray-200 dark:border-gray-700 last:border-r-0 min-h-24 p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          :class="{
            'bg-gray-50 dark:bg-gray-800/30': !day.isCurrentMonth,
            'bg-blue-50 dark:bg-blue-900/20': day.isToday
          }"
          @click="emit('dateClick', day.date)"
        >
          <!-- 日期数字 -->
          <div class="flex items-center justify-between mb-1">
            <span 
              class="text-sm font-medium"
              :class="{
                'text-gray-400 dark:text-gray-500': !day.isCurrentMonth,
                'text-blue-600 dark:text-blue-400 font-bold': day.isToday,
                'text-gray-800 dark:text-white': day.isCurrentMonth && !day.isToday
              }"
            >
              {{ day.dayNumber }}
            </span>
            
            <!-- 任务数量指示器 -->
            <span 
              v-if="day.taskCount > 0"
              class="text-xs px-1.5 py-0.5 rounded-full bg-blue-500 text-white font-medium"
            >
              {{ day.taskCount }}
            </span>
          </div>

          <!-- 任务列表 -->
          <div class="space-y-1 mt-1">
            <div 
              v-for="(task, index) in day.tasks.slice(0, 3)" 
              :key="task.id"
              class="text-xs p-1.5 rounded cursor-pointer transition-all hover:shadow-sm border-l-2 relative"
              :class="[getTaskClass(task), {
                'z-30': activeTaskId === task.id,
                'z-10': activeTaskId !== task.id
              }]"
              @click.stop="handleTaskClick(task)"
            >
              <div class="truncate font-medium leading-tight" :class="getTaskTextClass(task)">
                {{ task.name }}
              </div>
              <div v-if="task.reminderTime" class="truncate opacity-75 leading-tight mt-0.5" :class="getTaskTextClass(task)">
                {{ formatTime(task.reminderTime) }}
              </div>
            </div>
            
            <!-- 更多任务指示 -->
            <div 
              v-if="day.tasks.length > 3"
              class="text-xs text-gray-500 dark:text-gray-400 font-medium p-1"
            >
              +{{ day.tasks.length - 3 }} 更多
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type Task from '@/services/types/TaskType'

interface Props {
  tasks: Task[]
  currentDate: Date
}

interface CalendarDay {
  date: string
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  tasks: Task[]
  taskCount: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  taskClick: [task: Task]
  dateClick: [date: string]
}>()

const activeTaskId = ref<string | null>(null)

// 星期名称
const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

// 月历天数
const calendarDays = computed<CalendarDay[]>(() => {
  const year = props.currentDate.getFullYear()
  const month = props.currentDate.getMonth()
  const today = new Date()
  
  // 获取当月第一天
  const firstDay = new Date(year, month, 1)
  
  // 获取第一周的起始日期（周一）
  const startDate = new Date(firstDay)
  const dayOfWeek = firstDay.getDay()
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  startDate.setDate(firstDay.getDate() - daysToSubtract)
  
  // 生成6周的日期
  const days: CalendarDay[] = []
  const currentDate = new Date(startDate)
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(currentDate)
    const dateString = date.toISOString().split('T')[0]
    const isCurrentMonth = date.getMonth() === month
    const isToday = date.toDateString() === today.toDateString()
    
    // 获取该日期的任务
    const dayTasks = props.tasks.filter(task => {
      if (!task.dueDate) return false
      return task.dueDate === dateString
    })
    
    days.push({
      date: dateString,
      dayNumber: date.getDate(),
      isCurrentMonth,
      isToday,
      tasks: dayTasks,
      taskCount: dayTasks.length
    })
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return days
})

// 格式化月份
function formatMonth() {
  return props.currentDate.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long'
  })
}

// 格式化时间
function formatTime(time: string) {
  return time.slice(0, 5)
}

// 处理任务点击
function handleTaskClick(task: Task) {
  if (activeTaskId.value === task.id) {
    activeTaskId.value = null
  } else {
    activeTaskId.value = task.id
  }
  
  emit('taskClick', task)
}

// 获取任务样式类
function getTaskClass(task: Task) {
  const baseClass = 'border-l-2 shadow-sm'
  
  switch (task.priority) {
    case 'high':
      return `${baseClass} bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-400`
    case 'medium':
      return `${baseClass} bg-yellow-100 border-yellow-500 dark:bg-yellow-900/30 dark:border-yellow-400`
    case 'low':
      return `${baseClass} bg-blue-100 border-blue-500 dark:bg-blue-900/30 dark:border-blue-400`
    default:
      return `${baseClass} bg-gray-100 border-gray-500 dark:bg-gray-800/50 dark:border-gray-400`
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
</script>
