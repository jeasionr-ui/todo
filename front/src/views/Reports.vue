<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('reports.title')" />
    
    <div class="space-y-6">
      <!-- 日期范围选择器 -->
      <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">{{ $t('reports.dateRange') }}</h2>
          <div class="flex gap-4">
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.startDate') }}</label>
              <input
                v-model="dateRange.start"
                type="date"
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                @change="loadReports"
              />
            </div>
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.endDate') }}</label>
              <input
                v-model="dateRange.end"
                type="date"
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                @change="loadReports"
              />
            </div>
            <button
              @click="exportData"
              class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {{ $t('reports.export') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- 报表内容 -->
      <div v-else class="space-y-6">
        <!-- 概览卡片 -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            :title="$t('reports.types.productivity')"
            :value="stats.productivity"
            suffix="%"
            :change="getProductivityChange()"
            icon="TrendingUp"
            color="blue"
          />
          <StatsCard
            :title="$t('reports.types.habits')"
            :value="stats.habits"
            suffix="%"
            :change="getHabitsChange()"
            icon="Repeat"
            color="green"
          />
          <StatsCard
            :title="$t('reports.types.goals')"
            :value="stats.goals"
            suffix="%"
            :change="getGoalsChange()"
            icon="Target"
            color="purple"
          />
          <StatsCard
            :title="$t('reports.types.timeEfficiency')"
            :value="stats.timeEfficiency"
            suffix="%"
            :change="getTimeEfficiencyChange()"
            icon="Clock"
            color="orange"
          />
        </div>

        <!-- 报表标签页 -->
        <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="flex space-x-8 px-6 pt-6">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                @click="activeTab = tab.key"
                :class="[
                  'whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium',
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                ]"
              >
                {{ $t(`reports.types.${tab.key}`) }}
              </button>
            </nav>
          </div>

          <div class="p-6">
            <!-- 生产力报告 -->
            <ProductivityReport
              v-if="activeTab === 'productivity'"
              :start-date="dateRange.start"
              :end-date="dateRange.end"
            />
            
            <!-- 习惯跟踪报告 -->
            <HabitsReport
              v-else-if="activeTab === 'habits'"
              :start-date="dateRange.start"
              :end-date="dateRange.end"
            />
            
            <!-- 目标完成分析 -->
            <GoalsReport
              v-else-if="activeTab === 'goals'"
              :start-date="dateRange.start"
              :end-date="dateRange.end"
            />
            
            <!-- 时间效率报告 -->
            <TimeEfficiencyReport
              v-else-if="activeTab === 'timeEfficiency'"
              :start-date="dateRange.start"
              :end-date="dateRange.end"
            />
            
            <!-- 任务统计 -->
            <TasksReport
              v-else-if="activeTab === 'taskStats'"
              :start-date="dateRange.start"
              :end-date="dateRange.end"
            />
            
            <!-- 番茄工作法统计 -->
            <PomodoroReport
              v-else-if="activeTab === 'pomodoro'"
              :start-date="dateRange.start"
              :end-date="dateRange.end"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 导出对话框 -->
    <ExportDialog
      :is-open="showExportDialog"
      :start-date="dateRange.start"
      :end-date="dateRange.end"
      @close="showExportDialog = false"
      @exported="handleExported"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import StatsCard from '@/components/reports/StatsCard.vue'
import ProductivityReport from '@/components/reports/ProductivityReport.vue'
import HabitsReport from '@/components/reports/HabitsReport.vue'
import GoalsReport from '@/components/reports/GoalsReport.vue'
import TimeEfficiencyReport from '@/components/reports/TimeEfficiencyReport.vue'
import TasksReport from '@/components/reports/TasksReport.vue'
import PomodoroReport from '@/components/reports/PomodoroReport.vue'
import ExportDialog from '@/components/reports/ExportDialog.vue'

const { t } = useI18n()
const loading = ref(false)
const activeTab = ref('productivity')
const showExportDialog = ref(false)

// Simplified statistics data, should be fetched from respective report components
const stats = ref({
  productivity: 85,
  habits: 92,
  goals: 78,
  timeEfficiency: 88
})

// Date range
const dateRange = ref({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
  end: new Date().toISOString().split('T')[0] // today
})

// Tab configuration
const tabs = [
  { key: 'productivity' },
  { key: 'habits' },
  { key: 'goals' },
  { key: 'timeEfficiency' },
  { key: 'taskStats' },
  { key: 'pomodoro' }
]

// Load reports data (simplified version)
const loadReports = async () => {
  loading.value = true
  try {
    // Load overview data here
    await new Promise(resolve => setTimeout(resolve, 500)) // simulate loading
  } catch (error) {
    console.error('Failed to load reports:', error)
  } finally {
    loading.value = false
  }
}

// Export data
const exportData = () => {
  showExportDialog.value = true
}

const handleExported = (data: { format: string, filename: string }) => {
  console.log(t('reports.exportSuccess', { 
    format: data.format.toUpperCase(), 
    filename: data.filename 
  }))
  showExportDialog.value = false
}

// Get percentage change (mock data, should fetch comparison data from API)
const getProductivityChange = () => {
  return Math.floor(Math.random() * 20) - 10 // random value between -10 to +10
}

const getHabitsChange = () => {
  return Math.floor(Math.random() * 20) - 10
}

const getGoalsChange = () => {
  return Math.floor(Math.random() * 20) - 10
}

const getTimeEfficiencyChange = () => {
  return Math.floor(Math.random() * 20) - 10
}

onMounted(() => {
  loadReports()
})
</script>
