<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="$emit('update:show', false)"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('pomodoro.cancelModal.title') }}
        </h3>
      </div>

      <!-- Content -->
      <div class="px-6 py-4">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ $t('pomodoro.cancelModal.message') }}
        </p>

        <!-- Session Info -->
        <div v-if="session" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <div class="text-sm">
            <p class="font-medium text-gray-900 dark:text-white">
              {{ session.taskId ? `Task ${session.taskId}` : $t('pomodoro.focusSession') }}
            </p>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              {{ $t('pomodoro.cancel.timeSpent', { duration: getSessionDuration() }) }}
            </p>
          </div>
        </div>

        <!-- Warning -->
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p class="text-sm font-medium text-red-800 dark:text-red-200">
                {{ $t('pomodoro.cancel.warning.title') }}
              </p>
              <p class="text-sm text-red-700 dark:text-red-300 mt-1">
                {{ $t('pomodoro.cancel.warning.message') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Reason -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('pomodoro.cancel.reason') }}
          </label>
          <select
            v-model="cancelReason"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">{{ $t('pomodoro.cancel.selectReason') }}</option>
            <option value="interruption">{{ $t('pomodoro.cancel.reasons.interruption') }}</option>
            <option value="urgent_task">{{ $t('pomodoro.cancel.reasons.urgentTask') }}</option>
            <option value="feeling_unwell">{{ $t('pomodoro.cancel.reasons.feelingUnwell') }}</option>
            <option value="distraction">{{ $t('pomodoro.cancel.reasons.distraction') }}</option>
            <option value="other">{{ $t('pomodoro.cancel.reasons.other') }}</option>
          </select>
        </div>

        <!-- Notes -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('pomodoro.cancel.notes') }}
          </label>
          <textarea
            v-model="notes"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            rows="3"
            :placeholder="$t('pomodoro.cancel.notesPlaceholder')"
          ></textarea>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex justify-end space-x-3">
          <button
            @click="$emit('update:show', false)"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            {{ $t('common.back') }}
          </button>
          <button
            @click="cancelSession"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700"
            :disabled="saving"
          >
            {{ saving ? $t('common.saving') : $t('pomodoro.cancel.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PomodoroSession } from '@/types/pomodoro'

const { t } = useI18n()

const props = defineProps<{
  show: boolean
  session: PomodoroSession | null
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  'cancelled': [data: { reason: string; notes: string }]
}>()

// Reactive state
const cancelReason = ref('')
const notes = ref('')
const saving = ref(false)

// Methods
const getSessionDuration = (): string => {
  if (!props.session) return '0min'
  
  const start = new Date(props.session.startTime || props.session.createdAt)
  const now = new Date()
  const durationMs = now.getTime() - start.getTime()
  const durationMinutes = Math.floor(durationMs / (1000 * 60))
  
  return `${durationMinutes}min`
}

const cancelSession = () => {
  emit('cancelled', {
    reason: cancelReason.value,
    notes: notes.value
  })
}
</script>
