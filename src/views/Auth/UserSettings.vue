<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white/90">{{ $t('settings.title') }}</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('settings.description') }}</p>
    </div>

    <!-- 设置表单 -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="lg:col-span-3">
        <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <h4 class="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
            {{ $t('settings.generalSettings') }}
          </h4>

          <form @submit.prevent="saveSettings">
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <!-- 语言设置 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('settings.language') }}
                </label>
                <select
                  v-model="settings.language"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                >
                  <option value="zh">中文</option>
                  <option value="en">English</option>
                </select>
              </div>

              <!-- 时区设置 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('settings.timezone') }}
                </label>
                <select
                  v-model="settings.timezone"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                >
                  <option value="Asia/Shanghai">(GMT+8:00) 北京, 香港, 上海</option>
                  <option value="America/New_York">(GMT-5:00) 纽约</option>
                  <option value="Europe/London">(GMT+0:00) 伦敦</option>
                  <option value="Asia/Tokyo">(GMT+9:00) 东京</option>
                </select>
              </div>

              <!-- 日期格式 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('settings.dateFormat') }}
                </label>
                <select
                  v-model="settings.dateFormat"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                </select>
              </div>

              <!-- 主题设置 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('settings.theme') }}
                </label>
                <select
                  v-model="settings.theme"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                >
                  <option value="light">{{ $t('settings.lightTheme') }}</option>
                  <option value="dark">{{ $t('settings.darkTheme') }}</option>
                  <option value="system">{{ $t('settings.systemTheme') }}</option>
                </select>
              </div>
            </div>

            <!-- 通知设置 -->
            <div class="mt-8">
              <h5 class="mb-4 text-base font-medium text-gray-800 dark:text-white/90">
                {{ $t('settings.notifications') }}
              </h5>

              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-400">
                    {{ $t('settings.emailNotifications') }}
                  </label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="settings.emailNotifications" class="sr-only peer" />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-400">
                    {{ $t('settings.smsNotifications') }}
                  </label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="settings.smsNotifications" class="sr-only peer" />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-400">
                    {{ $t('settings.browserNotifications') }}
                  </label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="settings.browserNotifications" class="sr-only peer" />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
                  </label>
                </div>
              </div>
            </div>

            <div class="flex justify-end mt-8">
              <button
                type="submit"
                class="flex justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
              >
                {{ $t('common.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户设置页面
 * 允许用户配置应用程序的各种设置，如语言、时区、日期格式、主题和通知首选项
 */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLanguage } from '@/i18n'

const { t } = useI18n()
const { changeLanguage } = useLanguage()

// 用户设置
const settings = ref({
  language: localStorage.getItem('locale') || 'zh',
  timezone: 'Asia/Shanghai',
  dateFormat: 'YYYY-MM-DD',
  theme: 'light',
  emailNotifications: true,
  smsNotifications: false,
  browserNotifications: true
})

// 保存设置
const saveSettings = () => {
  // 更新语言设置
  if (settings.value.language) {
    changeLanguage(settings.value.language as 'zh' | 'en')
  }
  
  // 实际应用中这里会调用API保存数据
  console.log('保存设置', settings.value)
  
  // 显示成功消息
  alert(t('settings.saveSuccess'))
}
</script>