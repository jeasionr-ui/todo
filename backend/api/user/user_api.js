import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, changeUserPassword } from '../../biz/user/user_biz.js';
import { verifyToken } from '../../middleware/auth_middleware.js';

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

// 修改密码
router.put('/:id/password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // 验证请求的有效性
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    // 验证用户是否有权更改此密码（只有自己或管理员可以更改）
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to change this password' });
    }
    
    await changeUserPassword(req.params.id, currentPassword, newPassword);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    if (err.message === 'User not found') {
      res.status(404).json({ error: 'User not found' });
    } else if (err.message === 'Current password is incorrect') {
      res.status(400).json({ error: 'Current password is incorrect' });
    } else if (err.message.includes('Password')) {
      // 处理密码复杂性错误
      res.status(400).json({ error: err.message, code: 'PASSWORD_COMPLEXITY' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

export default router;
