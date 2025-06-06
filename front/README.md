# ToDo 前端应用

基于 Vue 3 + TypeScript + Tailwind CSS 构建的现代化 ToDo 项目管理系统前端应用。

## 🚀 快速开始

### 环境要求
- Node.js 16.0+
- npm 8.0+

### 安装与运行

```bash
# 安装依赖
npm install

# 开发模式启动
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

### 访问应用
- 开发服务器: http://localhost:5173
- 生产预览: http://localhost:4173

## 🛠️ 技术栈

### 核心框架
- **Vue 3.5.13** - 渐进式 JavaScript 框架（Composition API）
- **TypeScript** - 静态类型检查
- **Vite** - 下一代前端构建工具
- **Vue Router 4.5.0** - 官方路由管理器
- **Pinia** - 状态管理库

### UI 与样式
- **Tailwind CSS 4.0.0** - 原子化 CSS 框架
- **vue3-apexcharts** - 图表可视化库
- **自研组件库** - 基于 Tailwind 的高质量组件

### 功能增强
- **FullCalendar** - 日历组件
- **Flatpickr** - 日期选择器
- **Vuedraggable** - 拖拽功能
- **Swiper** - 轮播组件
- **Dropzone** - 文件上传
- **Vue-Kanban** - 看板功能

## 📁 项目结构
```
src/
├── App.vue                 # 应用根组件
├── main.ts                 # 应用入口文件
├── index.d.ts              # 全局类型声明
├── vue.shims.d.ts          # Vue 类型声明
├── assets/                 # 静态资源
│   └── main.css           # 主样式文件（Tailwind CSS）
├── components/             # 可复用组件
│   ├── charts/            # 图表组件
│   │   ├── BarChart/      # 条形图
│   │   └── LineChart/     # 折线图
│   ├── common/            # 通用组件
│   │   ├── ComponentCard.vue
│   │   ├── ThemeToggler.vue
│   │   ├── LanguageSwitcher.vue
│   │   └── ...
│   ├── forms/             # 表单组件
│   │   └── FormElements/  # 表单元素
│   ├── habits/            # 习惯管理组件
│   │   └── HabitDialog.vue
│   ├── layout/            # 布局组件
│   │   ├── AdminLayout.vue    # 管理布局
│   │   ├── AppHeader.vue      # 顶部导航
│   │   ├── AppSidebar.vue     # 侧边栏
│   │   └── ...
│   ├── task/              # 任务管理组件
│   │   └── TaskDialog.vue
│   └── ui/                # UI 基础组件
│       ├── Button.vue
│       ├── Modal.vue
│       ├── Toast.vue
│       └── ...
├── composables/            # 组合式函数
│   ├── useFlatPickr.ts    # 日期选择器
│   ├── useFormatters.ts   # 格式化工具
│   └── useSidebar.ts      # 侧边栏状态
├── i18n/                  # 国际化
│   ├── index.ts           # i18n 配置
│   └── locales/           # 语言包
│       ├── en.ts          # 英文
│       └── zh.ts          # 中文
├── icons/                 # 图标组件
│   ├── index.ts           # 图标导出
│   └── *.vue              # 各种图标组件
├── router/                # 路由配置
│   └── index.ts           # 路由定义
├── services/              # API 服务
│   ├── habitService.ts    # 习惯服务
│   ├── taskService.ts     # 任务服务
│   ├── userService.ts     # 用户服务
│   ├── toastService.ts    # 提示服务
│   └── types/             # 类型定义
│       ├── HabitType.ts
│       ├── TaskType.ts
│       └── ...
├── types/                 # 全局类型
│   └── user.ts
└── views/                 # 页面视图
    ├── Auth/              # 认证页面
    │   ├── SignIn.vue
    │   ├── SignUp.vue
    │   └── ...
    ├── Dashboard.vue      # 仪表盘
    ├── Habits/            # 习惯管理
    │   └── HabitList.vue
    ├── Tasks/             # 任务管理
    │   └── TaskList.vue
    └── ...
