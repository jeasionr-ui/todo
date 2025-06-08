<template>
  <div
    :class="[
      'rounded-xl p-6 transition-colors duration-200',
      colorClasses[color]
    ]"
  >
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ title }}</p>
        <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
          {{ formattedValue }}
        </p>
        <div v-if="change !== undefined" class="mt-2 flex items-center text-sm">
          <component
            :is="changeIcon"
            class="mr-1 h-4 w-4"
            :class="changeColor"
          />
          <span :class="changeColor">
            {{ Math.abs(change) }}%
          </span>
          <span class="ml-1 text-gray-500 dark:text-gray-400">
            {{ change >= 0 ? '较上期增长' : '较上期下降' }}
          </span>
        </div>
      </div>
      <div
        :class="[
          'flex h-12 w-12 items-center justify-center rounded-lg',
          iconBgClasses[color]
        ]"
      >
        <component
          :is="iconComponent"
          :class="[
            'h-6 w-6',
            iconColorClasses[color]
          ]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  TrendingUp, 
  TrendingDown, 
  Repeat, 
  Target, 
  Clock, 
  CheckCircle,
  BarChart3,
  Timer
} from 'lucide-vue-next'

interface Props {
  title: string
  value: number
  suffix?: string
  prefix?: string
  change?: number
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo'
}

const props = withDefaults(defineProps<Props>(), {
  suffix: '',
  prefix: '',
  color: 'blue'
})

// 图标映射
const iconMap = {
  TrendingUp,
  Repeat,
  Target,
  Clock,
  CheckCircle,
  BarChart3,
  Timer
}

const iconComponent = computed(() => iconMap[props.icon as keyof typeof iconMap] || TrendingUp)

// 变化趋势图标
const changeIcon = computed(() => {
  if (props.change === undefined) return null
  return props.change >= 0 ? TrendingUp : TrendingDown
})

// 变化趋势颜色
const changeColor = computed(() => {
  if (props.change === undefined) return ''
  return props.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
})

// 格式化数值
const formattedValue = computed(() => {
  const value = props.value.toFixed(props.suffix === '%' ? 1 : 0)
  return `${props.prefix}${value}${props.suffix}`
})

// 颜色主题
const colorClasses = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800',
  green: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800',
  purple: 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800',
  orange: 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800',
  red: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800',
  indigo: 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'
}

const iconBgClasses = {
  blue: 'bg-blue-100 dark:bg-blue-800/30',
  green: 'bg-green-100 dark:bg-green-800/30',
  purple: 'bg-purple-100 dark:bg-purple-800/30',
  orange: 'bg-orange-100 dark:bg-orange-800/30',
  red: 'bg-red-100 dark:bg-red-800/30',
  indigo: 'bg-indigo-100 dark:bg-indigo-800/30'
}

const iconColorClasses = {
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-green-600 dark:text-green-400',
  purple: 'text-purple-600 dark:text-purple-400',
  orange: 'text-orange-600 dark:text-orange-400',
  red: 'text-red-600 dark:text-red-400',
  indigo: 'text-indigo-600 dark:text-indigo-400'
}
</script>
