<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('goal.title')" />
    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <!-- 目标列表头部 -->
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white/90">
          {{ $t('goal.all') }}
        </h3>
        <div class="flex flex-wrap items-center gap-4">
          <!-- 搜索框 -->
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              :placeholder="$t('goal.search')"
              @input="handleSearch"
              class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 pl-11 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500"
            />
            <span class="absolute left-4 top-1/2 -translate-y-1/2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M7.33325 12.6667C10.2789 12.6667 12.6666 10.279 12.6666 7.33333C12.6666 4.38769 10.2789 2 7.33325 2C4.38761 2 1.99992 4.38769 1.99992 7.33333C1.99992 10.279 4.38761 12.6667 7.33325 12.6667Z"
                  stroke="#8C9097"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14.0001 14L11.3334 11.3333"
                  stroke="#8C9097"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </div>

          <!-- 筛选按钮 -->
          <button
            @click="toggleFilterMenu"
            class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 3H14"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M5 8H11"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M7 13H9"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
            {{ $t('goal.filter') }}
          </button>

          <!-- 新建目标按钮 -->
          <button
            @click="openGoalDialog()"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:ring-0"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3V13"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M3 8H13"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            {{ $t('goal.create') }}
          </button>
        </div>
      </div>

      <!-- 筛选菜单 -->
      <div v-if="showFilterMenu" class="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <!-- 状态筛选 -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('goal.status') }}
            </label>
            <select
              v-model="filters.status"
              @change="loadGoals"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300"
            >
              <option value="">{{ $t('goal.allStatus') }}</option>
              <option value="planning">{{ $t('goal.planning') }}</option>
              <option value="active">{{ $t('goal.active') }}</option>
              <option value="paused">{{ $t('goal.paused') }}</option>
              <option value="completed">{{ $t('goal.completed') }}</option>
              <option value="cancelled">{{ $t('goal.cancelled') }}</option>
            </select>
          </div>

          <!-- 类别筛选 -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('goal.category') }}
            </label>
            <select
              v-model="filters.category"
              @change="loadGoals"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300"
            >
              <option value="">{{ $t('goal.allCategories') }}</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <!-- 优先级筛选 -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('goal.priority') }}
            </label>
            <select
              v-model="filters.priority"
              @change="loadGoals"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300"
            >
              <option value="">{{ $t('goal.allPriorities') }}</option>
              <option value="high">{{ $t('goal.high') }}</option>
              <option value="medium">{{ $t('goal.medium') }}</option>
              <option value="low">{{ $t('goal.low') }}</option>
            </select>
          </div>

          <!-- 父目标筛选 -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('goal.parentGoal') }}
            </label>
            <select
              v-model="filters.parentGoalId"
              @change="loadGoals"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300"
            >
              <option value="">{{ $t('goal.allGoals') }}</option>
              <option value="null">{{ $t('goal.topLevelGoals') }}</option>
              <option v-for="goal in parentGoals" :key="goal.id" :value="goal.id">
                {{ goal.title }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 目标统计卡片 -->
      <div v-if="stats" class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('goal.totalGoals') }}</h4>
          <p class="mt-2 text-2xl font-bold text-gray-800 dark:text-white">{{ stats.totalGoals }}</p>
        </div>
        <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('goal.activeGoals') }}</h4>
          <p class="mt-2 text-2xl font-bold text-green-600">{{ stats.activeGoals }}</p>
        </div>
        <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('goal.completedGoals') }}</h4>
          <p class="mt-2 text-2xl font-bold text-blue-600">{{ stats.completedGoals }}</p>
        </div>
        <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('goal.averageProgress') }}</h4>
          <p class="mt-2 text-2xl font-bold text-purple-600">{{ Math.round(stats.averageProgress) }}%</p>
        </div>
      </div>

      <!-- 目标列表 -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>

      <div v-else-if="goals.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">{{ $t('goal.noGoals') }}</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="goal in goals"
          :key="goal.id"
          class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h4 class="text-lg font-semibold text-gray-800 dark:text-white">
                  {{ goal.title }}
                </h4>
                <span
                  :class="getStatusColor(goal.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ $t(`goal.${goal.status}`) }}
                </span>
                <span
                  :class="getPriorityColor(goal.priority)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ $t(`goal.${goal.priority}`) }}
                </span>
              </div>

              <p v-if="goal.description" class="text-gray-600 dark:text-gray-400 mb-3">
                {{ goal.description }}
              </p>

              <div class="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <span>{{ $t('goal.category') }}: {{ goal.category }}</span>
                <span v-if="goal.targetDate">
                  {{ $t('goal.targetDate') }}: {{ formatDate(goal.targetDate) }}
                </span>
                <span v-if="goal.parentGoalId">
                  {{ $t('goal.subGoal') }}
                </span>
              </div>

              <!-- 进度条 -->
              <div class="mt-4">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('goal.progress') }}</span>
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

            <!-- 操作按钮 -->
            <div class="flex items-center gap-2 ml-4">
              <button
                @click="openGoalDialog(goal)"
                class="p-2 text-gray-400 hover:text-brand-500 dark:hover:text-brand-400"
                :title="$t('goal.edit')"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M11.333 2.00004C11.7018 1.63127 12.2982 1.63127 12.667 2.00004C13.0357 2.36881 13.0357 2.96525 12.667 3.33402L4.66699 11.334H2.66699V9.33404L11.333 2.00004Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button
                @click="viewGoalDetails(goal)"
                class="p-2 text-gray-400 hover:text-green-500 dark:hover:text-green-400"
                :title="$t('goal.view')"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle
                    cx="8"
                    cy="8"
                    r="3"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button
                @click="deleteGoalConfirm(goal)"
                class="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                :title="$t('goal.delete')"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 4h12"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h8.667Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页组件 -->
      <div class="mt-8" v-if="!loading && goals.length > 0">
        <Pagination
          v-model:currentPage="pagination.currentPage"
          :pageCount="pagination.totalPages"
          :totalItems="pagination.total"
          :pageSize="pagination.pageSize"
          @page-change="onPageChange"
          @page-size-change="onPageSizeChange"
        />
      </div>
    </div>

    <!-- 目标对话框 -->
    <GoalDialog
      v-if="showGoalDialog"
      :goal="selectedGoal"
      :parentGoals="parentGoals"
      @close="closeGoalDialog"
      @saved="onGoalSaved"
    />

    <!-- 目标详情对话框 -->
    <GoalDetailDialog
      v-if="showGoalDetailDialog"
      :goal="selectedGoal"
      @close="closeGoalDetailDialog"
      @updated="onGoalUpdated"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Pagination from '@/components/common/Pagination.vue'
