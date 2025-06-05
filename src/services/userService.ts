
import { mockUsers } from './mockData'
import type User from '@/services/types/UserType'

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 用户服务
export const userService = {
  // 登录
  async login(email: string, password: string): Promise<User | null> {
    await delay(800) // 模拟网络延迟
    
    const user = mockUsers.find(u => u.email === email && u.password === password)
    
    if (user) {
      // 更新登录历史
      const loginRecord = {
        id: `h${Date.now()}`,
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
        device: 'Web Browser',
        browser: 'Chrome',
        location: '未知位置',
        time: new Date().toISOString(),
        status: 'success' as const
      }
      
      user.loginHistory.unshift(loginRecord)
      user.lastLogin = loginRecord.time
      
      // 存储用户信息到本地存储（实际应用中应该使用更安全的方式，如JWT）
      const { password: _, ...userWithoutPassword } = user
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      
      return userWithoutPassword as User
    }
    
    return null
  },
  
  // 注册
  async register(userData: Partial<User>): Promise<User | null> {
    await delay(1000) // 模拟网络延迟
    
    // 检查邮箱是否已存在
    const existingUser = mockUsers.find(u => u.email === userData.email)
    if (existingUser) {
      return null
    }
    
    // 创建新用户
    const newUser: User = {
      id: `${mockUsers.length + 1}`,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      password: userData.password || '',
      avatar: '/images/user/default-avatar.jpg',
      bio: '',
      phone: userData.phone || '',
      country: '',
      city: '',
      state: '',
      postalCode: '',
      taxId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      twoFactorEnabled: false,
      role: 'user',
      status: 'active',
      socialAccounts: {},
      loginHistory: [
        {
          id: `h${Date.now()}`,
          ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
          device: 'Web Browser',
          browser: 'Chrome',
          location: '未知位置',
          time: new Date().toISOString(),
          status: 'success'
        }
      ]
    }
    
    mockUsers.push(newUser)
    
    // 存储用户信息到本地存储（实际应用中应该使用更安全的方式，如JWT）
    const { password: _, ...userWithoutPassword } = newUser
    localStorage.setItem('user', JSON.stringify(userWithoutPassword))
    
    return userWithoutPassword as User
  },
  
  // 登出
  async logout(): Promise<void> {
    await delay(300) // 模拟网络延迟
    localStorage.removeItem('user')
  },
  
  // 获取当前用户
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user')
    if (userJson) {
      return JSON.parse(userJson)
    } else if (import.meta.env.DEV) {
      // 只在开发环境中自动返回模拟用户
      if (mockUsers.length > 0) {
        const { password: _, ...userWithoutPassword } = mockUsers[0]
        return userWithoutPassword as User
      }
    }
    return null
  },
  
  // 更新用户资料
  async updateProfile(userId: string, userData: Partial<User>): Promise<User | null> {
    await delay(800) // 模拟网络延迟
    
    const userIndex = mockUsers.findIndex(u => u.id === userId)
    if (userIndex === -1) return null
    
    // 更新用户数据
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData,
      updatedAt: new Date().toISOString()
    }
    
    // 更新本地存储
    const { password: _, ...userWithoutPassword } = mockUsers[userIndex]
    localStorage.setItem('user', JSON.stringify(userWithoutPassword))
    
    return userWithoutPassword as User
  },
  
  // 更改密码
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    await delay(800) // 模拟网络延迟
    
    const userIndex = mockUsers.findIndex(u => u.id === userId && u.password === currentPassword)
    if (userIndex === -1) return false
    
    // 更新密码
    mockUsers[userIndex].password = newPassword
    mockUsers[userIndex].updatedAt = new Date().toISOString()
    
    return true
  },
  
  // 启用/禁用两步验证
  async toggleTwoFactor(userId: string, enable: boolean): Promise<boolean> {
    await delay(500) // 模拟网络延迟
    
    const userIndex = mockUsers.findIndex(u => u.id === userId)
    if (userIndex === -1) return false
    
    // 更新两步验证状态
    mockUsers[userIndex].twoFactorEnabled = enable
    mockUsers[userIndex].updatedAt = new Date().toISOString()
    
    // 更新本地存储
    const { password: _, ...userWithoutPassword } = mockUsers[userIndex]
    localStorage.setItem('user', JSON.stringify(userWithoutPassword))
    
    return true
  },
  
  // 获取用户登录历史
  async getLoginHistory(userId: string) {
    await delay(500) // 模拟网络延迟
    
    const user = mockUsers.find(u => u.id === userId)
    return user ? user.loginHistory : []
  }
}