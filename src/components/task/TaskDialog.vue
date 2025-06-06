<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div
      class="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900 max-h-[60vh] overflow-y-auto"
    >
      <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
        {{ isEditMode ? $t('task.editTask') : $t('task.createTask') }}
      </h3>

      <form @submit.prevent="onSave">
        <!-- 任务名称 -->
        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ $t('task.name') }} *
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500"
          />
        </div>

        <!-- 任务描述 -->
        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ $t('task.description') }}
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500"
          ></textarea>
        </div>

        <!-- 任务状态 -->
        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ $t('task.status') }}
          </label>
          <select
            v-model="form.status"
            class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500"
          >
            <option value="todo">{{ $t('task.todo') }}</option>
            <option value="working">{{ $t('task.working') }}</option>
            <option value="done">{{ $t('task.done') }}</option>
          </select>
        </div>

        <!-- 任务优先级 -->
        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ $t('task.priority') }}
          </label>
          <select
            v-model="form.priority"
            class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500"
          >
            <option value="high">{{ $t('task.high') }}</option>
            <option value="medium">{{ $t('task.medium') }}</option>
            <option value="low">{{ $t('task.low') }}</option>
          </select>
        </div>

        <!-- 截止日期 -->
        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ $t('task.dueDate') }}
          </label>
          <div class="relative">
            <flat-pickr
              v-model="form.dueDate"
              :config="flatpickrConfig"
              class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500"
              placeholder="选择截止日期"
            />
            <span
              class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.66699 1.66699V4.16699M13.3337 1.66699V4.16699M2.50033 7.50033H17.5003M4.16699 3.33366H15.8337C16.7541 3.33366 17.5003 4.07985 17.5003 5.00033V16.667C17.5003 17.5875 16.7541 18.3337 15.8337 18.3337H4.16699C3.24652 18.3337 2.50033 17.5875 2.50033 16.667V5.00033C2.50033 4.07985 3.24652 3.33366 4.16699 3.33366Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        <!-- 提醒时间 -->
        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ $t('task.reminderTime') }}
          </label>
          <div class="relative">
            <flat-pickr
              v-model="form.reminderTime"
              :config="flatpickrTimeConfig"
              class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500"
              placeholder="选择提醒时间"
            />
            <span
              class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0003 5.00033V10.0003L13.3337 11.667M18.3337 10.0003C18.3337 14.6027 14.6027 18.3337 10.0003 18.3337C5.39795 18.3337 1.66699 14.6027 1.66699 10.0003C1.66699 5.39795 5.39795 1.66699 10.0003 1.66699C14.6027 1.66699 18.3337 5.39795 18.3337 10.0003Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        <!-- 标签 -->
        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ $t('task.tags') }}
          </label>
          <div v-if="form.tags && form.tags.length > 0" class="mb-2 flex flex-wrap gap-2">
            <div
              v-for="(tag, index) in form.tags"
              :key="index"
              class="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-gray-800"
            >
              <span>{{ tag }}</span>
              <button
                @click="removeTag(index)"
                type="button"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
          </div>
          <div class="flex gap-2">
            <input
              v-model="tagsInput"
              @keydown.enter.prevent="addTag"
              type="text"
              :placeholder="$t('task.addTag')"
              class="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500"
            />
            <button
              @click="addTag"
              type="button"
              class="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
            >
              {{ $t('common.add') }}
            </button>
          </div>
        </div>

        <!-- 附件 -->
        <div class="mb-6">
          <FileInput
            :label="$t('task.attachments')"
            :multiple="true"
            :model-value="form.attachments"
            @update:model-value="updateAttachments"
            @upload="onFilesUploaded"
            @error="onFileUploadError"
            accept="image/*,application/pdf,.doc,.docx,.txt,.xlsx,.xls"
          />
        </div>

        <!-- 按钮组 -->
        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            type="submit"
            class="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600"
          >
            {{ $t('common.save') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useI18n } from '@/i18n'
import { useFlatPickr } from '@/composables/useFlatPickr'
import flatPickr from 'vue-flatpickr-component'
import FileInput from '@/components/forms/FormElements/FileInput.vue'
import type { FileInfo } from '@/services/fileService'
import 'flatpickr/dist/flatpickr.css'

export default defineComponent({
  name: 'TaskDialog',
  components: {
    flatPickr,
    FileInput,
  },
  props: {
    show: Boolean,
    isEditMode: Boolean,
    modelValue: Object,
  },
  emits: ['update:modelValue', 'save', 'close'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const { flatpickrConfig, flatpickrTimeConfig } = useFlatPickr()

    const form = ref({
      id: props.modelValue?.id || '',
      name: props.modelValue?.name || '',
      description: props.modelValue?.description || '',
      status: props.modelValue?.status || 'todo',
      priority: props.modelValue?.priority || 'medium',
      dueDate: props.modelValue?.dueDate || null,
      reminderTime: props.modelValue?.reminderTime || null,
      tags: props.modelValue?.tags || [],
      attachments: props.modelValue?.attachments || [], // 现在是文件ID数组
    })

    watch(
      () => props.modelValue,
      (val) => {
        // 只在初始化时或者 modelValue 的 id 发生变化时才重新初始化表单
        if (val && (!form.value.id || val.id !== form.value.id)) {
          form.value = {
            id: val.id || '',
            name: val.name || '',
            description: val.description || '',
            status: val.status || 'todo',
            priority: val.priority || 'medium',
            dueDate: val.dueDate || null,
            reminderTime: val.reminderTime || null,
            tags: val.tags || [],
            attachments: val.attachments || [],
          }
        }
      },
      { deep: true, immediate: true }
    )

    const tagsInput = ref('')

    function onSave() {
      console.log('TaskDialog 表单数据:', form.value)
      console.log('TaskDialog name:', form.value.name)
      console.log('TaskDialog description:', form.value.description)
      emit('save', { ...form.value })
    }

    function addTag() {
      const tag = tagsInput.value.trim()
      if (tag && !form.value.tags.includes(tag)) {
        form.value.tags.push(tag)
      }
      tagsInput.value = ''
    }

    function removeTag(idx: number) {
      form.value.tags.splice(idx, 1)
    }

    // 更新附件（文件ID数组）
    function updateAttachments(fileIds: string[]) {
      form.value.attachments = fileIds
    }

    // 文件上传成功回调
    function onFilesUploaded(files: FileInfo[]) {
      console.log('文件上传成功:', files)
      // 这里可以添加额外的处理逻辑，比如显示成功消息
    }

    // 文件上传错误回调
    function onFileUploadError(error: string) {
      console.error('文件上传错误:', error)
      // 这里可以添加错误处理逻辑，比如显示错误消息
    }

    return {
      t,
      flatpickrConfig,
      flatpickrTimeConfig,
      form,
      tagsInput,
      onSave,
      addTag,
      removeTag,
      updateAttachments,
      onFilesUploaded,
      onFileUploadError,
    }
  },
})
</script>