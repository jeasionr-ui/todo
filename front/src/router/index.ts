import { createRouter, createWebHistory } from 'vue-router'
import { userService } from '@/services/userService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    // 主页面
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: {
        title: 'Dashboard',
        requiresAuth: true,
      },
    },

    // 用户认证相关路由
    {
      path: '/signin',
      name: 'SignIn',
      component: () => import('../views/Auth/SignIn.vue'),
      meta: {
        title: 'Sign In',
        guest: true,
      },
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: () => import('../views/Auth/SignUp.vue'),
      meta: {
        title: 'Sign Up',
        guest: true,
      },
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('../views/Auth/ForgotPassword.vue'),
      meta: {
        title: 'Forgot Password',
        guest: true,
      },
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('../views/Auth/ResetPassword.vue'),
      meta: {
        title: 'Reset Password',
        guest: true,
      },
    },
    // 用户个人信息路由
    {
      path: '/profile',
      name: 'UserProfile',
      component: () => import('../views/Auth/UserProfile.vue'),
      meta: {
        title: 'User Profile',
        requiresAuth: true,
      },
    },
    {
      path: '/security',
      name: 'UserSecurity',
      component: () => import('../views/Auth/UserSecurity.vue'),
      meta: {
        title: 'Security Settings',
        requiresAuth: true,
      },
    },

    // 核心功能路由
    {
      path: '/tasks',
      name: 'Tasks',
      component: () => import('../views/Tasks/TaskList.vue'),
      meta: {
        title: 'Task Management',
        requiresAuth: true,
      },
    },
    {
      path: '/tasks/:id',
      name: 'TaskDetail',
      component: () => import('../views/Tasks/TaskList.vue'),
      meta: {
        title: 'Task Detail',
        requiresAuth: true,
      },
    },
    {
      path: '/goals',
      name: 'Goals',
      component: () => import('../views/Goals/GoalList.vue'),
      meta: {
        title: 'Goal Management',
        requiresAuth: true,
      },
    },
    {
      path: '/habits',
      name: 'Habits',
      component: () => import('../views/Habits/HabitList.vue'),
      meta: {
        title: 'Habit Management',
        requiresAuth: true,
      },
    },

    // Pomodoro 相关路由
    {
      path: '/pomodoro',
      name: 'Pomodoro',
      component: () => import('../views/Pomodoro/PomodoroTimer.vue'),
      meta: {
        title: 'Pomodoro Timer',
        requiresAuth: true,
      },
    },

    // 报告路由
    {
      path: '/reports',
      name: 'Reports',
      component: () => import('../views/Reports.vue'),
      meta: {
        title: 'Reports & Analytics',
        requiresAuth: true,
      },
    },

    // 404 页面
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Not Found',
      },
    },
  ],
})

export default router

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || 'Todo App'} | Todo App`

  // 检查是否需要认证
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isGuest = to.matched.some((record) => record.meta.guest)
  const isAuthenticated = userService.getCurrentUser() !== null

  if (requiresAuth && !isAuthenticated) {
    next('/signin')
  } else if (isGuest && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})
