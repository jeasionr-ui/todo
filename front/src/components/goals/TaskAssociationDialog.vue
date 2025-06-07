<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-full max-w-lg rounded-lg bg-white dark:bg-gray-800 p-6">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
          {{ $t('goal.associateTask') }}
        </h3>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5l10 10"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <!-- 搜索框 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ $t('goal.searchTasks') }}
          </label>
          <input
            v-model="searchQuery"
            type="text"
            @input="searchTasks"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            :placeholder="$t('goal.searchTasksPlaceholder')"
          />
        </div>

        <!-- 任务列表 -->
        <div class="max-h-64 overflow-y-auto">
          <div v-if="loading" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
          </div>

          <div v-else-if="availableTasks.length === 0" class="text-center py-4 text-gray-500">
            {{ $t('goal.noAvailableTasks') }}
          </div>

          <div v-else class="space-y-2">
            <label
              v-for="task in availableTasks"
              :key="task.id"
              class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <input
                type="checkbox"
                :value="task.id"
                v-model="selectedTaskIds"
                class="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              <div class="flex-1">
                <h4 class="font-medium text-gray-800 dark:text-white">{{ task.name }}</h4>
                <p v-if="task.description" class="text-sm text-gray-500 dark:text-gray-400">
                  {{ task.description }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span
                    :class="getTaskStatusColor(task.status)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ $t(`task.${task.status}`) }}
                  </span>
                  <span
                    :class="getTaskPriorityColor(task.priority)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ $t(`task.${task.priority}`) }}
                  </span>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- 已选择的任务计数 -->
        <div v-if="selectedTaskIds.length > 0" class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t('goal.selectedTasks', { count: selectedTaskIds.length }) }}
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          @click="$emit('close')"
          class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
          @click="handleAssociate"
          :disabled="selectedTaskIds.length === 0 || associating"
          class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 focus:ring-0 disabled:opacity-50"
        >
          <div v-if="associating" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          {{ $t('goal.associate') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { goalService } from '@/services/goalService'
import { getTasks } from '@/services/taskService'
import type Task from '@/services/types/TaskType'
import { toastService } from '@/services/toastService'

const { t } = useI18n()

// Props
interface Props {
  goalId?: string
  associatedTaskIds: string[]
}

const props = withDefaults(defineProps<Props>(), {
  associatedTaskIds: () => []
})

// Emits
const emit = defineEmits<{
  close: []
  saved: []
}>()

// 响应式数据
const loading = ref(false)
const associating = ref(false)
const searchQuery = ref('')
const availableTasks = ref<Task[]>([])
const selectedTaskIds = ref<string[]>([])

// 方法
const getTaskStatusColor = (status: string) => {
  const colors = {
    todo: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    working: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
    done: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
  }
  return colors[status as keyof typeof colors] || colors.todo
}

const getTaskPriorityColor = (priority: string) => {
  const colors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
    low: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
  }
  return colors[priority as keyof typeof colors] || colors.medium
}

const loadTasks = async () => {
  try {
    loading.value = true
    const response = await getTasks({
      page: 1,
      pageSize: 100
    })
    
    // 过滤掉已经关联的任务
    availableTasks.value = response.data.filter(
      task => !props.associatedTaskIds.includes(task.id)
    )
  } catch (error) {
    console.error('Failed to load tasks:', error)
    toastService.error(t('goal.loadTasksError'))
  } finally {
    loading.value = false
  }
}

const searchTasks = async () => {
  try {
    loading.value = true
    const response = await getTasks({
      page: 1,
      pageSize: 100
    })
    
    let tasks = response.data.filter(
      task => !props.associatedTaskIds.includes(task.id)
    )

    if (searchQuery.value) {
      tasks = tasks.filter(task =>
        task.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
      )
    }

    availableTasks.value = tasks
  } catch (error) {
    console.error('Failed to search tasks:', error)
  } finally {
    loading.value = false
  }
}

const handleAssociate = async () => {
  if (!props.goalId || selectedTaskIds.value.length === 0) return

  try {
    associating.value = true

    // 批量关联任务
    for (const taskId of selectedTaskIds.value) {
      await goalService.associateTask(props.goalId, taskId)
    }

    toastService.success(t('goal.tasksAssociated', { count: selectedTaskIds.value.length }))
    emit('saved')
  } catch (error) {
    console.error('Failed to associate tasks:', error)
    toastService.error(t('goal.associateTasksError'))
  } finally {
    associating.value = false
  }
}

// 生命周期
onMounted(() => {
  loadTasks()
})
</script>
