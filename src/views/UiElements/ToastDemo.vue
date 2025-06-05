<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('menu.toast')" />
    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <div class="mx-auto w-full max-w-[800px]">
        <h3
          class="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl"
        >
          {{ $t('menu.toast') }}
        </h3>

        <div class="grid gap-6 md:grid-cols-2">
          <!-- 成功消息 -->
          <div class="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
            <h4 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">{{ $t('toast.success') }}</h4>
            <button
              @click="showSuccessToast"
              class="rounded-lg bg-success-500 px-4 py-2 text-sm font-medium text-white hover:bg-success-600 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {{ $t('toast.show') }} {{ $t('toast.success').toLowerCase() }}
            </button>
          </div>

          <!-- 错误消息 -->
          <div class="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
            <h4 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">{{ $t('toast.error') }}</h4>
            <button
              @click="showErrorToast"
              class="rounded-lg bg-error-500 px-4 py-2 text-sm font-medium text-white hover:bg-error-600 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {{ $t('toast.show') }} {{ $t('toast.error').toLowerCase() }}
            </button>
          </div>

          <!-- 警告消息 -->
          <div class="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
            <h4 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">{{ $t('toast.warning') }}</h4>
            <button
              @click="showWarningToast"
              class="rounded-lg bg-warning-500 px-4 py-2 text-sm font-medium text-white hover:bg-warning-600 focus:outline-none focus:ring-2 focus:ring-warning-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {{ $t('toast.show') }} {{ $t('toast.warning').toLowerCase() }}
            </button>
          </div>

          <!-- 信息消息 -->
          <div class="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
            <h4 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">{{ $t('toast.info') }}</h4>
            <button
              @click="showInfoToast"
              class="rounded-lg bg-blue-light-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-light-600 focus:outline-none focus:ring-2 focus:ring-blue-light-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {{ $t('toast.show') }} {{ $t('toast.info').toLowerCase() }}
            </button>
          </div>

          <!-- 自定义消息 -->
          <div class="rounded-xl border border-gray-200 p-6 dark:border-gray-700 md:col-span-2">
            <h4 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">{{ $t('toast.customToast') }}</h4>
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label for="title" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('toast.title') }}</label>
                <input
                  id="title"
                  v-model="customTitle"
                  type="text"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
                  :placeholder="$t('toast.title')"
                />
              </div>
              <div>
                <label for="message" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('toast.message') }}</label>
                <input
                  id="message"
                  v-model="customMessage"
                  type="text"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
                  :placeholder="$t('toast.message')"
                />
              </div>
              <div>
                <label for="variant" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('toast.variant') }}</label>
                <select
                  id="variant"
                  v-model="customVariant"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
                >
                  <option value="success">{{ $t('toast.success') }}</option>
                  <option value="error">{{ $t('toast.error') }}</option>
                  <option value="warning">{{ $t('toast.warning') }}</option>
                  <option value="info">{{ $t('toast.info') }}</option>
                </select>
              </div>
              <div>
                <label for="duration" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('toast.duration') }} (ms)</label>
                <input
                  id="duration"
                  v-model.number="customDuration"
                  type="number"
                  min="1000"
                  step="1000"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
                />
              </div>
              <div>
                <div class="flex items-center mb-2">
                  <input
                    id="showCountdown"
                    v-model="customShowCountdown"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label for="showCountdown" class="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('toast.showCountdown') }}</label>
                </div>
              </div>
              <div class="md:col-span-2">
                <button
                  @click="showCustomToast"
                  class="mt-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  {{ $t('toast.show') }} {{ $t('toast.customToast').toLowerCase() }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { toastService } from '@/services/toastService'

const { t } = useI18n()

// 自定义消息的状态
const customTitle = ref('')
const customMessage = ref('')
const customVariant = ref<'success' | 'error' | 'warning' | 'info'>('success')
const customDuration = ref(3000)
const customShowCountdown = ref(true)

/**
 * 显示成功消息
 */
function showSuccessToast() {
  toastService.success(t('toast.operationSuccess'), t('toast.success'), undefined, true)
}

/**
 * 显示错误消息
 */
function showErrorToast() {
  toastService.error(t('toast.operationError'), t('toast.error'), undefined, true)
}

/**
 * 显示警告消息
 */
function showWarningToast() {
  toastService.warning(t('toast.operationWarning'), t('toast.warning'), undefined, true)
}

/**
 * 显示信息消息
 */
function showInfoToast() {
  toastService.info(t('toast.informationMessage'), t('toast.info'), undefined, true)
}

/**
 * 显示自定义消息
 */
function showCustomToast() {
  if (!customMessage.value) {
    toastService.error(t('toast.pleaseEnterMessage'), t('toast.error'))
    return
  }
  
  toastService.showToast({
    title: customTitle.value,
    message: customMessage.value,
    variant: customVariant.value,
    duration: customDuration.value,
    showCountdown: customShowCountdown.value
  })
}
</script>