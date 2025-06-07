<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-full max-w-lg rounded-lg bg-white dark:bg-gray-800 p-6">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
          {{ review ? $t('goal.editReview') : $t('goal.addReview') }}
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
          <!-- 回顾日期 -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('goal.reviewDate') }} *
            </label>
            <input
              v-model="form.reviewDate"
              type="date"
              required
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- 回顾类型 -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('goal.reviewType') }} *
            </label>
            <select
              v-model="form.reviewType"
              required
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('goal.selectReviewType') }}</option>
              <option value="weekly">{{ $t('goal.reviewTypeOptions.weekly') }}</option>
              <option value="monthly">{{ $t('goal.reviewTypeOptions.monthly') }}</option>
              <option value="quarterly">{{ $t('goal.reviewTypeOptions.quarterly') }}</option>
              <option value="custom">{{ $t('goal.reviewTypeOptions.custom') }}</option>
            </select>
          </div>

          <!-- 评分 -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('goal.rating') }} *
            </label>
            <div class="flex items-center gap-1">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="form.rating = star"
                class="text-2xl hover:scale-110 transition-transform"
                :class="star <= form.rating ? 'text-yellow-400' : 'text-gray-300'"
              >
                ★
              </button>
              <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {{ form.rating }}/5
              </span>
            </div>
          </div>

          <!-- 回顾内容 -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('goal.reviewContent') }} *
            </label>
            <textarea
              v-model="form.content"
              rows="4"
              required
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              :placeholder="$t('goal.reviewContentPlaceholder')"
            ></textarea>
          </div>

          <!-- 经验教训 -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('goal.lessonsLearned') }}
            </label>
            <textarea
              v-model="form.lessonsLearned"
              rows="3"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              :placeholder="$t('goal.lessonsLearnedPlaceholder')"
            ></textarea>
          </div>

          <!-- 下一步计划 -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('goal.nextSteps') }}
            </label>
            <textarea
              v-model="form.nextSteps"
              rows="3"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              :placeholder="$t('goal.nextStepsPlaceholder')"
            ></textarea>
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
            {{ review ? $t('common.update') : $t('common.create') }}
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
import type { GoalReview, CreateReviewRequest } from '@/services/types/GoalType'
import { toastService } from '@/services/toastService'

const { t } = useI18n()

// Props
interface Props {
  goalId?: string
  review?: GoalReview | null
}

const props = withDefaults(defineProps<Props>(), {
  review: null
})

// Emits
const emit = defineEmits<{
  close: []
  saved: []
}>()

// 响应式数据
const loading = ref(false)

const form = reactive<CreateReviewRequest>({
  reviewDate: '',
  reviewType: 'monthly',
  content: '',
  rating: 3,
  lessonsLearned: '',
  nextSteps: ''
})

// 方法
const initForm = () => {
  if (props.review) {
    // 编辑模式
    form.reviewDate = props.review.reviewDate.split('T')[0]
    form.reviewType = props.review.reviewType || 'monthly'
    form.content = props.review.content
    form.rating = props.review.rating
    form.lessonsLearned = props.review.lessonsLearned || ''
    form.nextSteps = props.review.nextSteps || ''
  } else {
    // 创建模式 - 默认今天
    const today = new Date().toISOString().split('T')[0]
    form.reviewDate = today
    form.reviewType = 'monthly'
    form.content = ''
    form.rating = 3
    form.lessonsLearned = ''
    form.nextSteps = ''
  }
}

const handleSubmit = async () => {
  if (!props.goalId) return

  try {
    loading.value = true

    const reviewData: CreateReviewRequest = {
      reviewDate: form.reviewDate,
      reviewType: form.reviewType,
      content: form.content,
      rating: form.rating,
      lessonsLearned: form.lessonsLearned || undefined,
      nextSteps: form.nextSteps || undefined
    }

    if (props.review) {
      // 编辑模式
      await goalService.updateReview(props.goalId, props.review.id, reviewData)
      toastService.success(t('goal.reviewUpdateSuccess'))
    } else {
      // 创建模式
      await goalService.createReview(props.goalId, reviewData)
      toastService.success(t('goal.reviewCreateSuccess'))
    }

    emit('saved')
  } catch (error) {
    console.error('Failed to save review:', error)
    toastService.error(props.review ? t('goal.reviewUpdateError') : t('goal.reviewCreateError'))
  } finally {
    loading.value = false
  }
}

// 监听 props 变化
watch(() => props.review, initForm, { immediate: true })

// 生命周期
onMounted(() => {
  initForm()
})
</script>
