<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('security.title')" />
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mb-6">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white/90">{{ $t('security.title') }}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('security.description') }}</p>
      </div>

    <!-- 安全设置 -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- 更改密码 -->
      <div class="lg:col-span-3">
        <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <h4 class="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
            {{ $t('security.changePassword') }}
          </h4>

          <form @submit.prevent="changePassword">
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <!-- 当前密码 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('security.currentPassword') }} <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="passwordForm.currentPassword"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    :class="[
                      'dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
                      errors.currentPassword 
                        ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10 dark:border-red-600 dark:focus:border-red-800' 
                        : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'
                    ]"
                    @blur="validateCurrentPassword"
                  />
                  <p v-if="errors.currentPassword" class="mt-1 text-xs text-red-500">
                    {{ errors.currentPassword }}
                  </p>
                  <span
                    @click="showCurrentPassword = !showCurrentPassword"
                    class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                  >
                    <svg
                      v-if="!showCurrentPassword"
                      class="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                        fill="#98A2B3"
                      />
                    </svg>
                    <svg
                      v-else
                      class="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                        fill="#98A2B3"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <!-- 新密码 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('security.newPassword') }} <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="passwordForm.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    :class="[
                      'dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
                      errors.newPassword 
                        ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10 dark:border-red-600 dark:focus:border-red-800' 
                        : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'
                    ]"
                    @input="checkPasswordStrength"
                    @blur="validateNewPassword"
                  />
                  <p v-if="errors.newPassword" class="mt-1 text-xs text-red-500">
                    {{ errors.newPassword }}
                  </p>
                  <!-- 密码强度指示器 -->
                  <div v-if="passwordForm.newPassword && !errors.newPassword" class="mt-1">
                    <div class="flex gap-1 mb-1">
                      <div 
                        v-for="n in 4" 
                        :key="n"
                        :class="[
                          'h-1 flex-1 rounded-full',
                          n <= passwordStrength.score ? getPasswordStrengthColor(passwordStrength.score) : 'bg-gray-200 dark:bg-gray-700'
                        ]"
                      ></div>
                    </div>
                    <p :class="[
                      'text-xs',
                      getPasswordStrengthTextColor(passwordStrength.score)
                    ]">
                      {{ $t(passwordStrength.strengthKey) }}
                      <span v-if="passwordStrength.score >= 2" class="text-xs text-gray-500 ml-1">
                        ({{ $t('password.crackTime', { time: passwordStrength.crackTimeDisplay }) }})
                      </span>
                    </p>
                  </div>
                  <span
                    @click="showNewPassword = !showNewPassword"
                    class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                  >
                    <svg
                      v-if="!showNewPassword"
                      class="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                        fill="#98A2B3"
                      />
                    </svg>
                    <svg
                      v-else
                      class="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                        fill="#98A2B3"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <!-- 确认新密码 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('security.confirmNewPassword') }} <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="passwordForm.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :class="[
                      'dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
                      errors.confirmPassword 
                        ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10 dark:border-red-600 dark:focus:border-red-800' 
                        : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'
                    ]"
                    @blur="validateConfirmPassword"
                  />
                  <p v-if="errors.confirmPassword" class="mt-1 text-xs text-red-500">
                    {{ errors.confirmPassword }}
                  </p>
                  <span
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                  >
                    <svg
                      v-if="!showConfirmPassword"
                      class="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                        fill="#98A2B3"
                      />
                    </svg>
                    <svg
                      v-else
                      class="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                        fill="#98A2B3"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <!-- 表单状态消息 -->
            <div class="mt-4">
              <div v-if="formSuccess" class="p-2 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-100">
                <span class="font-medium">{{ $t('common.success') }}</span> - {{ $t('security.passwordUpdated') }}
              </div>
              <div v-if="errors.form" class="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100">
                <span class="font-medium">{{ $t('common.failed') }}</span> - {{ errors.form }}
              </div>
            </div>
            
            <div class="flex justify-end mt-8">
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed"
              >
                <svg v-if="isSubmitting" class="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? $t('common.processing') : $t('security.updatePassword') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 会话管理 -->
      <div class="lg:col-span-3">
        <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <h4 class="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
            {{ $t('security.activeSessions') }}
          </h4>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-800">
                  <th class="pb-3 text-sm font-medium text-left text-gray-500 dark:text-gray-400">
                    {{ $t('security.device') }}
                  </th>
                  <th class="pb-3 text-sm font-medium text-left text-gray-500 dark:text-gray-400">
                    {{ $t('security.location') }}
                  </th>
                  <th class="pb-3 text-sm font-medium text-left text-gray-500 dark:text-gray-400">
                    {{ $t('security.ipAddress') }}
                  </th>
                  <th class="pb-3 text-sm font-medium text-left text-gray-500 dark:text-gray-400">
                    {{ $t('security.lastActive') }}
                  </th>
                  <th class="pb-3 text-sm font-medium text-left text-gray-500 dark:text-gray-400">
                    {{ $t('security.action') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(session, index) in activeSessions" :key="index" class="border-b border-gray-200 dark:border-gray-800">
                  <td class="py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ session.device }} ({{ session.browser }})
                  </td>
                  <td class="py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ session.location }}
                  </td>
                  <td class="py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ session.ipAddress }}
                  </td>
                  <td class="py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ formatDate(session.lastActive) }}
                  </td>
                  <td class="py-4 text-sm font-medium">
                    <button 
                      v-if="!session.current"
                      @click="terminateSession(index)"
                      class="text-error-500 hover:text-error-600"
                    >
                      {{ $t('security.terminate') }}
                    </button>
                    <span v-else class="text-brand-500">{{ $t('security.current') }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
/**
 * 用户安全设置页面
 * 允许用户更改密码、管理两步验证和查看活动会话
 */
import { ref, onMounted } from 'vue'
import { useI18n } from '@/i18n'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { userService } from '@/services/userService'
import { validatePassword } from '@/utils/passwordValidator'

const { t } = useI18n()

// 密码表单
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码可见性
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// 表单错误信息
const errors = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  form: ''
})

// 表单处理状态
const isSubmitting = ref(false)
const formSuccess = ref(false)

// 两步验证状态
const twoFactorEnabled = ref(false)

// 密码强度
const passwordStrength = ref({
  score: 0,
  strengthKey: 'password.veryWeak',
  crackTimeDisplay: ''
})

// 活动会话
const activeSessions = ref([
  {
    device: 'MacBook Pro',
    browser: 'Chrome',
    location: '北京, 中国',
    ipAddress: '192.168.1.1',
    lastActive: new Date().toISOString(),
    current: true
  },
  {
    device: 'iPhone 13',
    browser: 'Safari',
    location: '上海, 中国',
    ipAddress: '192.168.1.2',
    lastActive: new Date(Date.now() - 86400000).toISOString(), // 1天前
    current: false
  },
  {
    device: 'Windows PC',
    browser: 'Edge',
    location: '广州, 中国',
    ipAddress: '192.168.1.3',
    lastActive: new Date(Date.now() - 172800000).toISOString(), // 2天前
    current: false
  }
])

/**
 * 初始化页面数据
 */
onMounted(async () => {
  const currentUser = userService.getCurrentUser()
  if (currentUser) {
    twoFactorEnabled.value = currentUser.twoFactorEnabled
    
    // 获取登录历史
    try {
      const loginHistory = await userService.getLoginHistory()
      if (loginHistory && loginHistory.length > 0) {
        // 将登录历史转换为活动会话格式
        activeSessions.value = loginHistory.slice(0, 5).map((history, index) => ({
          device: history.device,
          browser: history.browser,
          location: history.location,
          ipAddress: history.ipAddress,
          lastActive: history.time,
          current: index === 0 // 假设最新的登录是当前会话
        }))
      }
    } catch (error) {
      console.error('获取登录历史失败', error)
    }
  }
})

/**
 * 验证当前密码
 */
const validateCurrentPassword = () => {
  if (!passwordForm.value.currentPassword) {
    errors.value.currentPassword = t('user.passwordRequired')
    return false
  }
  errors.value.currentPassword = ''
  return true
}

/**
 * 验证新密码
 */
const validateNewPassword = () => {
  if (!passwordForm.value.newPassword) {
    errors.value.newPassword = t('user.passwordRequired')
    return false
  }
  
  // 使用密码验证工具进行复杂度验证
  const passwordValidation = validatePassword(passwordForm.value.newPassword)
  
  if (!passwordValidation.isValid) {
    // 如果有具体的警告信息，优先显示
    if (passwordValidation.feedback.warning) {
      errors.value.newPassword = passwordValidation.feedback.warning
    } else if (!passwordValidation.rules.hasMinLength) {
      errors.value.newPassword = t('password.tooShort', { length: 8 })
    } else if (!passwordValidation.rules.hasNumber) {
      errors.value.newPassword = t('password.requiresNumber')
    } else if (!passwordValidation.rules.hasLowerCase || !passwordValidation.rules.hasUpperCase) {
      errors.value.newPassword = t('password.requiresCase')
    } else if (!passwordValidation.rules.hasSpecialChar) {
      errors.value.newPassword = t('password.requiresSpecial')
    } else if (!passwordValidation.rules.hasNoRepeatingChars) {
      errors.value.newPassword = t('password.noRepeats')
    } else {
      errors.value.newPassword = t('password.tooWeak')
    }
    return false
  }
  
  errors.value.newPassword = ''
  return true
}

/**
 * 验证确认密码
 */
const validateConfirmPassword = () => {
  if (!passwordForm.value.confirmPassword) {
    errors.value.confirmPassword = t('user.passwordRequired')
    return false
  }
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errors.value.confirmPassword = t('auth.passwordNotMatch')
    return false
  }
  
  errors.value.confirmPassword = ''
  return true
}

