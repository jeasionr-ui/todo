import express from 'express';
import { loginBiz, registerBiz, forgotPasswordBiz } from '../../biz/auth/auth_biz.js';

const router = express.Router();

// 登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginBiz(email, password);
    if (result) {
      res.json(result);
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 注册
router.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    const result = await registerBiz(userData);
    if (result) {
      res.json(result);
    } else {
      res.status(409).json({ error: 'Email already exists' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 忘记密码（mock）
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    await forgotPasswordBiz(email);
    res.json({ message: 'If the email exists, a reset link will be sent.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
