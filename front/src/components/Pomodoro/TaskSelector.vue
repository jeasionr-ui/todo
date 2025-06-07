<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="$emit('update:show', false)"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('pomodoro.taskSelector.title') }}
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

      <!-- Search -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            :placeholder="$t('pomodoro.taskSelector.searchPlaceholder')"
          >
        </div>
      </div>

      <!-- Task List -->
      <div class="flex-1 overflow-y-auto" style="max-height: 50vh;">
        <div v-if="loading" class="p-6 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
        </div>

        <div v-else-if="filteredTasks.length === 0" class="p-6 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('pomodoro.selectTask.noTasks') }}</p>
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            @click="selectTask(task)"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-3">
                  <div
                    :class="[
                      'w-3 h-3 rounded-full',
                      getPriorityColor(task.priority)
                    ]"
                  ></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ task.title }}
                    </p>
                    <p v-if="task.description" class="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {{ task.description }}
                    </p>
                    <div class="flex items-center space-x-4 mt-2">
                      <span
                        :class="[
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          getStatusColor(task.status)
                        ]"
                      >
                        {{ $t(`tasks.status.${task.status}`) }}
                      </span>
                      <span v-if="task.due_date" class="text-xs text-gray-500 dark:text-gray-400">
                        {{ $t('common.due') }}: {{ formatDate(task.due_date) }}
                      </span>
                      <span v-if="task.estimated_pomodoros" class="text-xs text-gray-500 dark:text-gray-400">
                        {{ $t('pomodoro.selectTask.estimatedPomodoros', { count: task.estimated_pomodoros }) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click.stop="selectTask(task)"
                  class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <button
            @click="startWithoutTask"
            class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            {{ $t('pomodoro.selectTask.startWithoutTask') }}
          </button>
          <button
            @click="$emit('update:show', false)"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            {{ $t('common.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Task {
  id: number
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date?: string
  estimated_pomodoros?: number
}

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  'selected': [taskId: number, taskTitle: string]
}>()

// Reactive state
const tasks = ref<Task[]>([])
const searchQuery = ref('')
const loading = ref(false)

// Computed
const filteredTasks = computed(() => {
  if (!searchQuery.value) {
    return tasks.value.filter(task => task.status !== 'completed' && task.status !== 'cancelled')
  }
  
  const query = searchQuery.value.toLowerCase()
  return tasks.value.filter(task => 
    (task.status !== 'completed' && task.status !== 'cancelled') &&
    (task.title.toLowerCase().includes(query) || 
     task.description?.toLowerCase().includes(query))
  )
})

// Methods
const loadTasks = async () => {
  loading.value = true
  try {
    // Mock data - replace with actual API call
    tasks.value = [
      {
        id: 1,
        title: "完成项目文档",
        description: "编写项目的技术文档和用户手册",
        status: "in_progress",
        priority: "high",
        due_date: "2024-01-20",
        estimated_pomodoros: 3
      },
      {
        id: 2,
        title: "代码审查",
        description: "审查新功能的代码实现",
        status: "pending",
        priority: "medium",
        due_date: "2024-01-18",
        estimated_pomodoros: 2
      },
      {
        id: 3,
        title: "修复UI bug",
        description: "修复用户界面中的显示问题",
        status: "pending",
        priority: "urgent",
        estimated_pomodoros: 1
      },
      {
        id: 4,
        title: "学习新技术",
        description: "学习Vue 3的新特性和最佳实践",
        status: "pending",
        priority: "low",
        estimated_pomodoros: 5
      }
    ]
  } catch (error) {
    console.error('Failed to load tasks:', error)
  } finally {
    loading.value = false
  }
}

const selectTask = (task: Task) => {
  emit('selected', task.id, task.title)
}

const startWithoutTask = () => {
  emit('selected', 0, '')
}

const getPriorityColor = (priority: string): string => {
  const colors = {
    low: 'bg-gray-400',
    medium: 'bg-yellow-400',
    high: 'bg-orange-400',
    urgent: 'bg-red-400'
  }
  return colors[priority as keyof typeof colors] || 'bg-gray-400'
}

const getStatusColor = (status: string): string => {
  const colors = {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// Watch for modal show/hide
watch(() => props.show, (newValue) => {
  if (newValue) {
    loadTasks()
    searchQuery.value = ''
  }
})

onMounted(() => {
  if (props.show) {
    loadTasks()
  }
})
</script>
