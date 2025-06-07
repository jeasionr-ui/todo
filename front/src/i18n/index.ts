import { createI18n } from 'vue-i18n'
import zh from './locales/zh'
import en from './locales/en'
import { ref } from 'vue'

type MessageSchema = typeof zh

export const i18n = createI18n({ 
  locale: 'zh', // 默认语言为中文
  fallbackLocale: 'zh',
  messages: {
    zh,
    en
  }
})

// 提供一个组合式API来使用i18n
export function useI18n() {
  return i18n.global
}

// 提供一个切换语言的函数
export function useLanguage() {
  const i18nInstance = i18n.global
  
  // 获取当前语言
const currentLanguage = ref(i18nInstance.locale.value)
  
  // 切换语言
  const changeLanguage = (locale: 'zh' | 'en') => {
    i18nInstance.locale.value = locale
    currentLanguage.value = locale
    localStorage.setItem('locale', locale)
  }
  
  // 初始化语言
  const initLanguage = () => {
    const savedLocale = localStorage.getItem('locale') as 'zh' | 'en' | null
    if (savedLocale && (savedLocale === 'zh' || savedLocale === 'en')) {
      i18nInstance.locale.value = savedLocale
      currentLanguage.value = savedLocale
    }
  }
  
  return {
    currentLanguage,
    changeLanguage,
    initLanguage
  }
}