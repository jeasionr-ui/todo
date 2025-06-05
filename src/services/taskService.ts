import { mockTasks } from './mockData'
import type Task from '@/services/types/TaskType'

/**
 * 获取所有任务
 * @returns 任务列表
 */
export const getTasks = (): Promise<Task[]> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      resolve(mockTasks)
    }, 300)
  })
}

/**
 * 获取任务详情
 * @param id 任务ID
 * @returns 任务详情
 */
export const getTaskById = (id: string): Promise<Task | null> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      const task = mockTasks.find((task) => task.id === id) || null
      resolve(task)
    }, 200)
  })
}

/**
 * 创建新任务
 * @param task 任务数据（不包含id）
 * @returns 创建的任务
 */
export const createTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      const newTask: Task = {
        ...task,
        id: `${mockTasks.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockTasks.push(newTask)
      resolve(newTask)
    }, 300)
  })
}

/**
 * 更新任务
 * @param id 任务ID
 * @param updates 更新的字段
 * @returns 更新后的任务
 */
export const updateTask = (
  id: string,
  updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<Task | null> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      const index = mockTasks.findIndex((task) => task.id === id)
      if (index === -1) {
        resolve(null)
        return
      }

      const updatedTask: Task = {
        ...mockTasks[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      mockTasks[index] = updatedTask
      resolve(updatedTask)
    }, 300)
  })
}

/**
 * 删除任务
 * @param id 任务ID
 * @returns 操作结果
 */
export const deleteTask = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      const index = mockTasks.findIndex((task) => task.id === id)
      if (index === -1) {
        resolve(false)
        return
      }

      mockTasks.splice(index, 1)
      resolve(true)
    }, 200)
  })
}

/**
 * 批量更新任务状态
 * @param ids 任务ID数组
 * @param status 新状态
 * @returns 操作结果
 */
export const batchUpdateTaskStatus = (ids: string[], status: Task['status']): Promise<boolean> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      ids.forEach((id) => {
        const index = mockTasks.findIndex((task) => task.id === id)
        if (index !== -1) {
          mockTasks[index] = {
            ...mockTasks[index],
            status,
            updatedAt: new Date().toISOString(),
          }
        }
      })
      resolve(true)
    }, 300)
  })
}

/**
 * 批量删除任务
 * @param ids 任务ID数组
 * @returns 操作结果
 */
export const batchDeleteTasks = (ids: string[]): Promise<boolean> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      ids.forEach((id) => {
        const index = mockTasks.findIndex((task) => task.id === id)
        if (index !== -1) {
          mockTasks.splice(index, 1)
        }
      })
      resolve(true)
    }, 300)
  })
}

// 导出任务服务
export const taskService = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  batchUpdateTaskStatus,
  batchDeleteTasks,
}
