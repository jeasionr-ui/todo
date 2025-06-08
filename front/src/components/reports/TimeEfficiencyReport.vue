<template>
  <div class="space-y-6">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
    </div>
    
    <!-- 数据显示 -->
    <div v-else class="space-y-6">
      <!-- 关键指标 -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">总时间</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatTime(stats.totalTime) }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">有效时间</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ formatTime(stats.effectiveTime) }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">效率</p>
          <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ stats.efficiency.toFixed(1) }}%</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">平均会话</p>
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ formatTime(stats.averageSessionTime) }}</p>
        </div>
      </div>

      <!-- 时间效率可视化 -->
      <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">每日效率趋势</h3>
        <div class="h-40 flex items-end justify-center space-x-3">
          <div
            v-for="(day, index) in efficiencyTrend"
            :key="index"
            class="flex flex-col items-center space-y-1"
          >
            <div
              :class="[
                'rounded-t transition-all duration-300 w-8 flex items-end justify-center text-xs text-white font-medium',
                getEfficiencyColor(day.efficiency)
              ]"
              :style="{ height: `${(day.efficiency / 100) * 120}px` }"
              :title="`第${index + 1}天: ${day.efficiency}%`"
            >
              {{ day.efficiency }}
            </div>
            <span class="text-xs text-gray-500">第{{ index + 1 }}天</span>
          </div>
        </div>
      </div>

      <!-- 效率分析 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- 时间分配 -->
        <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">时间分配</h3>
          <div class="space-y-3">
            <div v-for="category in timeCategories" :key="category.name" class="flex items-center justify-between">
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ category.name }}</span>
              <div class="flex items-center space-x-2">
                <div class="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    :class="['h-2 rounded-full', category.color]"
                    :style="{ width: `${category.percentage}%` }"
                  ></div>
                </div>
                <span class="text-xs text-gray-500">{{ category.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 效率等级 -->
        <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">效率等级分布</h3>
          <div class="space-y-3">
            <div v-for="level in efficiencyLevels" :key="level.name" class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div :class="['w-3 h-3 rounded-full', level.color]"></div>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ level.name }}</span>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ level.count }}次</span>
            </div>
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
  totalTime: 28800, // 8小时，以秒为单位
  effectiveTime: 23040, // 6.4小时
  efficiency: 80.0,
  averageSessionTime: 3600 // 1小时
})

// 模拟效率趋势数据
const efficiencyTrend = ref(
  Array.from({ length: 7 }, (_, i) => ({
    efficiency: Math.floor(Math.random() * 30) + 60 // 60-90之间的随机值
  }))
)

// 时间分类数据
const timeCategories = ref([
  { name: '专注工作', percentage: 65, color: 'bg-green-500' },
  { name: '学习提升', percentage: 20, color: 'bg-blue-500' },
  { name: '会议沟通', percentage: 10, color: 'bg-yellow-500' },
  { name: '其他杂项', percentage: 5, color: 'bg-gray-500' }
])

// 效率等级数据
const efficiencyLevels = ref([
  { name: '高效', color: 'bg-green-500', count: 15 },
  { name: '一般', color: 'bg-yellow-500', count: 8 },
  { name: '低效', color: 'bg-red-500', count: 3 }
])

// 格式化时间显示
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

// 获取效率颜色
const getEfficiencyColor = (efficiency: number): string => {
  if (efficiency >= 80) return 'bg-green-500'
  if (efficiency >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

// 模拟加载数据
const loadData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 700))
    // 重新生成效率趋势数据
    efficiencyTrend.value = Array.from({ length: 7 }, (_, i) => ({
      efficiency: Math.floor(Math.random() * 30) + 60
    }))
  } catch (error) {
    console.error('Failed to load time efficiency data:', error)
  } finally {
    loading.value = false
  }
}

// 监听日期变化
watch(() => [props.startDate, props.endDate], () => {
  loadData()
}, { immediate: true })
</script>
