<template>
  <div class="space-y-6">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
    </div>
    
    <!-- Data display -->
    <div v-else class="space-y-6">
      <!-- Key metrics -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.timeEfficiency.totalTime') }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatTime(stats.totalTime) }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.timeEfficiency.effectiveTime') }}</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ formatTime(stats.effectiveTime) }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.timeEfficiency.efficiency') }}</p>
          <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ stats.efficiency.toFixed(1) }}%</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.timeEfficiency.averageSession') }}</p>
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ formatTime(stats.averageSessionTime) }}</p>
        </div>
      </div>

      <!-- Time efficiency visualization -->
      <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{{ $t('reports.timeEfficiency.dailyTrend') }}</h3>
        <div class="h-40 flex items-end justify-center space-x-3">
          <div
            v-for="(day, index) in efficiencyTrend"
            :key="index"
            class="flex flex-col items-center space-y-1"
          >
            <div
              :class="[
                'rounded-t transition-all duration-300 w-8 flex items-end justify-center text-xs text-white font-medium',
                getEfficiencyColor(day.efficiency)
              ]"
              :style="{ height: `${(day.efficiency / 100) * 120}px` }"
              :title="`${$t('common.day')} ${index + 1}: ${day.efficiency}%`"
            >
              {{ day.efficiency }}
            </div>
            <span class="text-xs text-gray-500">{{ $t('common.day') }} {{ index + 1 }}</span>
          </div>
        </div>
      </div>

      <!-- Efficiency analysis -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Time allocation -->
        <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{{ $t('reports.timeEfficiency.timeAllocation') }}</h3>
          <div class="space-y-3">
            <div v-for="category in timeCategories" :key="category.name" class="flex items-center justify-between">
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ category.name }}</span>
              <div class="flex items-center space-x-2">
                <div class="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    :class="['h-2 rounded-full', category.color]"
                    :style="{ width: `${category.percentage}%` }"
                  ></div>
                </div>
                <span class="text-xs text-gray-500">{{ category.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Efficiency levels -->
        <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{{ $t('reports.timeEfficiency.efficiencyLevels') }}</h3>
          <div class="space-y-3">
            <div v-for="level in efficiencyLevels" :key="level.name" class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div :class="['w-3 h-3 rounded-full', level.color]"></div>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ level.name }}</span>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ level.count }}次</span>
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
  totalTime: 28800, // 8 hours in seconds
  effectiveTime: 23040, // 6.4 hours
  efficiency: 80.0,
  averageSessionTime: 3600 // 1 hour
})

// Mock efficiency trend data
const efficiencyTrend = ref(
  Array.from({ length: 7 }, (_, i) => ({
    efficiency: Math.floor(Math.random() * 30) + 60 // Random value between 60-90
  }))
)

// Time categories data
const timeCategories = ref([
  { name: t('reports.timeEfficiency.categories.focusWork'), percentage: 65, color: 'bg-green-500' },
  { name: t('reports.timeEfficiency.categories.learning'), percentage: 20, color: 'bg-blue-500' },
  { name: t('reports.timeEfficiency.categories.meeting'), percentage: 10, color: 'bg-yellow-500' },
  { name: t('reports.timeEfficiency.categories.other'), percentage: 5, color: 'bg-gray-500' }
])

// Efficiency levels data
const efficiencyLevels = ref([
  { name: t('reports.timeEfficiency.levels.high'), color: 'bg-green-500', count: 15 },
  { name: t('reports.timeEfficiency.levels.medium'), color: 'bg-yellow-500', count: 8 },
  { name: t('reports.timeEfficiency.levels.low'), color: 'bg-red-500', count: 3 }
])

// Format time display
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}${t('common.hour')} ${minutes}${t('common.minute')}`
  }
  return `${minutes}${t('common.minute')}`
}

// Get efficiency color
const getEfficiencyColor = (efficiency: number): string => {
  if (efficiency >= 80) return 'bg-green-500'
  if (efficiency >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

// Mock loading data
const loadData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 700))
    // Regenerate efficiency trend data
    efficiencyTrend.value = Array.from({ length: 7 }, (_, i) => ({
      efficiency: Math.floor(Math.random() * 30) + 60
    }))
  } catch (error) {
    console.error('Failed to load time efficiency data:', error)
  } finally {
    loading.value = false
  }
}

// Watch date changes
watch(() => [props.startDate, props.endDate], () => {
  loadData()
}, { immediate: true })
</script>
