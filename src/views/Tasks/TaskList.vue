<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('task.title')" />
    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <!-- 任务列表头部 -->
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white/90">
          {{ $t('task.all') }}
        </h3>
        <div class="flex flex-wrap items-center gap-4">
          <!-- 搜索框 -->
          <div class="relative">
            <input type="text" v-model="searchQuery" :placeholder="$t('task.search')"
              class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 pl-11 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500" />
            <span class="absolute left-4 top-1/2 -translate-y-1/2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.33325 12.6667C10.2789 12.6667 12.6666 10.279 12.6666 7.33333C12.6666 4.38769 10.2789 2 7.33325 2C4.38761 2 1.99992 4.38769 1.99992 7.33333C1.99992 10.279 4.38761 12.6667 7.33325 12.6667Z"
                  stroke="#8C9097" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14.0001 14L11.3334 11.3333" stroke="#8C9097" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </span>
          </div>

          <!-- 筛选按钮 -->
          <button @click="toggleFilterMenu"
            class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.0001 2H2.00006C1.82325 2 1.65367 2.07024 1.52865 2.19526C1.40363 2.32029 1.33339 2.48986 1.33339 2.66667C1.33339 2.84348 1.40363 3.01305 1.52865 3.13807C1.65367 3.2631 1.82325 3.33333 2.00006 3.33333H14.0001C14.1769 3.33333 14.3465 3.2631 14.4715 3.13807C14.5965 3.01305 14.6667 2.84348 14.6667 2.66667C14.6667 2.48986 14.5965 2.32029 14.4715 2.19526C14.3465 2.07024 14.1769 2 14.0001 2ZM11.3334 6.66667H4.66673C4.48992 6.66667 4.32035 6.7369 4.19532 6.86193C4.0703 6.98695 4.00006 7.15652 4.00006 7.33333C4.00006 7.51014 4.0703 7.67971 4.19532 7.80474C4.32035 7.92976 4.48992 8 4.66673 8H11.3334C11.5102 8 11.6798 7.92976 11.8048 7.80474C11.9298 7.67971 12.0001 7.51014 12.0001 7.33333C12.0001 7.15652 11.9298 6.98695 11.8048 6.86193C11.6798 6.7369 11.5102 6.66667 11.3334 6.66667ZM8.66673 11.3333H7.33339C7.15659 11.3333 6.98701 11.4036 6.86199 11.5286C6.73697 11.6536 6.66673 11.8232 6.66673 12C6.66673 12.1768 6.73697 12.3464 6.86199 12.4714C6.98701 12.5964 7.15659 12.6667 7.33339 12.6667H8.66673C8.84353 12.6667 9.01311 12.5964 9.13813 12.4714C9.26316 12.3464 9.33339 12.1768 9.33339 12C9.33339 11.8232 9.26316 11.6536 9.13813 11.5286C9.01311 11.4036 8.84353 11.3333 8.66673 11.3333Z"
                fill="currentColor" />
            </svg>
            {{ $t('task.filter') }}
          </button>

          <!-- 筛选菜单 -->
          <div v-if="showFilterMenu"
            class="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <h4 class="mb-3 text-sm font-medium text-gray-800 dark:text-white/90">{{ $t('task.filter') }}</h4>

            <!-- 状态筛选 -->
            <div class="mb-4">
              <label class="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">{{ $t('task.status')
                }}</label>
              <select v-model="filterStatus"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500">
                <option value="all">{{ $t('task.allStatuses') }}</option>
                <option value="todo">{{ $t('task.todo') }}</option>
                <option value="working">{{ $t('task.working') }}</option>
                <option value="done">{{ $t('task.done') }}</option>
              </select>
            </div>

            <!-- 优先级筛选 -->
            <div class="mb-4">
              <label class="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">{{ $t('task.priority')
                }}</label>
              <select v-model="filterPriority"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500">
                <option value="all">{{ $t('task.allPriorities') }}</option>
                <option value="high">{{ $t('task.high') }}</option>
                <option value="medium">{{ $t('task.medium') }}</option>
                <option value="low">{{ $t('task.low') }}</option>
              </select>
            </div>

            <!-- 筛选按钮 -->
            <div class="flex justify-between">
              <button @click="resetFilter"
                class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]">
                {{ $t('task.resetFilter') }}
              </button>
              <button @click="applyFilter(filterStatus, filterPriority)"
                class="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600">
                {{ $t('task.applyFilter') }}
              </button>
            </div>
          </div>

          <!-- 创建任务按钮 -->
          <button @click="openCreateTaskDialog"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:ring-0 dark:bg-brand-500 dark:hover:bg-brand-600">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.00006 3.33334C7.82325 3.33334 7.65367 3.40358 7.52865 3.5286C7.40363 3.65363 7.33339 3.8232 7.33339 4.00001V7.33334H4.00006C3.82325 7.33334 3.65367 7.40358 3.52865 7.5286C3.40363 7.65363 3.33339 7.8232 3.33339 8.00001C3.33339 8.17682 3.40363 8.34639 3.52865 8.47141C3.65367 8.59644 3.82325 8.66668 4.00006 8.66668H7.33339V12C7.33339 12.1768 7.40363 12.3464 7.52865 12.4714C7.65367 12.5964 7.82325 12.6667 8.00006 12.6667C8.17687 12.6667 8.34644 12.5964 8.47147 12.4714C8.59649 12.3464 8.66673 12.1768 8.66673 12V8.66668H12.0001C12.1769 8.66668 12.3465 8.59644 12.4715 8.47141C12.5965 8.34639 12.6667 8.17682 12.6667 8.00001C12.6667 7.8232 12.5965 7.65363 12.4715 7.5286C12.3465 7.40358 12.1769 7.33334 12.0001 7.33334H8.66673V4.00001C8.66673 3.8232 8.59649 3.65363 8.47147 3.5286C8.34644 3.40358 8.17687 3.33334 8.00006 3.33334Z"
                fill="currentColor" />
            </svg>
            {{ $t('task.create') }}
          </button>

          <!-- 任务对话框 -->
          <div v-if="showTaskDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
              <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                {{ isEditMode ? $t('task.editTask') : $t('task.createTask') }}
              </h3>

              <form @submit.prevent="saveTask">
                <!-- 任务名称 -->
                <div class="mb-4">
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('task.name') }} *
                  </label>
                  <input v-model="currentTask.name" type="text" required
                    class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500" />
                </div>

                <!-- 任务描述 -->
                <div class="mb-4">
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('task.description') }}
                  </label>
                  <textarea v-model="currentTask.description" rows="3"
                    class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500"></textarea>
                </div>

                <!-- 任务状态 -->
                <div class="mb-4">
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('task.status') }}
                  </label>
                  <select v-model="currentTask.status"
                    class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500">
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
                  <select v-model="currentTask.priority"
                    class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500">
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
                  <div class="flex gap-2">
                    <div class="relative w-full">
                      <div class="relative">
                        <flat-pickr v-model="currentTask.dueDate" :config="flatpickrConfig"
                          class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                          placeholder="Select date" />
                        <span
                          class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                          <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                              fill="" />
                          </svg>
                        </span>
                      </div>

                    </div>
                    <div class="relative w-full">
                      <flat-pickr v-model="currentTask.dueTime" :config="flatpickrTimeConfig"
                        class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:ring-0 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-brand-500"
                        placeholder="选择时间" />
                      <span class="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 dark:text-gray-400">
                        <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M3.04175 9.99984C3.04175 6.15686 6.1571 3.0415 10.0001 3.0415C13.8431 3.0415 16.9584 6.15686 16.9584 9.99984C16.9584 13.8428 13.8431 16.9582 10.0001 16.9582C6.1571 16.9582 3.04175 13.8428 3.04175 9.99984ZM10.0001 1.5415C5.32867 1.5415 1.54175 5.32843 1.54175 9.99984C1.54175 14.6712 5.32867 18.4582 10.0001 18.4582C14.6715 18.4582 18.4584 14.6712 18.4584 9.99984C18.4584 5.32843 14.6715 1.5415 10.0001 1.5415ZM9.99998 10.7498C9.58577 10.7498 9.24998 10.4141 9.24998 9.99984V5.4165C9.24998 5.00229 9.58577 4.6665 9.99998 4.6665C10.4142 4.6665 10.75 5.00229 10.75 5.4165V9.24984H13.3334C13.7476 9.24984 14.0834 9.58562 14.0834 9.99984C14.0834 10.4141 13.7476 10.7498 13.3334 10.7498H10.0001H9.99998Z"
                            fill="" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>


                <!-- 附件 -->
                <div class="mb-6">
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('task.attachments') }}
                  </label>
                  <div v-if="currentTask.attachments && currentTask.attachments.length > 0"
                    class="mb-2 flex flex-wrap gap-2">
                    <div v-for="(attachment, index) in currentTask.attachments" :key="index"
                      class="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-gray-800">
                      <span>{{ attachment.name }}</span>
                      <button @click="removeAttachment(index)" type="button"
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button type="button" @click="addAttachment"
                      class="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round" />
                      </svg>
                      {{ $t('task.addAttachment') }}
                    </button>
                  </div>
                </div>

                <!-- 按钮组 -->
                <div class="flex justify-end gap-3">
                  <button type="button" @click="showTaskDialog = false"
                    class="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]">
                    {{ $t('common.cancel') }}
                  </button>
                  <button type="submit"
                    class="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600">
                    {{ $t('common.save') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>



      <!-- 任务列表 -->
      <div v-if="filteredTasks.length > 0" class="space-y-4">
        <div v-for="task in filteredTasks" :key="task.id"
          class="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="flex-1">
              <!-- 任务标题和状态 -->
              <div class="mb-2 flex items-center gap-3">
                <h4 class="text-base font-medium text-gray-800 dark:text-white/90">
                  {{ task.name }}
                </h4>
              </div>

              <div class="flex flex-wrap items-start  gap-4">
                <span :class="{
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-500': task.status === 'todo',
                  'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-500': task.status === 'working',
                  'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-500': task.status === 'done'
                }" class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium">
                  {{ $t(`task.${task.status}`) }}
                </span>
                <span :class="{
                  'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-500': task.priority === 'high',
                  'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-500': task.priority === 'medium',
                  'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-500': task.priority === 'low'
                }" class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium">
                  {{ $t(`task.${task.priority}`) }}
                </span>
              </div>

              <!-- 任务描述 -->
              <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">
                {{ task.description }}
              </p>

              <!-- 任务标签 -->
              <div v-if="task.tags.length > 0" class="mb-3 flex flex-wrap gap-2">
                <span v-for="tag in task.tags" :key="tag"
                  class="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {{ tag }}
                </span>
              </div>

              <!-- 任务元数据 -->
              <div class="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <!-- 截止日期 -->
                <div v-if="task.dueDate" class="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7.00008 12.8334C10.2217 12.8334 12.8334 10.2217 12.8334 7.00008C12.8334 3.77842 10.2217 1.16675 7.00008 1.16675C3.77842 1.16675 1.16675 3.77842 1.16675 7.00008C1.16675 10.2217 3.77842 12.8334 7.00008 12.8334Z"
                      stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7 3.5V7L9.33333 8.16667" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  {{ formatDate(task.dueDate) }} {{ task.dueTime }}
                </div>



                <!-- 评论数 -->
                <div v-if="task.comments.length > 0" class="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.25 9.0415C12.25 9.34361 12.1307 9.63315 11.9181 9.84581C11.7055 10.0585 11.4159 10.1778 11.1138 10.1778H4.47501L2.33334 12.2498V3.5415C2.33334 3.23939 2.45268 2.94985 2.66534 2.73719C2.878 2.52453 3.16755 2.4052 3.46967 2.4052H11.1138C11.4159 2.4052 11.7055 2.52453 11.9181 2.73719C12.1307 2.94985 12.25 3.23939 12.25 3.5415V9.0415Z"
                      stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ task.comments.length }}
                </div>
              </div>
            </div>

            <!-- 任务操作按钮 -->
            <div class="flex items-center gap-2">
              <button @click="openEditTaskDialog(task)"
                class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                :title="$t('common.edit')">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9.16699 3.33301L10.8337 1.66634C11.0566 1.44338 11.3621 1.31934 11.6803 1.31934C11.9986 1.31934 12.304 1.44338 12.527 1.66634C12.75 1.88931 12.874 2.19475 12.874 2.51301C12.874 2.83127 12.75 3.13671 12.527 3.35967L4.83366 11.053C4.47033 11.4163 4.00033 11.6663 3.50033 11.7663L1.66699 12.333L2.23366 10.4997C2.33366 9.99967 2.58366 9.52967 2.94699 9.16634L9.16699 2.94634V3.33301ZM9.16699 3.33301L12.667 6.83301"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <button @click="deleteTask(task.id)"
                class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                :title="$t('common.delete')">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 4H3.33333H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path
                    d="M5.33301 4.00033V2.66699C5.33301 2.31337 5.47348 1.97423 5.7235 1.7242C5.97353 1.47418 6.31267 1.33366 6.66634 1.33366H9.33301C9.68667 1.33366 10.0258 1.47418 10.2758 1.7242C10.5259 1.97423 10.6663 2.31337 10.6663 2.66699V4.00033M12.6663 4.00033V13.3337C12.6663 13.6873 12.5259 14.0265 12.2758 14.2765C12.0258 14.5265 11.6867 14.667 11.333 14.667H4.66634C4.31272 14.667 3.97358 14.5265 3.72355 14.2765C3.47353 14.0265 3.33301 13.6873 3.33301 13.3337V4.00033H12.6663Z"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M6.66699 7.33366V11.3337" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M9.33301 7.33366V11.3337" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 无任务提示 -->
      <div v-else-if="!loading"
        class="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-white/[0.03]">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
          class="mb-4 text-gray-300 dark:text-gray-600">
          <path
            d="M56 16H48V12C48 10.9391 47.5786 9.92172 46.8284 9.17157C46.0783 8.42143 45.0609 8 44 8H20C18.9391 8 17.9217 8.42143 17.1716 9.17157C16.4214 9.92172 16 10.9391 16 12V16H8C6.93913 16 5.92172 16.4214 5.17157 17.1716C4.42143 17.9217 4 18.9391 4 20V52C4 53.0609 4.42143 54.0783 5.17157 54.8284C5.92172 55.5786 6.93913 56 8 56H56C57.0609 56 58.0783 55.5786 58.8284 54.8284C59.5786 54.0783 60 53.0609 60 52V20C60 18.9391 59.5786 17.9217 58.8284 17.1716C58.0783 16.4214 57.0609 16 56 16ZM20 12H44V24H20V12ZM56 52H8V20H16V24C16 25.0609 16.4214 26.0783 17.1716 26.8284C17.9217 27.5786 18.9391 28 20 28H44C45.0609 28 46.0783 27.5786 46.8284 26.8284C47.5786 26.0783 48 25.0609 48 24V20H56V52Z"
            fill="currentColor" />
          <path
            d="M24 36H40C40.5304 36 41.0391 35.7893 41.4142 35.4142C41.7893 35.0391 42 34.5304 42 34C42 33.4696 41.7893 32.9609 41.4142 32.5858C41.0391 32.2107 40.5304 32 40 32H24C23.4696 32 22.9609 32.2107 22.5858 32.5858C22.2107 32.9609 22 33.4696 22 34C22 34.5304 22.2107 35.0391 22.5858 35.4142C22.9609 35.7893 23.4696 36 24 36Z"
            fill="currentColor" />
          <path
            d="M24 44H32C32.5304 44 33.0391 43.7893 33.4142 43.4142C33.7893 43.0391 34 42.5304 34 42C34 41.4696 33.7893 40.9609 33.4142 40.5858C33.0391 40.2107 32.5304 40 32 40H24C23.4696 40 22.9609 40.2107 22.5858 40.5858C22.2107 40.9609 22 41.4696 22 42C22 42.5304 22.2107 43.0391 22.5858 43.4142C22.9609 43.7893 23.4696 44 24 44Z"
            fill="currentColor" />
        </svg>
        <h3 class="mb-1 text-lg font-medium text-gray-800 dark:text-white/90">
          {{ $t('task.noTasks') }}
        </h3>
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {{ $t('task.createFirstTask') }}
        </p>
        <button @click="openCreateTaskDialog"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:ring-0 dark:bg-brand-500 dark:hover:bg-brand-600">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.00006 3.33334V12.6667M3.33339 8.00001H12.6667" stroke="white" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ $t('task.create') }}
        </button>
      </div>

      <!-- 删除确认对话框 -->
      <DeleteAlertDialog v-model:show="showDeleteDialog" title="确认删除" :message="$t('task.confirmDelete')"
        @confirm="confirmDeleteTask" />
    </div>
  </AdminLayout>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useI18n } from '@/i18n'
