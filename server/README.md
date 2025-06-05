# todo-server

## 依赖安装

```sh
cd server
npm install
```

## 启动服务

开发模式（自动重启）：
```sh
npm run dev
```

生产模式：
```sh
npm start
```

## 目录结构与分层规范

本服务端采用分层解耦设计，推荐如下目录结构和职责划分：

- **db/**
  - `db_config.js`：数据库连接配置。
  - `exec_api.js`：通用数据库操作（如 query/execute）。
  - `todo/`：每个业务表对应一个子文件夹，存放该表的数据库操作（如 todo_db.js）。
- **biz/**
  - `todo/`：每个业务表对应一个子文件夹，存放业务逻辑（如 todo_biz.js），负责处理业务规则、数据转换等。
- **api/**
  - `todo/`：每个业务表对应一个子文件夹，存放 API 路由（如 todo_api.js），负责路由分发和请求响应。
- **dto/**
  - 存放数据传输对象（Data Transfer Object），用于 API 层与业务层、数据库层之间的数据结构中转。
- **entity/**
  - 存放与数据库表结构类似的实体定义（如 TodoType.ts），用于类型约束和数据结构描述。

> 推荐每个业务（如 todo）都按 api/biz/db/dto/entity 五层分文件夹，便于解耦和维护。

## API 说明

- GET    `/api/todos`         获取所有 todo
- POST   `/api/todos`         新增 todo（body: { title, completed })
- PUT    `/api/todos/:id`     更新 todo（body: { title, completed })
- DELETE `/api/todos/:id`     删除 todo

## 数据库配置

- host: 47.86.237.178
- port: 3308
- user: todo
- password: fXWZGS2m2JKREaFH
- database: todo

> 请确保数据库有 `todos` 表，字段至少包含：id, title, completed。
