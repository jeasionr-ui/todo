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
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('pomodoro.history.title') }}</h1>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Filter Controls -->
            <div class="flex items-center space-x-2">
              <select
                v-model="filters.status"
                @change="loadSessions"
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="">{{ $t('pomodoro.history.allStatuses') }}</option>
                <option value="completed">{{ $t('pomodoro.status.completed') }}</option>
                <option value="cancelled">{{ $t('pomodoro.status.cancelled') }}</option>
                <option value="paused">{{ $t('pomodoro.status.paused') }}</option>
              </select>

              <input
                v-model="filters.dateFrom"
                type="date"
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                @change="loadSessions"
              >
              
              <span class="text-gray-500 dark:text-gray-400">{{ $t('common.to') }}</span>
              
              <input
                v-model="filters.dateTo"
                type="date"
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                @change="loadSessions"
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('pomodoro.history.totalSessions') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ sessionHistory.total }}</p>
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
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('pomodoro.history.completed') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ completedCount }}</p>
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
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('pomodoro.history.totalTime') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ formatTime(totalTime) }}</p>
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
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('pomodoro.history.avgProductivity') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ avgProductivity.toFixed(1) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sessions List -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('pomodoro.history.sessions') }}</h3>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ $t('pomodoro.history.showing', { 
                  start: (currentPage - 1) * pageSize + 1,
                  end: Math.min(currentPage * pageSize, sessionHistory.total),
                  total: sessionHistory.total 
                }) }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="loading" class="p-6 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
        </div>

        <div v-else-if="sessionHistory.sessions.length === 0" class="p-6 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('pomodoro.history.noSessions') }}</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('pomodoro.history.date') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('pomodoro.history.task') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('pomodoro.history.template') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('pomodoro.history.duration') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('pomodoro.history.status') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('pomodoro.history.productivity') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('pomodoro.history.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="session in sessionHistory.sessions" :key="session.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div>
                    <div class="font-medium">{{ formatDate(session.createdAt) }}</div>
                    <div class="text-gray-500 dark:text-gray-400">{{ formatTime(session.createdAt) }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div class="max-w-xs truncate">
                    {{ session.taskId ? `Task ${session.taskId}` : $t('pomodoro.focusSession') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ session.templateId || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div>
                    <div>{{ session.actualDuration || session.plannedDuration }}min</div>
                    <div v-if="session.actualDuration !== session.plannedDuration" class="text-xs text-gray-500 dark:text-gray-400">
                      {{ $t('pomodoro.history.planned') }}: {{ session.plannedDuration }}min
                    </div>
                  </div>
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
                  <div v-if="getProductivityRating(session.productivity)" class="flex items-center">
                    <div class="flex">
                      <svg
                        v-for="star in 5"
                        :key="star"
                        :class="[
                          'w-4 h-4',
                          star <= getProductivityRating(session.productivity) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                        ]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span class="ml-1 text-xs text-gray-500 dark:text-gray-400">{{ getProductivityRating(session.productivity) }}/5</span>
                  </div>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewSession(session)"
                    class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                  >
                    {{ $t('common.view') }}
                  </button>
                  <button
                    v-if="session.taskId"
                    @click="goToTask(session.taskId)"
                    class="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    {{ $t('pomodoro.history.viewTask') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="sessionHistory.total > pageSize" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {{ $t('common.previous') }}
              </button>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('common.page') }} {{ currentPage }} {{ $t('common.of') }} {{ totalPages }}
              </span>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {{ $t('common.next') }}
              </button>
            </div>
            <div class="flex items-center space-x-2">
              <select
                v-model="pageSize"
                @change="loadSessions"
                class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('common.perPage') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Session Detail Modal -->
    <SessionDetailModal
      v-model:show="showSessionDetail"
      :session="selectedSession"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { pomodoroService } from '@/services/pomodoroService'
import type { PomodoroSession } from '@/types/pomodoro'
import SessionDetailModal from '@/components/Pomodoro/SessionDetailModal.vue'

const { t } = useI18n()
const router = useRouter()

// Reactive state
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(25)
const showSessionDetail = ref(false)
const selectedSession = ref<PomodoroSession | null>(null)

const filters = ref({
  status: '',
  dateFrom: '',
  dateTo: ''
})

const sessionHistory = ref<{
  sessions: PomodoroSession[]
  total: number
  page: number
  pageSize: number
}>({
  sessions: [],
  total: 0,
  page: 1,
  pageSize: 25
})

// Helper functions
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

// Computed properties
const totalPages = computed(() => Math.ceil(sessionHistory.value.total / pageSize.value))

const completedCount = computed(() => 
  sessionHistory.value.sessions.filter(s => s.status === 'completed').length
)

const totalTime = computed(() => 
  sessionHistory.value.sessions.reduce((sum, s) => sum + (s.actualDuration || s.plannedDuration || 0), 0)
)

const avgProductivity = computed(() => {
  const ratings = sessionHistory.value.sessions
    .filter(s => s.productivity)
    .map(s => getProductivityRating(s.productivity))
  
  return ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0
})

// Methods
const loadSessions = async () => {
  loading.value = true
  try {
    const result = await pomodoroService.getSessionHistory({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...filters.value
    })
    sessionHistory.value = {
      sessions: result.data,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize
    }
  } catch (error) {
    console.error('Failed to load sessions:', error)
  } finally {
    loading.value = false
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadSessions()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadSessions()
  }
}

const viewSession = (session: PomodoroSession) => {
  selectedSession.value = session
  showSessionDetail.value = true
}

const goToTask = (taskId: string | number) => {
  const numericId = typeof taskId === 'string' ? parseInt(taskId, 10) : taskId
  router.push(`/tasks/${numericId}`)
}

const formatTime = (input: string | number): string => {
  if (typeof input === 'string') {
    // Format time from date string
    const date = new Date(input)
    return date.toLocaleTimeString()
  } else {
    // Format duration in minutes
    const hours = Math.floor(input / 60)
    const minutes = input % 60
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }
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

// Set default date range (last 30 days)
const initFilters = () => {
  const today = new Date()
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  filters.value.dateTo = today.toISOString().split('T')[0]
  filters.value.dateFrom = thirtyDaysAgo.toISOString().split('T')[0]
}

onMounted(() => {
  initFilters()
  loadSessions()
})
</script>
