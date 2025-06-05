<template>
  <Toast
    :variant="toastService.toast.variant"
    :title="toastService.toast.title"
    :message="toastService.toast.message"
    :duration="toastService.toast.duration"
    :showCountdown="toastService.toast.showCountdown"
    v-model:visible="toastService.toast.visible"
  />
</template>

<script setup lang="ts">
import Toast from './Toast.vue'
import { toastService } from '@/services/toastService'
</script>