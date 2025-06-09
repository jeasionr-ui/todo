import express from 'express';
import { loginBiz, registerBiz, forgotPasswordBiz } from '../../biz/auth/auth_biz.js';
import { getUserById } from '../../biz/user/user_biz.js';

const router = express.Router();

// 登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 基本参数验证
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }
    
    const result = await loginBiz(email, password, req);
    if (result) {
      res.json(result);
    } else {
      res.status(401).json({ 
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
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

// 获取用户登录历史
router.get('/login-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    // 返回登录历史，如果没有则返回空数组
    const loginHistory = user.loginHistory || [];
    res.json({ loginHistory });
  } catch (err) {
    console.error('Get login history error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

export default router;