```

## 🎨 核心特性

### 主题系统
- 🌙 支持亮色/暗色主题切换
- 🎨 使用 Tailwind CSS 的主题变量
- 💾 主题设置持久化到 localStorage
- 🔄 响应式主题切换动画

### 响应式设计
- 📱 移动端优先的响应式布局
- 🖥️ 支持桌面、平板、移动设备
- 📐 基于 Tailwind CSS 的断点系统
- 🎯 针对不同屏幕尺寸的优化

### 组件化架构
- 🧩 高度模块化的组件设计
- 🔧 可复用的 UI 组件库
- 📦 布局组件与业务组件分离
- 🎭 基于 Composition API 的逻辑复用

### 国际化支持
- 🌍 多语言支持（中文/英文）
- 🔄 动态语言切换
- 📝 类型安全的翻译键
- 🎨 RTL 布局支持（预留）

### 状态管理
- 🗃️ 基于 Pinia 的状态管理
- 🔄 响应式状态更新
- 💾 状态持久化
- 🐛 Vue DevTools 集成

## 🏗️ 架构设计

### 分层架构
```
┌─────────────────┐
│     Views       │  ← 页面视图层
├─────────────────┤
│   Components    │  ← 组件层
├─────────────────┤
│   Composables   │  ← 逻辑复用层
├─────────────────┤
│    Services     │  ← API 服务层
├─────────────────┤
│     Types       │  ← 类型定义层
└─────────────────┘
```

### 设计原则
- **单一职责**: 每个组件/函数只负责一个功能
- **关注点分离**: UI、逻辑、数据分离
- **可复用性**: 组件和逻辑的高度复用
- **可测试性**: 便于单元测试和集成测试
- **类型安全**: 完整的 TypeScript 类型覆盖

## 🔧 开发指南

### 组件开发规范

#### 1. 组件命名
```typescript
// 使用 PascalCase
export default defineComponent({
  name: 'TaskDialog'
})
```

#### 2. 组件结构
```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
// 导入
import { ref, computed } from 'vue'

// 类型定义
interface Props {
  // props 类型
}

interface Emits {
  // events 类型
}

// Props & Emits
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 响应式数据
const data = ref('')

// 计算属性
const computedValue = computed(() => {
  // 计算逻辑
})

// 方法
const handleClick = () => {
  // 事件处理
}
</script>

<style scoped>
/* 组件样式（优先使用 Tailwind 类） */
</style>
```

#### 3. 样式规范
```vue
<!-- 优先使用 Tailwind CSS 类 -->
<div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800">
  <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
    标题
  </h1>
</div>
```

### API 服务开发

#### 1. 服务文件结构
```typescript
// taskService.ts
import type { Task, CreateTaskRequest, UpdateTaskRequest } from './types/TaskType'

export class TaskService {
  private baseUrl = '/api/tasks'

  async getTasks(): Promise<Task[]> {
    // 获取任务列表
  }

  async createTask(request: CreateTaskRequest): Promise<Task> {
    // 创建任务
  }

  async updateTask(id: string, request: UpdateTaskRequest): Promise<Task> {
    // 更新任务
  }

  async deleteTask(id: string): Promise<void> {
    // 删除任务
  }
}

export const taskService = new TaskService()
```

#### 2. 类型定义规范
```typescript
// types/TaskType.ts
export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: TaskPriority
  createdAt: string
  updatedAt: string
}

export interface CreateTaskRequest {
  title: string
  description?: string
  priority?: TaskPriority
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  completed?: boolean
  priority?: TaskPriority
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}
```

### 组合式函数开发

```typescript
// composables/useTask.ts
import { ref, computed } from 'vue'
import { taskService } from '@/services/taskService'
import type { Task } from '@/services/types/TaskType'