import { useFlatPickr } from '@/composables/useFlatPickr'
import { useFormatters } from '@/composables/useFormatters'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import DeleteAlertDialog from "@/components/ui/DeleteAlertDialog.vue";
import { taskService } from '@/services/taskService'
import { toastService } from '@/services/toastService'
import type Task from '@/services/types/TaskType'
import { mockUsers } from '@/services/mockData'

export default defineComponent({
  name: 'TaskList',
  components: {
    PageBreadcrumb,
    AdminLayout,
    flatPickr,
    DeleteAlertDialog
  },
  setup() {
    const { t } = useI18n()
    const { flatpickrConfig, flatpickrTimeConfig } = useFlatPickr()
    const { formatDate } = useFormatters()

    // 任务列表状态
    const tasks = ref<Task[]>([])
    const loading = ref(true)
    const searchQuery = ref('')

    // 删除确认对话框状态
    const showDeleteDialog = ref(false)
    const taskToDelete = ref<string>('')

    // 筛选状态
    const showFilterMenu = ref(false)
    const filterStatus = ref('all')
    const filterPriority = ref('all')

    // 任务对话框状态
    const showTaskDialog = ref(false)
    const isEditMode = ref(false)
    const currentTask = ref<Task>({
      id: '0',
      name: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
      dueTime: '',
      tags: [],
      attachments: [],
      comments: [],
      createdAt: '',
      updatedAt: '',
      estimatedTime: null,
      actualTime: null,
      dependencyIds: [],
      isRecurring: false,
      recurringPattern: null,
      reminderTime: null,
    })


    // 根据搜索查询和筛选条件过滤任务
    const filteredTasks = computed(() => {
      return tasks.value.filter(task => {
        // 搜索过滤
        const matchesSearch =
          searchQuery.value === '' ||
          task.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          task.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))

        // 状态筛选
        const matchesStatus =
          filterStatus.value === 'all' ||
          task.status === filterStatus.value

        // 优先级筛选
        const matchesPriority =
          filterPriority.value === 'all' ||
          task.priority === filterPriority.value

        return matchesSearch && matchesStatus && matchesPriority
      })
    })



    // 加载任务列表
    const loadTasks = async () => {
      loading.value = true
      try {
        tasks.value = await taskService.getTasks()
      } catch (error) {
        console.error('加载任务失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 筛选菜单相关方法
    const toggleFilterMenu = () => {
      showFilterMenu.value = !showFilterMenu.value
    }

    const applyFilter = (status: string, priority: string) => {
      filterStatus.value = status
      filterPriority.value = priority
      showFilterMenu.value = false
    }

    const resetFilter = () => {
      filterStatus.value = 'all'
      filterPriority.value = 'all'
    }

    // 任务对话框相关方法
    const openCreateTaskDialog = () => {
      isEditMode.value = false
      currentTask.value = {
        id: '0',
        name: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        dueTime: '',
        tags: [],
        attachments: [],
        comments: [],
        createdAt: '',
        updatedAt: '',
        estimatedTime: null,
        actualTime: null,
        dependencyIds: [],
        isRecurring: false,
        recurringPattern: null,
        reminderTime: null
      }
      showTaskDialog.value = true
    }

    const openEditTaskDialog = (task: Task) => {
      isEditMode.value = true
      // 深度复制任务对象，确保所有字段都被正确复制
      currentTask.value = {
        ...JSON.parse(JSON.stringify(task)), // 使用JSON序列化确保深度复制
        // 确保attachments被正确复制
        attachments: JSON.parse(JSON.stringify(task.attachments || []))
      }
      showTaskDialog.value = true
    }

    const saveTask = async () => {
      try {
        console.log('保存任务:', currentTask.value)
        if (isEditMode.value) {
          // 更新任务
          await taskService.updateTask(currentTask.value.id, currentTask.value)
        } else {
          // 创建任务
          await taskService.createTask(currentTask.value)
        }

        // 重新加载任务列表
        await loadTasks()
        showTaskDialog.value = false
      } catch (error) {
        console.error('保存任务失败:', error)
      }
    }

    // 打开删除确认对话框
    const openDeleteDialog = (taskId: string) => {
      taskToDelete.value = taskId
      showDeleteDialog.value = true
    }

    // 确认删除任务
    const confirmDeleteTask = async () => {
      try {
        await taskService.deleteTask(taskToDelete.value)
        // 显示删除成功的提示
        toastService.success(t('task.deleteSuccess'), t('common.success'))
        // 关闭删除确认对话框
        showDeleteDialog.value = false
        // 重新加载任务列表
        await loadTasks()
      } catch (error) {
        console.error('删除任务失败:', error)
        // 显示删除失败的提示
        toastService.error(t('task.deleteFailed'), t('common.error'))
      }
    }

    // 兼容原有调用方式的删除任务函数
    const deleteTask = (taskId: string) => {
      openDeleteDialog(taskId)
    }

    // 添加附件
    const addAttachment = () => {
      // 创建一个隐藏的文件输入元素
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.style.display = 'none';
      fileInput.accept = '*/*'; // 接受所有文件类型

      // 监听文件选择事件
      fileInput.addEventListener('change', (event) => {
        const file = (event.target as HTMLInputElement)?.files?.[0];
        if (file) {
          if (!currentTask.value.attachments) {
            currentTask.value.attachments = [];
          }

          // 添加文件到附件列表
          currentTask.value.attachments.push({
            id: Date.now().toString(),
            name: file.name,
            url: '#', // 实际应用中，这里应该是上传后的URL
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
          });

          // 从DOM中移除文件输入元素
          document.body.removeChild(fileInput);
        }
      });

      // 将文件输入元素添加到DOM并触发点击
      document.body.appendChild(fileInput);
      fileInput.click();
    };

    // 删除附件
    const removeAttachment = (index: number) => {
      if (currentTask.value.attachments && currentTask.value.attachments.length > index) {
        currentTask.value.attachments.splice(index, 1)
      }
    }

    // 初始化加载任务
    onMounted(() => {
      loadTasks()
    })

    return {
      tasks,
      loading,
      searchQuery,
      filteredTasks,
      formatDate,
      showFilterMenu,
      filterStatus,
      filterPriority,
      toggleFilterMenu,
      applyFilter,
      resetFilter,
      showTaskDialog,
      isEditMode,
      currentTask,
      openCreateTaskDialog,
      openEditTaskDialog,
      saveTask,
      deleteTask,
      addAttachment,
      removeAttachment,
      mockUsers,
      flatpickrConfig,
      flatpickrTimeConfig,
      // 删除确认对话框相关
      showDeleteDialog,
      taskToDelete,
      openDeleteDialog,
      confirmDeleteTask
    }
  }
})
</script>
