<template>
  <div class="space-y-6">
    <!-- File Upload -->
    <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {{ label || t('file.uploadFiles') }}
      </label>
      
      <!-- File Input -->
      <div class="relative">
        <!-- Hidden native file input -->
        <input
          ref="fileInput"
          type="file"
          :multiple="multiple"
          :accept="accept"
          @change="handleFileSelect"
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          :disabled="uploading"
        />
        
        <!-- Custom file input button -->
        <div class="flex items-center justify-center h-11 w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span class="text-sm">
              {{ selectedFiles.length > 0 
                ? t('file.selectedFiles') + ': ' + selectedFiles.length 
                : t('file.chooseFile') }}
            </span>
          </div>
        </div>
        
        <!-- Upload Progress -->
        <div v-if="uploading" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-lg">
          <div class="flex items-center space-x-2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ uploadProgress }}%
            </span>
          </div>
        </div>
      </div>
      
      <!-- Upload Button -->
      <div v-if="selectedFiles.length > 0 && !uploading" class="mt-2">
        <button
          @click="uploadFiles"
          type="button"
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          {{ t('file.uploadFiles') }} ({{ selectedFiles.length }})
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mt-2 text-sm text-red-600 dark:text-red-400">
        {{ errorMessage }}
      </div>

      <!-- Selected Files Preview -->
      <div v-if="selectedFiles.length > 0" class="mt-3 space-y-2">
        <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t('file.selectedFiles') }}:
        </div>
        <div class="space-y-1">
          <div
            v-for="(file, index) in selectedFiles"
            :key="index"
            class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div class="flex items-center space-x-2 flex-1 min-w-0">
              <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
              </svg>
              <div class="min-w-0 flex-1">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {{ file.name }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatFileSize(file.size) }}
                </div>
              </div>
            </div>
            <button
              @click="removeFile(index)"
              type="button"
              class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Uploaded Files List -->
      <div v-if="uploadedFiles.length > 0" class="mt-4 space-y-2">
        <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t('file.uploadedFiles') }}:
        </div>
        <div class="space-y-1">
          <div
            v-for="file in uploadedFiles"
            :key="file.id"
            class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <div class="flex items-center space-x-2 flex-1 min-w-0">
              <svg class="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="min-w-0 flex-1">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {{ file.originalName }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatFileSize(file.size) }} • {{ formatDate(file.uploadedAt) }}
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="downloadFile(file)"
                type="button"
                class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                :title="t('file.downloadFile')"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </button>
              <button
                @click="removeUploadedFile(file.id)"
                type="button"
                class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                :title="t('file.deleteFile')"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { uploadFile, uploadMultipleFiles, deleteFile, downloadFile as downloadFileService, formatFileSize, type FileInfo } from '@/services/fileService'

const { t, locale } = useI18n()

interface Props {
  label?: string
  multiple?: boolean
  accept?: string
  modelValue?: string[] // 文件ID数组
  userId?: string
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
  (e: 'upload', files: FileInfo[]): void
  (e: 'error', error: string): void
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  multiple: false,
  accept: '',
  modelValue: () => []
})

const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement>()
const selectedFiles = ref<File[]>([])
const uploadedFiles = ref<FileInfo[]>([])
const uploading = ref(false)
const uploadProgress = ref(0)
const errorMessage = ref('')

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (files) {
    selectedFiles.value = Array.from(files)
    errorMessage.value = ''
  }
}

// 移除选中的文件
const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
  
  // 清空 input 的值
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 上传文件
const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) return
  
  uploading.value = true
  uploadProgress.value = 0
  errorMessage.value = ''
  
  try {
    let uploadedFilesList: FileInfo[]
    
    if (props.multiple && selectedFiles.value.length > 1) {
      // 批量上传
      uploadedFilesList = await uploadMultipleFiles(selectedFiles.value, props.userId)
    } else {
      // 单个上传
      const uploadedFile = await uploadFile(selectedFiles.value[0], props.userId)
      uploadedFilesList = [uploadedFile]
    }
    
    // 添加到已上传文件列表
    uploadedFiles.value.push(...uploadedFilesList)
    
    // 更新模型值（文件ID数组）
    const fileIds = uploadedFiles.value.map(file => file.id)
    emit('update:modelValue', fileIds)
    
    // 触发上传事件
    emit('upload', uploadedFilesList)
    
    // 清空选择的文件
    selectedFiles.value = []
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    
    uploadProgress.value = 100
    
  } catch (error: any) {
    errorMessage.value = error.message || t('file.uploadFailed')
    emit('error', errorMessage.value)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

// 移除已上传的文件
const removeUploadedFile = async (fileId: string) => {
  try {
    await deleteFile(fileId)
    
    // 从列表中移除
    uploadedFiles.value = uploadedFiles.value.filter(file => file.id !== fileId)
    
    // 更新模型值
    const fileIds = uploadedFiles.value.map(file => file.id)
    emit('update:modelValue', fileIds)
    
  } catch (error: any) {
    errorMessage.value = error.message || t('file.deleteFailed')
    emit('error', errorMessage.value)
  }
}

// 下载文件
const downloadFile = (file: FileInfo) => {
  downloadFileService(file.id, file.originalName)
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const localeCode = locale.value === 'zh' ? 'zh-CN' : 'en-US'
  return date.toLocaleDateString(localeCode, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 清空所有文件
const clearFiles = () => {
  selectedFiles.value = []
  uploadedFiles.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('update:modelValue', [])
}

// 暴露方法给父组件
defineExpose({
  clearFiles,
  uploadFiles
})
</script>
