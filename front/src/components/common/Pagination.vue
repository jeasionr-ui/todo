<template>
  <div class="flex items-center justify-between px-4 py-3 sm:px-6">
    <!-- 移动版分页信息 -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="onPrevious"
        :disabled="currentPage === 1"
        :class="[
          currentPage === 1
            ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
          'relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium dark:border-gray-600',
        ]"
      >
        {{ $t('pagination.previous') }}
      </button>
      
      <button
        @click="onNext"
        :disabled="currentPage === pageCount"
        :class="[
          currentPage === pageCount
            ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
          'relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium dark:border-gray-600',
        ]"
      >
        {{ $t('pagination.next') }}
      </button>
    </div>

    <!-- 桌面版分页信息与控件 -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          {{ $t('pagination.showing') }}
          <span class="font-medium">{{ startItem }}</span>
          {{ $t('pagination.to') }}
          <span class="font-medium">{{ endItem }}</span>
          {{ $t('pagination.of') }}
          <span class="font-medium">{{ totalItems }}</span>
          {{ $t('pagination.results') }}
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- 上一页按钮 -->
          <button
            @click="onPrevious"
            :disabled="currentPage === 1"
            :class="[
              currentPage === 1
                ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700',
              'relative inline-flex items-center rounded-l-md border border-gray-300 px-2 py-2 text-sm font-medium focus:z-20 dark:border-gray-600',
            ]"
          >
            <span class="sr-only">{{ $t('pagination.previous') }}</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- 页码按钮 -->
          <template v-for="(page, index) in displayedPages" :key="index">
            <template v-if="page === '...'">
              <span class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                ...
              </span>
            </template>
            <template v-else>
              <button
                @click="onPageChange(page)"
                :class="[
                  page === currentPage
                    ? 'z-10 bg-brand-500 text-white border-brand-500 dark:bg-blue-100 dark:text-gray-800 dark:border-blue-100 pagination-current-page'
                    : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
                  'relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium focus:z-20 dark:border-gray-600 pagination-btn',
                ]"
              >
                {{ page }}
              </button>
            </template>
          </template>

          <!-- 下一页按钮 -->
          <button
            @click="onNext"
            :disabled="currentPage === pageCount"
            :class="[
              currentPage === pageCount
                ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700',
              'relative inline-flex items-center rounded-r-md border border-gray-300 px-2 py-2 text-sm font-medium focus:z-20 dark:border-gray-600',
            ]"
          >
            <span class="sr-only">{{ $t('pagination.next') }}</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  /** 当前页码 */
  currentPage: number
  /** 总页数 */
  pageCount: number
  /** 总条目数 */
  totalItems: number
  /** 每页条目数 */
  pageSize: number
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  pageCount: 1,
  totalItems: 0,
  pageSize: 10
})

// 定义发射事件
const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
  (e: 'page-change', page: number): void
}>()

// 计算当前页显示的起始项
const startItem = computed(() => {
  return (props.currentPage - 1) * props.pageSize + 1
})

// 计算当前页显示的结束项
const endItem = computed(() => {
  const end = props.currentPage * props.pageSize
  return end > props.totalItems ? props.totalItems : end
})

// 计算需要显示的页码
const displayedPages = computed(() => {
  const pages = []
  const totalPages = props.pageCount

  // 如果总页数小于等于7，则显示所有页码
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  // 总是显示第一页
  pages.push(1)

  // 当前页靠近开始
  if (props.currentPage <= 4) {
    for (let i = 2; i <= 5; i++) {
      pages.push(i)
    }
    pages.push('...')
    pages.push(totalPages)
  } 
  // 当前页靠近结束
  else if (props.currentPage >= totalPages - 3) {
    pages.push('...')
    for (let i = totalPages - 4; i <= totalPages; i++) {
      pages.push(i)
    }
  } 
  // 当前页在中间位置
  else {
    pages.push('...')
    for (let i = props.currentPage - 1; i <= props.currentPage + 1; i++) {
      pages.push(i)
    }
    pages.push('...')
    pages.push(totalPages)
  }

  return pages
})

// 切换到上一页
const onPrevious = () => {
  if (props.currentPage > 1) {
    const newPage = props.currentPage - 1
    emit('update:currentPage', newPage)
    emit('page-change', newPage)
  }
}

// 切换到下一页
const onNext = () => {
  if (props.currentPage < props.pageCount) {
    const newPage = props.currentPage + 1
    emit('update:currentPage', newPage)
    emit('page-change', newPage)
  }
}

// 切换到特定页码
const onPageChange = (page: number | string) => {
  // 确保页码是数字类型
  const pageNumber = typeof page === 'string' ? parseInt(page) : page
  if (pageNumber !== props.currentPage) {
    emit('update:currentPage', pageNumber)
    emit('page-change', pageNumber)
  }
}
</script>

<style scoped>
/* 使用更高的选择器特异性来覆盖注入的样式 */
:deep(.pagination-current-page) {
  background-color: #93c5fd !important; /* blue-100 */
  color: #1f2937 !important; /* text-gray-800 */
  border-color: #93c5fd !important; /* blue-100 */
}

:deep(.pagination-btn) {
  /* 确保其他按钮样式不受注入样式的影响 */
  background-color: inherit;
  color: inherit;
}
</style>
