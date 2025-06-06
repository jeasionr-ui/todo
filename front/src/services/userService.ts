import axios from 'axios'
import type User from '@/services/types/UserType'

const API_BASE = '/api/auth'

// 用户服务
export const userService = {
  // 登录
  async login(email: string, password: string): Promise<User | null> {
    const res = await axios.post(`${API_BASE}/login`, { email, password })
    if (res.data && res.data.token && res.data.user) {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      return res.data.user as User
    }
    return null
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
    const user = this.getCurrentUser()
    // 实际应用应通过API获取，临时兼容：返回当前用户的 loginHistory 字段
    return user && user.loginHistory ? user.loginHistory : []
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