<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('menu.dashboard')" />
    <div class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      
      <!-- 欢迎区域 -->
      <div class="mb-8">
        <h3 class="mb-2 font-semibold text-gray-800 text-2xl dark:text-white/90">
          {{ $t('common.welcome') }}, {{ currentUser?.firstName }}!
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          {{ $t('dashboard.welcomeMessage', { date: formatDate(new Date()) }) }}
        </p>
      </div>

      <!-- 网格布局：第一行 - 任务、习惯、目标 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        <!-- 任务卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {{ $t('dashboard.todayTasks') }}
            </h4>
            <router-link 
              to="/tasks"
              class="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              {{ $t('dashboard.more') }}
            </router-link>
          </div>
          
          <div v-if="tasksLoading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="animate-pulse">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          
          <div v-else-if="recentTasks.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('dashboard.noTasks') }}</p>
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="task in recentTasks" 
              :key="task.id"
              class="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <input 
                type="checkbox" 
                :checked="task.status === 'done'"
                @change="toggleTaskStatus(task)"
                class="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              >
              <div class="flex-1 min-w-0">
                <p :class="['text-sm font-medium', task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-800 dark:text-white']">
                  {{ task.name }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  <span :class="getPriorityColor(task.priority)" class="px-2 py-0.5 rounded-full text-xs font-medium">
                    {{ getPriorityText(task.priority) }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 习惯卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ $t('dashboard.todayHabits') }}
            </h4>
            <router-link 
              to="/habits"
              class="text-green-500 hover:text-green-600 text-sm font-medium"
            >
              {{ $t('dashboard.more') }}
            </router-link>
          </div>
          
          <div v-if="habitsLoading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="animate-pulse">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          
          <div v-else-if="activeHabits.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('dashboard.noHabits') }}</p>
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="habit in activeHabits" 
              :key="habit.id"
              class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <div class="flex justify-between items-center mb-2">
                <p class="text-sm font-medium text-gray-800 dark:text-white">{{ habit.name }}</p>
                <button 
                  @click="markHabitComplete(habit)"
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium transition-colors',
                    isHabitCompletedToday(habit) 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-green-100 hover:text-green-800'
                  ]"
                >
                  {{ isHabitCompletedToday(habit) ? $t('dashboard.taskCompleted') : $t('dashboard.markComplete') }}
                </button>
              </div>
              <div class="flex items-center text-xs text-gray-500">
                <span>{{ $t('dashboard.consecutiveDays', { count: habit.streakCount }) }}</span>
                <span class="mx-2">•</span>
                <span>{{ $t('dashboard.goalTarget', { target: getFrequencyText(habit.frequency) }) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 目标卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {{ $t('dashboard.activeGoals') }}
            </h4>
            <router-link 
              to="/goals"
              class="text-purple-500 hover:text-purple-600 text-sm font-medium"
            >
              {{ $t('dashboard.more') }}
            </router-link>
          </div>
          
          <div v-if="goalsLoading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="animate-pulse">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          
          <div v-else-if="activeGoals.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('dashboard.noGoals') }}</p>
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="goal in activeGoals" 
              :key="goal.id"
              class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <div class="flex justify-between items-start mb-2">
                <p class="text-sm font-medium text-gray-800 dark:text-white">{{ goal.title }}</p>
                <span class="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  {{ Math.round(goal.progressPercentage || 0) }}%
                </span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                <div 
                  class="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${Math.min(goal.progressPercentage || 0, 100)}%` }"
                ></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500">
                <span>{{ goal.startDate ? formatDate(new Date(goal.startDate)) : $t('dashboard.notSet') }}</span>
                <span>{{ $t('dashboard.dueDate', { date: goal.targetDate ? formatDate(new Date(goal.targetDate)) : $t('dashboard.notSet') }) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 第二行 - 番茄钟 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 番茄钟卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex justify-between items-center mb-6">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <svg class="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ $t('dashboard.pomodoroTimer') }}
            </h4>
            <router-link 
              to="/pomodoro"
              class="text-red-500 hover:text-red-600 text-sm font-medium"
            >
              {{ $t('dashboard.more') }}
            </router-link>
          </div>
          
          <div class="text-center">
            <div class="mb-6">
              <div class="text-4xl font-mono font-bold text-gray-800 dark:text-white mb-2">
                {{ formatTime(pomodoroTime) }}
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ pomodoroStatus === 'work' ? $t('dashboard.focusTime') : pomodoroStatus === 'shortBreak' ? $t('dashboard.shortBreak') : pomodoroStatus === 'longBreak' ? $t('dashboard.longBreak') : $t('dashboard.readyToStart') }}
              </p>
            </div>
            
            <div class="flex justify-center space-x-3">
              <button 
                @click="togglePomodoro"
                :class="[
                  'px-6 py-2 rounded-lg font-medium transition-colors',
                  pomodoroRunning 
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                ]"
              >
                {{ pomodoroRunning ? $t('dashboard.pause') : $t('dashboard.start') }}
              </button>
              <button 
                @click="resetPomodoro"
                class="px-6 py-2 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 text-white transition-colors"
              >
                {{ $t('dashboard.reset') }}
              </button>
            </div>
          </div>
        </div>

        <!-- 今日统计 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg class="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {{ $t('dashboard.todayStats') }}
          </h4>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ completedTasksToday }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('dashboard.completedTasks') }}</div>
            </div>
            <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ completedHabitsToday }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('dashboard.completedHabits') }}</div>
            </div>
            <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ pomodoroSessionsToday }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('dashboard.pomodoroSessions') }}</div>
            </div>
            <div class="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ Math.round(avgGoalProgress) }}%</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('dashboard.avgGoalProgress') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { userService } from '@/services/userService'
