// src/composables/useFlatPickr.ts
import { computed } from 'vue'
import { i18n } from '@/i18n'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import { english } from 'flatpickr/dist/l10n/default.js'

/**
 * 提供 flatPickr 日期和时间选择器的配置
 * 根据当前 i18n 语言自动切换本地化设置
 */
export function useFlatPickr() {
  const i18nInstance = i18n.global

  // 日期选择器配置
  const flatpickrConfig = computed(() => ({
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'F j, Y',
    wrap: false,
    locale: i18nInstance.locale.value === 'zh' ? Mandarin : english,
  }))

  // 时间选择器配置
  const flatpickrTimeConfig = computed(() => ({
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    time_24hr: false,
    minuteIncrement: 1,
    wrap: false,
    locale: i18nInstance.locale.value === 'zh' ? Mandarin : english,
  }))

  return {
    flatpickrConfig,
    flatpickrTimeConfig,
  }
}
