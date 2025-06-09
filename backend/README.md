# ToDo 后端服务

基于 Node.js + Express 构建的 ToDo 项目管理系统后端服务，采用分层架构设计，提供 RESTful API 接口。

## 🚀 快速开始

### 环境要求
- Node.js 16.0+
- npm 8.0+
- MySQL 8.0+ 或 PostgreSQL 12.0+

### 安装与运行

```bash
# 安装依赖
npm install

# 配置数据库
# 1. 创建数据库
# 2. 导入数据库结构
mysql -u root -p < init.sql

# 开发模式启动（自动重启）
npm run dev

# 生产模式启动
npm start

# 运行测试
npm test
```

### 服务访问
- API 服务: http://localhost:3000
- API 文档: http://localhost:3000/api-docs

## 🏗️ 架构设计

### 分层架构模式

本服务采用经典的三层架构 + DTO/Entity 模式，实现了良好的关注点分离：

```
┌─────────────────┐
│   API Layer     │  ← 路由层：处理HTTP请求/响应
├─────────────────┤
│ Business Layer  │  ← 业务层：业务逻辑处理
├─────────────────┤
│   Data Layer    │  ← 数据层：数据库操作
├─────────────────┤
│   DTO Layer     │  ← 传输层：数据传输对象
├─────────────────┤
│  Entity Layer   │  ← 实体层：数据结构定义
└─────────────────┘
```

### 设计原则
- **单一职责**: 每层只负责特定的功能
- **依赖倒置**: 高层模块不依赖低层模块
- **接口隔离**: 接口设计遵循最小化原则
- **开闭原则**: 对扩展开放，对修改关闭

## 📁 目录结构与职责

```
backend/
├── index.js                 # 应用入口文件
├── init.sql                 # 数据库初始化脚本
├── package.json             # 项目配置与依赖
├── api/                     # API 路由层
│   ├── auth/                # 认证相关路由
│   │   └── auth_api.js      # 用户认证 API
│   ├── file/                # 文件相关路由
│   │   └── file_api.js      # 文件上传/下载 API
│   ├── goal/                # 目标相关路由
│   │   └── goal_api.js      # 目标管理 API
│   ├── habit/               # 习惯相关路由
│   │   └── habit_api.js     # 习惯管理 API
│   ├── pomodoro/            # 番茄钟相关路由
│   │   └── pomodoro_api.js  # 番茄钟 API
│   ├── report/              # 报表相关路由
│   │   └── report_api.js    # 报表分析 API
│   ├── task/                # 任务相关路由
│   │   └── task_api.js      # 任务管理 API
│   └── user/                # 用户相关路由
│       └── user_api.js      # 用户管理 API
├── biz/                     # 业务逻辑层
│   ├── auth/                # 认证业务逻辑
│   │   └── auth_biz.js      # 登录/注册/权限验证
│   ├── file/                # 文件业务逻辑
│   │   └── file_biz.js      # 文件处理/验证
│   ├── goal/                # 目标业务逻辑
│   │   └── goal_biz.js      # 目标管理/里程碑/回顾
│   ├── habit/               # 习惯业务逻辑
│   │   ├── habit_biz.js     # 习惯管理
│   │   └── habit_biz_functions.js # 习惯统计/计算
│   ├── pomodoro/            # 番茄钟业务逻辑
│   │   └── pomodoro_biz.js  # 番茄钟管理/统计
│   ├── report/              # 报表业务逻辑
│   │   └── report_biz.js    # 数据分析/报表生成
│   ├── task/                # 任务业务逻辑
│   │   └── task_biz.js      # 任务管理/状态变更
│   └── user/                # 用户业务逻辑
│       └── user_biz.js      # 用户信息管理
├── db/                      # 数据访问层
│   ├── db_config.js         # 数据库连接配置
│   ├── exec_api.js          # 通用数据库操作
│   ├── file/                # 文件数据操作
│   │   └── file_db.js       # 文件信息存储
│   ├── goal/                # 目标数据操作
│   │   └── goal_db.js       # 目标CRUD/里程碑/回顾
│   ├── habit/               # 习惯数据操作
│   │   ├── habit_db.js      # 习惯CRUD操作
│   │   └── habit_db_functions.js # 习惯查询函数
│   ├── pomodoro/            # 番茄钟数据操作
│   │   └── pomodoro_db.js   # 番茄钟CRUD/统计
│   ├── report/              # 报表数据操作
│   │   └── report_db.js     # 数据统计/分析查询
│   ├── task/                # 任务数据操作
│   │   └── task_db.js       # 任务CRUD操作
│   └── user/                # 用户数据操作
│       └── user_db.js       # 用户CRUD操作
├── dto/                     # 数据传输对象
│   ├── file/                # 文件传输对象
│   │   └── FileDTO.js       # 文件信息DTO
│   ├── goal/                # 目标传输对象
│   │   └── GoalDTO.js       # 目标/里程碑/回顾DTO
│   ├── habit/               # 习惯传输对象
│   │   └── HabitDTO.js      # 习惯信息DTO
│   ├── pomodoro/            # 番茄钟传输对象
│   │   └── PomodoroDTO.js   # 番茄钟模板/会话/统计DTO
│   ├── report/              # 报表传输对象
│   │   └── ReportDTO.js     # 报表数据DTO
│   ├── todo/                # 任务传输对象
│   │   └── TodoDTO.js       # 任务信息DTO
│   └── user/                # 用户传输对象
│       └── UserDTO.js       # 用户信息DTO
├── entity/                  # 实体定义层
│   ├── UserType.js          # 用户类型定义
│   ├── file/                # 文件实体
│   │   └── FileType.js      # 文件类型定义
│   ├── goal/                # 目标实体
│   │   └── GoalType.js      # 目标/里程碑/回顾类型定义
│   ├── habit/               # 习惯实体
│   │   └── HabitType.js     # 习惯类型定义
│   ├── pomodoro/            # 番茄钟实体
│   │   └── PomodoroType.js  # 番茄钟类型定义
│   └── todo/                # 任务实体
│       └── TodoType.js      # 任务类型定义
├── uploads/                 # 文件上传目录
│   ├── *.jpg               # 用户上传的图片
│   └── *.png               # 用户上传的图片
└── utils/                   # 工具函数
    └── common.js           # 通用工具函数
```

