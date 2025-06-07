<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="$emit('update:show', false)"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('pomodoro.sessionDetail.title') }}
          </h3>
          <button
            @click="$emit('update:show', false)"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div v-if="session" class="px-6 py-4">
        <!-- Session Info -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">{{ $t('pomodoro.sessionDetail.basicInfo') }}</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ $t('pomodoro.sessionDetail.sessionId') }}</span>
                  <span class="text-gray-900 dark:text-white">#{{ session.id }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ $t('pomodoro.sessionDetail.status') }}</span>
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                      getStatusColor(session.status)
                    ]"
                  >
                    {{ $t(`pomodoro.status.${session.status}`) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ $t('pomodoro.sessionDetail.createdAt') }}</span>
                  <span class="text-gray-900 dark:text-white">{{ formatDateTime(session.createdAt) }}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">{{ $t('pomodoro.sessionDetail.timing') }}</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ $t('pomodoro.sessionDetail.plannedDuration') }}</span>
                  <span class="text-gray-900 dark:text-white">{{ session.plannedDuration }}min</span>
                </div>
                <div v-if="session.actualDuration" class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ $t('pomodoro.sessionDetail.actualDuration') }}</span>
                  <span class="text-gray-900 dark:text-white">{{ session.actualDuration }}min</span>
                </div>
                <div v-if="session.startTime" class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ $t('pomodoro.sessionDetail.startedAt') }}</span>
                  <span class="text-gray-900 dark:text-white">{{ formatDateTime(session.startTime) }}</span>
                </div>
                <div v-if="session.endTime" class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ $t('pomodoro.sessionDetail.endedAt') }}</span>
                  <span class="text-gray-900 dark:text-white">{{ formatDateTime(session.endTime) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Task Info -->
        <div v-if="session.taskId" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">{{ $t('pomodoro.sessionDetail.taskInfo') }}</h4>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ session.taskId ? `Task ${session.taskId}` : $t('pomodoro.sessionDetail.unknownTask') }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pomodoro.sessionDetail.taskId') }}: {{ session.taskId }}</p>
            </div>
            <button
              @click="goToTask"
              class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              {{ $t('pomodoro.sessionDetail.viewTask') }}
            </button>
          </div>
        </div>

        <!-- Template Info -->
        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">{{ $t('pomodoro.sessionDetail.templateInfo') }}</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">{{ $t('pomodoro.sessionDetail.templateName') }}</span>
              <span class="text-gray-900 dark:text-white">{{ session.templateId ? `Template ${session.templateId}` : $t('pomodoro.sessionDetail.defaultTemplate') }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">{{ $t('pomodoro.sessionDetail.templateId') }}</span>
              <span class="text-gray-900 dark:text-white">#{{ session.templateId }}</span>
            </div>
          </div>
        </div>

        <!-- Productivity Rating -->
        <div v-if="session.productivity" class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">{{ $t('pomodoro.sessionDetail.productivity') }}</h4>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex">
                <svg
                  v-for="star in 5"
                  :key="star"
                  :class="[
                    'w-5 h-5',
                    star <= getProductivityRating(session.productivity) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  ]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">{{ getProductivityRating(session.productivity) }}/5</span>
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ getProductivityText(getProductivityRating(session.productivity)) }}</span>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="session.notes" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">{{ $t('pomodoro.sessionDetail.notes') }}</h4>
          <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ session.notes }}</p>
        </div>

        <!-- Pause Records -->
        <div v-if="pauseRecords.length > 0" class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-gray-900 dark:text-white mb-3">{{ $t('pomodoro.sessionDetail.pauseRecords') }}</h4>
          <div class="space-y-3">
            <div
              v-for="(pause, index) in pauseRecords"
              :key="pause.id"
              class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border"
            >
              <div class="flex-1">
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                    {{ $t('pomodoro.sessionDetail.pause') }} {{ index + 1 }}
                  </span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    {{ formatDateTime(pause.pauseTime) }}
                  </span>
                </div>
                <div v-if="pause.resumeTime" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {{ $t('pomodoro.sessionDetail.resumed') }}: {{ formatDateTime(pause.resumeTime) }}
                  <span class="ml-2 text-xs text-gray-500">
                    ({{ $t('pomodoro.sessionDetail.duration') }}: {{ calculatePauseDuration(pause) }})
                  </span>
                </div>
                <div v-if="pause.reason" class="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {{ $t('pomodoro.sessionDetail.reason') }}: {{ pause.reason }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Session Timeline -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 class="font-medium text-gray-900 dark:text-white mb-3">{{ $t('pomodoro.sessionDetail.timeline') }}</h4>
          <div class="relative">
            <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
            <div class="space-y-4">
              <!-- Session Created -->
              <div class="relative flex items-center">
                <div class="absolute left-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div class="ml-12">
                  <p class="font-medium text-gray-900 dark:text-white">{{ $t('pomodoro.sessionDetail.sessionCreated') }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ formatDateTime(session.createdAt) }}</p>
                </div>
              </div>

              <!-- Session Started -->
              <div v-if="session.startTime" class="relative flex items-center">
                <div class="absolute left-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-12">
                  <p class="font-medium text-gray-900 dark:text-white">{{ $t('pomodoro.sessionDetail.sessionStarted') }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ formatDateTime(session.startTime) }}</p>
                </div>
              </div>

              <!-- Pause Records in Timeline -->
              <div v-for="pause in pauseRecords" :key="`timeline-${pause.id}`" class="relative flex items-center">
                <div class="absolute left-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 002 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-12">
                  <p class="font-medium text-gray-900 dark:text-white">{{ $t('pomodoro.sessionDetail.sessionPaused') }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ formatDateTime(pause.pauseTime) }}</p>
                  <p v-if="pause.resumeTime" class="text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('pomodoro.sessionDetail.resumedAt') }}: {{ formatDateTime(pause.resumeTime) }}
                  </p>
                </div>
              </div>

              <!-- Session Ended -->
              <div v-if="session.endTime" class="relative flex items-center">
                <div
                  :class="[
                    'absolute left-0 w-8 h-8 rounded-full flex items-center justify-center',
                    session.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                  ]"
                >
                  <svg v-if="session.status === 'completed'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div class="ml-12">
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ session.status === 'completed' 
                        ? $t('pomodoro.sessionDetail.sessionCompleted') 
                        : $t('pomodoro.sessionDetail.sessionCancelled') 
                    }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ formatDateTime(session.endTime) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex justify-end">
          <button
            @click="$emit('update:show', false)"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            {{ $t('common.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { pomodoroService } from '@/services/pomodoroService'
import type { PomodoroSession, PomodoroPause } from '@/types/pomodoro'

const { t } = useI18n()
const router = useRouter()

const props = defineProps<{
  show: boolean
  session: PomodoroSession | null
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
}>()

// Reactive state
const pauseRecords = ref<PomodoroPause[]>([])

// Methods
const loadPauseRecords = async () => {
  if (!props.session) return
  
  try {
    // In a real app, you would call an API to get pause records
    // const records = await pomodoroService.getSessionPauseRecords(props.session.id)
    // pauseRecords.value = records
    
    // Mock data for now
    pauseRecords.value = []
  } catch (error) {
    console.error('Failed to load pause records:', error)
  }
}

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString()
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

const getProductivityRating = (productivity?: string): number => {
  const ratings = {
    'very_low': 1,
    'low': 2,
    'medium': 3,
    'high': 4,
    'very_high': 5
  }
  return ratings[productivity as keyof typeof ratings] || 0
}

const getProductivityText = (rating: number): string => {
  const texts = {
    1: t('pomodoro.complete.rating.poor'),
    2: t('pomodoro.complete.rating.fair'),
    3: t('pomodoro.complete.rating.good'),
    4: t('pomodoro.complete.rating.veryGood'),
    5: t('pomodoro.complete.rating.excellent')
  }
  return texts[rating as keyof typeof texts] || ''
}

const calculatePauseDuration = (pause: PomodoroPause): string => {
  if (!pause.resumeTime) return t('pomodoro.sessionDetail.ongoing')
  
  const pauseTime = new Date(pause.pauseTime)
  const resumeTime = new Date(pause.resumeTime)
  const durationMs = resumeTime.getTime() - pauseTime.getTime()
  const durationMinutes = Math.floor(durationMs / (1000 * 60))
  
  return `${durationMinutes}min`
}

const goToTask = () => {
  if (props.session?.taskId) {
    router.push(`/tasks/${props.session.taskId}`)
    emit('update:show', false)
  }
}

// Watch for session changes
watch(() => props.session, (newSession) => {
  if (newSession) {
    loadPauseRecords()
  }
})

onMounted(() => {
  if (props.session) {
    loadPauseRecords()
  }
})
</script>