import GoalDialog from '@/components/goals/GoalDialog.vue'
import GoalDetailDialog from '@/components/goals/GoalDetailDialog.vue'
import { goalService } from '@/services/goalService'
import type Goal from '@/services/types/GoalType'
import type { GoalStats, GoalFilters } from '@/services/types/GoalType'
import { toastService } from '@/services/toastService'

const { t } = useI18n()

// 响应式数据
const goals = ref<Goal[]>([])
const stats = ref<GoalStats | null>(null)
const parentGoals = ref<Goal[]>([])
const categories = ref<string[]>([])
const loading = ref(false)
const searchQuery = ref('')
const showFilterMenu = ref(false)
const showGoalDialog = ref(false)
const showGoalDetailDialog = ref(false)
const selectedGoal = ref<Goal | null>(null)

// 筛选器
const filters = reactive<GoalFilters>({
  status: '',
  category: '',
  priority: '',
  parentGoalId: '',
  search: '',
  page: 1,
  pageSize: 3
})

// 分页信息
const pagination = reactive({
  total: 0,
  pageSize: 3,
  currentPage: 1,
  totalPages: 0
})

// 计算属性
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

// 方法
const loadGoals = async () => {
  try {
    loading.value = true
    const response = await goalService.getGoals({
      ...filters,
      search: searchQuery.value
    })
    goals.value = response.data
    pagination.total = response.pagination.total
    pagination.currentPage = response.pagination.currentPage
    pagination.totalPages = response.pagination.totalPages
    pagination.pageSize = response.pagination.pageSize
  } catch (error) {
    console.error('Failed to load goals:', error)
    toastService.error(t('goal.loadError'))
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    stats.value = await goalService.getGoalStats()
  } catch (error) {
    console.error('Failed to load goal stats:', error)
  }
}

const loadParentGoals = async () => {
  try {
    const response = await goalService.getGoals({ status: 'active', pageSize: 100 })
    parentGoals.value = response.data
    
    // 提取类别
    const categorySet = new Set<string>()
    response.data.forEach(goal => {
      if (goal.category) {
        categorySet.add(goal.category)
      }
    })
    categories.value = Array.from(categorySet)
  } catch (error) {
    console.error('Failed to load parent goals:', error)
  }
}

const handleSearch = () => {
  filters.page = 1
  loadGoals()
}

const toggleFilterMenu = () => {
  showFilterMenu.value = !showFilterMenu.value
}

const openGoalDialog = (goal?: Goal) => {
  selectedGoal.value = goal || null
  showGoalDialog.value = true
}

const closeGoalDialog = () => {
  showGoalDialog.value = false
  selectedGoal.value = null
}

const onGoalSaved = () => {
  closeGoalDialog()
  loadGoals()
  loadStats()
}

const viewGoalDetails = (goal: Goal) => {
  selectedGoal.value = goal
  showGoalDetailDialog.value = true
}

const closeGoalDetailDialog = () => {
  showGoalDetailDialog.value = false
  selectedGoal.value = null
}

const onGoalUpdated = () => {
  closeGoalDetailDialog()
  loadGoals()
  loadStats()
}

const deleteGoalConfirm = (goal: Goal) => {
  if (confirm(t('goal.deleteConfirm', { title: goal.title }))) {
    deleteGoal(goal.id)
  }
}

const deleteGoal = async (goalId: string) => {
  try {
    await goalService.deleteGoal(goalId)
    toastService.success(t('goal.deleteSuccess'))
    loadGoals()
    loadStats()
  } catch (error) {
    console.error('Failed to delete goal:', error)
    toastService.error(t('goal.deleteError'))
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.totalPages) {
    filters.page = page
    pagination.currentPage = page
    loadGoals()
  }
}

const onPageChange = (page: number) => {
  changePage(page)
}

const onPageSizeChange = (newPageSize: number) => {
  filters.pageSize = newPageSize
  filters.page = 1
  pagination.pageSize = newPageSize
  pagination.currentPage = 1
  loadGoals()
}

const getPageNumbers = () => {
  const pages = []
  const start = Math.max(1, pagination.currentPage - 2)
  const end = Math.min(pagination.totalPages, pagination.currentPage + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

// 生命周期
onMounted(() => {
  loadGoals()
  loadStats()
  loadParentGoals()
})
</script>
