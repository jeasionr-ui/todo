<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900"
      >
        <div class="flex flex-col flex-1 w-full lg:w-1/2 relative">
          <!-- 语言切换器 - 右上角椭圆形背景 -->
          <div class="absolute top-5 right-5 z-10">
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
              <LanguageSwitcher />
            </div>
          </div>
          
          <!-- 返回按钮 - 左上角 -->
          <div class="absolute top-5 left-5 z-10">
            <router-link
              to="/signin"
              class="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-gray-200/50 dark:border-gray-700/50"
            >
              <svg
                class="stroke-current"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M12.7083 5L7.5 10.2083L12.7083 15.4167"
                  stroke=""
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {{ $t('common.back') }}
            </router-link>
          </div>
          
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div class="mb-5 sm:mb-8">
                <h1
                  class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
                >
                  {{ $t('auth.forgotPassword') }}
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ $t('auth.enterEmailForReset') }}
                </p>
              </div>
              <div>
                <form @submit.prevent="handleSubmit">
                  <div class="space-y-5">
                    <!-- Email -->
                    <div>
                      <label
                        for="email"
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        {{ $t('auth.email') }}<span class="text-error-500">*</span>
                      </label>
                      <input
                        v-model="email"
                        type="email"
                        id="email"
                        name="email"
                        :placeholder="$t('auth.email')"
                        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />
                    </div>
                    
                    <!-- 错误/成功信息 -->
                    <div v-if="errorMessage" class="text-error-500 text-sm">
                      {{ errorMessage }}
                    </div>
                    <div v-if="successMessage" class="text-success-500 text-sm">
                      {{ successMessage }}
                    </div>
                    
                    <!-- Button -->
                    <div>
                      <button
                        type="submit"
                        class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                        :disabled="isSubmitting"
                      >
                        <span v-if="isSubmitting">{{ $t('common.loading') }}</span>
                        <span v-else>{{ $t('auth.sendResetLink') }}</span>
                      </button>
                    </div>
                  </div>
                </form>
                <div class="mt-5">
                  <p
                    class="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start"
                  >
                    {{ $t('auth.rememberPassword') }}
                    <router-link
                      to="/signin"
                      class="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                      >{{ $t('auth.signIn') }}</router-link
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid"
        >
          <div class="flex items-center justify-center z-1">
            <common-grid-shape />
            <div class="flex flex-col items-center max-w-xs">
              <router-link to="/" class="block mb-4">
                <img width="{231}" height="{48}" src="/images/logo/auth-logo.svg" alt="Logo" />
              </router-link>
              <p class="text-center text-gray-400 dark:text-white/60">
                {{ $t('common.appDescription') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/i18n'
import CommonGridShape from '@/components/common/CommonGridShape.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'

const { t } = useI18n()
const email = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)

// 提交表单
const handleSubmit = async () => {
  try {
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      errorMessage.value = t('auth.invalidEmail')
      return
    }
    
    errorMessage.value = ''
    isSubmitting.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 假设发送成功
    successMessage.value = t('auth.resetLinkSent')
    isSubmitting.value = false
  } catch (error) {
    console.error('Forgot password error:', error)
    errorMessage.value = t('auth.resetLinkFailed')
    isSubmitting.value = false
  }
}
</script>