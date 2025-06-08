<template>
  <div class="space-y-6">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>
    
    <!-- Data display -->
    <div v-else class="space-y-6">
      <!-- Key metrics -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.stats.totalTasks') }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalTasks }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.stats.completed') }}</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.completedTasks }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.stats.inProgress') }}</p>
          <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ stats.pendingTasks }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.stats.completionRate') }}</p>
          <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ stats.completionRate.toFixed(1) }}%</p>
        </div>
      </div>

      <!-- Task completion trend -->
      <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{{ $t('reports.stats.completionTrend') }}</h3>
        <div class="h-40 flex items-end justify-center space-x-2">
          <div
            v-for="(day, index) in completionTrend"
            :key="index"
            class="flex flex-col items-center space-y-1"
          >
            <div
              :class="[
                'bg-purple-500 rounded-t transition-all duration-300',
                'w-8 flex items-end justify-center text-xs text-white font-medium'
              ]"
              :style="{ height: `${(day.count / Math.max(...completionTrend.map(d => d.count))) * 120}px` }"
              :title="`${$t('common.day')} ${index + 1}: ${day.count}${$t('tasks.status.completed')}`"
            >
              {{ day.count }}
            </div>
            <span class="text-xs text-gray-500">{{ day.date }}</span>
          </div>
        </div>
      </div>

      <!-- Priority and status distribution -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Priority distribution -->
        <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{{ $t('reports.stats.priorityDistribution') }}</h3>
          <div class="space-y-3">
            <div v-for="priority in priorityDistribution" :key="priority.name" class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div :class="['w-3 h-3 rounded-full', priority.color]"></div>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ priority.name }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    :class="['h-2 rounded-full', priority.color]"
                    :style="{ width: `${priority.percentage}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ priority.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Status distribution -->
        <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{{ $t('reports.stats.statusDistribution') }}</h3>
          <div class="space-y-3">
            <div v-for="status in statusDistribution" :key="status.name" class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div :class="['w-3 h-3 rounded-full', status.color]"></div>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ status.name }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    :class="['h-2 rounded-full', status.color]"
                    :style="{ width: `${status.percentage}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ status.count }}</span>
              </div>
            </div>
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
  totalTasks: 156,
  completedTasks: 134,
  pendingTasks: 22,
  completionRate: 85.9
})

// Mock completion trend data
const completionTrend = ref([
  { date: t('taskCalendar.weekdays.monday'), count: 12 },
  { date: t('taskCalendar.weekdays.tuesday'), count: 8 },
  { date: t('taskCalendar.weekdays.wednesday'), count: 15 },
  { date: t('taskCalendar.weekdays.thursday'), count: 10 },
  { date: t('taskCalendar.weekdays.friday'), count: 18 },
  { date: t('taskCalendar.weekdays.saturday'), count: 6 },
  { date: t('taskCalendar.weekdays.sunday'), count: 4 }
])

// Priority distribution data
const priorityDistribution = ref([
  { name: t('reports.stats.highPriority'), color: 'bg-red-500', count: 25, percentage: 60 },
  { name: t('reports.stats.mediumPriority'), color: 'bg-yellow-500', count: 18, percentage: 43 },
  { name: t('reports.stats.lowPriority'), color: 'bg-green-500', count: 12, percentage: 29 }
])

// Status distribution data
const statusDistribution = ref([
  { name: t('reports.stats.completed'), color: 'bg-green-500', count: 134, percentage: 86 },
  { name: t('reports.stats.inProgress'), color: 'bg-blue-500', count: 15, percentage: 10 },
  { name: t('reports.stats.todo'), color: 'bg-gray-500', count: 7, percentage: 4 }
])

// Mock loading data
const loadData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    // Regenerate trend data
    completionTrend.value = completionTrend.value.map(day => ({
      ...day,
      count: Math.floor(Math.random() * 15) + 3
    }))
  } catch (error) {
    console.error('Failed to load tasks data:', error)
  } finally {
    loading.value = false
  }
}

// Watch date changes
watch(() => [props.startDate, props.endDate], () => {
  loadData()
}, { immediate: true })
</script>
