import { query, execute } from '../exec_api.js';
import { v4 as uuidv4 } from 'uuid';

export async function getAllUsersDb() {
  return await query('SELECT * FROM `user`');
}

export async function getUserByIdDb(id) {
  const rows = await query('SELECT * FROM `user` WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function getUserByEmailDb(email) {
  const rows = await query('SELECT * FROM `user` WHERE email = ?', [email]);
  return rows[0] || null;
}

export async function createUserDb(user) {
  const id = uuidv4();
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const {
    firstName, lastName, email, password, avatar = '', bio = '', phone = '', country = '', city = '', state = '', postalCode = '', taxId = '', twoFactorEnabled = false, role = 'user', status = 'active', socialAccounts = {}, loginHistory = []
  } = user;
  await execute(
    'INSERT INTO `user` (id, firstName, lastName, email, password, avatar, bio, phone, country, city, state, postalCode, taxId, createdAt, updatedAt, lastLogin, twoFactorEnabled, role, status, socialAccounts, loginHistory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, firstName, lastName, email, password, avatar, bio, phone, country, city, state, postalCode, taxId, now, now, now, twoFactorEnabled, role, status, JSON.stringify(socialAccounts), JSON.stringify(loginHistory)]
  );
  return { ...user, id, createdAt: now, updatedAt: now, lastLogin: now };
}

export async function updateUserDb(id, user) {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const fields = [
    'firstName', 'lastName', 'email', 'password', 'avatar', 'bio', 'phone', 'country', 'city', 'state', 'postalCode', 'taxId', 'twoFactorEnabled', 'role', 'status', 'socialAccounts', 'loginHistory'
  ];
  const setClause = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => f === 'socialAccounts' || f === 'loginHistory' ? JSON.stringify(user[f] || (f === 'loginHistory' ? [] : {})) : user[f]);
  values.push(now, id);
  await execute(
    `UPDATE user SET ${setClause}, updatedAt = ? WHERE id = ?`,
    values
  );
  return { ...user, id, updatedAt: now };
}

export async function deleteUserDb(id) {
  await execute('DELETE FROM `user` WHERE id = ?', [id]);
}
