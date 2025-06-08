<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    @click.self="closeDialog"
  >
    <div class="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ $t('legal.termsOfService') }}
        </h2>
        <button
          @click="closeDialog"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <div class="prose dark:prose-invert max-w-none">
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {{ $t('legal.lastUpdated') }}: {{ lastUpdated }}
          </div>

          <section class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ $t('legal.terms.acceptance.title') }}
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ $t('legal.terms.acceptance.content') }}
            </p>
          </section>

          <section class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ $t('legal.terms.description.title') }}
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {{ $t('legal.terms.description.content') }}
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>{{ $t('legal.terms.description.features.taskManagement') }}</li>
              <li>{{ $t('legal.terms.description.features.habitTracking') }}</li>
              <li>{{ $t('legal.terms.description.features.pomodoroTimer') }}</li>
              <li>{{ $t('legal.terms.description.features.goalSetting') }}</li>
              <li>{{ $t('legal.terms.description.features.progressReports') }}</li>
            </ul>
          </section>

          <section class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ $t('legal.terms.userAccount.title') }}
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {{ $t('legal.terms.userAccount.content') }}
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>{{ $t('legal.terms.userAccount.requirements.accurateInfo') }}</li>
              <li>{{ $t('legal.terms.userAccount.requirements.securePassword') }}</li>
              <li>{{ $t('legal.terms.userAccount.requirements.confidentiality') }}</li>
            </ul>
          </section>

          <section class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ $t('legal.terms.userConduct.title') }}
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {{ $t('legal.terms.userConduct.content') }}
            </p>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>{{ $t('legal.terms.userConduct.prohibited.illegalActivities') }}</li>
              <li>{{ $t('legal.terms.userConduct.prohibited.harmfulContent') }}</li>
              <li>{{ $t('legal.terms.userConduct.prohibited.systemInterference') }}</li>
              <li>{{ $t('legal.terms.userConduct.prohibited.unauthorizedAccess') }}</li>
            </ul>
          </section>

          <section class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ $t('legal.terms.intellectualProperty.title') }}
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ $t('legal.terms.intellectualProperty.content') }}
            </p>
          </section>

          <section class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ $t('legal.terms.termination.title') }}
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ $t('legal.terms.termination.content') }}
            </p>
          </section>

          <section class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ $t('legal.terms.disclaimers.title') }}
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ $t('legal.terms.disclaimers.content') }}
            </p>
          </section>

          <section class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ $t('legal.terms.changes.title') }}
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ $t('legal.terms.changes.content') }}
            </p>
          </section>

          <section class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ $t('legal.contact.title') }}
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ $t('legal.contact.content') }}
            </p>
            <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p class="text-gray-700 dark:text-gray-300">
                <strong>{{ $t('legal.contact.email') }}:</strong> jeasionr@foxmail.com<br>
                <strong>{{ $t('legal.contact.address') }}:</strong> {{ $t('legal.contact.addressValue') }}
              </p>
            </div>
          </section>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="closeDialog"
          class="px-6 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
        >
          {{ $t('common.close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/i18n'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()

const lastUpdated = computed(() => {
  return new Date().toLocaleDateString()
})

const closeDialog = () => {
  emit('close')
}
</script>