### 层次职责划分

#### 1. API 层 (api/)
- **职责**: 处理 HTTP 请求/响应，路由分发
- **功能**: 
  - 请求参数验证
  - 路由定义与分发
  - 响应格式化
  - 错误处理
- **规范**: 
  - 不包含业务逻辑
  - 直接调用 BIZ 层方法
  - 统一的响应格式

#### 2. 业务逻辑层 (biz/)
- **职责**: 核心业务逻辑处理
- **功能**:
  - 业务规则验证
  - 数据转换与处理
  - 业务流程控制
  - 事务管理
- **规范**:
  - 包含核心业务逻辑
  - 调用 DB 层进行数据操作
  - 使用 DTO 进行数据传输

#### 3. 数据访问层 (db/)
- **职责**: 数据库操作与数据持久化
- **功能**:
  - CRUD 操作
  - 复杂查询
  - 数据库连接管理
  - SQL 语句执行
- **规范**:
  - 只负责数据操作
  - 不包含业务逻辑
  - 返回原始数据

#### 4. DTO 层 (dto/)
- **职责**: 数据传输对象定义
- **功能**:
  - API 请求/响应格式定义
  - 数据验证规则
  - 数据转换映射
- **规范**:
  - 定义数据结构
  - 包含验证逻辑
  - 用于层间数据传输

#### 5. Entity 层 (entity/)
- **职责**: 实体和类型定义
- **功能**:
  - 数据库表结构定义
  - 枚举类型定义
  - 常量定义
- **规范**:
  - 纯数据结构定义
  - 与数据库表结构对应
  - 类型约束和文档

## 🔌 API 接口文档

### 认证相关 (Auth)
```http
POST /api/auth/login          # 用户登录
POST /api/auth/register       # 用户注册  
POST /api/auth/logout         # 用户登出
GET  /api/auth/verify         # 验证用户身份
```

### 用户管理 (User)
```http
GET    /api/user/profile      # 获取用户信息
PUT    /api/user/profile      # 更新用户信息
POST   /api/user/avatar       # 上传用户头像
PUT    /api/user/password     # 修改密码
```

### 任务管理 (Task)
```http
GET    /api/tasks             # 获取任务列表
POST   /api/tasks             # 创建新任务
GET    /api/tasks/:id         # 获取任务详情
PUT    /api/tasks/:id         # 更新任务
DELETE /api/tasks/:id         # 删除任务
POST   /api/tasks/:id/complete # 标记任务完成
```

### 习惯管理 (Habit)
```http
GET    /api/habits            # 获取习惯列表
POST   /api/habits            # 创建新习惯
GET    /api/habits/:id        # 获取习惯详情
PUT    /api/habits/:id        # 更新习惯
DELETE /api/habits/:id        # 删除习惯
POST   /api/habits/:id/checkin # 习惯打卡
GET    /api/habits/:id/stats  # 获取习惯统计
```

### 文件管理 (File)
```http
POST   /api/files/upload      # 上传文件
GET    /api/files/:id         # 获取文件信息
DELETE /api/files/:id         # 删除文件
```

### 请求/响应格式

#### 标准响应格式
```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "code": 200
}
```

