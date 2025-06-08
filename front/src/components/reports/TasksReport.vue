<template>
  <div class="space-y-6">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>
    
    <!-- 数据显示 -->
    <div v-else class="space-y-6">
      <!-- 关键指标 -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">总任务数</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalTasks }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">已完成</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.completedTasks }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">进行中</p>
          <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ stats.pendingTasks }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">完成率</p>
          <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ stats.completionRate.toFixed(1) }}%</p>
        </div>
      </div>

      <!-- 任务完成趋势 -->
      <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">任务完成趋势</h3>
        <div class="h-40 flex items-end justify-center space-x-2">
          <div
            v-for="(day, index) in completionTrend"
            :key="index"
            class="flex flex-col items-center space-y-1"
          >
            <div
              :class="[
                'bg-purple-500 rounded-t transition-all duration-300',
                'w-8 flex items-end justify-center text-xs text-white font-medium'
              ]"
              :style="{ height: `${(day.count / Math.max(...completionTrend.map(d => d.count))) * 120}px` }"
              :title="`第${index + 1}天: ${day.count}个任务`"
            >
              {{ day.count }}
            </div>
            <span class="text-xs text-gray-500">{{ day.date }}</span>
          </div>
        </div>
      </div>

      <!-- 优先级和状态分布 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- 优先级分布 -->
        <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">优先级分布</h3>
          <div class="space-y-3">
            <div v-for="priority in priorityDistribution" :key="priority.name" class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div :class="['w-3 h-3 rounded-full', priority.color]"></div>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ priority.name }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    :class="['h-2 rounded-full', priority.color]"
                    :style="{ width: `${priority.percentage}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ priority.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 状态分布 -->
        <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">状态分布</h3>
          <div class="space-y-3">
            <div v-for="status in statusDistribution" :key="status.name" class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div :class="['w-3 h-3 rounded-full', status.color]"></div>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ status.name }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    :class="['h-2 rounded-full', status.color]"
                    :style="{ width: `${status.percentage}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ status.count }}</span>
              </div>
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
  totalTasks: 156,
  completedTasks: 134,
  pendingTasks: 22,
  completionRate: 85.9
})

// 模拟完成趋势数据
const completionTrend = ref([
  { date: '周一', count: 12 },
  { date: '周二', count: 8 },
  { date: '周三', count: 15 },
  { date: '周四', count: 10 },
  { date: '周五', count: 18 },
  { date: '周六', count: 6 },
  { date: '周日', count: 4 }
])

// 优先级分布数据
const priorityDistribution = ref([
  { name: '高优先级', color: 'bg-red-500', count: 25, percentage: 60 },
  { name: '中优先级', color: 'bg-yellow-500', count: 18, percentage: 43 },
  { name: '低优先级', color: 'bg-green-500', count: 12, percentage: 29 }
])

// 状态分布数据
const statusDistribution = ref([
  { name: '已完成', color: 'bg-green-500', count: 134, percentage: 86 },
  { name: '进行中', color: 'bg-blue-500', count: 15, percentage: 10 },
  { name: '待开始', color: 'bg-gray-500', count: 7, percentage: 4 }
])

// 模拟加载数据
const loadData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    // 重新生成趋势数据
    completionTrend.value = completionTrend.value.map(day => ({
      ...day,
      count: Math.floor(Math.random() * 15) + 3
    }))
  } catch (error) {
    console.error('Failed to load tasks data:', error)
  } finally {
    loading.value = false
  }
}

// 监听日期变化
watch(() => [props.startDate, props.endDate], () => {
  loadData()
}, { immediate: true })
</script>
