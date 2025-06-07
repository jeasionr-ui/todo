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
          {{ isEditing ? $t('pomodoro.settings.editTemplate') : $t('pomodoro.settings.createTemplate') }}
        </h3>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="px-6 py-4">
        <div class="space-y-4">
          <!-- Template Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('pomodoro.settings.templateName') }}
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              :placeholder="$t('pomodoro.settings.templateNamePlaceholder')"
            />
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('pomodoro.settings.description') }}
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              :placeholder="$t('pomodoro.settings.descriptionPlaceholder')"
            />
          </div>

          <!-- Work Duration -->
          <div>
            <label for="workDuration" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('pomodoro.settings.workDuration') }} (分钟)
            </label>
            <input
              id="workDuration"
              v-model.number="form.workDuration"
              type="number"
              min="1"
              max="120"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Break Duration -->
          <div>
            <label for="breakDuration" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('pomodoro.settings.breakDuration') }} (分钟)
            </label>
            <input
              id="breakDuration"
              v-model.number="form.shortBreakDuration"
              type="number"
              min="1"
              max="60"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Long Break Duration -->
          <div>
            <label for="longBreakDuration" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('pomodoro.settings.longBreakDuration') }} (分钟)
            </label>
            <input
              id="longBreakDuration"
              v-model.number="form.longBreakDuration"
              type="number"
              min="1"
              max="120"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Sessions Before Long Break -->
          <div>
            <label for="sessionsBeforeLongBreak" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('pomodoro.settings.sessionsBeforeLongBreak') }}
            </label>
            <input
              id="sessionsBeforeLongBreak"
              v-model.number="form.longBreakInterval"
              type="number"
              min="1"
              max="10"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Auto Start Breaks -->
          <div class="flex items-center">
            <input
              id="autoStartBreaks"
              v-model="form.autoStartBreaks"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label for="autoStartBreaks" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {{ $t('pomodoro.settings.autoStartBreaks') }}
            </label>
          </div>

          <!-- Set as Default -->
          <div class="flex items-center">
            <input
              id="setAsDefault"
              v-model="form.isDefault"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label for="setAsDefault" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {{ $t('pomodoro.settings.setAsDefault') }}
            </label>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$emit('update:show', false)"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ $t('common.saving') }}
            </span>
            <span v-else>
              {{ isEditing ? $t('common.update') : $t('common.create') }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { pomodoroService } from '@/services/pomodoroService'
import type { PomodoroTemplate } from '@/types/pomodoro'

const { t } = useI18n()

interface Props {
  show: boolean
  template?: PomodoroTemplate | null
}

const props = withDefaults(defineProps<Props>(), {
  template: null
})

const emit = defineEmits<{
  'update:show': [value: boolean]
  'saved': []
}>()

// Reactive state
const loading = ref(false)

const form = ref({
  name: '',
  description: '',
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartWork: false,
  isDefault: false
})

// Computed properties
const isEditing = computed(() => !!props.template)

// Methods
const resetForm = () => {
  if (props.template) {
    // Edit mode: populate form with template data
    form.value = {
      name: props.template.name,
      description: props.template.description || '',
      workDuration: props.template.workDuration,
      shortBreakDuration: props.template.shortBreakDuration,
      longBreakDuration: props.template.longBreakDuration,
      longBreakInterval: props.template.longBreakInterval,
      autoStartBreaks: props.template.autoStartBreaks,
      autoStartWork: props.template.autoStartWork,
      isDefault: props.template.isDefault
    }
  } else {
    // Create mode: reset to defaults
    form.value = {
      name: '',
      description: '',
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
      autoStartBreaks: false,
      autoStartWork: false,
      isDefault: false
    }
  }
}

const handleSubmit = async () => {
  loading.value = true
  
  try {
    if (isEditing.value && props.template) {
      // Update existing template
      await pomodoroService.updateTemplate(props.template.id, form.value)
    } else {
      // Create new template
      await pomodoroService.createTemplate(form.value)
    }
    
    emit('saved')
  } catch (error) {
    console.error('Failed to save template:', error)
    // TODO: Show error message to user
  } finally {
    loading.value = false
  }
}

// Watch for prop changes
watch(() => props.show, (newValue) => {
  if (newValue) {
    resetForm()
  }
})

watch(() => props.template, () => {
  if (props.show) {
    resetForm()
  }
})
</script>
