<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ $t('reports.export.title') }}
      </h3>

      <!-- 导出格式选择 -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('reports.export.format') }}
        </label>
        <select 
          v-model="exportFormat" 
          class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="csv">CSV</option>
          <option value="excel">Excel (.xlsx)</option>
          <option value="json">JSON</option>
          <option value="pdf">PDF</option>
        </select>
      </div>

      <!-- 导出内容选择 -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('reports.export.content') }}
        </label>
        <div class="space-y-2">
          <label class="flex items-center">
            <input 
              type="checkbox" 
              v-model="exportOptions.productivity"
              class="mr-2 text-blue-600"
            >
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ $t('reports.productivity.title') }}
            </span>
          </label>
          <label class="flex items-center">
            <input 
              type="checkbox" 
              v-model="exportOptions.habits"
              class="mr-2 text-blue-600"
            >
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ $t('reports.habits.title') }}
            </span>
          </label>
          <label class="flex items-center">
            <input 
              type="checkbox" 
              v-model="exportOptions.goals"
              class="mr-2 text-blue-600"
            >
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ $t('reports.goals.title') }}
            </span>
          </label>
          <label class="flex items-center">
            <input 
              type="checkbox" 
              v-model="exportOptions.timeEfficiency"
              class="mr-2 text-blue-600"
            >
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ $t('reports.timeEfficiency.title') }}
            </span>
          </label>
          <label class="flex items-center">
            <input 
              type="checkbox" 
              v-model="exportOptions.tasks"
              class="mr-2 text-blue-600"
            >
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ $t('reports.tasks.title') }}
            </span>
          </label>
          <label class="flex items-center">
            <input 
              type="checkbox" 
              v-model="exportOptions.pomodoro"
              class="mr-2 text-blue-600"
            >
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ $t('reports.pomodoro.title') }}
            </span>
          </label>
        </div>
      </div>

      <!-- 日期范围 -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('reports.export.dateRange') }}
        </label>
        <div class="grid grid-cols-2 gap-2">
          <input 
            type="date" 
            v-model="dateRange.start"
            class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
          <input 
            type="date" 
            v-model="dateRange.end"
            class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
        </div>
      </div>

      <!-- 高级选项 -->
      <div class="mb-6">
        <label class="flex items-center">
          <input 
            type="checkbox" 
            v-model="includeCharts"
            class="mr-2 text-blue-600"
          >
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ $t('reports.export.includeCharts') }}
          </span>
        </label>
      </div>

      <!-- 按钮 -->
      <div class="flex justify-end space-x-3">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          {{ $t('common.cancel') }}
        </button>
        <button 
          @click="handleExport"
          :disabled="loading || !hasSelectedOptions"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <span v-if="loading" class="animate-spin">⚪</span>
          <span>{{ loading ? $t('reports.export.exporting') : $t('reports.export.export') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { reportService } from '@/services/reportService'

interface Props {
  isOpen: boolean
  startDate: string
  endDate: string
}

interface Emits {
  (e: 'close'): void
  (e: 'exported', data: { format: string, filename: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)
const exportFormat = ref('csv')
const includeCharts = ref(false)

const exportOptions = ref({
  productivity: true,
  habits: true,
  goals: true,
  timeEfficiency: true,
  tasks: true,
  pomodoro: true
})

const dateRange = ref({
  start: '',
  end: ''
})

// 计算属性
const hasSelectedOptions = computed(() => {
  return Object.values(exportOptions.value).some(option => option)
})

// 监听 props 变化
watch(() => props.startDate, (newDate) => {
  dateRange.value.start = newDate
}, { immediate: true })

watch(() => props.endDate, (newDate) => {
  dateRange.value.end = newDate
}, { immediate: true })

// 导出处理
const handleExport = async () => {
  if (!hasSelectedOptions.value) return

  loading.value = true
  try {
    const exportData = {
      format: exportFormat.value,
      options: exportOptions.value,
      startDate: dateRange.value.start,
      endDate: dateRange.value.end,
      includeCharts: includeCharts.value
    }

    let blob: Blob
    let filename: string
    const timestamp = new Date().toISOString().split('T')[0]

    switch (exportFormat.value) {
      case 'csv':
        blob = await exportToCSV(exportData)
        filename = `reports_${timestamp}.csv`
        break
      case 'excel':
        blob = await exportToExcel(exportData)
        filename = `reports_${timestamp}.xlsx`
        break
      case 'json':
        blob = await exportToJSON(exportData)
        filename = `reports_${timestamp}.json`
        break
      case 'pdf':
        blob = await exportToPDF(exportData)
        filename = `reports_${timestamp}.pdf`
        break
      default:
        throw new Error('Unsupported export format')
    }

    // 下载文件
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    emit('exported', { format: exportFormat.value, filename })
    emit('close')
  } catch (error) {
    console.error('Export failed:', error)
    // 这里可以添加错误提示
  } finally {
    loading.value = false
  }
}

// 导出到 CSV
const exportToCSV = async (exportData: any): Promise<Blob> => {
  const reports = await fetchSelectedReports(exportData)
  let csvContent = ''

  // 添加头部信息
  csvContent += `Report Export,${exportData.startDate} - ${exportData.endDate}\n\n`

  // 处理每种报表类型
  if (exportData.options.productivity && reports.productivity) {
    csvContent += 'Productivity Report\n'
    csvContent += 'Date,Completed Tasks,Focus Time,Efficiency Score\n'
    reports.productivity.dailyStats.forEach((item: any) => {
      csvContent += `${item.date},${item.completedTasks},${item.focusTime},${item.efficiencyScore}\n`
    })
    csvContent += '\n'
  }

  if (exportData.options.tasks && reports.tasks) {
    csvContent += 'Tasks Report\n'
    csvContent += 'Total Tasks,Completed Tasks,Completion Rate\n'
    csvContent += `${reports.tasks.totalTasks},${reports.tasks.completedTasks},${reports.tasks.completionRate}%\n`
    csvContent += '\n'
  }

  // 添加其他报表类型...

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
}

// 导出到 Excel
const exportToExcel = async (exportData: any): Promise<Blob> => {
  // 这里需要使用 xlsx 库或类似的库来生成 Excel 文件
  // 简化示例，实际实现需要安装 xlsx 包
  const reports = await fetchSelectedReports(exportData)
  const jsonData = JSON.stringify(reports, null, 2)
  return new Blob([jsonData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

// 导出到 JSON
const exportToJSON = async (exportData: any): Promise<Blob> => {
  const reports = await fetchSelectedReports(exportData)
  const jsonData = JSON.stringify(reports, null, 2)
  return new Blob([jsonData], { type: 'application/json' })
}

// 导出到 PDF
const exportToPDF = async (exportData: any): Promise<Blob> => {
  // 这里需要使用 jsPDF 或类似的库来生成 PDF 文件
  // 简化示例，实际实现需要安装 jspdf 包
  const reports = await fetchSelectedReports(exportData)
  const jsonData = JSON.stringify(reports, null, 2)
  return new Blob([jsonData], { type: 'application/pdf' })
}

// 获取选中的报表数据
const fetchSelectedReports = async (exportData: any) => {
  const reports: any = {}
  const dateRange = { start: exportData.startDate, end: exportData.endDate }

  if (exportData.options.productivity) {
    reports.productivity = await reportService.getProductivityReport(dateRange)
  }
  if (exportData.options.habits) {
    reports.habits = await reportService.getHabitsReport(dateRange)
  }
  if (exportData.options.goals) {
    reports.goals = await reportService.getGoalsReport(dateRange)
  }
  if (exportData.options.timeEfficiency) {
    reports.timeEfficiency = await reportService.getTimeEfficiencyReport(dateRange)
  }
  if (exportData.options.tasks) {
    reports.tasks = await reportService.getTasksReport(dateRange)
  }
  if (exportData.options.pomodoro) {
    reports.pomodoro = await reportService.getPomodoroReport(dateRange)
  }

  return reports
}
</script>
