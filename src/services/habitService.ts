import { mockHabits } from './mockData'
import type Habit from '@/services/types/HabitType'

/**
 * 获取所有习惯
 * @returns 习惯列表
 */
export const getHabits = (): Promise<Habit[]> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      resolve(mockHabits)
    }, 300)
  })
}





/**
 * 获取习惯详情
 * @param id 习惯ID
 * @returns 习惯详情
 */
export const getHabitById = (id: string): Promise<Habit | null> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      const habit = mockHabits.find((habit) => habit.id === id) || null
      resolve(habit)
    }, 200)
  })
}

/**
 * 创建新习惯
 * @param habit 习惯数据（不包含id）
 * @returns 创建的习惯
 */
export const createHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'streakCount' | 'longestStreak' | 'totalCompletions' | 'completionHistory' | 'lastCompletedAt'>): Promise<Habit> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      const newHabit: Habit = {
        ...habit,
        id: `${mockHabits.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        streakCount: 0,
        longestStreak: 0,
        totalCompletions: 0,
        completionHistory: [],
        lastCompletedAt: null
      }
      mockHabits.push(newHabit)
      resolve(newHabit)
    }, 300)
  })
}

/**
 * 更新习惯
 * @param id 习惯ID
 * @param updates 更新的字段
 * @returns 更新后的习惯
 */
export const updateHabit = (
  id: string,
  updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<Habit | null> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      const index = mockHabits.findIndex((habit) => habit.id === id)
      if (index === -1) {
        resolve(null)
        return
      }

      const updatedHabit: Habit = {
        ...mockHabits[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      mockHabits[index] = updatedHabit
      resolve(updatedHabit)
    }, 300)
  })
}

/**
 * 删除习惯
 * @param id 习惯ID
 * @returns 操作结果
 */
export const deleteHabit = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      const index = mockHabits.findIndex((habit) => habit.id === id)
      if (index === -1) {
        resolve(false)
        return
      }

      mockHabits.splice(index, 1)
      resolve(true)
    }, 200)
  })
}

/**
 * 完成习惯打卡
 * @param id 习惯ID
 * @param date 打卡日期
 * @param note 打卡备注
 * @returns 更新后的习惯
 */
export const completeHabit = (
  id: string,
  date: string,
  note: string | null = null,
): Promise<Habit | null> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      const index = mockHabits.findIndex((habit) => habit.id === id)
      if (index === -1) {
        resolve(null)
        return
      }

      const habit = { ...mockHabits[index] }
      
      // 检查是否已经完成过
      const existingCompletion = habit.completionHistory.find(c => c.date === date)
      if (existingCompletion) {
        // 已经完成过，更新备注
        existingCompletion.note = note
      } else {
        // 新增完成记录
        habit.completionHistory.push({
          date,
          isCompleted: true,
          note
        })
        
        // 更新统计数据
        habit.totalCompletions += 1
        habit.lastCompletedAt = new Date().toISOString()
        
        // 计算连续完成次数
        // 这里简化处理，实际应用中需要根据习惯的频率类型计算
        habit.streakCount += 1
        if (habit.streakCount > habit.longestStreak) {
          habit.longestStreak = habit.streakCount
        }
      }
      
      habit.updatedAt = new Date().toISOString()
      mockHabits[index] = habit
      resolve(habit)
    }, 300)
  })
}

/**
 * 取消习惯打卡
 * @param id 习惯ID
 * @param date 打卡日期
 * @returns 更新后的习惯
 */
export const uncompleteHabit = (
  id: string,
  date: string,
): Promise<Habit | null> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      const index = mockHabits.findIndex((habit) => habit.id === id)
      if (index === -1) {
        resolve(null)
        return
      }

      const habit = { ...mockHabits[index] }
      
      // 查找并移除完成记录
      const completionIndex = habit.completionHistory.findIndex(c => c.date === date)
      if (completionIndex !== -1) {
        habit.completionHistory.splice(completionIndex, 1)
        
        // 更新统计数据
        habit.totalCompletions = Math.max(0, habit.totalCompletions - 1)
        
        // 重新计算最后完成时间
        if (habit.completionHistory.length > 0) {
          const lastCompletion = habit.completionHistory.reduce((latest, current) => {
            return new Date(latest.date) > new Date(current.date) ? latest : current
          })
          habit.lastCompletedAt = new Date(`${lastCompletion.date}T23:59:59`).toISOString()
        } else {
          habit.lastCompletedAt = null
        }
        
        // 重新计算连续完成次数
        // 这里简化处理，实际应用中需要根据习惯的频率类型计算
        habit.streakCount = Math.max(0, habit.streakCount - 1)
      }
      
      habit.updatedAt = new Date().toISOString()
      mockHabits[index] = habit
      resolve(habit)
    }, 300)
  })
}

/**
 * 获取习惯统计数据
 * @param id 习惯ID
 * @returns 习惯统计数据
 */
export const getHabitStats = (id: string): Promise<{
  totalDays: number
  completedDays: number
  completionRate: number
  currentStreak: number
  longestStreak: number
} | null> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      const habit = mockHabits.find((habit) => habit.id === id)
      if (!habit) {
        resolve(null)
        return
      }

      const startDate = new Date(habit.startDate)
      const today = new Date()
      const totalDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
      const completedDays = habit.totalCompletions
      const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0

      resolve({
        totalDays,
        completedDays,
        completionRate,
        currentStreak: habit.streakCount,
        longestStreak: habit.longestStreak
      })
    }, 200)
  })
}

/**
 * 归档习惯
 * @param id 习惯ID
 * @returns 操作结果
 */
export const archiveHabit = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      const index = mockHabits.findIndex((habit) => habit.id === id)
      if (index === -1) {
        resolve(false)
        return
      }

      mockHabits[index] = {
        ...mockHabits[index],
        isArchived: true,
        updatedAt: new Date().toISOString()
      }
      resolve(true)
    }, 200)
  })
}

/**
 * 取消归档习惯
 * @param id 习惯ID
 * @returns 操作结果
 */
export const unarchiveHabit = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      const index = mockHabits.findIndex((habit) => habit.id === id)
      if (index === -1) {
        resolve(false)
        return
      }

      mockHabits[index] = {
        ...mockHabits[index],
        isArchived: false,
        updatedAt: new Date().toISOString()
      }
      resolve(true)
    }, 200)
  })
}

// 导出习惯服务
export const habitService = {
  getHabits,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
  uncompleteHabit,
  getHabitStats,
  archiveHabit,
  unarchiveHabit
}