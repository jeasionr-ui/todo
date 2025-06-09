import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmailDb, createUserDb, updateUserDb } from '../../db/user/user_db.js';
import { UserDTO } from '../../dto/user/UserDTO.js';
import { createLoginRecord } from '../../utils/loginUtils.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export async function loginBiz(email, password, req) {
  const user = await getUserByEmailDb(email);
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;
  
  // 创建登录记录
  const loginRecord = await createLoginRecord(req);
  
  // 获取现有登录历史，限制最多保存20条记录
  let loginHistory = [];
  try {
    loginHistory = user.loginHistory ? JSON.parse(user.loginHistory) : [];
  } catch (e) {
    loginHistory = [];
  }
  
  // 添加新的登录记录到开头
  loginHistory.unshift(loginRecord);
  // 只保留最近20条记录
  loginHistory = loginHistory.slice(0, 20);
  
  // 更新用户的最后登录时间和登录历史
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  await updateUserDb(user.id, {
    lastLogin: now,
    loginHistory: loginHistory
  });
  
  // 生成token
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  
  // 重新获取更新后的用户信息
  const updatedUser = await getUserByEmailDb(email);
  return { user: new UserDTO(updatedUser), token };
}

export async function registerBiz(userData) {
  // 检查邮箱唯一
  const existing = await getUserByEmailDb(userData.email);
  if (existing) return null;
  // 密码加密
  const hash = await bcrypt.hash(userData.password, 10);
  const user = { ...userData, password: hash };
  const created = await createUserDb(user);
  // 生成token
  const token = jwt.sign({ id: created.id, email: created.email }, JWT_SECRET, { expiresIn: '7d' });
  return { user: new UserDTO(created), token };
}

export async function forgotPasswordBiz(email) {
  // 可扩展为发送邮件，当前仅 mock
  return true;
}