/**
 * 修改密码
 */
const changePassword = async () => {
  // 表单验证
  const isCurrentPasswordValid = validateCurrentPassword()
  const isNewPasswordValid = validateNewPassword()
  const isConfirmPasswordValid = validateConfirmPassword()
  
  if (!isCurrentPasswordValid || !isNewPasswordValid || !isConfirmPasswordValid) {
    return
  }
  
  errors.value.form = ''
  
  const currentUser = userService.getCurrentUser()
  if (!currentUser) {
    return
  }
  
  isSubmitting.value = true
  try {
    const success = await userService.changePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword
    )
    
    if (success) {
      formSuccess.value = true
      errors.value.form = ''
      // 重置表单
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      // 3秒后隐藏成功消息
      setTimeout(() => {
        formSuccess.value = false
      }, 3000)
    } else {
      formSuccess.value = false
      errors.value.form = t('common.failed')
    }
  } catch (error: any) {
    console.error('修改密码失败', error)
    formSuccess.value = false
    
    // 处理特定的错误信息
    if (error.response) {
      const statusCode = error.response.status
      const errorData = error.response.data
      
      if (statusCode === 400 && errorData.error === 'Current password is incorrect') {
        // 当前密码错误
        errors.value.currentPassword = t('security.currentPasswordIncorrect') || '当前密码不正确'
      } else if (statusCode === 404) {
        // 用户不存在
        errors.value.form = t('security.userNotFound') || '用户不存在或已被删除'
      } else {
        // 其他服务器响应错误
        errors.value.form = errorData.error || t('common.failed')
      }
    } else if (error.request) {
      // 请求发出但未收到响应
      errors.value.form = t('common.networkError') || '网络错误，请检查连接后重试'
    } else {
      // 其他错误
      errors.value.form = t('common.failed')
    }
  } finally {
    isSubmitting.value = false
  }
}

