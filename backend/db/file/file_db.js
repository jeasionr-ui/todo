import { query, execute } from '../exec_api.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export async function createFileDb(fileInfo) {
  const id = uuidv4();
  const {
    originalName, fileName, filePath, mimeType, size, uploadedBy, hash
  } = fileInfo;
  
  const uploadedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
  await execute(
    'INSERT INTO `file` (id, originalName, fileName, filePath, mimeType, size, uploadedBy, uploadedAt, hash, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, originalName, fileName, filePath, mimeType, size, uploadedBy, uploadedAt, hash, 'active']
  );
  
  return await getFileByIdDb(id);
}

export async function getFileByIdDb(id) {
  const rows = await query('SELECT * FROM `file` WHERE id = ? AND status = "active"', [id]);
  return rows[0] || null;
}

export async function getFilesByIdsDb(ids) {
  if (!ids || ids.length === 0) return [];
  const placeholders = ids.map(() => '?').join(',');
  const rows = await query(
    `SELECT * FROM file WHERE id IN (${placeholders}) AND status = "active"`,
    ids
  );
  return rows;
}

export async function getAllFilesDb() {
  const rows = await query('SELECT * FROM `file` WHERE status = "active" ORDER BY uploadedAt DESC');
  return rows;
}

export async function getFilesByUserDb(userId) {
  const rows = await query('SELECT * FROM `file` WHERE uploadedBy = ? AND status = "active" ORDER BY uploadedAt DESC', [userId]);
  return rows;
}

export async function deleteFileDb(id) {
  // 软删除：只标记为删除状态
  await execute('UPDATE `file` SET status = "deleted" WHERE id = ?', [id]);
  return true;
}

export async function permanentDeleteFileDb(id) {
  // 硬删除：真正从数据库删除记录
  await execute('DELETE FROM `file` WHERE id = ?', [id]);
  return true;
}

export async function getFileByHashDb(hash) {
  const rows = await query('SELECT * FROM `file` WHERE hash = ? AND status = "active"', [hash]);
  return rows[0] || null;
}

export async function updateFileDb(id, updates) {
  const allowedFields = ['originalName', 'fileName', 'filePath', 'mimeType', 'size', 'status'];
  const updateFields = Object.keys(updates).filter(key => allowedFields.includes(key));
  
  if (updateFields.length === 0) return await getFileByIdDb(id);
  
  const setClause = updateFields.map(field => `${field} = ?`).join(', ');
  const values = updateFields.map(field => updates[field]);
  values.push(id);
  
  await execute(`UPDATE file SET ${setClause} WHERE id = ?`, values);
  return await getFileByIdDb(id);
}
