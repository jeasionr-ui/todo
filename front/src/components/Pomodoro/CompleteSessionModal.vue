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
          {{ $t('pomodoro.completeModal.title') }}
        </h3>
      </div>

      <!-- Content -->
      <div class="px-6 py-4">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ $t('pomodoro.completeModal.message') }}
        </p>

        <!-- Session Info -->
        <div v-if="session" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <div class="text-sm">
            <p class="font-medium text-gray-900 dark:text-white">
              {{ session.taskId ? `Task ${session.taskId}` : $t('pomodoro.focusSession') }}
            </p>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              {{ $t('pomodoro.complete.duration', { duration: getSessionDuration() }) }}
            </p>
          </div>
        </div>

        <!-- Productivity Rating -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('pomodoro.complete.productivityRating') }}
          </label>
          <div class="flex space-x-2">
            <button
              v-for="rating in 5"
              :key="rating"
              @click="productivityRating = rating"
              :class="[
                'p-2 rounded-lg transition-colors',
                productivityRating >= rating
                  ? 'text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
              ]"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ getRatingText() }}
          </p>
        </div>

        <!-- Notes -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('pomodoro.complete.notes') }}
          </label>
          <textarea
            v-model="notes"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            rows="3"
            :placeholder="$t('pomodoro.complete.notesPlaceholder')"
          ></textarea>
        </div>

        <!-- Break Suggestion -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-sm font-medium text-blue-800 dark:text-blue-200">
                {{ $t('pomodoro.complete.breakSuggestion.title') }}
              </p>
              <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
                {{ $t('pomodoro.complete.breakSuggestion.message') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex justify-end space-x-3">
          <button
            @click="$emit('update:show', false)"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            @click="completeSession"
            class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700"
            :disabled="saving"
          >
            {{ saving ? $t('common.saving') : $t('pomodoro.complete.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PomodoroSession } from '@/types/pomodoro'

const { t } = useI18n()

const props = defineProps<{
  show: boolean
  session: PomodoroSession | null
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  'completed': [data: { productivity_rating: number; notes: string }]
}>()

// Reactive state
const productivityRating = ref(5)
const notes = ref('')
const saving = ref(false)

// Computed
const getRatingText = (): string => {
  const texts = {
    1: t('pomodoro.complete.rating.poor'),
    2: t('pomodoro.complete.rating.fair'),
    3: t('pomodoro.complete.rating.good'),
    4: t('pomodoro.complete.rating.veryGood'),
    5: t('pomodoro.complete.rating.excellent')
  }
  return texts[productivityRating.value as keyof typeof texts] || ''
}

// Methods
const getSessionDuration = (): string => {
  if (!props.session) return '0min'
  
  const start = new Date(props.session.startTime || props.session.createdAt)
  const now = new Date()
  const durationMs = now.getTime() - start.getTime()
  const durationMinutes = Math.floor(durationMs / (1000 * 60))
  
  return `${durationMinutes}min`
}

const completeSession = () => {
  emit('completed', {
    productivity_rating: productivityRating.value,
    notes: notes.value
  })
}
</script>