/**
 * 切换两步验证
 */
const toggleTwoFactor = async () => {
  const currentUser = userService.getCurrentUser()
  if (!currentUser) {
    return
  }
  
  try {
    const success = await userService.toggleTwoFactor(
      twoFactorEnabled.value
    )
    
    if (!success) {
      // 如果失败，恢复原来的状态
      twoFactorEnabled.value = !twoFactorEnabled.value
      // 使用更友好的通知方式，这里我们暂时通过添加一个临时的错误消息
      const statusMessage = document.createElement('div')
      statusMessage.className = 'p-2 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100 fixed top-4 right-4 z-50'
      statusMessage.textContent = t('common.failed')
      document.body.appendChild(statusMessage)
      setTimeout(() => statusMessage.remove(), 3000)
    } else {
      // 成功消息
      const statusMessage = document.createElement('div')
      statusMessage.className = 'p-2 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-100 fixed top-4 right-4 z-50'
      statusMessage.textContent = t('common.success')
      document.body.appendChild(statusMessage)
      setTimeout(() => statusMessage.remove(), 3000)
    }
  } catch (error) {
    console.error('切换两步验证失败', error)
    // 如果出错，恢复原来的状态
    twoFactorEnabled.value = !twoFactorEnabled.value
    // 使用更友好的通知方式
    const statusMessage = document.createElement('div')
    statusMessage.className = 'p-2 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100 fixed top-4 right-4 z-50'
    statusMessage.textContent = t('common.failed')
    document.body.appendChild(statusMessage)
    setTimeout(() => statusMessage.remove(), 3000)
  }
}

