// 用户类型定义，前端用
export interface UserType {
  id: string | number
  firstName: string
  lastName: string
  email: string
  password?: string
  avatar?: string
  bio?: string
  phone?: string
  country?: string
  city?: string
  state?: string
  postalCode?: string
  taxId?: string
  createdAt?: string
  updatedAt?: string
  lastLogin?: string
  twoFactorEnabled?: boolean
  role?: string
  status?: string
  socialAccounts?: {
    facebook?: string
    twitter?: string
    linkedin?: string
    instagram?: string
    [key: string]: string | undefined
  }
  loginHistory?: Array<{
    id: string | number
    device: string
    browser: string
    location: string
    ipAddress: string
    time?: string
    status?: string
  }>
}