export function useTask() {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const completedTasks = computed(() => 
    tasks.value.filter(task => task.completed)
  )

  const pendingTasks = computed(() => 
    tasks.value.filter(task => !task.completed)
  )

  const loadTasks = async () => {
    try {
      loading.value = true
      error.value = null
      tasks.value = await taskService.getTasks()
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  const createTask = async (title: string) => {
    try {
      const newTask = await taskService.createTask({ title })
      tasks.value.push(newTask)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '创建失败'
    }
  }

  return {
    tasks: readonly(tasks),
    loading: readonly(loading),
    error: readonly(error),
    completedTasks,
    pendingTasks,
    loadTasks,
    createTask
  }
}
```

## 🎨 UI 组件库

### 基础组件

#### Button 组件
```vue
<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50',
  {
    // 变体样式
    'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500': 
      props.variant === 'primary',
    'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500': 
      props.variant === 'secondary',
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500': 
      props.variant === 'danger',
  },
  {
    // 尺寸样式
    'h-8 px-3 text-sm': props.size === 'sm',
    'h-10 px-4 text-base': props.size === 'md',
    'h-12 px-6 text-lg': props.size === 'lg',
  }
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>
```

### 使用示例
```vue
<template>
  <div class="space-y-4">
    <!-- 按钮组件 -->
    <Button variant="primary" @click="handleSave">
      保存
    </Button>
    
    <!-- 模态框组件 -->
    <Modal v-model:open="showModal" title="编辑任务">
      <TaskForm @submit="handleSubmit" />
    </Modal>
    
    <!-- 提示组件 -->
    <Toast 
      v-model:show="showToast" 
      :type="toastType" 
      :message="toastMessage" 
    />
  </div>
</template>
```

## 🔄 状态管理

### Pinia Store 示例

```typescript
// stores/taskStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { taskService } from '@/services/taskService'
import type { Task } from '@/services/types/TaskType'

export const useTaskStore = defineStore('task', () => {
  // State
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const completedTasks = computed(() => 
    tasks.value.filter(task => task.completed)
  )
  
  const pendingTasks = computed(() => 
    tasks.value.filter(task => !task.completed)
  )
  
  const taskById = computed(() => 
    (id: string) => tasks.value.find(task => task.id === id)
  )

  // Actions
  const fetchTasks = async () => {
    try {
      loading.value = true
      error.value = null
      tasks.value = await taskService.getTasks()
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取任务失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addTask = async (title: string) => {
    try {
      const newTask = await taskService.createTask({ title })
      tasks.value.push(newTask)
      return newTask
    } catch (err) {
      error.value = err instanceof Error ? err.message : '创建任务失败'
      throw err
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await taskService.updateTask(id, updates)
      const index = tasks.value.findIndex(task => task.id === id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
      return updatedTask
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新任务失败'
      throw err
    }
  }

  const removeTask = async (id: string) => {
    try {
      await taskService.deleteTask(id)
      const index = tasks.value.findIndex(task => task.id === id)
      if (index !== -1) {
        tasks.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除任务失败'
      throw err
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    tasks: readonly(tasks),
    loading: readonly(loading),
    error: readonly(error),
    
    // Getters
    completedTasks,
    pendingTasks,
    taskById,
    
    // Actions
    fetchTasks,
    addTask,
    updateTask,
    removeTask,
    clearError
  }
})
```

## 🚀 构建与部署

### 构建配置

#### Vite 配置 (vite.config.ts)
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'images/[name]-[hash][extname]'
          }
          if (/\.css$/.test(name ?? '')) {
            return 'css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
```

### 部署脚本

```bash
#!/bin/bash
# deploy.sh

echo "开始构建前端应用..."

# 安装依赖
npm ci

# 构建应用
npm run build

# 检查构建是否成功
if [ $? -eq 0 ]; then
    echo "构建成功！"
    echo "构建文件位于 dist/ 目录"
    
    # 可选：部署到服务器
    # rsync -avz dist/ user@server:/var/www/html/
    
else
    echo "构建失败！"
    exit 1
fi
```

## 🧪 测试

### 单元测试配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
```

### 测试示例

```typescript
// src/components/ui/__tests__/Button.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../Button.vue'

describe('Button', () => {
  it('渲染正确的文本', () => {
    const wrapper = mount(Button, {
      slots: {
        default: '点击我'
      }
    })
    
    expect(wrapper.text()).toBe('点击我')
  })

  it('处理点击事件', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Button, {
      props: {
        onClick
      },
      slots: {
        default: '点击我'
      }
    })

    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('禁用状态下不触发点击事件', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Button, {
      props: {
        disabled: true,
        onClick
      },
      slots: {
        default: '点击我'
      }
    })

    await wrapper.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })
})
```

## 📝 常见问题

### Q: 如何添加新的主题色？
A: 在 `tailwind.config.js` 中扩展颜色配置：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        }
      }
    }
  }
}
```

### Q: 如何在组件中使用国际化？
A: 使用 `useI18n` composable：

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <h1>{{ t('common.welcome') }}</h1>
</template>
```

### Q: 如何处理API错误？
A: 在服务层统一处理错误：

```typescript
// services/api.ts
class ApiClient {
  async request<T>(config: RequestConfig): Promise<T> {
    try {
      const response = await fetch(config.url, config)
      
      if (!response.ok) {
        throw new ApiError(response.status, await response.text())
      }
      
      return await response.json()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(0, '网络错误')
    }
  }
}
```

## 🤝 贡献指南

### 开发流程
1. Fork 项目仓库
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交更改: `git commit -m "feat: 添加新功能"`
4. 推送分支: `git push origin feature/new-feature`
5. 创建 Pull Request

### 代码规范
- 遵循 ESLint 和 Prettier 配置
- 使用 TypeScript 严格模式
- 编写单元测试
- 更新相关文档

---

更多信息请参考[项目主文档](../README.md)。

```
/src
├── App.vue              # 应用入口组件
├── assets/              # 静态资源
│   └── main.css         # 主样式文件（包含 Tailwind 配置）
├── components/          # 组件目录
│   ├── charts/          # 图表相关组件
│   ├── common/          # 通用组件
│   ├── ecommerce/       # 电商相关组件
│   ├── forms/           # 表单组件
│   ├── habits/          # 习惯相关组件
│   ├── layout/          # 布局组件
│   ├── profile/         # 用户资料相关组件
│   ├── tables/          # 表格组件
│   └── ui/              # UI 元素组件
├── composables/         # 组合式函数
│   ├── useFlatPickr.ts  # 日期选择器
│   ├── useFormatters.ts # 格式化工具
│   └── useSidebar.ts    # 侧边栏状态管理
├── i18n/                # 国际化
│   ├── index.ts         # 国际化配置
│   └── locales/         # 语言文件
├── icons/               # 图标组件
├── router/              # 路由配置
│   └── index.ts         # 路由定义
├── services/            # 服务
│   ├── habitService.ts  # 习惯服务
│   ├── taskService.ts   # 任务服务
│   ├── toastService.ts  # 提示服务
│   ├── types/           # 类型定义
│   └── userService.ts   # 用户服务
├── views/               # 页面视图
│   ├── Auth/            # 认证相关页面
│   ├── Chart/           # 图表页面
│   ├── Dashboard.vue    # 仪表盘（首页）
│   ├── Errors/          # 错误页面
│   ├── Forms/           # 表单页面
│   ├── Habits/          # 习惯管理页面
│   ├── Others/          # 其他页面
│   ├── Pages/           # 通用页面
│   ├── Tables/          # 表格页面
│   ├── Tasks/           # 任务管理页面
│   ├── UiElements/      # UI 元素展示页面
│   └── templates/       # 模板页面
└── main.ts              # 应用入口文件
```

## 核心架构特点

1. **主题系统**：
   - 实现了亮色/暗色主题切换功能
   - 使用 `ThemeProvider.vue` 管理主题状态
   - 主题设置保存在 localStorage 中

2. **响应式布局**：
   - 使用 Tailwind CSS 的响应式类
   - 针对不同屏幕尺寸优化的界面
   - 移动端友好的侧边栏切换

3. **侧边栏系统**：
   - 可展开/折叠的侧边栏
   - 悬停时自动展开的迷你侧边栏
   - 移动端的侧边栏覆盖模式
   - 使用 `useSidebar` composable 管理状态

4. **路由系统**：
   - 基于 Vue Router 的路由管理
   - 懒加载路由组件提高性能
   - 路由元数据用于页面标题等

5. **组件化设计**：
   - 高度模块化的组件结构
   - 布局组件与内容组件分离
   - 可复用的 UI 组件库

6. **Tailwind CSS 配置**：
   - 使用 Tailwind CSS 4.0
   - 通过 PostCSS 插件集成
   - 自定义主题变量和断点

## 布局结构

项目使用了典型的管理后台布局结构：

1. **App.vue**：应用根组件，包含主题提供者和侧边栏提供者
2. **AdminLayout.vue**：管理后台的主布局组件
   - 包含侧边栏、顶部导航栏和内容区域
   - 响应式布局适配不同屏幕尺寸
3. **AppSidebar.vue**：侧边栏组件，包含导航菜单
4. **AppHeader.vue**：顶部导航栏，包含用户信息、通知等

