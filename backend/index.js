import express from 'express'
import cors from 'cors'
import userApi from './api/user/user_api.js'
import authApi from './api/auth/auth_api.js'
import taskApi from './api/task/task_api.js'
import fileApi from './api/file/file_api.js'
import habitApi from './api/habit/habit_api.js'
import goalApi from './api/goal/goal_api.js'
import pomodoroApi from './api/pomodoro/pomodoro_api.js'
import reportApi from './api/report/report_api.js'

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

// 路由分发
app.use('/api/users', userApi)
app.use('/api/auth', authApi)
app.use('/api/file', fileApi)
app.use('/api/tasks', taskApi)
app.use('/api/habits', habitApi)
app.use('/api/goals', goalApi)
app.use('/api/pomodoro', pomodoroApi)
app.use('/api/reports', reportApi)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
