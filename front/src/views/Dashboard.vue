<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('menu.dashboard')" />
    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <div class="mx-auto w-full max-w-[630px] text-center">
        <h3 class="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
          {{ $t('menu.dashboard') }}
        </h3>

        <p class="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
          {{ $t('common.welcome') }}, {{ currentUser?.firstName }} {{ currentUser?.lastName }}!
        </p>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { userService } from '@/services/userService'
import type User from '@/services/types/UserType'

const currentUser = ref<User | null>(null)

onMounted(async () => {
  // 先用本地缓存渲染
  currentUser.value = userService.getCurrentUser()
  // 再用后端数据刷新
  try {
    const token = localStorage.getItem('token')
    if (token) {
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const user = await res.json()
        currentUser.value = user
        localStorage.setItem('user', JSON.stringify(user))
      }
    }
  } catch {
    // 可选：处理异常
  }
})
</script>
