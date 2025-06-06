import express from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../../biz/todo/todo_biz.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const todos = await getTodos();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const todo = await createTodo(req.body);
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err && err.message ? err.message : 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const todo = await updateTodo(req.params.id, req.body);
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err && err.message ? err.message : 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteTodo(req.params.id);
    res.json({ id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err && err.message ? err.message : 'Server error' });
  }
});

export default router;
