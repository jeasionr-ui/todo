<template>
  <div class="space-y-6">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
    
    <!-- 数据显示 -->
    <div v-else class="space-y-6">
      <!-- 关键指标 -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">总目标数</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalGoals }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">已完成</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.completedGoals }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">平均进度</p>
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.averageProgress.toFixed(1) }}%</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">正常进行</p>
          <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ stats.onTrackGoals }}</p>
        </div>
      </div>

      <!-- 进度可视化 -->
      <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">目标进度可视化</h3>
        <div class="space-y-4">
          <div v-for="goal in goalProgress" :key="goal.name" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-900 dark:text-white">{{ goal.name }}</span>
              <span class="text-gray-600 dark:text-gray-400">{{ goal.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${goal.progress}%` }"
              ></div>
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
  totalGoals: 12,
  completedGoals: 8,
  averageProgress: 72.5,
  onTrackGoals: 9
})

// 模拟目标进度数据
const goalProgress = ref([
  { name: '学习新技能', progress: 85 },
  { name: '健身计划', progress: 60 },
  { name: '读书目标', progress: 95 },
  { name: '项目开发', progress: 40 },
  { name: '社交改善', progress: 70 }
])

// 模拟加载数据
const loadData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    // 重新生成进度数据
    goalProgress.value = goalProgress.value.map(goal => ({
      ...goal,
      progress: Math.floor(Math.random() * 50) + 30 // 30-80之间的随机值
    }))
  } catch (error) {
    console.error('Failed to load goals data:', error)
  } finally {
    loading.value = false
  }
}

// 监听日期变化
watch(() => [props.startDate, props.endDate], () => {
  loadData()
}, { immediate: true })
</script>