#### 错误响应格式
```json
{
  "success": false,
  "error": "错误信息",
  "message": "详细错误描述",
  "code": 400
}
```

## 🛠️ 开发指南

### 代码规范

#### 1. 文件命名
- API 层: `{module}_api.js`
- 业务层: `{module}_biz.js`
- 数据层: `{module}_db.js`
- DTO 层: `{Module}DTO.js`
- 实体层: `{Module}Type.js`

#### 2. 函数命名
```javascript
// API 层 - 使用 HTTP 动词
async function getTasks(req, res) {}
async function createTask(req, res) {}
async function updateTask(req, res) {}
async function deleteTask(req, res) {}

// 业务层 - 使用业务动词
async function findTasksByUser(userId) {}
async function createTaskForUser(userId, taskData) {}
async function completeTask(taskId) {}

// 数据层 - 使用数据操作动词
async function selectTaskById(id) {}
async function insertTask(taskData) {}
async function updateTaskById(id, data) {}
async function deleteTaskById(id) {}
```

#### 3. 错误处理
```javascript
// 统一错误处理格式
try {
  const result = await businessFunction();
  res.json({ success: true, data: result });
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ 
    success: false, 
    error: error.message,
    code: 500 
  });
}
```

### 中间件系统

#### 认证中间件
```javascript
// 验证用户身份
function authenticateToken(req, res, next) {
  // 验证 JWT token
  // 设置 req.user
}
```

#### 日志中间件
```javascript
// 请求日志记录
function logRequests(req, res, next) {
  // 记录请求信息
  // 性能监控
}
```

#### 跨域中间件
```javascript
// CORS 处理
function corsHandler(req, res, next) {
  // 设置跨域头
  // 处理预检请求
}
```

### 数据库设计

#### 主要数据表

##### users 表
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

##### tasks 表
```sql
CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  due_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

##### habits 表
```sql
CREATE TABLE habits (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  frequency ENUM('daily', 'weekly', 'monthly') DEFAULT 'daily',
  target_count INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 数据库连接配置
```javascript
// db/db_config.js
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'todo_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
```

## 🚀 部署指南

### 本地构建

#### 构建生产版本
```bash
# 构建应用（推荐）
npm run build

# 简单构建（仅复制文件）
npm run build:simple

# 清理构建文件
npm run clean
```

构建完成后，`dist/` 目录包含：
- 所有源代码文件
- 生产环境依赖
- 启动脚本 `start.sh`

#### 运行生产版本
```bash
# 方式1：使用 npm
cd dist && npm start

# 方式2：使用启动脚本
cd dist && ./start.sh

# 方式3：直接运行
npm run start:prod
```

### 环境变量配置
```bash
# .env 文件
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=todo_db
JWT_SECRET=your_jwt_secret
UPLOAD_PATH=./uploads
```

### PM2 部署
```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start index.js --name "todo-backend"

# 查看状态
pm2 status

# 查看日志
pm2 logs todo-backend

# 重启应用
pm2 restart todo-backend
```

### Docker 部署

#### 单独构建
```bash
# 构建镜像
docker build -t todo-backend .

# 运行容器
docker run -d \
  --name todo-backend \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=mysql \
  -e DB_USER=root \
  -e DB_PASSWORD=rootpassword \
  -e DB_NAME=todo_db \
  todo-backend
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: 
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=rootpassword
      - DB_NAME=todo_db
    depends_on:
      mysql:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 10s
      retries: 3
  
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: todo_db
      MYSQL_CHARACTER_SET_SERVER: utf8mb4
      MYSQL_COLLATION_SERVER: utf8mb4_unicode_ci
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mysql_data:
```

## 🧪 测试

### 单元测试
```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- --grep "Task API"

# 生成测试覆盖率报告
npm run test:coverage
```

### API 测试示例
```javascript
// 使用 Jest 和 Supertest
describe('Task API', () => {
  test('GET /api/tasks should return tasks list', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

## 📊 性能监控

### 日志记录
- 使用 Winston 进行结构化日志
- 错误日志自动告警
- 性能指标监控

### 数据库优化
- 索引优化策略
- 查询性能分析
- 连接池管理

## 🔒 安全考虑

### 身份认证
- JWT Token 验证
- 密码哈希存储 (bcrypt)
- 会话管理

### 数据验证
- 输入参数验证
- SQL 注入防护
- XSS 攻击防护

### 文件上传安全
- 文件类型验证
- 文件大小限制
- 恶意文件检测

## 🤝 贡献指南

### 开发流程
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 代码审查标准
- 代码风格一致性
- 单元测试覆盖率
- API 文档完整性
- 性能影响评估

---

📚 **相关文档**
- [前端开发文档](../front/README.md)
- [项目主文档](../README.md)
- [API 接口测试](./tests/README.md)

