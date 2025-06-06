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
  // 允许更新的字段
  const fields = [
    'firstName', 'lastName', 'email', 'password', 'avatar', 'bio', 'phone', 'country', 'city', 'state', 'postalCode', 'taxId', 'twoFactorEnabled', 'role', 'status', 'socialAccounts', 'loginHistory'
  ];
  // 只保留 user 里实际有的字段
  const updateFields = fields.filter(f => Object.prototype.hasOwnProperty.call(user, f));
  if (updateFields.length === 0) return await getUserByIdDb(id); // 没有要更新的内容
  const setClause = updateFields.map(f => `${f} = ?`).join(', ');
  const values = updateFields.map(f => {
    if (f === 'socialAccounts' || f === 'loginHistory') {
      return JSON.stringify(user[f] || (f === 'loginHistory' ? [] : {}));
    }
    return user[f];
  });
  values.push(now, id);
  await execute(
    `UPDATE user SET ${setClause}, updatedAt = ? WHERE id = ?`,
    values
  );
  return await getUserByIdDb(id);
}

export async function deleteUserDb(id) {
  await execute('DELETE FROM `user` WHERE id = ?', [id]);
}
