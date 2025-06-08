<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 p-6">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
          {{ goal ? $t('goal.edit') : $t('goal.create') }}
        </h2>
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
              :placeholder="$t('goal.titlePlaceholder')"
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
              :placeholder="$t('goal.descriptionPlaceholder')"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <!-- 类别 -->
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('goal.category') }} *
              </label>
              <select
                v-model="form.category"
                required
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{{ $t('goal.selectCategory') }}</option>
                <option value="personal">{{ $t('goal.personal') }}</option>
                <option value="career">{{ $t('goal.career') }}</option>
                <option value="health">{{ $t('goal.health') }}</option>
                <option value="education">{{ $t('goal.education') }}</option>
                <option value="finance">{{ $t('goal.finance') }}</option>
                <option value="relationship">{{ $t('goal.relationship') }}</option>
                <option value="hobby">{{ $t('goal.hobby') }}</option>
                <option value="other">{{ $t('goal.other') }}</option>
              </select>
            </div>

            <!-- 优先级 -->
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('goal.priority') }} *
              </label>
              <select
                v-model="form.priority"
                required
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="high">{{ $t('goal.high') }}</option>
                <option value="medium">{{ $t('goal.medium') }}</option>
                <option value="low">{{ $t('goal.low') }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <!-- 开始日期 -->
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('goal.startDate') }}
              </label>
              <div class="relative">
                <flat-pickr
                  v-model="startDateValue"
                  :config="flatpickrConfig"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  :placeholder="$t('goal.selectStartDate')"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M5.5 1.5V4.5M10.5 1.5V4.5M2 7.5H14M3.5 2.5H12.5C13.0523 2.5 13.5 2.94772 13.5 3.5V13.5C13.5 14.0523 13.0523 14.5 12.5 14.5H3.5C2.94772 14.5 2.5 14.0523 2.5 13.5V3.5C2.5 2.94772 2.94772 2.5 3.5 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>

            <!-- 目标日期 -->
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('goal.targetDate') }}
              </label>
              <div class="relative">
                <flat-pickr
                  v-model="targetDateValue"
                  :config="flatpickrConfig"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  :placeholder="$t('goal.selectTargetDate')"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M5.5 1.5V4.5M10.5 1.5V4.5M2 7.5H14M3.5 2.5H12.5C13.0523 2.5 13.5 2.94772 13.5 3.5V13.5C13.5 14.0523 13.0523 14.5 12.5 14.5H3.5C2.94772 14.5 2.5 14.0523 2.5 13.5V3.5C2.5 2.94772 2.94772 2.5 3.5 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <!-- 父目标 -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('goal.parentGoal') }}
            </label>
            <select
              v-model="form.parentGoalId"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('goal.noParentGoal') }}</option>
              <option
                v-for="parentGoal in parentGoals"
                :key="parentGoal.id"
                :value="parentGoal.id"
                :disabled="parentGoal.id === goal?.id"
              >
                {{ parentGoal.title }}
              </option>
            </select>
          </div>

          <!-- 编辑模式下显示状态和进度 -->
          <div v-if="goal" class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <!-- 状态 -->
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('goal.status') }}
              </label>
              <select
                v-model="form.status"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="draft">{{ $t('goal.draft') }}</option>
                <option value="active">{{ $t('goal.active') }}</option>
                <option value="paused">{{ $t('goal.paused') }}</option>
                <option value="completed">{{ $t('goal.completed') }}</option>
                <option value="cancelled">{{ $t('goal.cancelled') }}</option>
              </select>
            </div>

            <!-- 进度 -->
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('goal.progress') }} (0-100%)
              </label>
              <input
                v-model.number="form.progressPercentage"
                type="number"
                min="0"
                max="100"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
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
            {{ goal ? $t('common.update') : $t('common.create') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { useFlatPickr } from '@/composables/useFlatPickr'
import { goalService } from '@/services/goalService'
import type Goal from '@/services/types/GoalType'
import type { CreateGoalRequest, UpdateGoalRequest } from '@/services/types/GoalType'
import { toastService } from '@/services/toastService'

const { t } = useI18n()
const { flatpickrConfig } = useFlatPickr()

// Props
interface Props {
  goal?: Goal | null
  parentGoals: Goal[]
}

const props = withDefaults(defineProps<Props>(), {
  goal: null
})

// Emits
const emit = defineEmits<{
  close: []
  saved: []
}>()

// 响应式数据
const loading = ref(false)

const form = reactive<CreateGoalRequest & UpdateGoalRequest>({
  title: '',
  description: '',
  category: '',
  priority: 'medium',
  startDate: '',
  targetDate: '',
  parentGoalId: '',
  status: 'draft',
  progressPercentage: 0
})

// 日期字段的计算属性，用于处理 flatpickr 的类型要求
const startDateValue = computed({
  get: () => form.startDate || null,
  set: (value: string | null) => {
    form.startDate = value || ''
  }
})

const targetDateValue = computed({
  get: () => form.targetDate || null,
  set: (value: string | null) => {
    form.targetDate = value || ''
  }
})

// 方法
const initForm = () => {
  if (props.goal) {
    // 编辑模式
    form.title = props.goal.title
    form.description = props.goal.description || ''
    form.category = props.goal.category
    form.priority = props.goal.priority
    form.startDate = props.goal.startDate ? props.goal.startDate.split('T')[0] : ''
    form.targetDate = props.goal.targetDate ? props.goal.targetDate.split('T')[0] : ''
    form.parentGoalId = props.goal.parentGoalId || ''
    form.status = props.goal.status
    form.progressPercentage = props.goal.progressPercentage
  } else {
    // 创建模式
    form.title = ''
    form.description = ''
    form.category = ''
    form.priority = 'medium'
    form.startDate = ''
    form.targetDate = ''
    form.parentGoalId = ''
    form.status = 'draft'
    form.progressPercentage = 0
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true

    const goalData = {
      title: form.title,
      description: form.description || undefined,
      category: form.category,
      priority: form.priority as 'high' | 'medium' | 'low',
      startDate: form.startDate || undefined,
      targetDate: form.targetDate || undefined,
      parentGoalId: form.parentGoalId || undefined
    }

    if (props.goal) {
      // 编辑模式
      const updateData = {
        ...goalData,
        status: form.status as 'draft' | 'active' | 'paused' | 'completed' | 'cancelled',
        progressPercentage: form.progressPercentage
      }
      await goalService.updateGoal(props.goal.id, updateData)
      toastService.success(t('goal.updateSuccess'))
    } else {
      // 创建模式
      await goalService.createGoal(goalData as CreateGoalRequest)
      toastService.success(t('goal.createSuccess'))
    }

    emit('saved')
  } catch (error) {
    console.error('Failed to save goal:', error)
    toastService.error(props.goal ? t('goal.updateError') : t('goal.createError'))
  } finally {
    loading.value = false
  }
}

// 监听 props 变化
watch(() => props.goal, initForm, { immediate: true })

// 生命周期
onMounted(() => {
  initForm()
})
</script>
