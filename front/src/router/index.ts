import { createRouter, createWebHistory } from 'vue-router'

import { userService } from '@/services/userService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Ecommerce',
      component: () => import('../views/templates/Ecommerce.vue'),
      meta: {
        title: 'eCommerce Dashboard',
      },
    },
    {
      path: '/templates/calendar',
      name: 'Calendar',
      component: () => import('../views/templates/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
      },
    },
    {
      path: '/templates/profile',
      name: 'Profile',
      component: () => import('../views/templates/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
      },
    },
    {
      path: '/templates/form-elements',
      name: 'Form Elements',
      component: () => import('../views/templates/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/templates/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/templates/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/templates/line-chart',
      name: 'Line Chart',
      component: () => import('../views/templates/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/templates/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/templates/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/templates/alerts',
      name: 'Alerts',
      component: () => import('../views/templates/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/templates/avatars',
      name: 'Avatars',
      component: () => import('../views/templates/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/templates/badge',
      name: 'Badge',
      component: () => import('../views/templates/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/templates/buttons',
      name: 'Buttons',
      component: () => import('../views/templates/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/templates/images',
      name: 'Images',
      component: () => import('../views/templates/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },

    {
      path: '/ui/toast',
      name: 'Toast',
      component: () => import('../views/UiElements/ToastDemo.vue'),
      meta: {
        title: 'Toast',
      },
    },
    {
      path: '/templates/videos',
      name: 'Videos',
      component: () => import('../views/templates/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/templates/blank',
      name: 'Blank',
      component: () => import('../views/templates/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/templates/error-404',
      name: '404 Error',
      component: () => import('../views/templates/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    {
      path: '/templates/signin',
      name: 'Signin',
      component: () => import('../views/templates/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/templates/signup',
      name: 'Signup',
      component: () => import('../views/templates/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },

    // 添加用户管理相关路由
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Dashboard.vue'),
      meta: {
        title: 'Dashboard',
        requiresAuth: true,
      },
    },
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
      path: '/settings',
      name: 'UserSettings',
      component: () => import('../views/Auth/UserSettings.vue'),
      meta: {
        title: 'User Settings',
        requiresAuth: true,
      },
    },
    {
      path: '/security',
      name: 'UserSecurity',
      component: () => import('../views/Auth/UserSecurity.vue'),
      meta: {
        title: 'User Security',
        requiresAuth: true,
      },
    },

    {
      path: '/tasks',
      name: 'Tasks',
      component: () => import('../views/Tasks/TaskList.vue'),
      meta: {
        title: 'Task Management',
      },
    },

    {
      path: '/goals',
      name: 'Goals',
      component: () => import('../views/Goals/GoalList.vue'),
      meta: {
        title: 'Goal Management',
      },
    },

    {
      path: '/habits',
      name: 'Habits',
      component: () => import('../views/Habits/HabitList.vue'),
      meta: {
        title: 'Habit Management',
      },
    },

    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },
  ],
})

export default router

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
