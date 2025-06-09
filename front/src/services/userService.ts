import axios from 'axios'
import type User from '@/services/types/UserType'

const API_BASE = '/api/auth'

// 用户服务
export const userService = {
  // 登录
  async login(email: string, password: string): Promise<User | null> {
    try {
      const res = await axios.post(`${API_BASE}/login`, { email, password })
      if (res.data && res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        return res.data.user as User
      }
      return null
    } catch (error: any) {
      // 重新抛出错误以便调用方能够处理具体的错误类型
      throw error
    }
  },

  // 注册
  async register(userData: Partial<User>): Promise<User | null> {
    const res = await axios.post(`${API_BASE}/register`, userData)
    if (res.data && res.data.token && res.data.user) {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      return res.data.user as User
    }
    return null
  },

  // 忘记密码
  async forgotPassword(email: string): Promise<boolean> {
    try {
      await axios.post(`${API_BASE}/forgot-password`, { email })
      return true
    } catch {
      return false
    }
  },

  // 登出
  async logout(): Promise<void> {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // 获取当前用户
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user')
    if (userJson) {
      return JSON.parse(userJson)
    }
    return null
  },

  // 获取登录历史
  async getLoginHistory(): Promise<User['loginHistory']> {
    try {
      const user = this.getCurrentUser()
      if (!user) return []
      
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_BASE}/login-history/${user.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      
      return res.data.loginHistory || []
    } catch (error) {
      console.error('Failed to fetch login history:', error)
      // 降级方案：返回当前用户的 loginHistory 字段
      const user = this.getCurrentUser()
      return user && user.loginHistory ? user.loginHistory : []
    }
  },

  // 修改密码
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const user = this.getCurrentUser()
      if (!user) return false
      
      const token = localStorage.getItem('token')
      await axios.put(`/api/users/${user.id}/password`, {
        currentPassword,
        newPassword
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      return true
    } catch {
      return false
    }
  },

  // 切换双因子认证
  async toggleTwoFactor(enable: boolean): Promise<boolean> {
    try {
      const user = this.getCurrentUser()
      if (!user) return false
      
      const token = localStorage.getItem('token')
      await axios.put(`/api/users/${user.id}/two-factor`, {
        enabled: enable
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      
      // 更新本地用户信息
      const updatedUser = { ...user, twoFactorEnabled: enable }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      return true
    } catch {
      return false
    }
  },

  // 更新用户资料
  async updateProfile(updates: Partial<User>): Promise<User | null> {
    const user = this.getCurrentUser()
    if (!user) return null
    const token = localStorage.getItem('token')
    const res = await axios.put(`/api/users/${user.id}`, updates, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    if (res.data) {
      // 更新本地缓存
      localStorage.setItem('user', JSON.stringify(res.data))
      return res.data as User
    }
    return null
  }
}