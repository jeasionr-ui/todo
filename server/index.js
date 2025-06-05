import express from 'express';
import cors from 'cors';
import todoApi from './api/todo/todo_api.js';

const app = express();
const port = 3001;

// 数据库连接配置
const dbConfig = {
  host: '47.86.237.178',
  port: 3308,
  user: 'todo', // 请根据实际情况修改
  password: 'fXWZGS2m2JKREaFH', // 请根据实际情况修改
  database: 'todo',
};

app.use(cors());
app.use(express.json());

// 路由分发
app.use('/api/todos', todoApi);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
