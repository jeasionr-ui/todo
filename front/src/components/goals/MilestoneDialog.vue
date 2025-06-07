<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-full max-w-lg rounded-lg bg-white dark:bg-gray-800 p-6">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
          {{ milestone ? $t('goal.editMilestone') : $t('goal.addMilestone') }}
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

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- 标题 -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('goal.title') }} *
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              :placeholder="$t('goal.milestoneTitlePlaceholder')"
            />
          </div>

          <!-- 描述 -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('goal.description') }}
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              :placeholder="$t('goal.milestoneDescriptionPlaceholder')"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <!-- 目标日期 -->
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('goal.targetDate') }}
              </label>
              <input
                v-model="form.targetDate"
                type="date"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <!-- 顺序 -->
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('goal.order') }}
              </label>
              <input
                v-model.number="form.order"
                type="number"
                min="1"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <!-- 编辑模式下显示完成状态 -->
          <div v-if="milestone">
            <label class="flex items-center gap-2">
              <input
                v-model="form.isCompleted"
                type="checkbox"
                class="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('goal.isCompleted') }}
              </span>
            </label>
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
            type="submit"
            :disabled="loading"
            class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 focus:ring-0 disabled:opacity-50"
          >
            <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            {{ milestone ? $t('common.update') : $t('common.create') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { goalService } from '@/services/goalService'
import type { GoalMilestone, CreateMilestoneRequest, UpdateMilestoneRequest } from '@/services/types/GoalType'
import { toastService } from '@/services/toastService'

const { t } = useI18n()

// Props
interface Props {
  goalId?: string
  milestone?: GoalMilestone | null
}

const props = withDefaults(defineProps<Props>(), {
  milestone: null
})

// Emits
const emit = defineEmits<{
  close: []
  saved: []
}>()

// 响应式数据
const loading = ref(false)

const form = reactive<CreateMilestoneRequest & UpdateMilestoneRequest>({
  title: '',
  description: '',
  targetDate: '',
  order: 1,
  isCompleted: false
})

// 方法
const initForm = () => {
  if (props.milestone) {
    // 编辑模式
    form.title = props.milestone.title
    form.description = props.milestone.description || ''
    form.targetDate = props.milestone.targetDate ? props.milestone.targetDate.split('T')[0] : ''
    form.order = props.milestone.order
    form.isCompleted = props.milestone.isCompleted
  } else {
    // 创建模式
    form.title = ''
    form.description = ''
    form.targetDate = ''
    form.order = 1
    form.isCompleted = false
  }
}

const handleSubmit = async () => {
  if (!props.goalId) return

  try {
    loading.value = true

    const milestoneData = {
      title: form.title,
      description: form.description || undefined,
      targetDate: form.targetDate || undefined,
      order: form.order
    }

    if (props.milestone) {
      // 编辑模式
      const updateData = {
        ...milestoneData,
        isCompleted: form.isCompleted
      }
      await goalService.updateMilestone(props.goalId, props.milestone.id, updateData)
      toastService.success(t('goal.milestoneUpdateSuccess'))
    } else {
      // 创建模式
      await goalService.createMilestone(props.goalId, milestoneData as CreateMilestoneRequest)
      toastService.success(t('goal.milestoneCreateSuccess'))
    }

    emit('saved')
  } catch (error) {
    console.error('Failed to save milestone:', error)
    toastService.error(props.milestone ? t('goal.milestoneUpdateError') : t('goal.milestoneCreateError'))
  } finally {
    loading.value = false
  }
}

// 监听 props 变化
watch(() => props.milestone, initForm, { immediate: true })

// 生命周期
onMounted(() => {
  initForm()
})
</script>