import * as taskService from '@/services/taskService'
import * as habitService from '@/services/habitService'
import * as goalService from '@/services/goalService'
import * as pomodoroService from '@/services/pomodoroService'
import type User from '@/services/types/UserType'
import type Task from '@/services/types/TaskType'
import type Habit from '@/services/types/HabitType'
import type { Goal } from '@/services/types/GoalType'

const { t, locale } = useI18n()
const currentUser = ref<User | null>(null)

// 任务相关
const recentTasks = ref<Task[]>([])
const tasksLoading = ref(true)

// 习惯相关
const activeHabits = ref<Habit[]>([])
const habitsLoading = ref(true)

// 目标相关
const activeGoals = ref<Goal[]>([])
const goalsLoading = ref(true)

// 番茄钟相关
const pomodoroTime = ref(25 * 60) // 默认25分钟
const pomodoroRunning = ref(false)
const pomodoroStatus = ref<'idle' | 'work' | 'shortBreak' | 'longBreak'>('idle')
const pomodoroInterval = ref<number | null>(null)

// 统计数据
const completedTasksToday = ref(0)
const completedHabitsToday = ref(0)
const pomodoroSessionsToday = ref(0)
const avgGoalProgress = computed(() => {
  if (activeGoals.value.length === 0) return 0
  const total = activeGoals.value.reduce((sum, goal) => sum + (goal.progressPercentage || 0), 0)
  return total / activeGoals.value.length
})

// 工具函数
const formatDate = (date: Date) => {
  const { locale } = useI18n()
  const localeCode = locale.value === 'zh' ? 'zh-CN' : 'en-US'
  return date.toLocaleDateString(localeCode, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  })
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'high': return t('dashboard.highPriority')
    case 'medium': return t('dashboard.mediumPriority')
    case 'low': return t('dashboard.lowPriority')
    default: return t('dashboard.normalPriority')
  }
}

const getFrequencyText = (frequency: Habit['frequency']) => {
  switch (frequency.type) {
    case 'daily': return t('dashboard.daily')
    case 'weekly': return t('dashboard.weekly')
    case 'monthly': return t('dashboard.monthly')
    default: return t('dashboard.custom')
  }
}

const isHabitCompletedToday = (habit: Habit) => {
  const today = new Date().toISOString().split('T')[0]
  return habit.completionHistory.some(h => h.date === today && h.isCompleted)
}

// 任务相关方法
const loadRecentTasks = async () => {
  try {
    tasksLoading.value = true
    const response = await taskService.getTasks({ page: 1, pageSize: 3, status: 'todo' })
    recentTasks.value = response.data
  } catch (error) {
    console.error('加载任务失败:', error)
    recentTasks.value = []
  } finally {
    tasksLoading.value = false
  }
}

