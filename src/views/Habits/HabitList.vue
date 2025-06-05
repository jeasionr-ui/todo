<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('habits.title')" />
    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <!-- 习惯列表头部 -->
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4">

        <h3 class="text-2xl font-semibold mb-4 md:mb-0">
          {{ $t('habits.all') }}
        </h3>
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- 搜索框 -->
          <div class="relative">
            <input type="text" :placeholder="$t('common.search')" v-model="searchQuery"
              class="w-full sm:w-64 h-10 px-4 py-2 border border-stroke rounded-md focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark" />
            <span class="absolute right-4 top-3">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M8.25 3C5.3505 3 3 5.3505 3 8.25C3 11.1495 5.3505 13.5 8.25 13.5C11.1495 13.5 13.5 11.1495 13.5 8.25C13.5 5.3505 11.1495 3 8.25 3ZM1.5 8.25C1.5 4.52208 4.52208 1.5 8.25 1.5C11.9779 1.5 15 4.52208 15 8.25C15 11.9779 11.9779 15 8.25 15C4.52208 15 1.5 11.9779 1.5 8.25Z"
                  fill="#637381" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M11.9572 11.9572C12.2501 11.6643 12.7249 11.6643 13.0178 11.9572L16.2803 15.2197C16.5732 15.5126 16.5732 15.9874 16.2803 16.2803C15.9874 16.5732 15.5126 16.5732 15.2197 16.2803L11.9572 13.0178C11.6643 12.7249 11.6643 12.2501 11.9572 11.9572Z"
                  fill="#637381" />
              </svg>
            </span>
          </div>

          <!-- 筛选按钮 -->
          <div class="relative">
            <button @click="toggleFilterMenu"
              class="filter-button flex items-center justify-center gap-2 h-10 px-4 py-2 border border-stroke rounded-md hover:bg-gray-100 focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:hover:bg-meta-4">
              <span>{{ $t('common.filter') }}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.4 6.4H3.6C3.264 6.4 3 6.136 3 5.8C3 5.464 3.264 5.2 3.6 5.2H12.4C12.736 5.2 13 5.464 13 5.8C13 6.136 12.736 6.4 12.4 6.4Z"
                  fill="#637381" />
                <path
                  d="M10.4 10.4H5.6C5.264 10.4 5 10.136 5 9.8C5 9.464 5.264 9.2 5.6 9.2H10.4C10.736 9.2 11 9.464 11 9.8C11 10.136 10.736 10.4 10.4 10.4Z"
                  fill="#637381" />
              </svg>
            </button>

            <!-- 筛选菜单 -->
            <div v-if="showFilterMenu"
              class="filter-menu absolute right-0 top-full mt-2 w-60 rounded-md border border-stroke bg-white p-4 shadow-md dark:border-strokedark dark:bg-boxdark z-50">
              <h3 class="mb-2 font-medium">{{ $t('habits.filter.title') }}</h3>

              <!-- 分类筛选 -->
              <div class="mb-4">
                <label class="mb-2 block text-sm">{{ $t('habits.filter.category') }}</label>
                <select v-model="filterCategory"
                  class="w-full rounded-md border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark">
                  <option value="">{{ $t('habits.filter.all_categories') }}</option>
                  <option value="health">{{ $t('habits.categories.health') }}</option>
                  <option value="fitness">{{ $t('habits.categories.fitness') }}</option>
                  <option value="study">{{ $t('habits.categories.study') }}</option>
                  <option value="work">{{ $t('habits.categories.work') }}</option>
                  <option value="lifestyle">{{ $t('habits.categories.lifestyle') }}</option>
                  <option value="hobby">{{ $t('habits.categories.hobby') }}</option>
                  <option value="social">{{ $t('habits.categories.social') }}</option>
                  <option value="personal">{{ $t('habits.categories.personal') }}</option>
                  <option value="finance">{{ $t('habits.categories.finance') }}</option>
                  <option value="mindfulness">{{ $t('habits.categories.mindfulness') }}</option>
                  <option value="creativity">{{ $t('habits.categories.creativity') }}</option>
                  <option value="other">{{ $t('habits.categories.other') }}</option>
                </select>
              </div>

              <!-- 频率筛选 -->
              <div class="mb-4">
                <label class="mb-2 block text-sm">{{ $t('habits.filter.frequency') }}</label>
                <select v-model="filterFrequency"
                  class="w-full rounded-md border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark">
                  <option value="">{{ $t('habits.filter.all_frequencies') }}</option>
                  <option value="daily">{{ $t('habits.frequency.daily') }}</option>
                  <option value="weekly">{{ $t('habits.frequency.weekly') }}</option>
                  <option value="monthly">{{ $t('habits.frequency.monthly') }}</option>
                  <option value="custom">{{ $t('habits.frequency.custom') }}</option>
                </select>
              </div>

              <!-- 显示归档习惯 -->
              <div class="mb-4">
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="showArchived"
                    class="h-4 w-4 rounded-sm border-stroke bg-transparent accent-primary" />
                  <span class="text-sm">{{ $t('habits.filter.show_archived') }}</span>
                </label>
              </div>

              <!-- 筛选操作按钮 -->
              <div class="flex justify-end gap-2">
                <button @click="resetFilter"
                  class="flex items-center justify-center rounded-md border border-stroke py-1 px-3 text-sm hover:bg-gray-100 dark:border-strokedark dark:hover:bg-meta-4">
                  {{ $t('common.reset') }}
                </button>
                <button @click="applyFilter"
                  class="flex items-center justify-center rounded-md bg-primary py-1 px-3 text-sm text-white hover:bg-opacity-90">
                  {{ $t('common.apply') }}
                </button>
              </div>
            </div>
          </div>

          <!-- 创建习惯按钮 -->
          <button @click="openCreateHabitDialog"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:ring-0 dark:bg-brand-500 dark:hover:bg-brand-600">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3.33331V12.6666" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M3.33301 8H12.6663" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            <span>{{ $t('habits.create') }}</span>
          </button>
        </div>
      </div>

      <!-- 习惯列表 -->
      <div class=" bg-white dark:bg-boxdark px-5 py-6 ">
        <div v-if="loading" class="flex justify-center items-center py-10">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
        <div v-else-if="filteredHabits.length === 0" class="flex flex-col items-center justify-center py-10">
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

          <p class="text-lg text-gray-500 dark:text-gray-400 mb-4">
            {{ $t('habits.empty.title') }}
          </p>
          <p class="text-sm text-gray-400 dark:text-gray-500 mb-6 text-center max-w-md">
            {{ $t('habits.empty.description') }}
          </p>
          <button @click="openCreateHabitDialog"
            class="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 focus-visible:outline-none">
            <span>{{ $t('habits.empty.create_first') }}</span>
          </button>
        </div>
        <div v-else>
          <!-- 习惯卡片列表 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="habit in filteredHabits" :key="habit.id"
              class="rounded-md border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-meta-4 relative"
              :class="{ 'opacity-70': habit.isArchived }">
              <!-- 归档标记 -->
              <div v-if="habit.isArchived"
                class="absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded-full">
                {{ $t('habits.archived') }}
              </div>

              <!-- 习惯图标和颜色 -->
              <div class="flex items-start mb-3">
                <div class="flex items-center justify-center w-10 h-10 rounded-full mr-3"
                  :style="{ backgroundColor: habit.color + '33' }">
                  <span :style="{ color: habit.color }" class="text-lg">
                    {{ habit.icon }}
                  </span>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold truncate" :title="habit.name">
                    {{ habit.name }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ $t(`habits.categories.${habit.category}`) }} · {{ $t(`habits.frequency.${habit.frequency.type}`)
                    }}
                  </p>
                </div>
              </div>

              <!-- 习惯描述 -->
              <p v-if="habit.description" class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {{ habit.description }}
              </p>

              <!-- 习惯标签 -->
              <div v-if="habit.tags && habit.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
                <span v-for="tag in habit.tags" :key="tag"
                  class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  {{ tag }}
                </span>
              </div>

              <!-- 习惯统计 -->
              <div class="flex items-center justify-between mb-3">
                <div class="text-sm">
                  <span class="font-semibold">{{ habit.streakCount }}</span>
                  <span class="text-gray-500 dark:text-gray-400"> {{ $t('habits.stats.current_streak') }}</span>
                </div>
                <div class="text-sm">
                  <span class="font-semibold">{{ habit.totalCompletions }}</span>
                  <span class="text-gray-500 dark:text-gray-400"> {{ $t('habits.stats.total') }}</span>
                </div>
              </div>

              <!-- 最近7天完成情况 -->
              <div class="flex items-center justify-between mb-4">
                <div v-for="i in 7" :key="i" class="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  :class="{
                    'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300': isCompletedOnDay(habit, i),
                    'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500': !isCompletedOnDay(habit, i)
                  }">
                  {{ getDayLabel(i) }}
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex justify-between items-center">
                <!-- 打卡按钮 -->
                <button @click="toggleHabitCompletion(habit)"
                  class="flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-sm" :class="{
                    'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300': isCompletedToday(habit),
                    'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300': !isCompletedToday(habit)
                  }">
                  <svg v-if="isCompletedToday(habit)" width="16" height="16" viewBox="0 0 16 16" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span>{{ isCompletedToday(habit) ? $t('habits.completed') : $t('habits.complete') }}</span>
                </button>

                <!-- 更多操作按钮 -->
                <div class="relative">
                  <button @click="toggleHabitMenu(habit.id)"
                    class="habit-menu-button flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M9.00033 9.83268C9.46066 9.83268 9.83366 9.45968 9.83366 8.99935C9.83366 8.53901 9.46066 8.16602 9.00033 8.16602C8.53999 8.16602 8.16699 8.53901 8.16699 8.99935C8.16699 9.45968 8.53999 9.83268 9.00033 9.83268Z"
                        stroke="#637381" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path
                        d="M9.00033 4.83268C9.46066 4.83268 9.83366 4.45968 9.83366 3.99935C9.83366 3.53901 9.46066 3.16602 9.00033 3.16602C8.53999 3.16602 8.16699 3.53901 8.16699 3.99935C8.16699 4.45968 8.53999 4.83268 9.00033 4.83268Z"
                        stroke="#637381" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path
                        d="M9.00033 14.8327C9.46066 14.8327 9.83366 14.4597 9.83366 13.9993C9.83366 13.539 9.46066 13.166 9.00033 13.166C8.53999 13.166 8.16699 13.539 8.16699 13.9993C8.16699 14.4597 8.53999 14.8327 9.00033 14.8327Z"
                        stroke="#637381" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>

                  <!-- 习惯操作菜单 -->
                  <div v-if="activeHabitMenu === habit.id"
                    class="habit-menu absolute right-0 top-full mt-1 w-40 rounded-md border border-stroke bg-white p-2 shadow-md dark:border-strokedark dark:bg-boxdark z-50">
                    <ul class="flex flex-col gap-1">
                      <li>
                        <button @click="openEditHabitDialog(habit)"
                          class="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-meta-4">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M13.3334 8.00004V12.6667C13.3334 13.0203 13.1929 13.3595 12.9429 13.6095C12.6928 13.8595 12.3537 14 12.0001 14H3.33341C2.97979 14 2.64067 13.8595 2.39063 13.6095C2.14058 13.3595 2.00008 13.0203 2.00008 12.6667V4.00004C2.00008 3.64642 2.14058 3.3073 2.39063 3.05725C2.64067 2.80721 2.97979 2.66671 3.33341 2.66671H8.00008"
                              stroke="#637381" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M11.3333 2.00004L14.0001 4.66671L8.00008 10.6667H5.33341V8.00004L11.3333 2.00004Z"
                              stroke="#637381" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          <span>{{ $t('habits.edit') }}</span>
                        </button>
                      </li>
                      <li>
                        <button @click="viewHabitDetails(habit)"
                          class="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-meta-4">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M8.00008 3.33329C3.33341 3.33329 1.33341 7.99996 1.33341 7.99996C1.33341 7.99996 3.33341 12.6666 8.00008 12.6666C12.6667 12.6666 14.6667 7.99996 14.6667 7.99996C14.6667 7.99996 12.6667 3.33329 8.00008 3.33329Z"
                              stroke="#637381" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                              d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                              stroke="#637381" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          <span>{{ $t('habits.view') }}</span>
                        </button>
                      </li>
                      <li>
                        <button @click="toggleArchiveStatus(habit)"
                          class="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-meta-4">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 5.33337V14H2V5.33337" stroke="#637381" stroke-width="1.5"
                              stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M5.33301 5.33337V2.00004H10.6663V5.33337" stroke="#637381" stroke-width="1.5"
                              stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M6.66699 8.66663H9.33366" stroke="#637381" stroke-width="1.5"
                              stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          <span>{{ habit.isArchived ? $t('habits.unarchive') : $t('habits.archive') }}</span>
                        </button>
                      </li>
                      <li>
                        <button @click="openDeleteDialog(habit)"
                          class="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-danger hover:bg-gray-100 dark:hover:bg-meta-4">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 4H3.33333H14" stroke="#DC3545" stroke-width="1.5" stroke-linecap="round"
                              stroke-linejoin="round" />
                            <path
                              d="M5.33301 4.00004V2.66671C5.33301 2.31309 5.47348 1.97395 5.72353 1.7239C5.97358 1.47385 6.3127 1.33337 6.66634 1.33337H9.33301C9.68663 1.33337 10.0258 1.47385 10.2758 1.7239C10.5259 1.97395 10.6663 2.31309 10.6663 2.66671V4.00004M12.6663 4.00004V13.3334C12.6663 13.687 12.5259 14.0261 12.2758 14.2762C12.0258 14.5262 11.6866 14.6667 11.333 14.6667H4.66634C4.31272 14.6667 3.9736 14.5262 3.72355 14.2762C3.4735 14.0261 3.33301 13.687 3.33301 13.3334V4.00004H12.6663Z"
                              stroke="#DC3545" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M6.66699 7.33337V11.3334" stroke="#DC3545" stroke-width="1.5"
                              stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M9.33301 7.33337V11.3334" stroke="#DC3545" stroke-width="1.5"
                              stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          <span>{{ $t('habits.delete') }}</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 习惯对话框 -->
      <HabitDialog v-if="showHabitDialog" :is-edit-mode="isEditMode" :habit="currentHabit"
        @close="showHabitDialog = false" @save="saveHabit" @edit="switchToEditMode" />

      <!-- 删除确认对话框 -->
      <div v-if="showDeleteDialog" class="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-40">
        <div class="w-full max-w-md rounded-md bg-white p-6 shadow-md dark:bg-boxdark md:p-8">
          <h3 class="mb-4 text-xl font-semibold text-black dark:text-white">
            {{ $t('habits.delete_confirm.title') }}
          </h3>
          <p class="mb-6 text-gray-600 dark:text-gray-400">
            {{ $t('habits.delete_confirm.message', { name: habitToDelete?.name }) }}
          </p>
          <div class="flex justify-end gap-3">
            <button @click="showDeleteDialog = false"
              class="flex items-center justify-center gap-2 rounded-md border border-stroke py-2 px-6 hover:bg-gray-100 dark:border-strokedark dark:hover:bg-meta-4">
              {{ $t('common.cancel') }}
            </button>
            <button @click="confirmDeleteHabit"
              class="flex items-center justify-center gap-2 rounded-md bg-danger py-2 px-6 text-white hover:bg-opacity-90">
              {{ $t('common.delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import HabitDialog from '@/components/habits/HabitDialog.vue'


import { toastService } from '@/services/toastService'
import { habitService } from '@/services/habitService'
import type Habit from '@/services/types/HabitType'


const { t } = useI18n()

// 习惯列表状态
const habits = ref<Habit[]>([])
const loading = ref(true)
const searchQuery = ref('')

// 删除确认对话框状态
const showDeleteDialog = ref(false)
const habitToDelete = ref<Habit | null>(null)

// 筛选状态
const showFilterMenu = ref(false)
const filterCategory = ref('')
const filterFrequency = ref('')
const showArchived = ref(false)

// 习惯操作菜单状态
const activeHabitMenu = ref<string | null>(null)

// 习惯对话框状态
const showHabitDialog = ref(false)
const isEditMode = ref(false)
const currentHabit = ref<Partial<Habit>>({})

// 根据搜索查询和筛选条件过滤习惯
const filteredHabits = computed(() => {
  return habits.value
    .filter(habit => {
      // 搜索过滤
      const matchesSearch = habit.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (habit.description && habit.description.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
        (habit.tags && habit.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase())))

      // 分类过滤
      const matchesCategory = !filterCategory.value || habit.category === filterCategory.value

      // 频率过滤
      const matchesFrequency = !filterFrequency.value || habit.frequency.type === filterFrequency.value

      // 归档状态过滤
      const matchesArchived = showArchived.value || !habit.isArchived

      return matchesSearch && matchesCategory && matchesFrequency && matchesArchived
    })
})

/**
 * 加载习惯列表
 */
const loadHabits = async () => {
  loading.value = true
  try {
    habits.value = await habitService.getHabits()
  } catch (error) {
    console.error('Failed to load habits:', error)
    toastService.error(t('habits.load_error'))
  } finally {
    loading.value = false
  }
}

/**
 * 切换筛选菜单显示状态
 */
const toggleFilterMenu = () => {
  showFilterMenu.value = !showFilterMenu.value
  // 点击筛选按钮时关闭习惯操作菜单
  activeHabitMenu.value = null
}

/**
 * 应用筛选条件
 */
const applyFilter = () => {
  showFilterMenu.value = false
}

/**
 * 重置筛选条件
 */
const resetFilter = () => {
  filterCategory.value = ''
  filterFrequency.value = ''
  showArchived.value = false
  showFilterMenu.value = false
}

/**
 * 切换习惯操作菜单显示状态
 * @param habitId 习惯ID
 */
const toggleHabitMenu = (habitId: string) => {
  if (activeHabitMenu.value === habitId) {
    activeHabitMenu.value = null
  } else {
    activeHabitMenu.value = habitId
    // 点击习惯操作菜单时关闭筛选菜单
    showFilterMenu.value = false
  }
}

/**
 * 打开创建习惯对话框
 */
const openCreateHabitDialog = () => {
  isEditMode.value = false
  currentHabit.value = {
    name: '',
    description: '',
    category: 'other',
    tags: [],
    frequency: {
      type: 'daily',
    },
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
    reminderTime: null,
    reminderType: null,
    reminderLocation: '',
    color: '#4F46E5',
    icon: '📦',
    cronExpression: '0 0 * * *',
    isArchived: false
  }
  showHabitDialog.value = true
  // 关闭所有菜单
  activeHabitMenu.value = null
  showFilterMenu.value = false
}

/**
 * 打开编辑习惯对话框
 * @param habit 要编辑的习惯
 */
const openEditHabitDialog = (habit: Habit) => {
  isEditMode.value = true
  // 深度复制习惯对象以进行编辑
  currentHabit.value = JSON.parse(JSON.stringify(habit))
  showHabitDialog.value = true
  // 关闭习惯操作菜单
  activeHabitMenu.value = null
}

/**
 * 查看习惯详情
 * @param habit 要查看的习惯
 */
const viewHabitDetails = (habit: Habit) => {
  // 使用对话框查看习惯详情
  isEditMode.value = false // 设为非编辑模式但显示详情
  currentHabit.value = JSON.parse(JSON.stringify(habit))
  showHabitDialog.value = true
  // 关闭习惯操作菜单
  activeHabitMenu.value = null
}

/**
 * 保存习惯（创建或更新）
 * @param habit 习惯数据
 */
const saveHabit = async (habit: Partial<Habit>) => {
  try {
    if (isEditMode.value && currentHabit.value.id) {
      // 更新习惯
      await habitService.updateHabit(currentHabit.value.id, habit)
      toastService.success(t('habits.update_success'))
    } else {
      // 创建习惯
      await habitService.createHabit(habit as Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'streakCount' | 'longestStreak' | 'totalCompletions' | 'completionHistory' | 'lastCompletedAt'>)
      toastService.success(t('habits.create_success'))
    }
    // 重新加载习惯列表
    await loadHabits()
    // 关闭对话框
    showHabitDialog.value = false
  } catch (error) {
    console.error('Failed to save habit:', error)
    toastService.error(isEditMode.value ? t('habits.update_error') : t('habits.create_error'))
  }
}

/**
 * 从查看模式切换到编辑模式
 * @param habit 要编辑的习惯
 */
const switchToEditMode = (habit: Habit) => {
  isEditMode.value = true
  // 确保我们有一个干净的拷贝
  currentHabit.value = JSON.parse(JSON.stringify(habit))
}

/**
 * 打开删除确认对话框
 * @param habit 要删除的习惯
 */
const openDeleteDialog = (habit: Habit) => {
  habitToDelete.value = habit
  showDeleteDialog.value = true
  // 关闭习惯操作菜单
  activeHabitMenu.value = null
}

/**
 * 确认删除习惯
 */
const confirmDeleteHabit = async () => {
  if (!habitToDelete.value) return

  try {
    const success = await habitService.deleteHabit(habitToDelete.value.id)
    if (success) {
      toastService.success(t('habits.delete_success'))
      // 重新加载习惯列表
      await loadHabits()
    } else {
      toastService.error(t('habits.delete_error'))
    }
  } catch (error) {
    console.error('Failed to delete habit:', error)
    toastService.error(t('habits.delete_error'))
  } finally {
    // 关闭删除确认对话框
    showDeleteDialog.value = false
    habitToDelete.value = null
  }
}

/**
 * 切换习惯归档状态
 * @param habit 要操作的习惯
 */
const toggleArchiveStatus = async (habit: Habit) => {
  try {
    let success
    if (habit.isArchived) {
      success = await habitService.unarchiveHabit(habit.id)
      if (success) toastService.success(t('habits.unarchive_success'))
    } else {
      success = await habitService.archiveHabit(habit.id)
      if (success) toastService.success(t('habits.archive_success'))
    }

    if (!success) {
      toastService.error(habit.isArchived ? t('habits.unarchive_error') : t('habits.archive_error'))
    } else {
      // 重新加载习惯列表
      await loadHabits()
    }
  } catch (error) {
    console.error('Failed to toggle archive status:', error)
    toastService.error(habit.isArchived ? t('habits.unarchive_error') : t('habits.archive_error'))
  } finally {
    // 关闭习惯操作菜单
    activeHabitMenu.value = null
  }
}

/**
 * 切换习惯完成状态（打卡/取消打卡）
 * @param habit 要操作的习惯
 */
const toggleHabitCompletion = async (habit: Habit) => {
  const today = new Date().toISOString().split('T')[0]
  try {
    if (isCompletedToday(habit)) {
      // 取消今日打卡
      await habitService.uncompleteHabit(habit.id, today)
      toastService.success(t('habits.uncheck_success'))
    } else {
      // 完成今日打卡
      await habitService.completeHabit(habit.id, today)
      toastService.success(t('habits.check_success'))
    }
    // 重新加载习惯列表
    await loadHabits()
  } catch (error) {
    console.error('Failed to toggle habit completion:', error)
    toastService.error(isCompletedToday(habit) ? t('habits.uncheck_error') : t('habits.check_error'))
  }
}

/**
 * 检查习惯是否在今天完成
 * @param habit 习惯
 * @returns 是否今天完成
 */
const isCompletedToday = (habit: Habit): boolean => {
  const today = new Date().toISOString().split('T')[0]
  return habit.completionHistory.some(completion => completion.date === today && completion.isCompleted)
}

/**
 * 检查习惯是否在指定天数前完成
 * @param habit 习惯
 * @param daysAgo 天数（1表示昨天，2表示前天，以此类推）
 * @returns 是否在指定天数前完成
 */
const isCompletedOnDay = (habit: Habit, daysAgo: number): boolean => {
  const date = new Date()
  date.setDate(date.getDate() - (7 - daysAgo))
  const dateString = date.toISOString().split('T')[0]
  return habit.completionHistory.some(completion => completion.date === dateString && completion.isCompleted)
}

/**
 * 获取指定天数的标签（周一到周日的首字母）
 * @param dayIndex 天数索引（1-7）
 * @returns 周几的首字母
 */
const getDayLabel = (dayIndex: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - (7 - dayIndex))
  const dayNames = ['日', '一', '二', '三', '四', '五', '六']
  return dayNames[date.getDay()]
}

// 组件挂载时加载习惯列表
onMounted(() => {
  loadHabits()

  // 点击页面其他区域时关闭菜单
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    // 如果点击的不是筛选按钮或筛选菜单内的元素，则关闭筛选菜单
    if (showFilterMenu.value && !target.closest('.filter-menu') && !target.closest('.filter-button')) {
      showFilterMenu.value = false
    }
    // 如果点击的不是习惯操作按钮或习惯操作菜单内的元素，则关闭习惯操作菜单
    if (activeHabitMenu.value && !target.closest('.habit-menu') && !target.closest('.habit-menu-button')) {
      activeHabitMenu.value = null
    }
  })
})
</script>