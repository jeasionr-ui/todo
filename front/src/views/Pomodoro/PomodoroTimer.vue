<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('pomodoro.title')" />
    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <!-- Header -->
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h3 class="text-2xl font-semibold mb-4 md:mb-0">
          {{ $t('pomodoro.title') }}
        </h3>
        <div class="flex items-center space-x-4">
          <button
            @click="showSettings = true"
            class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </button>
          <button
            @click="toggleFocusMode"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              focusMode
                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            ]"
          >
            {{ focusMode ? $t('pomodoro.focusModeOn') : $t('pomodoro.focusModeOff') }}
          </button>
        </div>
      </div>

      <!-- Current Session Info -->
      <div v-if="currentSession" class="mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div class="text-center">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ currentSession.taskId ? $t('pomodoro.workingOn') : $t('pomodoro.focusSession') }}
            </h2>
            <p v-if="currentTask" class="text-gray-600 dark:text-gray-400">
              {{ currentTask.title }}
            </p>
          </div>
        </div>
      </div>

      <!-- Timer Display -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <div class="text-center">
          <!-- Session Type Indicator -->
          <div class="mb-6">
            <span
              :class="[
                'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium',
                getSessionTypeClass()
              ]"
            >
              {{ getSessionTypeText() }}
            </span>
          </div>

          <!-- Timer Circle -->
          <div class="relative w-64 h-64 mx-auto mb-8">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <!-- Background circle -->
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                stroke-width="8"
                class="text-gray-200 dark:text-gray-700"
              />
              <!-- Progress circle -->
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                :stroke="getTimerColor()"
                stroke-width="8"
                stroke-linecap="round"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="strokeDashoffset"
                class="transition-all duration-1000 ease-linear"
              />
            </svg>
            
            <!-- Timer Text -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="text-4xl font-mono font-bold text-gray-900 dark:text-white">
                  {{ formatTime(timerState.remainingTime) }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ $t('pomodoro.remaining') }}
                </div>
              </div>
            </div>
          </div>

          <!-- Timer Controls -->
          <div class="flex justify-center space-x-4">
            <button
              v-if="!timerState.isRunning && !currentSession"
              @click="startNewSession"
              class="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
              <span>{{ $t('pomodoro.start') }}</span>
            </button>

            <button
              v-if="currentSession && !timerState.isRunning && timerState.isPaused"
              @click="resumeSession"
              class="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
              <span>{{ $t('pomodoro.resume') }}</span>
            </button>

            <button
              v-if="timerState.isRunning"
              @click="pauseSession"
              class="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span>{{ $t('pomodoro.pause') }}</span>
            </button>

            <button
              v-if="currentSession"
              @click="showCompleteModal = true"
              class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ $t('pomodoro.completed') }}</span>
            </button>

            <button
              v-if="currentSession"
              @click="showCancelModal = true"
              class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{{ $t('pomodoro.abort') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Session Info -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('pomodoro.todaySessions') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ todayStats.totalSessions }}</p>
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
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('pomodoro.completed') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ todayStats.completedSessions }}</p>
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
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('pomodoro.focusTime') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ formatMinutes(todayStats.totalWorkTime) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('pomodoro.quickActions') }}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            @click="showTaskSelector = true"
            class="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-center"
          >
            <svg class="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('pomodoro.selectTask') }}</p>
          </button>

          <button
            @click="$router.push('/pomodoro/templates')"
            class="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-center"
          >
            <svg class="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('pomodoro.templates') }}</p>
          </button>

          <button
            @click="$router.push('/pomodoro/stats')"
            class="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-center"
          >
            <svg class="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z" />
            </svg>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('pomodoro.statistics') }}</p>
          </button>

          <button
            @click="$router.push('/pomodoro/history')"
            class="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-center"
          >
            <svg class="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('pomodoro.history.title') }}</p>
          </button>
        </div>
      </div>

      <!-- Modals -->
      <PomodoroSettings v-model:show="showSettings" @updated="loadData" />
      <TaskSelector v-model:show="showTaskSelector" @selected="handleTaskSelected" />
      <CompleteSessionModal v-model:show="showCompleteModal" :session="currentSession" @completed="handleSessionCompleted" />
      <CancelSessionModal v-model:show="showCancelModal" :session="currentSession" @cancelled="handleSessionCancelled" />
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { pomodoroService } from '@/services/pomodoroService'
import type { PomodoroSession, PomodoroTemplate, PomodoroStats, TimerState } from '@/types/pomodoro'
import PomodoroSettings from '@/components/Pomodoro/PomodoroSettings.vue'
import TaskSelector from '@/components/Pomodoro/TaskSelector.vue'
import CompleteSessionModal from '@/components/Pomodoro/CompleteSessionModal.vue'
import CancelSessionModal from '@/components/Pomodoro/CancelSessionModal.vue'

