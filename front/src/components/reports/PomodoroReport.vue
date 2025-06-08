<template>
  <div class="space-y-6">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
    </div>
    
    <!-- 数据显示 -->
    <div v-else class="space-y-6">
      <!-- 关键指标 -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">总会话数</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalSessions }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">完成会话</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.completedSessions }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">专注时间</p>
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ formatTime(stats.totalFocusTime) }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">平均会话</p>
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.averageSessionLength }}分钟</p>
        </div>
      </div>

      <!-- 专注时间趋势 -->
      <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">每日专注时间</h3>
        <div class="h-40 flex items-end justify-center space-x-2">
          <div
            v-for="(day, index) in focusTrend"
            :key="index"
            class="flex flex-col items-center space-y-1"
          >
            <div
              :class="[
                'bg-red-500 rounded-t transition-all duration-300',
                'w-8 flex items-end justify-center text-xs text-white font-medium'
              ]"
              :style="{ height: `${(day.minutes / Math.max(...focusTrend.map(d => d.minutes))) * 120}px` }"
              :title="`${day.day}: ${day.minutes}分钟`"
            >
              {{ day.sessions }}
            </div>
            <span class="text-xs text-gray-500">{{ day.day }}</span>
          </div>
        </div>
      </div>

      <!-- 番茄钟详情 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- 时间段分布 -->
        <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">时间段分布</h3>
          <div class="space-y-3">
            <div v-for="period in timePeriods" :key="period.name" class="flex items-center justify-between">
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ period.name }}</span>
              <div class="flex items-center space-x-2">
                <div class="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    class="bg-red-500 h-2 rounded-full"
                    :style="{ width: `${period.percentage}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ period.sessions }}次</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 完成状态 -->
        <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">会话状态</h3>
          <div class="space-y-3">
            <div v-for="status in sessionStatus" :key="status.name" class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div :class="['w-3 h-3 rounded-full', status.color]"></div>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ status.name }}</span>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ status.count }}次</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 番茄工作法效率指标 -->
      <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">效率指标</h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="text-center">
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.completionRate.toFixed(1) }}%</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">完成率</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.streakDays }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">连续天数</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.productivityScore }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">生产力评分</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  startDate: string
  endDate: string
}

const props = defineProps<Props>()
const loading = ref(true)

// 模拟统计数据
const stats = ref({
  totalSessions: 45,
  completedSessions: 38,
  totalFocusTime: 1140, // 19小时，以分钟为单位
  averageSessionLength: 25,
  completionRate: 84.4,
  streakDays: 7,
  productivityScore: 92
})

// 模拟专注趋势数据
const focusTrend = ref([
  { day: '周一', sessions: 8, minutes: 200 },
  { day: '周二', sessions: 6, minutes: 150 },
  { day: '周三', sessions: 10, minutes: 250 },
  { day: '周四', sessions: 7, minutes: 175 },
  { day: '周五', sessions: 9, minutes: 225 },
  { day: '周六', sessions: 4, minutes: 100 },
  { day: '周日', sessions: 3, minutes: 75 }
])

// 时间段分布数据
const timePeriods = ref([
  { name: '上午 (9-12点)', sessions: 18, percentage: 75 },
  { name: '下午 (13-17点)', sessions: 15, percentage: 62 },
  { name: '晚上 (18-21点)', sessions: 12, percentage: 50 }
])

// 会话状态数据
const sessionStatus = ref([
  { name: '完成', color: 'bg-green-500', count: 38 },
  { name: '中断', color: 'bg-yellow-500', count: 5 },
  { name: '跳过', color: 'bg-red-500', count: 2 }
])

// 格式化时间显示
const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

// 模拟加载数据
const loadData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    // 重新生成趋势数据
    focusTrend.value = focusTrend.value.map(day => ({
      ...day,
      sessions: Math.floor(Math.random() * 8) + 3,
      minutes: Math.floor(Math.random() * 200) + 75
    }))
  } catch (error) {
    console.error('Failed to load pomodoro data:', error)
  } finally {
    loading.value = false
  }
}

// 监听日期变化
watch(() => [props.startDate, props.endDate], () => {
  loadData()
}, { immediate: true })
</script>
