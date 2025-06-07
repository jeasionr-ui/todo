import { createI18n } from 'vue-i18n'
import zh from './locales/zh'
import en from './locales/en'
import { ref } from 'vue'

// 定义支持的语言类型
export type SupportedLocale = 'zh' | 'en'

// 消息结构类型
export type MessageSchema = typeof zh

// 创建 i18n 实例
export const i18n = createI18n<[MessageSchema], SupportedLocale>({
  legacy: false, // 使用 Composition API 模式
  locale: 'zh' as SupportedLocale, // 默认语言为中文
  fallbackLocale: 'zh' as SupportedLocale,
  messages: {
    zh,
    en
  }
})

// 提供统一的国际化组合式API
export function useI18n() {
  return i18n.global
}

// 语言管理组合式API
export function useLanguage() {
  const i18nInstance = i18n.global
  
  // 获取当前语言
  const currentLanguage = ref<SupportedLocale>(i18nInstance.locale.value)
  
  // 切换语言
  const changeLanguage = (locale: SupportedLocale) => {
    i18nInstance.locale.value = locale
    currentLanguage.value = locale
    localStorage.setItem('locale', locale)
    
    // 触发文档语言属性更新
    document.documentElement.lang = locale
  }
  
  // 初始化语言
  const initLanguage = () => {
    const savedLocale = localStorage.getItem('locale') as SupportedLocale | null
    if (savedLocale && (savedLocale === 'zh' || savedLocale === 'en')) {
      i18nInstance.locale.value = savedLocale
      currentLanguage.value = savedLocale
      document.documentElement.lang = savedLocale
    } else {
      // 如果没有保存的语言设置，尝试从浏览器语言检测
      const browserLang = navigator.language.toLowerCase()
      const detectedLocale: SupportedLocale = browserLang.startsWith('zh') ? 'zh' : 'en'
      changeLanguage(detectedLocale)
    }
  }
  
  return {
    currentLanguage,
    changeLanguage,
    initLanguage
  }
}

// 支持的语言列表
export const supportedLocales: Array<{ code: SupportedLocale; name: string; nativeName: string }> = [
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'en', name: 'English', nativeName: 'English' }
]

// 获取当前语言的显示名称
export function getCurrentLanguageName(): string {
  const currentLocale = i18n.global.locale.value
  return supportedLocales.find(locale => locale.code === currentLocale)?.nativeName || '中文'
}

// 格式化国际化消息（支持参数插值）
export function formatMessage(key: string, params?: Record<string, any>): string {
  const { t } = i18n.global
  return t(key, params)
}