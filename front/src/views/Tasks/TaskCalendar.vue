<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('taskCalendar.title')" />
    <div class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      
      <!-- 头部导航 -->
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h3 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
          {{ $t('taskCalendar.title') }}
        </h3>
        
        <!-- 视图切换按钮 -->
        <div class="flex space-x-2">
          <button
            v-for="view in viewOptions"
            :key="view.value"
            @click="currentView = view.value"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              currentView === view.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            ]"
          >
            {{ view.label }}
          </button>
        </div>
      </div>

      <!-- 日期导航 -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click="navigateDate(-1)"
            class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white">
            {{ formatDisplayDate() }}
          </h4>
          
          <button
            @click="navigateDate(1)"
            class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <button
          @click="goToToday"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {{ $t('taskCalendar.today') }}
        </button>
      </div>

      <!-- 视图容器 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        <!-- 今日时间轴视图 -->
        <div v-if="currentView === 'today'" class="p-6">
          <DayTimelineView 
            :tasks="filteredTasks"
            :current-date="currentDate"
            @task-click="handleTaskClick"
          />
        </div>

        <!-- 本周日历视图 -->
        <div v-else-if="currentView === 'week'" class="p-6">
          <WeekCalendarView 
            :tasks="filteredTasks"
            :current-date="currentDate"
            @task-click="handleTaskClick"
            @date-click="handleDateClick"
          />
        </div>

        <!-- 本月日历视图 -->
        <div v-else-if="currentView === 'month'" class="p-6">
          <MonthCalendarView 
            :tasks="filteredTasks"
            :current-date="currentDate"
            @task-click="handleTaskClick"
            @date-click="handleDateClick"
          />
        </div>

      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from '@/i18n'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import DayTimelineView from '@/components/calendar/DayTimelineView.vue'
import WeekCalendarView from '@/components/calendar/WeekCalendarView.vue'
import MonthCalendarView from '@/components/calendar/MonthCalendarView.vue'
import { getTasks } from '@/services/taskService'
import type Task from '@/services/types/TaskType'

const { t, locale } = useI18n()

// 视图选项
const viewOptions = computed(() => [
  { value: 'today' as const, label: t('taskCalendar.todayView') },
  { value: 'week' as const, label: t('taskCalendar.weekView') },
  { value: 'month' as const, label: t('taskCalendar.monthView') }
])

// 响应式数据
const currentView = ref<'today' | 'week' | 'month'>('today')
const currentDate = ref(new Date())
const tasks = ref<Task[]>([])
const loading = ref(false)

// 根据当前视图和日期过滤任务
const filteredTasks = computed(() => {
  const now = new Date(currentDate.value)
  
  return tasks.value.filter(task => {
    if (!task.dueDate) return false
    
    const taskDate = new Date(task.dueDate)
    
    switch (currentView.value) {
      case 'today':
        return isSameDay(taskDate, now)
      case 'week':
        return isInSameWeek(taskDate, now)
      case 'month':
        return isInSameMonth(taskDate, now)
      default:
        return false
    }
  })
})

// 格式化显示日期
const formatDisplayDate = () => {
  const date = currentDate.value
  const now = new Date()
  
  switch (currentView.value) {
    case 'today':
      if (isSameDay(date, now)) {
        return t('taskCalendar.today')
      }
      return date.toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    case 'week':
      const weekStart = getWeekStart(date)
      const weekEnd = getWeekEnd(date)
      return `${formatShortDate(weekStart)} - ${formatShortDate(weekEnd)}`
    case 'month':
      return date.toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'long'
      })
    default:
      return ''
  }
}

// 导航日期
const navigateDate = (direction: number) => {
  const date = new Date(currentDate.value)
  
  switch (currentView.value) {
    case 'today':
      date.setDate(date.getDate() + direction)
      break
    case 'week':
      date.setDate(date.getDate() + (direction * 7))
      break
    case 'month':
      date.setMonth(date.getMonth() + direction)
      break
  }
  
  currentDate.value = date
}

// 回到今天
const goToToday = () => {
  currentDate.value = new Date()
}

// 处理任务点击
const handleTaskClick = (task: Task) => {
  console.log('Task clicked:', task)
  // TODO: 打开任务详情弹窗或跳转到任务详情页
}

// 处理日期点击（用于周视图和月视图）
const handleDateClick = (date: string | Date) => {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  currentDate.value = targetDate
  currentView.value = 'today'
}

// 加载任务
const loadTasks = async () => {
  loading.value = true
  try {
    const result = await getTasks({
      pageSize: 1000 // 获取大量任务用于日历显示
    })
    tasks.value = result.data
  } catch (error) {
    console.error('Failed to load tasks:', error)
  } finally {
    loading.value = false
  }
}

// 工具函数
const isSameDay = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

const isInSameWeek = (date1: Date, date2: Date) => {
  const weekStart1 = getWeekStart(date1)
  const weekStart2 = getWeekStart(date2)
  return isSameDay(weekStart1, weekStart2)
}

const isInSameMonth = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth()
}

const getWeekStart = (date: Date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // 周一作为第一天
  return new Date(d.setDate(diff))
}

const getWeekEnd = (date: Date) => {
  const start = getWeekStart(date)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return end
}

const formatShortDate = (date: Date) => {
  return date.toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'short',
    day: 'numeric'
  })
}

// 监听视图变化重新加载数据
watch(currentView, () => {
  loadTasks()
})

// 生命周期
onMounted(() => {
  loadTasks()
})
</script>

<style scoped>
/* 可以添加一些自定义样式 */
</style>