const { t } = useI18n()

// Reactive state
const currentSession = ref<PomodoroSession | null>(null)
const activeTemplate = ref<PomodoroTemplate | null>(null)
const currentTask = ref<{id: string, title: string} | null>(null)

const todayStats = ref<PomodoroStats>({
  id: '',
  date: new Date().toISOString().split('T')[0],
  totalSessions: 0,
  completedSessions: 0,
  totalWorkTime: 0,
  totalBreakTime: 0,
  totalPauseTime: 0,
  interruptions: 0,
  tasksCompleted: 0,
  longestFocusSession: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

const timerState = ref<TimerState>({
  isRunning: false,
  isPaused: false,
  remainingTime: 25 * 60, // 25 minutes in seconds
  totalTime: 25 * 60,
  sessionType: 'work'
})

const focusMode = ref(false)
const showSettings = ref(false)
const showTaskSelector = ref(false)
const showCompleteModal = ref(false)
const showCancelModal = ref(false)

// Timer variables
let timerInterval: number | null = null
const circumference = 2 * Math.PI * 45 // radius = 45

// Computed properties
const strokeDashoffset = computed(() => {
  const progress = timerState.value.remainingTime / timerState.value.totalTime
  return circumference * (1 - progress)
})

// Methods
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`
  }
  return `${remainingMinutes}m`
}

const getSessionTypeText = (): string => {
  if (!currentSession.value) return t('pomodoro.timer.readyToStart')
  
  switch (timerState.value.sessionType) {
    case 'work':
      return t('pomodoro.timer.focusTime')
    case 'short_break':
      return t('pomodoro.timer.shortBreak')
    case 'long_break':
      return t('pomodoro.timer.longBreak')
    default:
      return t('pomodoro.timer.focusTime')
  }
}

const getSessionTypeClass = (): string => {
  if (!currentSession.value) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  
  switch (timerState.value.sessionType) {
    case 'work':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'short_break':
    case 'long_break':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }
}

const getTimerColor = (): string => {
  if (!currentSession.value) return '#9CA3AF'
  
  switch (timerState.value.sessionType) {
    case 'work':
      return '#3B82F6'
    case 'short_break':
    case 'long_break':
      return '#10B981'
    default:
      return '#3B82F6'
  }
}

const loadData = async () => {
  console.log('Loading data...')
  try {
    // Load active session
    const sessions = await pomodoroService.getActiveSessions()
    currentSession.value = sessions.length > 0 ? sessions[0] : null
    console.log('Active sessions:', sessions)
    
    // Load default template
    const templates = await pomodoroService.getTemplates()
    activeTemplate.value = templates.find(t => t.isDefault) || templates[0] || null
    console.log('Templates:', templates)
    console.log('Active template:', activeTemplate.value)
    
    // If no templates exist, create a default one
    if (!activeTemplate.value) {
      console.log('No templates found, creating default template...')
      try {
        const defaultTemplateResponse = await pomodoroService.createTemplate({
          name: '默认番茄钟',
          description: '25分钟工作，5分钟短休息，15分钟长休息',
          workDuration: 25,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          longBreakInterval: 4,
          autoStartBreaks: false,
          autoStartWork: false,
          isDefault: true
        })
        
        if (defaultTemplateResponse.success && defaultTemplateResponse.data) {
          activeTemplate.value = defaultTemplateResponse.data
          console.log('Default template created:', activeTemplate.value)
        }
      } catch (error) {
        console.error('Failed to create default template:', error)
      }
    }
    
    // Load today's stats
    const statsResponse = await pomodoroService.getDailyStats({ date: new Date().toISOString().split('T')[0] })
    if (statsResponse.success && statsResponse.data) {
      // Handle both single stats and array
      const statsData = Array.isArray(statsResponse.data) ? statsResponse.data[0] : statsResponse.data
      if (statsData) {
        todayStats.value = statsData
      }
    }
    
    // Update timer state based on current session
    if (currentSession.value) {
      updateTimerFromSession()
    } else if (activeTemplate.value) {
      timerState.value.totalTime = activeTemplate.value.workDuration * 60
      timerState.value.remainingTime = activeTemplate.value.workDuration * 60
      timerState.value.sessionType = 'work'
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

const updateTimerFromSession = () => {
  if (!currentSession.value || !activeTemplate.value) return
  
  console.log('Updating timer from session:', currentSession.value)
  
  const now = new Date()
  const sessionStart = new Date(currentSession.value.startTime || currentSession.value.createdAt)
  const elapsedMs = now.getTime() - sessionStart.getTime()
  const elapsedSeconds = Math.floor(elapsedMs / 1000)
  
  // Set session type and calculate remaining time
  timerState.value.sessionType = currentSession.value.type
  
  let sessionDuration: number
  switch (currentSession.value.type) {
    case 'work':
      sessionDuration = activeTemplate.value.workDuration * 60
      break
    case 'short_break':
      sessionDuration = activeTemplate.value.shortBreakDuration * 60
      break
    case 'long_break':
      sessionDuration = activeTemplate.value.longBreakDuration * 60
      break
    default:
      sessionDuration = activeTemplate.value.workDuration * 60
  }
  
  timerState.value.totalTime = sessionDuration
  timerState.value.remainingTime = Math.max(0, sessionDuration - elapsedSeconds)
  
  // Only update running state if not already manually set
  const wasRunning = timerState.value.isRunning
  const shouldBeRunning = currentSession.value.status === 'running'
  const shouldBePaused = currentSession.value.status === 'paused'
  
  console.log('Timer state check:', {
    wasRunning,
    shouldBeRunning,
    shouldBePaused,
    sessionStatus: currentSession.value.status,
    hasTimerInterval: !!timerInterval
  })
  
  if (shouldBeRunning && !wasRunning && !timerInterval) {
    console.log('Session is running but timer not started, starting timer...')
    startTimer()
  } else if (!shouldBeRunning && wasRunning && timerInterval) {
    console.log('Session not running but timer is, stopping timer...')
    stopTimer()
  }
  
  timerState.value.isRunning = shouldBeRunning
  timerState.value.isPaused = shouldBePaused
}

const startTimer = () => {
  console.log('startTimer called, current state:', {
    timerInterval,
    isRunning: timerState.value.isRunning,
    remainingTime: timerState.value.remainingTime
  })
  
  if (timerInterval) {
    console.log('Timer already running, returning')
    return
  }
  
  timerState.value.isRunning = true
  timerState.value.isPaused = false
  
  console.log('Starting timer interval...')
  timerInterval = window.setInterval(() => {
    if (timerState.value.remainingTime > 0) {
      timerState.value.remainingTime--
      // Log every 10 seconds to avoid spam
      if (timerState.value.remainingTime % 10 === 0) {
        console.log('Timer tick:', timerState.value.remainingTime)
      }
    } else {
      // Timer finished
      console.log('Timer completed!')
      handleTimerComplete()
    }
  }, 1000)
  
  console.log('Timer started successfully, interval ID:', timerInterval)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  timerState.value.isRunning = false
}

const handleTimerComplete = async () => {
  console.log('Timer completed!', { 
    sessionType: timerState.value.sessionType, 
    currentSessionId: currentSession.value?.id 
  })
  
  stopTimer()
  
  if (currentSession.value) {
    if (timerState.value.sessionType === 'work') {
      // Work period completed, first complete the current session, then start break
      console.log('Work session completed, transitioning to break...')
      await completeCurrentSession()
      await startBreakPeriod()
    } else {
      // Break completed, session is done
      console.log('Break session completed, showing completion modal...')
      await completeCurrentSession()
      showCompleteModal.value = true
    }
  } else {
    console.log('No current session found when timer completed')
  }
}

const completeCurrentSession = async () => {
  if (!currentSession.value) return
  
  try {
    await pomodoroService.completeSession(currentSession.value.id, {
      productivityRating: 'medium',
      notes: ''
    })
    console.log('Session completed:', currentSession.value.id)
    
    // Clear the current session to indicate it's no longer active
    currentSession.value = null
    
    // Update stats
    const statsResponse = await pomodoroService.getDailyStats({ date: new Date().toISOString().split('T')[0] })
    if (statsResponse.success && statsResponse.data) {
      const statsData = Array.isArray(statsResponse.data) ? statsResponse.data[0] : statsResponse.data
      if (statsData) {
        todayStats.value = statsData
      }
    }
  } catch (error) {
    console.error('Failed to complete current session:', error)
  }
}

const startBreakPeriod = async () => {
  if (!activeTemplate.value) {
    console.error('No active template found for break period')
    return
  }
  
  console.log('Starting break period...', { 
    activeTemplate: activeTemplate.value.id,
    currentSession: currentSession.value ? currentSession.value.id : 'null',
    todayStats: todayStats.value.completedSessions 
  })
  
  try {
    // Create break session
    const breakType = shouldUseLongBreak() ? 'long_break' : 'short_break'
    const duration = breakType === 'long_break' 
      ? activeTemplate.value.longBreakDuration 
      : activeTemplate.value.shortBreakDuration
    
    console.log('Creating break session:', { breakType, duration })
    
    const breakSessionResponse = await pomodoroService.createSession({
      templateId: activeTemplate.value.id,
      type: breakType,
      plannedDuration: duration
    })
    
    if (breakSessionResponse.success && breakSessionResponse.data) {
      const breakSession = breakSessionResponse.data
      console.log('Break session created successfully:', breakSession.id)
      
      currentSession.value = breakSession
      timerState.value.sessionType = breakType
      timerState.value.totalTime = duration * 60
      timerState.value.remainingTime = duration * 60
      
      if (activeTemplate.value.autoStartBreaks) {
        console.log('Auto-starting break session...')
        await pomodoroService.startSession(breakSession.id)
        startTimer()
      }
    } else {
      console.error('Failed to create break session:', breakSessionResponse)
    }
  } catch (error) {
    console.error('Failed to start break period:', error)
    // If break creation fails, we should still clear the current session state
    currentSession.value = null
    timerState.value.isRunning = false
    timerState.value.isPaused = false
  }
}

const shouldUseLongBreak = (): boolean => {
  // Simple logic: every 4th session is a long break
  return (todayStats.value.completedSessions + 1) % 4 === 0
}

const startNewSession = async () => {
  console.log('Starting new session...', { activeTemplate: activeTemplate.value })
  
  if (!activeTemplate.value) {
    console.error('No active template found')
    return
  }
  
  try {
    console.log('Creating session with template:', activeTemplate.value.id)
    const sessionResponse = await pomodoroService.createSession({
      templateId: activeTemplate.value.id,
      type: 'work',
      plannedDuration: activeTemplate.value.workDuration
    })
    
    console.log('Session creation response:', sessionResponse)
    
    if (sessionResponse.success && sessionResponse.data) {
      const session = sessionResponse.data
      currentSession.value = session
      
      // Reset timer for work period
      timerState.value.sessionType = 'work'
      timerState.value.totalTime = activeTemplate.value.workDuration * 60
      timerState.value.remainingTime = activeTemplate.value.workDuration * 60
      
      console.log('Starting session:', session.id)
      await pomodoroService.startSession(session.id)
      
      console.log('Starting timer...')
      startTimer()
      
      // Refresh stats but don't reload session data to avoid overriding timer state
      const statsResponse = await pomodoroService.getDailyStats({ date: new Date().toISOString().split('T')[0] })
      if (statsResponse.success && statsResponse.data) {
        const statsData = Array.isArray(statsResponse.data) ? statsResponse.data[0] : statsResponse.data
        if (statsData) {
          todayStats.value = statsData
        }
      }
    } else {
      console.error('Failed to create session:', sessionResponse)
    }
  } catch (error) {
    console.error('Failed to start session:', error)
  }
}

const resumeSession = async () => {
  if (!currentSession.value) return
  
  try {
    await pomodoroService.resumeSession(currentSession.value.id)
    startTimer()
    await loadData()
  } catch (error) {
    console.error('Failed to resume session:', error)
  }
}

const pauseSession = async () => {
  if (!currentSession.value) return
  
  try {
    stopTimer()
    await pomodoroService.pauseSession(currentSession.value.id)
    timerState.value.isPaused = true
    await loadData()
  } catch (error) {
    console.error('Failed to pause session:', error)
  }
}

const completeSession = async () => {
  if (!currentSession.value) return
  
  try {
    stopTimer()
    await pomodoroService.completeSession(currentSession.value.id, {
      productivityRating: 'medium',
      notes: ''
    })
    
    resetToInitialState()
    await loadData()
    showCompleteModal.value = false
  } catch (error) {
    console.error('Failed to complete session:', error)
  }
}

const cancelSession = async () => {
  if (!currentSession.value) return
  
  try {
    stopTimer()
    await pomodoroService.cancelSession(currentSession.value.id)
    
    resetToInitialState()
    await loadData()
    showCancelModal.value = false
  } catch (error) {
    console.error('Failed to cancel session:', error)
  }
}

const resetToInitialState = () => {
  currentSession.value = null
  currentTask.value = null
  timerState.value.isRunning = false
  timerState.value.isPaused = false
  timerState.value.sessionType = 'work'
  
  if (activeTemplate.value) {
    timerState.value.totalTime = activeTemplate.value.workDuration * 60
    timerState.value.remainingTime = activeTemplate.value.workDuration * 60
  }
}

const toggleFocusMode = () => {
  focusMode.value = !focusMode.value
  
  if (focusMode.value) {
    // Enable focus mode features
    document.body.classList.add('focus-mode')
    // Disable notifications, etc.
  } else {
    // Disable focus mode features
    document.body.classList.remove('focus-mode')
  }
}

const handleTaskSelected = async (taskId: number, taskTitle: string) => {
  if (!activeTemplate.value) return
  
  try {
    const sessionResponse = await pomodoroService.createSession({
      templateId: activeTemplate.value.id,
      taskId: taskId.toString(), // Convert to string as expected by API
      type: 'work',
      plannedDuration: activeTemplate.value.workDuration
    })
    
    if (sessionResponse.success && sessionResponse.data) {
      currentSession.value = sessionResponse.data
      currentTask.value = { id: taskId.toString(), title: taskTitle }
      showTaskSelector.value = false
      
      // Reset timer for work period
      timerState.value.sessionType = 'work'
      timerState.value.totalTime = activeTemplate.value.workDuration * 60
      timerState.value.remainingTime = activeTemplate.value.workDuration * 60
      
      await loadData()
    }
  } catch (error) {
    console.error('Failed to create session with task:', error)
  }
}

const handleSessionCompleted = () => {
  completeSession()
}

const handleSessionCancelled = () => {
  cancelSession()
}

// Watch for focus mode changes
watch(focusMode, (newValue) => {
  if (newValue) {
    document.documentElement.requestFullscreen?.()
  } else {
    document.exitFullscreen?.()
  }
})

// Lifecycle hooks
onMounted(() => {
  loadData()
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
  document.body.classList.remove('focus-mode')
})
</script>

<style scoped>
.focus-mode {
  overflow: hidden;
}

@media (max-width: 768px) {
  .timer-circle {
    width: 200px;
    height: 200px;
  }
}
</style>
