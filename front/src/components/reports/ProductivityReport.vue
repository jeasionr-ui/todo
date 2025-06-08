<template>
  <div class="space-y-6">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
    
    <!-- 数据显示 -->
    <div v-else-if="data" class="space-y-6">
      <!-- 关键指标 -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">总任务数</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ data.totalTasks }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">已完成</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ data.completedTasks }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">完成率</p>
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ data.completionRate.toFixed(1) }}%</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p class="text-sm text-gray-600 dark:text-gray-400">平均用时</p>
          <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ formatTime(data.averageTime) }}</p>
        </div>
      </div>

      <!-- 趋势图表 -->
      <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">生产力趋势</h3>
        <div class="h-80">
          <apexchart
            v-if="chartOptions && chartSeries.length > 0"
            type="line"
            height="100%"
            :options="chartOptions"
            :series="chartSeries"
          />
        </div>
      </div>

      <!-- 洞察和建议 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- 洞察 -->
        <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">数据洞察</h3>
          <ul class="space-y-3">
            <li
              v-for="(insight, index) in data.insights"
              :key="index"
              class="flex items-start gap-3"
            >
              <div class="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ insight }}</p>
            </li>
          </ul>
        </div>

        <!-- 建议 -->
        <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">改进建议</h3>
          <ul class="space-y-3">
            <li
              v-for="(recommendation, index) in data.recommendations"
              :key="index"
              class="flex items-start gap-3"
            >
              <div class="mt-1 h-2 w-2 rounded-full bg-green-500"></div>
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ recommendation }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- 暂无数据状态 -->
    <div v-else class="py-12 text-center">
      <p class="text-gray-500 dark:text-gray-400">暂无生产力数据</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import type { ProductivityReport } from '@/services/reportService'

interface Props {
  data?: ProductivityReport
  startDate: string
  endDate: string
}

const props = defineProps<Props>()
const loading = ref(true)

// 模拟数据
const data = ref<ProductivityReport | null>(null)

// 模拟加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 模拟 API 调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    data.value = {
      totalTasks: 125,
      completedTasks: 98,
      completionRate: 78.4,
      averageTime: 45,
      insights: [
        '本周任务完成率较上周提升了 5.2%',
        '周三是最高效的工作日，完成率达到 85%',
        '下午 2-4 点是生产力最高的时间段'
      ],
      recommendations: [
        '建议在高效时间段安排重要任务',
        '可以尝试番茄工作法提高专注度',
        '适当的休息有助于保持高效率'
      ],
      trendData: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
        tasks: Math.floor(Math.random() * 20) + 10,
        completed: Math.floor(Math.random() * 15) + 8,
        time: Math.floor(Math.random() * 60) + 30
      }))
    }
  } catch (error) {
    console.error('Failed to load productivity data:', error)
  } finally {
    loading.value = false
  }
}

// 监听日期变化
watch(() => [props.startDate, props.endDate], () => {
  loadData()
}, { immediate: true })

// 格式化时间（分钟转换为小时分钟）
const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes.toFixed(0)}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}小时${remainingMinutes.toFixed(0)}分钟`
}

// 图表配置
const chartOptions = computed(() => {
  if (!props.data?.trendData) return null

  return {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      },
      background: 'transparent'
    },
    theme: {
      mode: 'light' // 可以根据暗色模式动态切换
    },
    colors: ['#3B82F6', '#10B981', '#8B5CF6'],
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    grid: {
      borderColor: '#E5E7EB'
    },
    xaxis: {
      categories: props.data.trendData.map(item => {
        const date = new Date(item.date)
        return `${date.getMonth() + 1}/${date.getDate()}`
      }),
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    yaxis: [
      {
        title: {
          text: '任务数量',
          style: {
            color: '#6B7280'
          }
        },
        labels: {
          style: {
            colors: '#6B7280'
          }
        }
      },
      {
        opposite: true,
        title: {
          text: '用时（分钟）',
          style: {
            color: '#6B7280'
          }
        },
        labels: {
          style: {
            colors: '#6B7280'
          }
        }
      }
    ],
    legend: {
      labels: {
        colors: '#6B7280'
      }
    },
    tooltip: {
      theme: 'light'
    }
  }
})

const chartSeries = computed(() => {
  if (!props.data?.trendData) return []

  return [
    {
      name: '总任务',
      data: props.data.trendData.map(item => item.tasks),
      yAxisIndex: 0
    },
    {
      name: '已完成',
      data: props.data.trendData.map(item => item.completed),
      yAxisIndex: 0
    },
    {
      name: '用时',
      data: props.data.trendData.map(item => item.time),
      yAxisIndex: 1
    }
  ]
})
</script>
