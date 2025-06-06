<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('task.title')" />
    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <!-- 任务列表头部 -->
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white/90">
          {{ $t('task.all') }}
        </h3>
        <div class="flex flex-wrap items-center gap-4">
          <!-- 搜索框 -->
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              :placeholder="$t('task.search')"
              class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 pl-11 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500"
            />
            <span class="absolute left-4 top-1/2 -translate-y-1/2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.0001 2H2.00006C1.82325 2 1.65367 2.07024 1.52865 2.19526C1.40363 2.32029 1.33339 2.48986 1.33339 2.66667C1.33339 2.84348 1.40363 3.01305 1.52865 3.13807C1.65367 3.2631 1.82325 3.33333 2.00006 3.33333H14.0001C14.1769 3.33333 14.3465 3.2631 14.4715 3.13807C14.5965 3.01305 14.6667 2.84348 14.6667 2.66667C14.6667 2.48986 14.5965 2.32029 14.4715 2.19526C14.3465 2.07024 14.1769 2 14.0001 2ZM11.3334 6.66667H4.66673C4.48992 6.66667 4.32035 6.7369 4.19532 6.86193C4.0703 6.98695 4.00006 7.15652 4.00006 7.33333C4.00006 7.51014 4.0703 7.67971 4.19532 7.80474C4.32035 7.92976 4.48992 8 4.66673 8H11.3334C11.5102 8 11.6798 7.92976 11.8048 7.80474C11.9298 7.67971 12.0001 7.51014 12.0001 7.33333C12.0001 7.15652 11.9298 6.98695 11.8048 6.86193C11.6798 6.7369 11.5102 6.66667 11.3334 6.66667ZM8.66673 11.3333H7.33339C7.15659 11.3333 6.98701 11.4036 6.86199 11.5286C6.73697 11.6536 6.66673 11.8232 6.66673 12C6.66673 12.1768 6.73697 12.3464 6.86199 12.4714C6.98701 12.5964 7.15659 12.6667 7.33339 12.6667H8.66673C8.84353 12.6667 9.01311 12.5964 9.13813 12.4714C9.26316 12.3464 9.33339 12.1768 9.33339 12C9.33339 11.8232 9.26316 11.6536 9.13813 11.5286C9.01311 11.4036 8.84353 11.3333 8.66673 11.3333Z"
                fill="currentColor"
              />
            </svg>
            {{ $t('task.filter') }}
          </button>

          <!-- 筛选菜单 -->
          <div
            v-if="showFilterMenu"
            class="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900"
          >
            <h4 class="mb-3 text-sm font-medium text-gray-800 dark:text-white/90">
              {{ $t('task.filter') }}
            </h4>

            <!-- 状态筛选 -->
            <div class="mb-4">
              <label class="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">{{
                $t('task.status')
              }}</label>
              <select
                v-model="filterStatus"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500"
              >
                <option value="all">{{ $t('task.allStatuses') }}</option>
                <option value="todo">{{ $t('task.todo') }}</option>
                <option value="working">{{ $t('task.working') }}</option>
                <option value="done">{{ $t('task.done') }}</option>
              </select>
            </div>

            <!-- 优先级筛选 -->
            <div class="mb-4">
              <label class="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">{{
                $t('task.priority')
              }}</label>
              <select
                v-model="filterPriority"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500"
              >
                <option value="all">{{ $t('task.allPriorities') }}</option>
                <option value="high">{{ $t('task.high') }}</option>
                <option value="medium">{{ $t('task.medium') }}</option>
                <option value="low">{{ $t('task.low') }}</option>
              </select>
            </div>

            <!-- 筛选按钮 -->
            <div class="flex justify-between">
              <button
                @click="resetFilter"
                class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
              >
                {{ $t('task.resetFilter') }}
              </button>
              <button
                @click="applyFilter(filterStatus, filterPriority)"
                class="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600"
              >
                {{ $t('task.applyFilter') }}
              </button>
            </div>
          </div>

          <!-- 创建任务按钮 -->
          <button
            @click="openCreateTaskDialog"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:ring-0 dark:bg-brand-500 dark:hover:bg-brand-600"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.00006 3.33334C7.82325 3.33334 7.65367 3.40358 7.52865 3.5286C7.40363 3.65363 7.33339 3.8232 7.33339 4.00001V7.33334H4.00006C3.82325 7.33334 3.65367 7.40358 3.52865 7.5286C3.40363 7.65363 3.33339 7.8232 3.33339 8.00001C3.33339 8.17682 3.40363 8.34639 3.52865 8.47141C3.65367 8.59644 3.82325 8.66668 4.00006 8.66668H7.33339V12C7.33339 12.1768 7.40363 12.3464 7.52865 12.4714C7.65367 12.5964 7.82325 12.6667 8.00006 12.6667C8.17687 12.6667 8.34644 12.5964 8.47147 12.4714C8.59649 12.3464 8.66673 12.1768 8.66673 12V8.66668H12.0001C12.1769 8.66668 12.3465 8.59644 12.4715 8.47141C12.5965 8.34639 12.6667 8.17682 12.6667 8.00001C12.6667 7.8232 12.5965 7.65363 12.4715 7.5286C12.3465 7.40358 12.1769 7.33334 12.0001 7.33334H8.66673V4.00001C8.66673 3.8232 8.59649 3.65363 8.47147 3.5286C8.34644 3.40358 8.17687 3.33334 8.00006 3.33334Z"
                fill="currentColor"
              />
            </svg>
            {{ $t('task.create') }}
          </button>

          <!-- 任务对话框 -->
          <TaskDialog
            :show="showTaskDialog"
            :isEditMode="isEditMode"
            :modelValue="currentTask"
            @save="saveTask"
            @close="showTaskDialog = false"
          />
        </div>
      </div>

      <!-- 任务列表 -->
      <div v-if="filteredTasks.length > 0" class="space-y-4">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div class="flex flex-col">
            <!-- 任务标题 -->
            <div class="mb-2 flex items-center gap-3">
              <h4 class="text-base font-medium text-gray-800 dark:text-white/90">
                {{ task.name }}
              </h4>
            </div>

            <!-- 任务状态和标签 -->
            <div class="mb-3 flex flex-wrap items-start gap-2 pt-2">
              <!-- 状态标签 -->
              <span
                :class="{
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-500':
                    task.status === 'todo',
                  'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-500':
                    task.status === 'working',
                  'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-500':
                    task.status === 'done',
                }"
                class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
              >
                {{ $t(`task.${task.status}`) }}
              </span>

              <!-- 优先级标签 -->
              <span
                :class="{
                  'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-500':
                    task.priority === 'high',
                  'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-500':
                    task.priority === 'medium',
                  'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-500':
                    task.priority === 'low',
                }"
                class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
              >
                {{ $t(`task.${task.priority}`) }}
              </span>

              <!-- 任务标签 -->
              <span
                v-for="tag in task.tags"
                :key="tag"
                class="inline-block rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-500 px-2.5 py-0.5 text-xs font-medium"
              >
                {{ tag }}
              </span>
            </div>

            <!-- 任务描述 -->
            <p class="mb-3 text-sm text-gray-500 dark:text-gray-400 px-0 py-2 pl-4">
              {{ task.description }}
            </p>

            <!-- 任务元数据和操作按钮 -->
            <div class="flex items-center justify-between gap-4">
              <!-- 元数据信息 -->
              <div
                class="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400"
              >
                <!-- 截止日期 -->
                <div v-if="task.dueDate" class="flex items-center gap-1">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.00008 12.8334C10.2217 12.8334 12.8334 10.2217 12.8334 7.00008C12.8334 3.77842 10.2217 1.16675 7.00008 1.16675C3.77842 1.16675 1.16675 3.77842 1.16675 7.00008C1.16675 10.2217 3.77842 12.8334 7.00008 12.8334Z"
                      stroke="currentColor"
                      stroke-width="1.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7 3.5V7L9.33333 8.16667"
                      stroke="currentColor"
                      stroke-width="1.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  {{ formatDate(task.dueDate) }}
                </div>

                <!-- 提醒时间 -->
                <div v-if="task.reminderTime" class="flex items-center gap-1">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5 5.25C10.5 3.59315 9.15685 2.25 7.5 2.25C5.84315 2.25 4.5 3.59315 4.5 5.25C4.5 6.90685 5.84315 8.25 7.5 8.25C9.15685 8.25 10.5 6.90685 10.5 5.25Z"
                      stroke="currentColor"
                      stroke-width="1.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M3.5 10.5L11.5 10.5"
                      stroke="currentColor"
                      stroke-width="1.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  {{ task.reminderTime }}
                </div>
              </div>

              <!-- 任务操作按钮 -->
              <div class="flex items-center gap-2 shrink-0">
                <button
                  @click="openEditTaskDialog(task)"
                  class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  :title="$t('common.edit')"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.16699 3.33301L10.8337 1.66634C11.0566 1.44338 11.3621 1.31934 11.6803 1.31934C11.9986 1.31934 12.304 1.44338 12.527 1.66634C12.75 1.88931 12.874 2.19475 12.874 2.51301C12.874 2.83127 12.75 3.13671 12.527 3.35967L4.83366 11.053C4.47033 11.4163 4.00033 11.6663 3.50033 11.7663L1.66699 12.333L2.23366 10.4997C2.33366 9.99967 2.58366 9.52967 2.94699 9.16634L9.16699 2.94634V3.33301ZM9.16699 3.33301L12.667 6.83301"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <button
                  @click="deleteTask(task.id)"
                  class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  :title="$t('common.delete')"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 4H3.33333H14"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5.33301 4.00033V2.66699C5.33301 2.31337 5.47348 1.97423 5.7235 1.7242C5.97353 1.47418 6.31267 1.33366 6.66634 1.33366H9.33301C9.68667 1.33366 10.0258 1.47418 10.2758 1.7242C10.5259 1.97423 10.6663 2.31337 10.6663 2.66699V4.00033M12.6663 4.00033V13.3337C12.6663 13.6873 12.5259 14.0265 12.2758 14.2765C12.0258 14.5265 11.6867 14.667 11.333 14.667H4.66634C4.31272 14.667 3.97358 14.5265 3.72355 14.2765C3.47353 14.0265 3.33301 13.6873 3.33301 13.3337V4.00033H12.6663Z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.66699 7.33366V11.3337"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.33301 7.33366V11.3337"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 无任务提示 -->
      <div
        v-else-if="!loading"
        class="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="mb-4 text-gray-300 dark:text-gray-600"
        >
          <path
            d="M56 16H48V12C48 10.9391 47.5786 9.92172 46.8284 9.17157C46.0783 8.42143 45.0609 8 44 8H20C18.9391 8 17.9217 8.42143 17.1716 9.17157C16.4214 9.92172 16 10.9391 16 12V16H8C6.93913 16 5.92172 16.4214 5.17157 17.1716C4.42143 17.9217 4 18.9391 4 20V52C4 53.0609 4.42143 54.0783 5.17157 54.8284C5.92172 55.5786 6.93913 56 8 56H56C57.0609 56 58.0783 55.5786 58.8284 54.8284C59.5786 54.0783 60 53.0609 60 52V20C60 18.9391 59.5786 17.9217 58.8284 17.1716C58.0783 16.4214 57.0609 16 56 16ZM20 12H44V24H20V12ZM56 52H8V20H16V24C16 25.0609 16.4214 26.0783 17.1716 26.8284C17.9217 27.5786 18.9391 28 20 28H44C45.0609 28 46.0783 27.5786 46.8284 26.8284C47.5786 26.0783 48 25.0609 48 24V20H56V52Z"
            fill="currentColor"
          />
          <path
            d="M24 36H40C40.5304 36 41.0391 35.7893 41.4142 35.4142C41.7893 35.0391 42 34.5304 42 34C42 33.4696 41.7893 32.9609 41.4142 32.5858C41.0391 32.2107 40.5304 32 40 32H24C23.4696 32 22.9609 32.2107 22.5858 32.5858C22.2107 32.9609 22 33.4696 22 34C22 34.5304 22.2107 35.0391 22.5858 35.4142C22.9609 35.7893 23.4696 36 24 36Z"
            fill="currentColor"
          />
          <path
            d="M24 44H32C32.5304 44 33.0391 43.7893 33.4142 43.4142C33.7893 43.0391 34 42.5304 34 42C34 41.4696 33.7893 40.9609 33.4142 40.5858C33.0391 40.2107 32.5304 40 32 40H24C23.4696 40 22.9609 40.2107 22.5858 40.5858C22.2107 40.9609 22 41.4696 22 42C22 42.5304 22.2107 43.0391 22.5858 43.4142C22.9609 43.7893 23.4696 44 24 44Z"
            fill="currentColor"
          />
        </svg>
        <h3 class="mb-1 text-lg font-medium text-gray-800 dark:text-white/90">
          {{ $t('task.noTasks') }}
        </h3>
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {{ $t('task.createFirstTask') }}
        </p>
        <button
          @click="openCreateTaskDialog"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:ring-0 dark:bg-brand-500 dark:hover:bg-brand-600"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.00006 3.33334V12.6667M3.33339 8.00001H12.6667"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ $t('task.create') }}
        </button>
      </div>

      <!-- 删除确认对话框 -->
      <DeleteAlertDialog
        v-model:show="showDeleteDialog"
        title="确认删除"
        :message="$t('task.confirmDelete')"
        @confirm="confirmDeleteTask"
      />
    </div>
  </AdminLayout>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useI18n } from '@/i18n'
