// 番茄钟相关类型定义

export interface PomodoroTemplate {
  id: string
  name: string
  description?: string
  workDuration: number // 工作时长（分钟）
  shortBreakDuration: number // 短休息时长（分钟）
  longBreakDuration: number // 长休息时长（分钟）
  longBreakInterval: number // 长休息间隔（多少个工作周期后）
  autoStartBreaks: boolean // 自动开始休息
  autoStartWork: boolean // 自动开始工作
  isDefault: boolean // 是否为默认模板
  createdAt: string
  updatedAt: string
}

export interface PomodoroSession {
  id: string
  templateId: string
  taskId?: string
  type: 'work' | 'short_break' | 'long_break'
  status: 'pending' | 'running' | 'paused' | 'completed' | 'cancelled'
  plannedDuration: number // 计划时长（分钟）
  actualDuration?: number // 实际时长（分钟）
  pausedDuration?: number // 暂停总时长（分钟）
  startTime?: string
  endTime?: string
  productivity?: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  mood?: 'very_bad' | 'bad' | 'neutral' | 'good' | 'very_good'
  energy?: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  interruptions?: number
  notes?: string
  tags?: string[]
  pauses?: PomodoroPause[]
  createdAt: string
  updatedAt: string
}

export interface PomodoroPause {
  id: string
  sessionId: string
  pauseTime: string
  resumeTime?: string
  duration?: number
  reason?: string
  createdAt: string
}

export interface PomodoroStats {
  id: string
  date: string
  totalSessions: number
  completedSessions: number
  totalWorkTime: number
  totalBreakTime: number
  totalPauseTime: number
  interruptions: number
  tasksCompleted: number
  longestFocusSession: number
  createdAt: string
  updatedAt: string
}

export interface FocusSettings {
  disableNotifications: boolean
  enableFullscreen: boolean
  blockWebsites: boolean
  blockedWebsites: string[]
  playWhiteNoise: boolean
  whiteNoiseType: 'white' | 'brown' | 'rain' | 'ocean' | 'forest' | 'cafe'
  whiteNoiseVolume: number
  enablePomodoroClock: boolean
  showProgressInTitle: boolean
  enableSounds: boolean
  sessionCompleteSound: string
  breakCompleteSound: string
  enableAutoStart: boolean
}

export interface CreateTemplateRequest {
  name: string
  description?: string
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number
  autoStartBreaks: boolean
  autoStartWork: boolean
  isDefault?: boolean
}

export interface CreateSessionRequest {
  templateId: string
  taskId?: string
  type: 'work' | 'short_break' | 'long_break'
  plannedDuration: number
}

export interface CompleteSessionRequest {
  productivityRating?: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  moodRating?: 'very_bad' | 'bad' | 'neutral' | 'good' | 'very_good'
  energyRating?: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  interruptions?: number
  notes?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginationResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface TimerState {
  isRunning: boolean
  isPaused: boolean
  remainingTime: number
  totalTime: number
  sessionType: 'work' | 'short_break' | 'long_break'
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }[]
}

export interface WeeklyStatsData {
  week: string
  totalSessions: number
  completedSessions: number
  totalWorkTime: number
  averageProductivity: number
}

export interface MonthlyStatsData {
  month: string
  totalSessions: number
  completedSessions: number
  totalWorkTime: number
  averageProductivity: number
  streak: number
}

export interface PomodoroSettings {
  focusSettings: FocusSettings
  notificationSettings: {
    enabled: boolean
    sessionComplete: boolean
    breakComplete: boolean
    sessionStart: boolean
    breakStart: boolean
  }
  displaySettings: {
    showTimer: boolean
    showProgress: boolean
    showSessionInfo: boolean
    theme: 'light' | 'dark' | 'auto'
  }
}

export interface TaskIntegration {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  estimatedPomodoros?: number
  completedPomodoros?: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  type: 'milestone' | 'streak' | 'productivity' | 'consistency'
  requirement: {
    type: string
    value: number
  }
  unlockedAt?: string
  progress: number
}

export interface FocusModeState {
  enabled: boolean
  startTime?: string
  blockedWebsites: string[]
  notificationsDisabled: boolean
  fullscreenEnabled: boolean
}
