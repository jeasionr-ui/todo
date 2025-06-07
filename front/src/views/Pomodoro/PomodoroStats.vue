<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <button
              @click="$router.go(-1)"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('pomodoro.stats.title') }}</h1>
          </div>
          <div class="flex items-center space-x-2">
            <select
              v-model="selectedPeriod"
              @change="loadStats"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
            >
              <option value="week">{{ $t('pomodoro.stats.thisWeek') }}</option>
              <option value="month">{{ $t('pomodoro.stats.thisMonth') }}</option>
              <option value="quarter">{{ $t('pomodoro.stats.thisQuarter') }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('pomodoro.stats.totalSessions') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ overviewStats.totalSessions }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('pomodoro.stats.completedSessions') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ overviewStats.completedSessions }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('pomodoro.stats.totalFocusTime') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ formatTime(overviewStats.totalFocusTime) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('pomodoro.stats.avgProductivity') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ overviewStats.avgProductivity.toFixed(1) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Daily Sessions Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('pomodoro.stats.dailySessions') }}</h3>
          <div class="h-64">
            <canvas ref="dailyChart"></canvas>
          </div>
        </div>

        <!-- Productivity Trends -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('pomodoro.stats.productivityTrend') }}</h3>
          <div class="h-64">
            <canvas ref="productivityChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Detailed Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Time Distribution -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('pomodoro.stats.timeDistribution') }}</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pomodoro.stats.workTime') }}</span>
              <div class="flex items-center space-x-2">
                <div class="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    class="bg-blue-600 h-2 rounded-full" 
                    :style="{ width: `${(overviewStats.totalWorkTime / (overviewStats.totalWorkTime + overviewStats.totalBreakTime)) * 100}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatTime(overviewStats.totalWorkTime) }}</span>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pomodoro.stats.breakTime') }}</span>
              <div class="flex items-center space-x-2">
                <div class="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    class="bg-green-600 h-2 rounded-full" 
                    :style="{ width: `${(overviewStats.totalBreakTime / (overviewStats.totalWorkTime + overviewStats.totalBreakTime)) * 100}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatTime(overviewStats.totalBreakTime) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Session Completion Rate -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('pomodoro.stats.completionRate') }}</h3>
          <div class="flex items-center justify-center">
            <div class="relative w-32 h-32">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <!-- Background circle -->
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="8"
                  class="text-gray-200 dark:text-gray-700"
                />
                <!-- Progress circle -->
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10B981"
                  stroke-width="8"
                  stroke-linecap="round"
                  :stroke-dasharray="251.2"
                  :stroke-dashoffset="251.2 * (1 - (overviewStats.completedSessions / overviewStats.totalSessions))"
                  class="transition-all duration-1000 ease-out"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ Math.round((overviewStats.completedSessions / overviewStats.totalSessions) * 100) }}%
                </span>
              </div>
            </div>
          </div>
          <div class="text-center mt-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ overviewStats.completedSessions }} {{ $t('pomodoro.stats.of') }} {{ overviewStats.totalSessions }} {{ $t('pomodoro.stats.sessionsCompleted') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Recent Sessions -->
      <div class="mt-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('pomodoro.stats.recentSessions') }}</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {{ $t('pomodoro.stats.date') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {{ $t('pomodoro.stats.task') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {{ $t('pomodoro.stats.duration') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {{ $t('pomodoro.stats.status') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {{ $t('pomodoro.stats.productivity') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="session in recentSessions" :key="session.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatDate(session.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ session.task_title || $t('pomodoro.focusSession') }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ session.actual_duration || session.planned_duration }}min
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        getStatusColor(session.status)
                      ]"
                    >
                      {{ $t(`pomodoro.status.${session.status}`) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div class="flex items-center">
                      <div class="flex">
                        <svg
                          v-for="star in 5"
                          :key="star"
                          :class="[
                            'w-4 h-4',
                            star <= (session.productivity_rating || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                          ]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { pomodoroService } from '@/services/pomodoroService'
import type { PomodoroSession } from '@/types/pomodoro'

const { t } = useI18n()

// Chart references
const dailyChart = ref<HTMLCanvasElement>()
const productivityChart = ref<HTMLCanvasElement>()

// Reactive state
const selectedPeriod = ref('week')
const recentSessions = ref<PomodoroSession[]>([])

const overviewStats = ref({
  totalSessions: 0,
  completedSessions: 0,
  totalFocusTime: 0,
  totalWorkTime: 0,
  totalBreakTime: 0,
  avgProductivity: 0
})

// Methods
const loadStats = async () => {
  try {
    // Load recent sessions
    const sessions = await pomodoroService.getSessionHistory(1, 10)
    recentSessions.value = sessions.sessions

    // Calculate overview stats
    overviewStats.value.totalSessions = sessions.sessions.length
    overviewStats.value.completedSessions = sessions.sessions.filter(s => s.status === 'completed').length
    overviewStats.value.totalWorkTime = sessions.sessions.reduce((sum, s) => sum + (s.actual_duration || s.planned_duration || 0), 0)
    overviewStats.value.totalBreakTime = Math.floor(overviewStats.value.totalWorkTime * 0.2) // Estimate 20% break time
    overviewStats.value.totalFocusTime = overviewStats.value.totalWorkTime
    
    const productivityRatings = sessions.sessions
      .filter(s => s.productivity_rating)
      .map(s => s.productivity_rating!)
    
    overviewStats.value.avgProductivity = productivityRatings.length > 0
      ? productivityRatings.reduce((sum, rating) => sum + rating, 0) / productivityRatings.length
      : 0

    // Create charts
    await nextTick()
    createCharts()
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

const createCharts = () => {
  // Mock chart creation - replace with actual Chart.js implementation
  if (dailyChart.value) {
    const ctx = dailyChart.value.getContext('2d')
    if (ctx) {
      // Create daily sessions chart
      console.log('Creating daily sessions chart')
    }
  }

  if (productivityChart.value) {
    const ctx = productivityChart.value.getContext('2d')
    if (ctx) {
      // Create productivity trend chart
      console.log('Creating productivity chart')
    }
  }
}

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`
  }
  return `${remainingMinutes}m`
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const getStatusColor = (status: string): string => {
  const colors = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    running: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  loadStats()
})
</script>