import { useFormatters } from '@/composables/useFormatters'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import DeleteAlertDialog from '@/components/ui/DeleteAlertDialog.vue'
import TaskDialog from '@/components/task/TaskDialog.vue'
import { taskService } from '@/services/taskService'
import { toastService } from '@/services/toastService'
import type Task from '@/services/types/TaskType'

export default defineComponent({
  name: 'TaskList',
  components: {
    PageBreadcrumb,
    AdminLayout,
    DeleteAlertDialog,
    TaskDialog,
  },
  setup() {
    const { t } = useI18n()
    const { formatDate } = useFormatters()

    // 任务列表状态
    const tasks = ref<Task[]>([])
    const loading = ref(true)
    const searchQuery = ref('')

    // 删除确认对话框状态
    const showDeleteDialog = ref(false)
    const taskToDelete = ref<string>('')

    // 筛选状态
    const showFilterMenu = ref(false)
    const filterStatus = ref('all')
    const filterPriority = ref('all')

    // 任务对话框状态
    const showTaskDialog = ref(false)
    const isEditMode = ref(false)
    const currentTask = ref<Task>({
      id: '0',
      name: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: null,
      reminderTime: null,
      tags: [],
      attachments: [],
    })

    // 根据搜索查询和筛选条件过滤任务
    const filteredTasks = computed(() => {
      return tasks.value.filter((task) => {
        // 搜索过滤
        const matchesSearch =
          searchQuery.value === '' ||
          task.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          task.tags.some((tag) => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))

        // 状态筛选
        const matchesStatus = filterStatus.value === 'all' || task.status === filterStatus.value

        // 优先级筛选
        const matchesPriority =
          filterPriority.value === 'all' || task.priority === filterPriority.value

        return matchesSearch && matchesStatus && matchesPriority
      })
    })

    // 加载任务列表
    const loadTasks = async () => {
      loading.value = true
      try {
        tasks.value = await taskService.getTasks()
      } catch (error) {
        console.error('加载任务失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 筛选菜单相关方法
    const toggleFilterMenu = () => {
      showFilterMenu.value = !showFilterMenu.value
    }

    const applyFilter = (status: string, priority: string) => {
      filterStatus.value = status
      filterPriority.value = priority
      showFilterMenu.value = false
    }

    const resetFilter = () => {
      filterStatus.value = 'all'
      filterPriority.value = 'all'
    }

    // 任务对话框相关方法
    const openCreateTaskDialog = () => {
      isEditMode.value = false
      currentTask.value = {
        id: '0',
        name: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: null,
        reminderTime: null,
        tags: [],
        attachments: [],
      }
      showTaskDialog.value = true
    }

    const openEditTaskDialog = (task: Task) => {
      isEditMode.value = true
      // 深度复制任务对象，确保所有字段都被正确复制
      currentTask.value = {
        ...JSON.parse(JSON.stringify(task)), // 使用JSON序列化确保深度复制
        // 确保attachments被正确复制
        attachments: JSON.parse(JSON.stringify(task.attachments || [])),
      }
      showTaskDialog.value = true
    }

    const saveTask = async (taskData: Task) => {
      try {
        console.log('保存任务:', taskData)
        if (isEditMode.value) {
          // 更新任务
          await taskService.updateTask(taskData.id, taskData)
        } else {
          // 创建任务
          await taskService.createTask(taskData)
        }

        // 重新加载任务列表
        await loadTasks()
        showTaskDialog.value = false
      } catch (error) {
        console.error('保存任务失败:', error)
      }
    }

    // 打开删除确认对话框
    const openDeleteDialog = (taskId: string) => {
      taskToDelete.value = taskId
      showDeleteDialog.value = true
    }

    // 确认删除任务
    const confirmDeleteTask = async () => {
      try {
        await taskService.deleteTask(taskToDelete.value)
        // 显示删除成功的提示
        toastService.success(t('task.deleteSuccess'), t('common.success'))
        // 关闭删除确认对话框
        showDeleteDialog.value = false
        // 重新加载任务列表
        await loadTasks()
      } catch (error) {
        console.error('删除任务失败:', error)
        // 显示删除失败的提示
        toastService.error(t('task.deleteFailed'), t('common.error'))
      }
    }

    // 兼容原有调用方式的删除任务函数
    const deleteTask = (taskId: string) => {
      openDeleteDialog(taskId)
    }

    // 添加附件
    const addAttachment = () => {
      // 创建一个隐藏的文件输入元素
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.style.display = 'none'
      fileInput.accept = '*/*' // 接受所有文件类型

      // 监听文件选择事件
      fileInput.addEventListener('change', (event) => {
        const file = (event.target as HTMLInputElement)?.files?.[0]
        if (file) {
          if (!currentTask.value.attachments) {
            currentTask.value.attachments = []
          }

          // 添加文件到附件列表
          currentTask.value.attachments.push({
            id: Date.now().toString(),
            name: file.name,
            url: '#', // 实际应用中，这里应该是上传后的URL
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
          })

          // 从DOM中移除文件输入元素
          document.body.removeChild(fileInput)
        }
      })

      // 将文件输入元素添加到DOM并触发点击
      document.body.appendChild(fileInput)
      fileInput.click()
    }

    // 删除附件
    const removeAttachment = (index: number) => {
      if (currentTask.value.attachments && currentTask.value.attachments.length > index) {
        currentTask.value.attachments.splice(index, 1)
      }
    }

    // 初始化加载任务
    onMounted(() => {
      loadTasks()
    })

    return {
      tasks,
      loading,
      searchQuery,
      filteredTasks,
      formatDate,
      showFilterMenu,
      filterStatus,
      filterPriority,
      toggleFilterMenu,
      applyFilter,
      resetFilter,
      showTaskDialog,
      isEditMode,
      currentTask,
      openCreateTaskDialog,
      openEditTaskDialog,
      saveTask,
      deleteTask,
      addAttachment,
      removeAttachment,
      // 删除确认对话框相关
      showDeleteDialog,
      taskToDelete,
      openDeleteDialog,
      confirmDeleteTask,
    }
  },
})
</script>
