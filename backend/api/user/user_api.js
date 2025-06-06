import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../../biz/user/user_biz.js';

const router = express.Router();

// 获取所有用户
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取单个用户
router.get('/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (user) res.json(user);
    else res.status(404).json({ error: 'User not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 新增用户
router.post('/', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 更新用户
router.put('/:id', async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 删除用户
router.delete('/:id', async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.json({ id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
