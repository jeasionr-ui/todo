<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="w-full max-w-md rounded-xl border p-6 bg-white shadow-lg dark:bg-gray-900 dark:border-gray-800">
      <div class="flex items-start gap-3">
        <div class="-mt-0.5 text-error-500">
          <component :is="icons.warning" />
        </div>

        <div class="flex-1">
          <h4 class="mb-1 text-base font-semibold text-gray-800 dark:text-white/90">
            {{ title }}
          </h4>

          <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>

          <div class="flex justify-end gap-3">
            <button @click="onCancel"
              class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]">
              {{ cancelText }}
            </button>
            <button @click="onConfirm"
              class="rounded-lg bg-error-500 px-4 py-2 text-sm font-medium text-white hover:bg-error-600 dark:bg-error-500 dark:hover:bg-error-600">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * DeleteAlertDialog 组件
 * 
 * 用于显示删除确认对话框，提供用户二次确认机会
 */
import { WarningIcon } from '@/icons'

interface DeleteAlertDialogProps {
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

// 定义组件属性
const props = withDefaults(defineProps<DeleteAlertDialogProps>(), {
  confirmText: '删除',
  cancelText: '取消',
})

// 定义事件
const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'update:show', value: boolean): void
}>()

// 图标映射
const icons = {
  warning: WarningIcon
}

// 确认按钮点击处理
const onConfirm = () => {
  emit('confirm')
  emit('update:show', false)
}

// 取消按钮点击处理
const onCancel = () => {
  emit('cancel')
  emit('update:show', false)
}
</script>