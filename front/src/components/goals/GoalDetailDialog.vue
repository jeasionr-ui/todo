<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 p-6">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
          {{ goal?.title }}
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

      <div v-if="goal" class="space-y-6">
        <!-- 目标基本信息 -->
        <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 class="mb-4 font-semibold text-gray-800 dark:text-white">{{ $t('goal.basicInfo') }}</h3>
          
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('goal.status') }}:</span>
              <span
                :class="getStatusColor(goal.status)"
                class="ml-2 px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ $t(`goal.${goal.status}`) }}
              </span>
            </div>
            
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('goal.priority') }}:</span>
              <span
                :class="getPriorityColor(goal.priority)"
                class="ml-2 px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ $t(`goal.${goal.priority}`) }}
              </span>
            </div>
            
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('goal.category') }}:</span>
              <span class="ml-2 text-sm text-gray-800 dark:text-white">{{ goal.category }}</span>
            </div>
            
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('goal.progress') }}:</span>
              <span class="ml-2 text-sm text-gray-800 dark:text-white">{{ goal.progressPercentage }}%</span>
            </div>
            
            <div v-if="goal.startDate">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('goal.startDate') }}:</span>
              <span class="ml-2 text-sm text-gray-800 dark:text-white">{{ formatDate(goal.startDate) }}</span>
            </div>
            
            <div v-if="goal.targetDate">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('goal.targetDate') }}:</span>
              <span class="ml-2 text-sm text-gray-800 dark:text-white">{{ formatDate(goal.targetDate) }}</span>
            </div>
          </div>

          <div v-if="goal.description" class="mt-4">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('goal.description') }}:</span>
            <p class="mt-1 text-sm text-gray-800 dark:text-white">{{ goal.description }}</p>
          </div>

          <!-- 进度条 -->
          <div class="mt-4">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('goal.progress') }}</span>
              <span class="text-sm font-medium text-gray-800 dark:text-white">{{ goal.progressPercentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                :style="{ width: goal.progressPercentage + '%' }"
                class="bg-brand-500 h-2 rounded-full"
              ></div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex space-x-8">
            <button
              @click="activeTab = 'milestones'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'milestones'
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ $t('goal.milestones') }} ({{ milestones.length }})
            </button>
            <button
              @click="activeTab = 'tasks'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'tasks'
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ $t('goal.tasks') }} ({{ associatedTasks.length }})
            </button>
            <button
              @click="activeTab = 'reviews'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'reviews'
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ $t('goal.reviews') }} ({{ reviews.length }})
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- 里程碑 -->
          <div v-if="activeTab === 'milestones'">
            <div class="mb-4 flex justify-between items-center">
              <h3 class="font-semibold text-gray-800 dark:text-white">{{ $t('goal.milestones') }}</h3>
              <button
                @click="openMilestoneDialog()"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                {{ $t('goal.addMilestone') }}
              </button>
            </div>

            <div v-if="milestones.length === 0" class="text-center py-8 text-gray-500">
              {{ $t('goal.noMilestones') }}
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="milestone in milestones"
                :key="milestone.id"
                class="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    :checked="milestone.isCompleted"
                    @change="toggleMilestone(milestone)"
                    class="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  <div>
                    <h4 class="font-medium text-gray-800 dark:text-white">{{ milestone.title }}</h4>
                    <p v-if="milestone.description" class="text-sm text-gray-500">{{ milestone.description }}</p>
                    <p v-if="milestone.targetDate" class="text-xs text-gray-400">
                      {{ $t('goal.targetDate') }}: {{ formatDate(milestone.targetDate) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="openMilestoneDialog(milestone)"
                    class="p-2 text-gray-400 hover:text-brand-500"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M11.333 2.00004C11.7018 1.63127 12.2982 1.63127 12.667 2.00004C13.0357 2.36881 13.0357 2.96525 12.667 3.33402L4.66699 11.334H2.66699V9.33404L11.333 2.00004Z"
                        stroke="currentColor"
                        stroke-width="1.5"
                      />
                    </svg>
                  </button>
                  <button
                    @click="deleteMilestone(milestone.id)"
                    class="p-2 text-gray-400 hover:text-red-500"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h8.667Z" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 关联任务 -->
          <div v-if="activeTab === 'tasks'">
            <div class="mb-4 flex justify-between items-center">
              <h3 class="font-semibold text-gray-800 dark:text-white">{{ $t('goal.associatedTasks') }}</h3>
              <button
                @click="openTaskAssociationDialog()"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                {{ $t('goal.associateTask') }}
              </button>
            </div>

            <div v-if="associatedTasks.length === 0" class="text-center py-8 text-gray-500">
              {{ $t('goal.noTasks') }}
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="task in associatedTasks"
                :key="task.id"
                class="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <div>
                  <h4 class="font-medium text-gray-800 dark:text-white">{{ task.name }}</h4>
                  <span
                    :class="getTaskStatusColor(task.status)"
                    class="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ $t(`task.${task.status}`) }}
                  </span>
                </div>
                <button
                  @click="dissociateTask(task.id)"
                  class="p-2 text-gray-400 hover:text-red-500"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 回顾 -->
          <div v-if="activeTab === 'reviews'">
            <div class="mb-4 flex justify-between items-center">
              <h3 class="font-semibold text-gray-800 dark:text-white">{{ $t('goal.reviews') }}</h3>
              <button
                @click="openReviewDialog()"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                {{ $t('goal.addReview') }}
              </button>
            </div>

            <div v-if="reviews.length === 0" class="text-center py-8 text-gray-500">
              {{ $t('goal.noReviews') }}
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="review in reviews"
                :key="review.id"
                class="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-gray-800 dark:text-white">
                      {{ formatDate(review.reviewDate) }}
                    </span>
                    <div class="flex items-center">
                      <span v-for="i in 5" :key="i" class="text-yellow-400">
                        {{ i <= review.rating ? '★' : '☆' }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      @click="openReviewDialog(review)"
                      class="p-1 text-gray-400 hover:text-brand-500"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M11.333 2.00004C11.7018 1.63127 12.2982 1.63127 12.667 2.00004C13.0357 2.36881 13.0357 2.96525 12.667 3.33402L4.66699 11.334H2.66699V9.33404L11.333 2.00004Z"
                          stroke="currentColor"
                          stroke-width="1.5"
                        />
                      </svg>
                    </button>
                    <button
                      @click="deleteReview(review.id)"
                      class="p-1 text-gray-400 hover:text-red-500"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h8.667Z" stroke="currentColor" stroke-width="1.5"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">{{ review.content }}</p>
                <div v-if="review.lessonsLearned" class="text-xs text-gray-500 mb-1">
                  <strong>{{ $t('goal.lessonsLearned') }}:</strong> {{ review.lessonsLearned }}
                </div>
                <div v-if="review.nextSteps" class="text-xs text-gray-500">
                  <strong>{{ $t('goal.nextSteps') }}:</strong> {{ review.nextSteps }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 子组件对话框 -->
    <MilestoneDialog
      v-if="showMilestoneDialog"
      :goal-id="goal?.id"
      :milestone="selectedMilestone"
      @close="closeMilestoneDialog"
      @saved="onMilestoneSaved"
    />

    <ReviewDialog
      v-if="showReviewDialog"
      :goal-id="goal?.id"
      :review="selectedReview"
      @close="closeReviewDialog"
      @saved="onReviewSaved"
    />

    <TaskAssociationDialog
      v-if="showTaskAssociationDialog"
      :goal-id="goal?.id"
      :associated-task-ids="associatedTasks.map(t => t.id)"
      @close="closeTaskAssociationDialog"
      @saved="onTaskAssociationSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { goalService } from '@/services/goalService'
import type Goal from '@/services/types/GoalType'
import type { GoalMilestone, GoalReview } from '@/services/types/GoalType'
import { toastService } from '@/services/toastService'
import MilestoneDialog from './MilestoneDialog.vue'
import ReviewDialog from './ReviewDialog.vue'
import TaskAssociationDialog from './TaskAssociationDialog.vue'

const { t } = useI18n()

// Props
interface Props {
  goal: Goal | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  updated: []
}>()

// 响应式数据
const activeTab = ref('milestones')
const milestones = ref<GoalMilestone[]>([])
const reviews = ref<GoalReview[]>([])
const associatedTasks = ref<Array<{ id: string, name: string, status: string }>>([])

// 子对话框状态
const showMilestoneDialog = ref(false)
const showReviewDialog = ref(false)
const showTaskAssociationDialog = ref(false)
const selectedMilestone = ref<GoalMilestone | null>(null)
const selectedReview = ref<GoalReview | null>(null)

// 方法
const getStatusColor = (status: string) => {
  const colors = {
    planning: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    active: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
    paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
  }
  return colors[status as keyof typeof colors] || colors.planning
}

const getPriorityColor = (priority: string) => {
  const colors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
    low: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
  }
  return colors[priority as keyof typeof colors] || colors.medium
}

const getTaskStatusColor = (status: string) => {
  const colors = {
    todo: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    working: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
    done: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
  }
  return colors[status as keyof typeof colors] || colors.todo
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const loadMilestones = async () => {
  if (!props.goal) return
  try {
    milestones.value = await goalService.getGoalMilestones(props.goal.id)
  } catch (error) {
    console.error('Failed to load milestones:', error)
  }
}

const loadReviews = async () => {
  if (!props.goal) return
  try {
    reviews.value = await goalService.getGoalReviews(props.goal.id)
  } catch (error) {
    console.error('Failed to load reviews:', error)
  }
}

const loadAssociatedTasks = async () => {
  if (!props.goal) return
  try {
    associatedTasks.value = await goalService.getGoalTasks(props.goal.id)
  } catch (error) {
    console.error('Failed to load associated tasks:', error)
  }
}

// 里程碑相关方法
const openMilestoneDialog = (milestone?: GoalMilestone) => {
  selectedMilestone.value = milestone || null
  showMilestoneDialog.value = true
}

const closeMilestoneDialog = () => {
  showMilestoneDialog.value = false
  selectedMilestone.value = null
}

const onMilestoneSaved = async () => {
  closeMilestoneDialog()
  loadMilestones()
  // 更新目标进度
  if (props.goal) {
    try {
      await goalService.updateGoalProgress(props.goal.id)
    } catch (error) {
      console.error('Failed to update goal progress:', error)
    }
  }
  emit('updated')
}

const toggleMilestone = async (milestone: GoalMilestone) => {
  if (!props.goal) return
  try {
    await goalService.updateMilestone(props.goal.id, milestone.id, {
      isCompleted: !milestone.isCompleted
    })
    loadMilestones()
    // 更新目标进度
    try {
      await goalService.updateGoalProgress(props.goal.id)
    } catch (progressError) {
      console.error('Failed to update goal progress:', progressError)
    }
    emit('updated')
    toastService.success(t('goal.milestoneUpdated'))
  } catch (error) {
    console.error('Failed to toggle milestone:', error)
    toastService.error(t('goal.milestoneUpdateError'))
  }
}

const deleteMilestone = async (milestoneId: string) => {
  if (!props.goal || !confirm(t('goal.deleteMilestoneConfirm'))) return
  try {
    await goalService.deleteMilestone(props.goal.id, milestoneId)
    loadMilestones()
    // 更新目标进度
    try {
      await goalService.updateGoalProgress(props.goal.id)
    } catch (progressError) {
      console.error('Failed to update goal progress:', progressError)
    }
    emit('updated')
    toastService.success(t('goal.milestoneDeleted'))
  } catch (error) {
    console.error('Failed to delete milestone:', error)
    toastService.error(t('goal.milestoneDeleteError'))
  }
}

// 回顾相关方法
const openReviewDialog = (review?: GoalReview) => {
  selectedReview.value = review || null
  showReviewDialog.value = true
}

const closeReviewDialog = () => {
  showReviewDialog.value = false
  selectedReview.value = null
}

const onReviewSaved = () => {
  closeReviewDialog()
  loadReviews()
}

const deleteReview = async (reviewId: string) => {
  if (!props.goal || !confirm(t('goal.deleteReviewConfirm'))) return
  try {
    await goalService.deleteReview(props.goal.id, reviewId)
    loadReviews()
    toastService.success(t('goal.reviewDeleted'))
  } catch (error) {
    console.error('Failed to delete review:', error)
    toastService.error(t('goal.reviewDeleteError'))
  }
}

// 任务关联相关方法
const openTaskAssociationDialog = () => {
  showTaskAssociationDialog.value = true
}

const closeTaskAssociationDialog = () => {
  showTaskAssociationDialog.value = false
}

const onTaskAssociationSaved = () => {
  closeTaskAssociationDialog()
  loadAssociatedTasks()
  emit('updated')
}

const dissociateTask = async (taskId: string) => {
  if (!props.goal || !confirm(t('goal.dissociateTaskConfirm'))) return
  try {
    await goalService.dissociateTask(props.goal.id, taskId)
    loadAssociatedTasks()
    emit('updated')
    toastService.success(t('goal.taskDissociated'))
  } catch (error) {
    console.error('Failed to dissociate task:', error)
    toastService.error(t('goal.taskDissociateError'))
  }
}

// 生命周期
onMounted(() => {
  if (props.goal) {
    loadMilestones()
    loadReviews()
    loadAssociatedTasks()
  }
})
</script>
