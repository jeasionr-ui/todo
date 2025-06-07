<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span class="mr-1 font-medium text-theme-sm">{{ currentLanguageLabel }}</span>
      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[120px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <button
        v-for="lang in languages"
        :key="lang.code"
        @click="handleLanguageChange(lang.code)"
        class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        :class="{ 'bg-gray-100 dark:bg-white/5': i18n.locale.value === lang.code }"
      >
        {{ lang.name }}
      </button>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon } from '@/icons'
import { useLanguage, useI18n } from '@/i18n'

const { currentLanguage, changeLanguage } = useLanguage()
const i18n = useI18n()

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const languages = [
  { code: 'zh' as const, name: '中文' },
  { code: 'en' as const, name: 'English' }
]

// 修改计算属性，直接使用 i18n 实例的当前语言
const currentLanguageLabel = computed(() => {
  return languages.find(lang => lang.code === i18n.locale.value)?.name || '中文'
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const handleLanguageChange = (langCode: 'zh' | 'en') => {
  changeLanguage(langCode)
  dropdownOpen.value = false // 切换语言后关闭下拉菜单
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>