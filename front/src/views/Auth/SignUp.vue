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
              to="/"
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
                  {{ $t('auth.signUp') }}
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ $t('auth.enterInfoToSignUp') }}
                </p>
              </div>
              <div>
                <form @submit.prevent="handleSubmit">
                  <div class="space-y-5">
                    <!-- 姓名 -->
                    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          for="firstName"
                          class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          {{ $t('auth.firstName') }}<span class="text-error-500">*</span>
                        </label>
                        <input
                          v-model="firstName"
                          type="text"
                          id="firstName"
                          name="firstName"
                          :placeholder="$t('auth.firstName')"
                          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        />
                      </div>
                      <div>
                        <label
                          for="lastName"
                          class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          {{ $t('auth.lastName') }}<span class="text-error-500">*</span>
                        </label>
                        <input
                          v-model="lastName"
                          type="text"
                          id="lastName"
                          name="lastName"
                          :placeholder="$t('auth.lastName')"
                          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        />
                      </div>
                    </div>
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
                    <!-- Password -->
                    <div>
                      <label
                        for="password"
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        {{ $t('auth.password') }}<span class="text-error-500">*</span>
                      </label>
                      <div class="relative">
                        <input
                          v-model="password"
                          :type="showPassword ? 'text' : 'password'"
                          id="password"
                          :placeholder="$t('auth.password')"
                          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        />
                        <span
                          @click="togglePasswordVisibility('password')"
                          class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                        >
                          <svg
                            v-if="!showPassword"
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
                    <!-- Confirm Password -->
                    <div>
                      <label
                        for="confirmPassword"
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        {{ $t('auth.confirmPassword') }}<span class="text-error-500">*</span>
                      </label>
                      <div class="relative">
                        <input
                          v-model="confirmPassword"
                          :type="showConfirmPassword ? 'text' : 'password'"
                          id="confirmPassword"
                          :placeholder="$t('auth.confirmPassword')"
                          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        />
                        <span
                          @click="togglePasswordVisibility('confirmPassword')"
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
                    <!-- 协议 -->
                    <div class="space-y-3">
                      <!-- 服务条款和隐私政策 - 单个复选框 -->
                      <div class="flex items-start gap-3">
                        <label
                          for="agreeLegal"
                          class="flex items-start text-sm font-normal text-gray-700 cursor-pointer select-none dark:text-gray-400"
                        >
                          <div class="relative">
                            <input
                              v-model="agreeLegal"
                              type="checkbox"
                              id="agreeLegal"
                              class="sr-only"
                            />
                            <div
                              :class="
                                agreeLegal
                                  ? 'border-brand-500 bg-brand-500'
                                  : 'bg-transparent border-gray-300 dark:border-gray-700'
                              "
                              class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] flex-shrink-0 mt-0.5"
                            >
                              <span :class="agreeLegal ? '' : 'opacity-0'">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                                    stroke="white"
                                    stroke-width="1.94437"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>
                          <span class="leading-relaxed">
                            {{ $t('legal.agreeToTermsAndPrivacy') }}
                            <button
                              type="button"
                              @click="showTermsDialog = true"
                              class="text-brand-500 hover:text-brand-600 underline mx-1"
                            >
                              {{ $t('legal.termsOfService') }}
                            </button>
                            {{ $t('legal.and') }}
                            <button
                              type="button"
                              @click="showPrivacyDialog = true"
                              class="text-brand-500 hover:text-brand-600 underline ml-1"
                            >
                              {{ $t('legal.privacyPolicy') }}
                            </button>
                          </span>
                        </label>
                      </div>
                    </div>
                    <!-- 错误信息 -->
                    <div v-if="registerError" class="text-error-500 text-sm">
                      {{ registerError }}
                    </div>
                    <!-- Button -->
                    <div>
                      <button
                        type="submit"
                        class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                        :disabled="!isFormValid"
                      >
                        {{ $t('auth.createAccount') }}
                      </button>
                    </div>
                  </div>
                </form>
                
                <!-- 第三方登录选项 -->
                <div class="mt-6">
                  <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                      <div class="w-full border-t border-gray-200 dark:border-gray-800"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                      <span class="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-3">{{
                        $t('auth.or')
                      }}</span>
                    </div>
                  </div>
                  
                  <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3">
                    <!-- Google 注册 -->
                    <button
                      class="inline-flex items-center justify-center gap-2 py-2.5 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-4 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                          fill="#EB4335"
                        />
                      </svg>
                      <span class="hidden sm:inline">Google</span>
                    </button>
                    
                    <!-- GitHub 注册 -->
                    <button
                      class="inline-flex items-center justify-center gap-2 py-2.5 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-4 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C17.138 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
                          fill="currentColor"
                        />
                      </svg>
                      <span class="hidden sm:inline">GitHub</span>
                    </button>
                    
                    <!-- X (Twitter) 注册 -->
                    <button
                      class="inline-flex items-center justify-center gap-2 py-2.5 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-4 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z"
                          fill="currentColor"
                        />
                      </svg>
                      <span class="hidden sm:inline">X</span>
                    </button>
                  </div>
                </div>
                <div class="mt-5">
                  <p
                    class="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start"
                  >
                    {{ $t('auth.alreadyHaveAccount') }}
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
    
    <!-- 法律文档组件 -->
    <TermsOfService 
      :is-open="showTermsDialog" 
      @close="showTermsDialog = false" 
    />
    <PrivacyPolicy 
      :is-open="showPrivacyDialog" 
      @close="showPrivacyDialog = false" 
    />
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n'
import { useRouter } from 'vue-router'
import CommonGridShape from '@/components/common/CommonGridShape.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import TermsOfService from '@/components/auth/TermsOfService.vue'
import PrivacyPolicy from '@/components/auth/PrivacyPolicy.vue'
import { userService } from '@/services/userService'

const { t } = useI18n()
const router = useRouter()
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreeLegal = ref(false)
const showTermsDialog = ref(false)
const showPrivacyDialog = ref(false)
const registerError = ref('')

// 表单验证
const isFormValid = computed(() => {
  return (
    firstName.value.trim() !== '' &&
    lastName.value.trim() !== '' &&
    email.value.trim() !== '' &&
    password.value.trim() !== '' &&
    password.value === confirmPassword.value &&
    agreeLegal.value
  )
})

// 切换密码可见性
const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
  if (field === 'password') {
    showPassword.value = !showPassword.value
  } else {
    showConfirmPassword.value = !showConfirmPassword.value
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    // 验证密码是否匹配
    if (password.value !== confirmPassword.value) {
      registerError.value = t('auth.passwordNotMatch')
      return
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      registerError.value = t('auth.invalidEmail')
      return
    }
    
    registerError.value = ''
    const user = await userService.register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value
    })
    
    if (user) {
      router.push('/')
    } else {
      registerError.value = t('auth.emailAlreadyExists')
    }
  } catch (error) {
    console.error('Registration error:', error)
    registerError.value = t('auth.registrationFailed')
  }
}
</script>