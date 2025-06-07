<template>
  <div class="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-40">
    <div
      class="w-full max-w-xl rounded-md bg-white p-6 shadow-md dark:bg-boxdark md:p-8 max-h-[60vh] overflow-y-auto"
      :class="{
        'border-l-4 border-primary': isEditMode,
        'border-l-4 border-green-500': isViewMode,
        'border-l-4 border-blue-500': !isEditMode && !isViewMode,
      }"
    >
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-black dark:text-white">
          <span v-if="isViewMode">{{ $t('habits.view') }}</span>
          <span v-else-if="isEditMode">{{ $t('habits.edit') }}</span>
          <span v-else>{{ $t('habits.create') }}</span>
          <span v-if="(isEditMode || isViewMode) && habit.name" class="text-primary text-lg ml-1"
            >- {{ habit.name }}</span
          >
        </h3>
        <button
          @click="$emit('close')"
          class="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-meta-4"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 3.5L3.5 12.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12.5 12.5L3.5 3.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- 习惯名称 -->
        <div class="mb-4">
          <label for="habitName" class="mb-2 block text-sm font-medium">
            {{ $t('habits.form.name') }} <span class="text-danger">*</span>
          </label>
          <input
            id="habitName"
            v-model="formData.name"
            type="text"
            required
            :readonly="isViewMode"
            class="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
            :class="{ 'cursor-not-allowed': isViewMode }"
            :placeholder="$t('habits.form.name_placeholder')"
          />
        </div>

        <!-- 习惯描述 -->
        <div class="mb-4">
          <label for="habitDescription" class="mb-2 block text-sm font-medium">
            {{ $t('habits.form.description') }}
          </label>
          <textarea
            id="habitDescription"
            v-model="formData.description"
            rows="3"
            :readonly="isViewMode"
            class="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
            :class="{ 'cursor-not-allowed': isViewMode }"
            :placeholder="$t('habits.form.description_placeholder')"
          ></textarea>
        </div>

        <!-- 习惯分类和频率 -->
        <div class="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 分类 -->
          <div>
            <label for="habitCategory" class="mb-2 block text-sm font-medium">
              {{ $t('habits.form.category') }} <span class="text-danger">*</span>
            </label>
            <select
              id="habitCategory"
              v-model="formData.category"
              required
              :disabled="isViewMode"
              class="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
              :class="{ 'cursor-not-allowed': isViewMode }"
            >
              <option value="">{{ $t('habits.filter.all_categories') }}</option>
              <option value="health">{{ $t('habits.categories.health') }}</option>
              <option value="fitness">{{ $t('habits.categories.fitness') }}</option>
              <option value="study">{{ $t('habits.categories.study') }}</option>
              <option value="work">{{ $t('habits.categories.work') }}</option>
              <option value="lifestyle">{{ $t('habits.categories.lifestyle') }}</option>
              <option value="hobby">{{ $t('habits.categories.hobby') }}</option>
              <option value="social">{{ $t('habits.categories.social') }}</option>
              <option value="personal">{{ $t('habits.categories.personal') }}</option>
              <option value="finance">{{ $t('habits.categories.finance') }}</option>
              <option value="mindfulness">{{ $t('habits.categories.mindfulness') }}</option>
              <option value="creativity">{{ $t('habits.categories.creativity') }}</option>
              <option value="other">{{ $t('habits.categories.other') }}</option>
            </select>
          </div>

          <!-- 频率 -->
          <div>
            <label for="habitFrequency" class="mb-2 block text-sm font-medium">
              {{ $t('habits.form.frequency') }} <span class="text-danger">*</span>
            </label>
            <select
              id="habitFrequency"
              v-model="formData.frequency.type"
              required
              :disabled="isViewMode"
              class="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
              :class="{ 'cursor-not-allowed': isViewMode }"
            >
              <option value="daily">{{ $t('habits.frequency.daily') }}</option>
              <option value="weekly">{{ $t('habits.frequency.weekly') }}</option>
              <option value="monthly">{{ $t('habits.frequency.monthly') }}</option>
            </select>
          </div>
        </div>

        <!-- 频率详细设置 -->
        <div v-if="formData.frequency.type === 'weekly'" class="mb-4">
          <label class="mb-2 block text-sm font-medium">
            {{ $t('habits.form.days_of_week') }} <span class="text-danger">*</span>
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(day, index) in weekDays"
              :key="index"
              type="button"
              @click="!isViewMode && toggleDayOfWeek(index)"
              :disabled="isViewMode"
              class="flex items-center justify-center h-10 w-10 rounded-md border"
              :class="{
                'border-green-500 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300':
                  isDayOfWeekSelected(index),
                'border-stroke bg-transparent dark:border-strokedark': !isDayOfWeekSelected(index),
              }"
            >
              {{ day }}
            </button>
          </div>
        </div>

        <div v-if="formData.frequency.type === 'monthly'" class="mb-4">
          <label class="mb-2 block text-sm font-medium">
            {{ $t('habits.form.days_of_month') }} <span class="text-danger">*</span>
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="day in 31"
              :key="day"
              type="button"
              @click="!isViewMode && toggleDayOfMonth(day)"
              :disabled="isViewMode"
              class="flex items-center justify-center h-10 w-10 rounded-md border"
              :class="{
                'border-green-500 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300':
                  isDayOfMonthSelected(day),
                'border-stroke bg-transparent dark:border-strokedark': !isDayOfMonthSelected(day),
              }"
            >
              {{ day }}
            </button>
          </div>
        </div>

        <!-- 开始日期和结束日期 -->
        <div class="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 开始日期 -->
          <div>
            <label for="habitStartDate" class="mb-2 block text-sm font-medium">
              {{ $t('habits.form.start_date') }} <span class="text-danger">*</span>
            </label>
            <div class="relative">
              <flat-pickr
                v-model="formData.startDate"
                :config="flatpickrConfig"
                class="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
                :class="{ 'cursor-not-allowed': isViewMode }"
                :disabled="isViewMode"
                :placeholder="$t('habits.form.start_date_placeholder')"
              />
              <span
                class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
              >
                <svg
                  class="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                    fill=""
                  />
                </svg>
              </span>
            </div>
          </div>

          <!-- 结束日期 -->
          <div>
            <label for="habitEndDate" class="mb-2 block text-sm font-medium">
              {{ $t('habits.form.end_date') }}
            </label>
            <div class="relative">
              <flat-pickr
                v-model="formData.endDate"
                :config="flatpickrConfig"
                class="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
                :class="{ 'cursor-not-allowed': isViewMode }"
                :disabled="isViewMode"
                :placeholder="$t('habits.form.end_date_placeholder')"
              />
              <span
                class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
              >
                <svg
                  class="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                    fill=""
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <!-- 标签 -->
        <div class="mb-4">
          <label
            for="habitTags"
            class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {{ $t('habits.form.tags') }}
          </label>
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <span
              v-for="(tag, index) in formData.tags"
              :key="index"
              class="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-gray-800"
            >
              {{ tag }}
              <button
                type="button"
                @click="removeTag(index)"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              ></button>
            </span>
          </div>
          <div class="flex items-center gap-2">
            <input
              id="habitTags"
              v-model="newTag"
              type="text"
              class="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500"
              :placeholder="$t('habits.form.tags_placeholder')"
              @keydown.enter.prevent="addTag"
            />
            <button
              type="button"
              @click="addTag"
              class="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
            >
              {{ $t('common.add') }}
            </button>
          </div>
        </div>

        <!-- 提醒时间 -->
        <div class="mb-4">
          <label for="habitReminderTime" class="mb-2 block text-sm font-medium">
            {{ $t('habits.form.reminder_time') }}
          </label>
          <div class="relative">
            <flat-pickr
              v-model="formData.reminderTime"
              :config="flatpickrTimeConfig"
              class="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
              :placeholder="$t('habits.form.reminder_time_placeholder')"
            />
            <span
              class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
            >
              <svg
                class="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5ZM10 4.16667C13.2217 4.16667 15.8333 6.77834 15.8333 10C15.8333 13.2217 13.2217 15.8333 10 15.8333C6.77834 15.8333 4.16667 13.2217 4.16667 10C4.16667 6.77834 6.77834 4.16667 10 4.16667ZM10 5.83333C10.4602 5.83333 10.8333 6.20643 10.8333 6.66667V9.61508L12.9425 10.6697C13.3538 10.8758 13.5344 11.3611 13.3283 11.7725C13.1222 12.1838 12.6369 12.3644 12.2255 12.1583L9.64218 10.8249C9.39435 10.7014 9.16667 10.4556 9.16667 10V6.66667C9.16667 6.20643 9.53976 5.83333 10 5.83333Z"
                  fill=""
                />
              </svg>
            </span>
          </div>
        </div>

        <!-- 习惯颜色和图标 -->
        <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 颜色 -->
          <div>
            <label for="habitColor" class="mb-2 block text-sm font-medium">
              {{ $t('habits.form.color') }}
            </label>
            <div class="flex items-center gap-2">
              <input
                id="habitColor"
                v-model="formData.color"
                type="color"
                class="h-10 w-10 rounded-md border border-stroke bg-transparent outline-none focus:border-primary dark:border-strokedark"
              />
              <input
                v-model="formData.color"
                type="text"
                class="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
                placeholder="#4F46E5"
              />
            </div>
          </div>

          <!-- 图标 -->
          <div>
            <label for="habitIcon" class="mb-2 block text-sm font-medium">
              {{ $t('habits.form.icon') }}
            </label>
            <div class="relative">
              <input
                id="habitIcon"
                v-model="formData.icon"
                type="text"
                readonly
                @click="toggleIconSelector"
                class="w-full rounded-md border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
                :placeholder="$t('habits.form.icon_placeholder')"
                maxlength="2"
              />
              <div class="absolute right-4 top-3">
                <span
                  class="flex h-8 w-8 items-center justify-center rounded-full border border-green-500"
                  :style="{ backgroundColor: formData.color + '33' }"
                >
                  <span class="text-xl" :style="{ color: formData.color }">{{
                    formData.icon
                  }}</span>
                </span>
              </div>
            </div>
            <!-- 图标选择器 -->
            <div
              v-if="showIconSelector"
              ref="iconSelectorRef"
              class="mt-2 p-2 border border-stroke rounded-md bg-white dark:bg-boxdark dark:border-strokedark"
            >
              <div class="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                <button
                  v-for="emoji in commonEmojis"
                  :key="emoji"
                  type="button"
                  @click="selectIcon(emoji)"
                  class="flex items-center justify-center h-10 w-10 rounded-md hover:bg-gray-100 dark:hover:bg-meta-4 text-xl"
                  :class="{
                    'bg-green-100 border-green-500 dark:bg-green-900 dark:border-green-500':
                      formData.icon === emoji,
                    'border-stroke dark:border-strokedark': formData.icon !== emoji,
                  }"
                >
                  {{ emoji }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
          >
            {{ isViewMode ? $t('common.back') : $t('common.cancel') }}
          </button>
          <template v-if="!isViewMode">
            <button
              v-if="false"
              type="button"
              @click="openEditMode"
              class="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              {{ $t('habits.edit') }}
            </button>
            <button
              v-else
              type="submit"
              class="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              {{ isEditMode ? $t('common.update') : $t('common.save') }}
            </button>
          </template>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { useFlatPickr } from '@/composables/useFlatPickr'
import { toastService } from '@/services/toastService'
import { useI18n } from '@/i18n'

// 表单数据类型声明
interface Frequency {
  type: 'daily' | 'weekly' | 'monthly'
  daysOfWeek: number[]
  daysOfMonth: number[]
}
interface HabitFormData {
  id: string
  name: string
  description: string
  category: string
  frequency: Frequency
  startDate: string
  endDate: string
  tags: string[]
  reminderTime: string
  reminderType: string | null
  reminderLocation: string
  color: string
  icon: string
  cronExpression: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
  streakCount: number
  longestStreak: number
  totalCompletions: number
  completionHistory: Array<{ date: string; isCompleted: boolean; note: string | null }>
  lastCompletedAt: string
}

const formData = ref<HabitFormData>({
  id: '',
  name: '',
  description: '',
  category: 'other',
  frequency: {
    type: 'daily',
    daysOfWeek: [],
    daysOfMonth: [],
  },
  startDate: '',
  endDate: '',
  tags: [],
  reminderTime: '',
  reminderType: null,
  reminderLocation: '',
  color: '#4F46E5',
  icon: '📦',
  cronExpression: '0 0 * * *',
  isArchived: false,
  createdAt: '',
  updatedAt: '',
  streakCount: 0,
  longestStreak: 0,
  totalCompletions: 0,
  completionHistory: [],
  lastCompletedAt: '',
})

const props = defineProps({
  isEditMode: {
    type: Boolean,
    default: false,
  },
  isViewMode: {
    type: Boolean,
    default: false,
  },
  habit: {
    type: Object,
    default: () => ({}),
  },
})

// 监听habit属性变化，更新表单数据
watch(
  () => props.habit,
  (newHabit) => {
    if (newHabit && Object.keys(newHabit).length > 0) {
      const defaultHabit: HabitFormData = {
        id: '',
        name: '',
        description: '',
        category: 'other',
        tags: [],
        frequency: {
          type: 'daily',
          daysOfWeek: [],
          daysOfMonth: [],
        },
        startDate: '',
        endDate: '',
        reminderTime: '',
        reminderType: null,
        reminderLocation: '',
        color: '#4F46E5',
        icon: '📦',
        cronExpression: '0 0 * * *',
        isArchived: false,
        createdAt: '',
        updatedAt: '',
        streakCount: 0,
        longestStreak: 0,
        totalCompletions: 0,
        completionHistory: [],
        lastCompletedAt: '',
      }
      // 合并时保证 flat-pickr 相关字段为字符串且为合法日期格式或空字符串
      const safeHabit = JSON.parse(JSON.stringify(newHabit))
      // startDate
      if (typeof safeHabit.startDate !== 'string' || !safeHabit.startDate) safeHabit.startDate = ''
      // endDate
      if (typeof safeHabit.endDate !== 'string') safeHabit.endDate = ''
      // reminderTime
      if (typeof safeHabit.reminderTime !== 'string') safeHabit.reminderTime = ''
      formData.value = Object.assign({}, defaultHabit, safeHabit)
      if (!formData.value.frequency) {
        formData.value.frequency = { type: 'daily', daysOfWeek: [], daysOfMonth: [] }
      } else {
        if (!formData.value.frequency.daysOfWeek) formData.value.frequency.daysOfWeek = []
        if (!formData.value.frequency.daysOfMonth) formData.value.frequency.daysOfMonth = []
      }
      if (!formData.value.tags) formData.value.tags = []
    }
  },
  { immediate: true },
)

const emit = defineEmits(['close', 'save', 'edit'])

const { t } = useI18n()

// 从查看模式切换到编辑模式
const openEditMode = () => {
  emit('edit', props.habit)
}

const { flatpickrConfig, flatpickrTimeConfig } = useFlatPickr()

// 周天数组
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

// 自定义日期输入已移除

// 标签相关
const newTag = ref('')

// 图标选择器相关
const showIconSelector = ref(false)
const iconSelectorRef = ref(null)

// 常用emoji表情列表
const commonEmojis = [
  '📦',
  '✅',
  '📊',
  '📈',
  '📅',
  '🏠',
  '👤',
  '💬',
  '📧',
  '📄',
  '📁',
  '⚙️',
  '⭐',
  '🚩',
  '🎯',
  '🔔',
  '📝',
  '🔍',
  '🎮',
  '🎵',
  '🍎',
  '🚗',
  '✈️',
  '🏆',
]

// 周天选择方法
const toggleDayOfWeek = (index: number) => {
  const position = formData.value.frequency.daysOfWeek.indexOf(index)
  if (position === -1) {
    formData.value.frequency.daysOfWeek.push(index)
  } else {
    formData.value.frequency.daysOfWeek.splice(position, 1)
  }
}

const isDayOfWeekSelected = (index: number) => {
  return formData.value.frequency.daysOfWeek.includes(index)
}

// 月天选择方法
const toggleDayOfMonth = (day: number) => {
  const position = formData.value.frequency.daysOfMonth.indexOf(day)
  if (position === -1) {
    formData.value.frequency.daysOfMonth.push(day)
  } else {
    formData.value.frequency.daysOfMonth.splice(position, 1)
  }
}

const isDayOfMonthSelected = (day: number) => {
  return formData.value.frequency.daysOfMonth.includes(day)
}

// 标签相关方法
const addTag = () => {
  if (newTag.value.trim() && !formData.value.tags.includes(newTag.value.trim())) {
    formData.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1)
}

// 图标选择器相关方法
const toggleIconSelector = () => {
  showIconSelector.value = !showIconSelector.value
}

/**
 * 选择emoji图标
 * @param {String} emoji - emoji表情符号
 */
const selectIcon = (emoji: string) => {
  formData.value.icon = emoji
  showIconSelector.value = false
}

// 生成cron表达式
const generateCronExpression = () => {
  const { type, daysOfWeek, daysOfMonth } = formData.value.frequency

  // 默认每天执行
  let cronExpression = '0 0 * * *' // 分 时 日 月 周

  if (type === 'daily') {
    // 每天执行，保持默认
  } else if (type === 'weekly' && daysOfWeek.length > 0) {
    // 每周特定几天执行
    // 注意：cron中周日是0，周一是1，与我们的数组一致
    cronExpression = `0 0 * * ${daysOfWeek.join(',')}`
  } else if (type === 'monthly' && daysOfMonth.length > 0) {
    // 每月特定几天执行
    cronExpression = `0 0 ${daysOfMonth.join(',')} * *`
  }

  return cronExpression
}

// 处理表单提交
const handleSubmit = () => {
  if (!props.isViewMode) {
    saveHabit()
  }
}

// 保存习惯（只保留这一处实现）
const saveHabit = () => {
  // 生成cron表达式
  const cronExpression = generateCronExpression()
  // 创建要保存的数据对象
  const habitData = {
    ...formData.value,
    cronExpression,
  }
  emit('save', habitData)
  toastService.success(props.isEditMode ? t('habits.update_success') : t('habits.create_success'))
  emit('close')
}

// 点击外部关闭图标选择器
onClickOutside(iconSelectorRef, () => {
  showIconSelector.value = false
})
</script>
