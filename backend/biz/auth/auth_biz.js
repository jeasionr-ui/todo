import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmailDb, createUserDb } from '../../db/user/user_db.js';
import { UserDTO } from '../../dto/user/UserDTO.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export async function loginBiz(email, password) {
  const user = await getUserByEmailDb(email);
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;
  // 生成token
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  return { user: new UserDTO(user), token };
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
