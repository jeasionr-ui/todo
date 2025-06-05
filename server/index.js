import express from 'express'
import cors from 'cors'
import userApi from './api/user/user_api.js'
import authApi from './api/auth/auth_api.js'

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

// 路由分发
app.use('/api/users', userApi)
app.use('/api/auth', authApi)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
