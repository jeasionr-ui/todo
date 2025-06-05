import express from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../../biz/todo/todo_biz.js';

const router = express.Router();

// 获取所有 todo
router.get('/', async (req, res) => {
  try {
    const todos = await getTodos();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 新增 todo
router.post('/', async (req, res) => {
  try {
    const todo = await createTodo(req.body);
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 更新 todo
router.put('/:id', async (req, res) => {
  try {
    const todo = await updateTodo(req.params.id, req.body);
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 删除 todo
router.delete('/:id', async (req, res) => {
  try {
    await deleteTodo(req.params.id);
    res.json({ id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;