/**
 * 终止会话
 */
const terminateSession = (index: number) => {
  // 在实际应用中，这里应该调用API来终止会话
  // 这里只是模拟终止会话的效果
  activeSessions.value.splice(index, 1)
  
  // 显示临时成功消息
  const statusMessage = document.createElement('div')
  statusMessage.className = 'p-2 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-100 fixed top-4 right-4 z-50'
  statusMessage.textContent = t('common.success')
  document.body.appendChild(statusMessage)
  setTimeout(() => statusMessage.remove(), 3000)
}

/**
 * 检查密码强度
 */
const checkPasswordStrength = () => {
  if (!passwordForm.value.newPassword) {
    passwordStrength.value = {
      score: 0,
      strengthKey: 'password.veryWeak',
      crackTimeDisplay: ''
    }
    return
  }
  
  const result = validatePassword(passwordForm.value.newPassword)
  passwordStrength.value = {
    score: result.score,
    strengthKey: result.strengthKey,
    crackTimeDisplay: result.crackTimeDisplay
  }
}

/**
 * 获取密码强度对应的颜色
 */
const getPasswordStrengthColor = (score: number): string => {
  switch (score) {
    case 0:
      return 'bg-red-500' // 非常弱
    case 1:
      return 'bg-orange-500' // 弱
    case 2:
      return 'bg-yellow-500' // 中等
    case 3:
      return 'bg-blue-500' // 强
    case 4:
      return 'bg-green-500' // 非常强
    default:
      return 'bg-gray-300'
  }
}

/**
 * 获取密码强度文本颜色
 */
const getPasswordStrengthTextColor = (score: number): string => {
  switch (score) {
    case 0:
      return 'text-red-600 dark:text-red-400' // 非常弱
    case 1:
      return 'text-orange-600 dark:text-orange-400' // 弱
    case 2:
      return 'text-yellow-600 dark:text-yellow-400' // 中等
    case 3:
      return 'text-blue-600 dark:text-blue-400' // 强
    case 4:
      return 'text-green-600 dark:text-green-400' // 非常强
    default:
      return 'text-gray-500 dark:text-gray-400'
  }
}

/**
 * 格式化日期
 */
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>