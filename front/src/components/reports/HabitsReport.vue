<template>
  <div class="space-y-6">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>
    
    <!-- 数据显示 -->
    <div v-else class="space-y-6">
      <!-- 关键指标 -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">总习惯数</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalHabits }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">活跃习惯</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.activeHabits }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">平均连击</p>
          <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ stats.averageStreak }}天</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">完成率</p>
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.completionRate.toFixed(1) }}%</p>
        </div>
      </div>

      <!-- 简化的趋势图表 -->
      <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">习惯完成趋势</h3>
        <div class="h-40 flex items-end justify-center space-x-2">
          <div
            v-for="(day, index) in trendData"
            :key="index"
            :class="[
              'bg-green-500 rounded-t transition-all duration-300',
              'w-8 flex items-end justify-center text-xs text-white font-medium'
            ]"
            :style="{ height: `${(day.value / 100) * 160}px` }"
            :title="`第${index + 1}天: ${day.value}%`"
          >
            {{ day.value }}
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
  totalHabits: 8,
  activeHabits: 6,
  averageStreak: 12,
  completionRate: 85.3
})

// 模拟趋势数据
const trendData = ref(
  Array.from({ length: 7 }, (_, i) => ({
    value: Math.floor(Math.random() * 40) + 60 // 60-100之间的随机值
  }))
)

// 模拟加载数据
const loadData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    // 重新生成趋势数据
    trendData.value = Array.from({ length: 7 }, (_, i) => ({
      value: Math.floor(Math.random() * 40) + 60
    }))
  } catch (error) {
    console.error('Failed to load habits data:', error)
  } finally {
    loading.value = false
  }
}

// 监听日期变化
watch(() => [props.startDate, props.endDate], () => {
  loadData()
}, { immediate: true })
</script>
