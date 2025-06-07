import express from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../../biz/task/task_biz.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const options = {
      status: req.query.status,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined,
    };
    
    const result = await getTodos(options);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: '服务器内部错误',
      error: err.message 
    });
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
