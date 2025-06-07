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
            {{ $t('pomodoro.settings.title') }}
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
      <div class="px-6 py-4">
        <!-- Template Selection -->
        <div class="mb-6">
          <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3">
            {{ $t('pomodoro.settings.activeTemplate') }}
          </h4>
          <div class="space-y-3">
            <div
              v-for="template in templates"
              :key="template.id"
              :class="[
                'border rounded-lg p-4 cursor-pointer transition-colors',
                selectedTemplate?.id === template.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              ]"
              @click="selectTemplate(template)"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ template.name }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('pomodoro.settings.duration', { 
                      work: template.workDuration, 
                      break: template.shortBreakDuration 
                    }) }}
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <span
                    v-if="template.isDefault"
                    class="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded"
                  >
                    {{ $t('pomodoro.settings.default') }}
                  </span>
                  <input
                    type="radio"
                    :checked="selectedTemplate?.id === template.id"
                    class="text-blue-600"
                    @change="selectTemplate(template)"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Template Form -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-md font-semibold text-gray-900 dark:text-white">
              {{ editingTemplate ? $t('pomodoro.settings.editTemplate') : $t('pomodoro.settings.newTemplate') }}
            </h4>
            <button
              v-if="!showTemplateForm"
              @click="showTemplateForm = true"
              class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {{ $t('pomodoro.settings.addTemplate') }}
            </button>
          </div>

          <div v-if="showTemplateForm" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <form @submit.prevent="saveTemplate">
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ $t('pomodoro.settings.templateName') }}
                  </label>
                  <input
                    v-model="templateForm.name"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    :placeholder="$t('pomodoro.settings.templateNamePlaceholder')"
                    required
                  >
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {{ $t('pomodoro.settings.workDuration') }}
                    </label>
                    <div class="relative">
                      <input
                        v-model.number="templateForm.workDuration"
                        type="number"
                        min="1"
                        max="120"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      >
                      <span class="absolute right-3 top-2 text-sm text-gray-500 dark:text-gray-400">min</span>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {{ $t('pomodoro.settings.breakDuration') }}
                    </label>
                    <div class="relative">
                      <input
                        v-model.number="templateForm.shortBreakDuration"
                        type="number"
                        min="1"
                        max="60"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      >
                      <span class="absolute right-3 top-2 text-sm text-gray-500 dark:text-gray-400">min</span>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {{ $t('pomodoro.settings.longBreakDuration') }}
                    </label>
                    <div class="relative">
                      <input
                        v-model.number="templateForm.longBreakDuration"
                        type="number"
                        min="1"
                        max="120"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      >
                      <span class="absolute right-3 top-2 text-sm text-gray-500 dark:text-gray-400">min</span>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {{ $t('pomodoro.settings.sessionsBeforeLongBreak') }}
                    </label>
                    <input
                      v-model.number="templateForm.longBreakInterval"
                      type="number"
                      min="1"
                      max="10"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    >
                  </div>
                </div>

                <div>
                  <label class="flex items-center">
                    <input
                      v-model="templateForm.isDefault"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {{ $t('pomodoro.settings.setAsDefault') }}
                    </span>
                  </label>
                </div>

                <div class="flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="cancelTemplateEdit"
                    class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    {{ $t('common.cancel') }}
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                    :disabled="saving"
                  >
                    {{ saving ? $t('common.saving') : $t('common.save') }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Focus Mode Settings -->
        <div class="mb-6">
          <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3">
            {{ $t('pomodoro.settings.focusMode') }}
          </h4>
          <div class="space-y-3">
            <label class="flex items-center">
              <input
                v-model="focusSettings.disableNotifications"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {{ $t('pomodoro.settings.disableNotifications') }}
              </span>
            </label>

            <label class="flex items-center">
              <input
                v-model="focusSettings.blockWebsites"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {{ $t('pomodoro.settings.blockWebsites') }}
              </span>
            </label>

            <label class="flex items-center">
              <input
                v-model="focusSettings.enableAutoStart"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {{ $t('pomodoro.settings.autoStartBreaks') }}
              </span>
            </label>

            <label class="flex items-center">
              <input
                v-model="focusSettings.showProgressInTitle"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {{ $t('pomodoro.settings.showProgressInTitle') }}
              </span>
            </label>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="mb-6">
          <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3">
            {{ $t('pomodoro.settings.notifications') }}
          </h4>
          <div class="space-y-3">
            <label class="flex items-center">
              <input
                v-model="focusSettings.enableSounds"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {{ $t('pomodoro.settings.enableSounds') }}
              </span>
            </label>

            <div v-if="focusSettings.enableSounds" class="ml-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ $t('pomodoro.settings.soundVolume') }}
              </label>
              <input
                v-model.number="focusSettings.whiteNoiseVolume"
                type="range"
                min="0"
                max="100"
                class="w-full"
              >
              <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>0%</span>
                <span>{{ focusSettings.whiteNoiseVolume }}%</span>
                <span>100%</span>
              </div>
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
            @click="saveSettings"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            :disabled="saving"
          >
            {{ saving ? $t('common.saving') : $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { pomodoroService } from '@/services/pomodoroService'
import type { PomodoroTemplate, FocusSettings, CreateTemplateRequest } from '@/types/pomodoro'

const { t } = useI18n()

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  'updated': []
}>()

// Reactive state
const templates = ref<PomodoroTemplate[]>([])
const selectedTemplate = ref<PomodoroTemplate | null>(null)
const editingTemplate = ref<PomodoroTemplate | null>(null)
const showTemplateForm = ref(false)
const saving = ref(false)

const templateForm = ref<CreateTemplateRequest>({
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

const focusSettings = ref<FocusSettings>({
  disableNotifications: false,
  enableFullscreen: false,
  blockWebsites: false,
  blockedWebsites: [],
  playWhiteNoise: false,
  whiteNoiseType: 'white',
  whiteNoiseVolume: 50,
  enablePomodoroClock: true,
  showProgressInTitle: true,
  enableSounds: true,
  sessionCompleteSound: '',
  breakCompleteSound: '',
  enableAutoStart: false
})

// Methods
const loadData = async () => {
  try {
    // Load templates
    const templateList = await pomodoroService.getTemplates()
    templates.value = templateList
    selectedTemplate.value = templateList.find(t => t.isDefault) || templateList[0] || null
    
    // Load focus settings
    const settings = await pomodoroService.getFocusSettings()
    if (settings && settings.success && settings.data) {
      focusSettings.value = settings.data
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
}

const selectTemplate = async (template: PomodoroTemplate) => {
  selectedTemplate.value = template
  
  // Set as default template
  try {
    await pomodoroService.updateTemplate(template.id, { ...template, isDefault: true })
    
    // Update other templates to not be default
    const updates = templates.value
      .filter(t => t.id !== template.id && t.isDefault)
      .map(t => pomodoroService.updateTemplate(t.id, { ...t, isDefault: false }))
    
    await Promise.all(updates)
    await loadData()
  } catch (error) {
    console.error('Failed to set default template:', error)
  }
}

const editTemplate = (template: PomodoroTemplate) => {
  editingTemplate.value = template
  templateForm.value = {
    name: template.name,
    description: template.description,
    workDuration: template.workDuration,
    shortBreakDuration: template.shortBreakDuration,
    longBreakDuration: template.longBreakDuration,
    longBreakInterval: template.longBreakInterval,
    autoStartBreaks: template.autoStartBreaks,
    autoStartWork: template.autoStartWork,
    isDefault: template.isDefault
  }
  showTemplateForm.value = true
}

const saveTemplate = async () => {
  if (saving.value) return
  
  saving.value = true
  try {
    if (editingTemplate.value) {
      // Update existing template
      await pomodoroService.updateTemplate(editingTemplate.value.id, templateForm.value)
    } else {
      // Create new template
      await pomodoroService.createTemplate(templateForm.value)
    }
    
    await loadData()
    cancelTemplateEdit()
  } catch (error) {
    console.error('Failed to save template:', error)
  } finally {
    saving.value = false
  }
}

const deleteTemplate = async (template: PomodoroTemplate) => {
  if (!confirm(t('pomodoro.settings.confirmDeleteTemplate'))) return
  
  try {
    await pomodoroService.deleteTemplate(template.id)
    await loadData()
  } catch (error) {
    console.error('Failed to delete template:', error)
  }
}

const cancelTemplateEdit = () => {
  editingTemplate.value = null
  showTemplateForm.value = false
  templateForm.value = {
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

const saveSettings = async () => {
  if (saving.value) return
  
  saving.value = true
  try {
    await pomodoroService.updateFocusSettings(focusSettings.value)
    emit('updated')
    emit('update:show', false)
  } catch (error) {
    console.error('Failed to save settings:', error)
  } finally {
    saving.value = false
  }
}

// Watch for modal show/hide
watch(() => props.show, (newValue) => {
  if (newValue) {
    loadData()
  }
})

onMounted(() => {
  if (props.show) {
    loadData()
  }
})
</script>
