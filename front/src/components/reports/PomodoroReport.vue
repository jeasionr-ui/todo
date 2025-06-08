<template>
  <div class="space-y-6">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
    </div>
    
    <!-- Data display -->
    <div v-else class="space-y-6">
      <!-- Key metrics -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.stats.totalSessions') }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalSessions }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.stats.completedSessions') }}</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.completedSessions }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.stats.focusTime') }}</p>
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ formatTime(stats.totalFocusTime) }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.stats.avgSessionLength') }}</p>
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.averageSessionLength }}{{ $t('common.minute') }}</p>
        </div>
      </div>

      <!-- Focus time trend -->
      <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{{ $t('reports.pomodoro.focusTime') }}</h3>
        <div class="h-40 flex items-end justify-center space-x-2">
          <div
            v-for="(day, index) in focusTrend"
            :key="index"
            class="flex flex-col items-center space-y-1"
          >
            <div
              :class="[
                'bg-red-500 rounded-t transition-all duration-300',
                'w-8 flex items-end justify-center text-xs text-white font-medium'
              ]"
              :style="{ height: `${(day.minutes / Math.max(...focusTrend.map(d => d.minutes))) * 120}px` }"
              :title="`${day.day}: ${day.minutes}${t('common.minute')}`"
            >
              {{ day.sessions }}
            </div>
            <span class="text-xs text-gray-500">{{ day.day }}</span>
          </div>
        </div>
      </div>

      <!-- Pomodoro details -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Time period distribution -->
        <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{{ $t('reports.pomodoro.timeDistribution') }}</h3>
          <div class="space-y-3">
            <div v-for="period in timePeriods" :key="period.name" class="flex items-center justify-between">
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ period.name }}</span>
              <div class="flex items-center space-x-2">
                <div class="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    class="bg-red-500 h-2 rounded-full"
                    :style="{ width: `${period.percentage}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ period.sessions }}{{ $t('reports.stats.sessions') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Session status -->
        <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{{ $t('reports.pomodoro.sessionStatus') }}</h3>
          <div class="space-y-3">
            <div v-for="status in sessionStatus" :key="status.name" class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div :class="['w-3 h-3 rounded-full', status.color]"></div>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ status.name }}</span>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ status.count }}{{ $t('reports.stats.sessions') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pomodoro efficiency indicators -->
      <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{{ $t('reports.pomodoro.efficiency') }}</h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="text-center">
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.completionRate.toFixed(1) }}%</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.pomodoro.completionRate') }}</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.streakDays }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.pomodoro.streakDays') }}</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.productivityScore }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.pomodoro.productivityScore') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  startDate: string
  endDate: string
}

const props = defineProps<Props>()
const { t } = useI18n()
const loading = ref(true)

// Mock statistics data
const stats = ref({
  totalSessions: 45,
  completedSessions: 38,
  totalFocusTime: 1140, // 19 hours in minutes
  averageSessionLength: 25,
  completionRate: 84.4,
  streakDays: 7,
  productivityScore: 92
})

// Mock focus trend data
const focusTrend = ref([
  { day: t('taskCalendar.weekdays.monday'), sessions: 8, minutes: 200 },
  { day: t('taskCalendar.weekdays.tuesday'), sessions: 6, minutes: 150 },
  { day: t('taskCalendar.weekdays.wednesday'), sessions: 10, minutes: 250 },
  { day: t('taskCalendar.weekdays.thursday'), sessions: 7, minutes: 175 },
  { day: t('taskCalendar.weekdays.friday'), sessions: 9, minutes: 225 },
  { day: t('taskCalendar.weekdays.saturday'), sessions: 4, minutes: 100 },
  { day: t('taskCalendar.weekdays.sunday'), sessions: 3, minutes: 75 }
])

// Time period distribution data
const timePeriods = ref([
  { name: '9-12', sessions: 18, percentage: 75 },
  { name: '13-17', sessions: 15, percentage: 62 },
  { name: '18-21', sessions: 12, percentage: 50 }
])

// Session status data
const sessionStatus = ref([
  { name: t('reports.pomodoro.sessionType.completed'), color: 'bg-green-500', count: 38 },
  { name: t('reports.pomodoro.sessionType.interrupted'), color: 'bg-yellow-500', count: 5 },
  { name: t('reports.pomodoro.sessionType.skipped'), color: 'bg-red-500', count: 2 }
])

// Format time display
const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}${t('common.hour')} ${mins}${t('common.minute')}`
  }
  return `${mins}${t('common.minute')}`
}

// Mock loading data
const loadData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    // Regenerate trend data
    focusTrend.value = focusTrend.value.map(day => ({
      ...day,
      sessions: Math.floor(Math.random() * 8) + 3,
      minutes: Math.floor(Math.random() * 200) + 75
    }))
  } catch (error) {
    console.error('Failed to load pomodoro data:', error)
  } finally {
    loading.value = false
  }
}

// Watch date changes
watch(() => [props.startDate, props.endDate], () => {
  loadData()
}, { immediate: true })
</script>
