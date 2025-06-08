<template>
  <div class="space-y-6">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
    
    <!-- Data display -->
    <div v-else class="space-y-6">
      <!-- Key metrics -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.goals.totalGoals') }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalGoals }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.goals.completedGoals') }}</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.completedGoals }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.goals.averageProgress') }}</p>
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.averageProgress.toFixed(1) }}%</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.goals.onTrackGoals') }}</p>
          <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ stats.onTrackGoals }}</p>
        </div>
      </div>

      <!-- Progress visualization -->
      <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{{ $t('reports.goals.progressVisualization') }}</h3>
        <div class="space-y-4">
          <div v-for="goal in goalProgress" :key="goal.name" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-900 dark:text-white">{{ goal.name }}</span>
              <span class="text-gray-600 dark:text-gray-400">{{ goal.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${goal.progress}%` }"
              ></div>
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
  totalGoals: 12,
  completedGoals: 8,
  averageProgress: 72.5,
  onTrackGoals: 9
})

// Mock goal progress data
const goalProgress = ref([
  { name: t('reports.goals.sampleGoals.learnNewSkill'), progress: 85 },
  { name: t('reports.goals.sampleGoals.fitnessGoal'), progress: 60 },
  { name: t('reports.goals.sampleGoals.readingGoal'), progress: 95 },
  { name: t('reports.goals.sampleGoals.projectDevelopment'), progress: 40 },
  { name: t('reports.goals.sampleGoals.socialImprovement'), progress: 70 }
])

// Mock loading data
const loadData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    // Regenerate progress data
    goalProgress.value = goalProgress.value.map(goal => ({
      ...goal,
      progress: Math.floor(Math.random() * 50) + 30 // Random value between 30-80
    }))
  } catch (error) {
    console.error('Failed to load goals data:', error)
  } finally {
    loading.value = false
  }
}

// Watch date changes
watch(() => [props.startDate, props.endDate], () => {
  loadData()
}, { immediate: true })
</script>