const toggleTaskStatus = async (task: Task) => {
  try {
    const newStatus = task.status === 'done' ? 'todo' : 'done'
    await taskService.updateTask(task.id, { ...task, status: newStatus })
    task.status = newStatus
    
    if (newStatus === 'done') {
      completedTasksToday.value++
    } else {
      completedTasksToday.value = Math.max(0, completedTasksToday.value - 1)
    }
  } catch (error) {
    console.error('更新任务状态失败:', error)
  }
}

// 习惯相关方法
const loadActiveHabits = async () => {
  try {
    habitsLoading.value = true
    const response = await habitService.getHabits({ page: 1, pageSize: 3 })
    activeHabits.value = response.data
  } catch (error) {
    console.error('加载习惯失败:', error)
    activeHabits.value = []
  } finally {
    habitsLoading.value = false
  }
}

const markHabitComplete = async (habit: Habit) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const alreadyCompleted = isHabitCompletedToday(habit)
    
    if (!alreadyCompleted) {
      // 这里应该调用标记习惯完成的API
      await habitService.markHabitComplete(habit.id, today)
      
      // 更新本地状态
      habit.completionHistory.push({
        date: today,
        isCompleted: true,
        note: null
      })
      
      completedHabitsToday.value++
    }
  } catch (error) {
    console.error('标记习惯完成失败:', error)
  }
}

// 目标相关方法
const loadActiveGoals = async () => {
  try {
    goalsLoading.value = true
    const response = await goalService.getGoals({ page: 1, pageSize: 3, status: 'active' })
    activeGoals.value = response.data
  } catch (error) {
    console.error('加载目标失败:', error)
    activeGoals.value = []
  } finally {
    goalsLoading.value = false
  }
}

// 番茄钟相关方法
const togglePomodoro = () => {
  if (pomodoroRunning.value) {
    pausePomodoro()
  } else {
    startPomodoro()
  }
}

const startPomodoro = () => {
  pomodoroRunning.value = true
  if (pomodoroStatus.value === 'idle') {
    pomodoroStatus.value = 'work'
    pomodoroTime.value = 25 * 60
  }
  
  pomodoroInterval.value = setInterval(() => {
    pomodoroTime.value--
    
    if (pomodoroTime.value <= 0) {
      completeSession()
    }
  }, 1000)
}

const pausePomodoro = () => {
  pomodoroRunning.value = false
  if (pomodoroInterval.value) {
    clearInterval(pomodoroInterval.value)
    pomodoroInterval.value = null
  }
}

const resetPomodoro = () => {
  pausePomodoro()
  pomodoroStatus.value = 'idle'
  pomodoroTime.value = 25 * 60
}

const completeSession = () => {
  pausePomodoro()
  pomodoroSessionsToday.value++
  
  // 简化的休息逻辑
  if (pomodoroStatus.value === 'work') {
    pomodoroStatus.value = 'shortBreak'
    pomodoroTime.value = 5 * 60
  } else {
    pomodoroStatus.value = 'work'
    pomodoroTime.value = 25 * 60
  }
}

// 加载统计数据
const loadTodayStats = async () => {
  try {
    // 这里应该调用实际的统计API
    // 现在使用模拟数据
    completedTasksToday.value = 0
    completedHabitsToday.value = 0
    pomodoroSessionsToday.value = 0
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

onMounted(async () => {
  // 先用本地缓存渲染
  currentUser.value = userService.getCurrentUser()
  
  // 并行加载所有数据
  await Promise.all([
    loadCurrentUser(),
    loadRecentTasks(),
    loadActiveHabits(),
    loadActiveGoals(),
    loadTodayStats()
  ])
})

const loadCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const user = await res.json()
        currentUser.value = user
        localStorage.setItem('user', JSON.stringify(user))
      }
    }
  } catch {
    // 可选：处理异常
  }
}

onUnmounted(() => {
  if (pomodoroInterval.value) {
    clearInterval(pomodoroInterval.value)
  }
})
</script>
