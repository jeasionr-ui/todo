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
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('pomodoro.settings.title') }}</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Templates Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ $t('pomodoro.settings.templates') }}
          </h2>
          <button
            @click="showCreateTemplate = true"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>{{ $t('pomodoro.settings.createTemplate') }}</span>
          </button>
        </div>

        <!-- Templates List -->
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p class="text-gray-500 dark:text-gray-400 mt-4">{{ $t('common.loading') }}</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="template in templates"
            :key="template.id"
            :class="[
              'relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-200',
              template.isDefault
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
            ]"
            @click="setDefaultTemplate(template.id)"
          >
            <!-- Default Badge -->
            <div v-if="template.isDefault" class="absolute top-2 right-2">
              <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {{ $t('pomodoro.settings.default') }}
              </span>
            </div>

            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ template.name }}
              </h3>
              <p v-if="template.description" class="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {{ template.description }}
              </p>
            </div>

            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">{{ $t('pomodoro.settings.workDuration') }}</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ template.workDuration }}分钟</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">{{ $t('pomodoro.settings.breakDuration') }}</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ template.shortBreakDuration }}分钟</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">{{ $t('pomodoro.settings.longBreakDuration') }}</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ template.longBreakDuration }}分钟</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">{{ $t('pomodoro.settings.sessionsBeforeLongBreak') }}</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ template.longBreakInterval }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-2 mt-4">
              <button
                @click.stop="editTemplate(template)"
                class="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                v-if="!template.isDefault"
                @click.stop="deleteTemplate(template.id)"
                class="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {{ $t('pomodoro.settings.notifications') }}
        </h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ $t('pomodoro.settings.enableNotifications') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ $t('pomodoro.settings.notificationsDescription') }}
              </p>
            </div>
            <button
              @click="toggleNotifications"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                notificationsEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out',
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                ]"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ $t('pomodoro.settings.soundNotifications') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ $t('pomodoro.settings.soundNotificationsDescription') }}
              </p>
            </div>
            <button
              @click="toggleSoundNotifications"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                soundNotificationsEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out',
                  soundNotificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                ]"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Focus Mode Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {{ $t('pomodoro.settings.focusMode') }}
        </h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ $t('pomodoro.settings.autoStartBreaks') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ $t('pomodoro.settings.autoStartBreaksDescription') }}
              </p>
            </div>
            <button
              @click="toggleAutoStartBreaks"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                autoStartBreaks ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out',
                  autoStartBreaks ? 'translate-x-5' : 'translate-x-0'
                ]"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ $t('pomodoro.settings.fullscreenMode') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ $t('pomodoro.settings.fullscreenModeDescription') }}
              </p>
            </div>
            <button
              @click="toggleFullscreenMode"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                fullscreenMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out',
                  fullscreenMode ? 'translate-x-5' : 'translate-x-0'
                ]"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Template Modal -->
    <TemplateFormModal
      v-model:show="showCreateTemplate"
      :template="editingTemplate"
      @saved="handleTemplateSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { pomodoroService } from '@/services/pomodoroService'
import type { PomodoroTemplate } from '@/types/pomodoro'
import TemplateFormModal from '@/components/Pomodoro/TemplateFormModal.vue'

const { t } = useI18n()

// Reactive state
const templates = ref<PomodoroTemplate[]>([])
const loading = ref(false)
const showCreateTemplate = ref(false)
const editingTemplate = ref<PomodoroTemplate | null>(null)

// Settings
const notificationsEnabled = ref(true)
const soundNotificationsEnabled = ref(true)
const autoStartBreaks = ref(false)
const fullscreenMode = ref(false)

// Methods
const loadTemplates = async () => {
  loading.value = true
  try {
    templates.value = await pomodoroService.getTemplates()
  } catch (error) {
    console.error('Failed to load templates:', error)
  } finally {
    loading.value = false
  }
}

const setDefaultTemplate = async (templateId: string) => {
  try {
    await pomodoroService.setDefaultTemplate(parseInt(templateId))
    await loadTemplates() // Refresh to show updated default
  } catch (error) {
    console.error('Failed to set default template:', error)
  }
}

const editTemplate = (template: PomodoroTemplate) => {
  editingTemplate.value = template
  showCreateTemplate.value = true
}

const deleteTemplate = async (templateId: string) => {
  if (!confirm(t('pomodoro.settings.confirmDeleteTemplate'))) {
    return
  }

  try {
    await pomodoroService.deleteTemplate(templateId)
    await loadTemplates() // Refresh list
  } catch (error) {
    console.error('Failed to delete template:', error)
  }
}

const handleTemplateSaved = () => {
  editingTemplate.value = null
  showCreateTemplate.value = false
  loadTemplates() // Refresh list
}

const toggleNotifications = () => {
  notificationsEnabled.value = !notificationsEnabled.value
  // Save to localStorage or API
  localStorage.setItem('pomodoro-notifications', notificationsEnabled.value.toString())
}

const toggleSoundNotifications = () => {
  soundNotificationsEnabled.value = !soundNotificationsEnabled.value
  localStorage.setItem('pomodoro-sound-notifications', soundNotificationsEnabled.value.toString())
}

const toggleAutoStartBreaks = () => {
  autoStartBreaks.value = !autoStartBreaks.value
  localStorage.setItem('pomodoro-auto-start-breaks', autoStartBreaks.value.toString())
}

const toggleFullscreenMode = () => {
  fullscreenMode.value = !fullscreenMode.value
  localStorage.setItem('pomodoro-fullscreen-mode', fullscreenMode.value.toString())
}

const loadSettings = () => {
  // Load settings from localStorage
  notificationsEnabled.value = localStorage.getItem('pomodoro-notifications') !== 'false'
  soundNotificationsEnabled.value = localStorage.getItem('pomodoro-sound-notifications') !== 'false'
  autoStartBreaks.value = localStorage.getItem('pomodoro-auto-start-breaks') === 'true'
  fullscreenMode.value = localStorage.getItem('pomodoro-fullscreen-mode') === 'true'
}

// Lifecycle hooks
onMounted(() => {
  loadTemplates()
  loadSettings()
})
</script>
