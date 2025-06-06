// 用户数据类型定义
export default interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  avatar: string
  bio: string
  phone: string
  country: string
  city: string
  state: string
  postalCode: string
  taxId: string
  createdAt: string
  updatedAt: string
  lastLogin: string
  twoFactorEnabled: boolean
  role: string
  status: 'active' | 'inactive'
  socialAccounts?: {
    google?: string
    facebook?: string
    twitter?: string
    linkedin?: string
  }
  loginHistory: Array<{
    id: string
    ipAddress: string
    device: string
    browser: string
    location: string
    time: string
    status: 'success' | 'failed'
  }>
}
