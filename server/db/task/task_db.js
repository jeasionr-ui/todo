import { query, execute } from '../exec_api.js';
import { getFilesByIdsDb } from '../file/file_db.js';
import { v4 as uuidv4 } from 'uuid';

export async function getAllTasksDb() {
  const rows = await query('SELECT * FROM `task`');
  const tasks = [];
  
  for (const row of rows) {
    const task = await enrichTaskWithFiles(row);
    tasks.push(task);
  }
  
  return tasks;
}

export async function createTaskDb(task) {
  const id = uuidv4();
  // 只取允许的字段
  const {
    name, description, status = 'todo', priority = 'medium', dueDate = null,
    tags = [], attachments = [], reminderTime = null
  } = task || {};
  
  // 将数组转换为逗号分隔的字符串
  const tagsString = Array.isArray(tags) ? tags.join(',') : tags;
  const attachmentsString = Array.isArray(attachments) ? attachments.join(',') : attachments;
  
  await execute(
    'INSERT INTO `task` (id, name, description, status, priority, dueDate, tags, attachments, reminderTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, name, description, status, priority, dueDate, tagsString, attachmentsString, reminderTime]
  );
  return await getTaskByIdDb(id);
}

export async function getTaskByIdDb(id) {
  const rows = await query('SELECT * FROM `task` WHERE id = ?', [id]);
  if (!rows[0]) return null;
  
  return await enrichTaskWithFiles(rows[0]);
}

export async function updateTaskDb(id, updates) {
  const fields = [
    'name', 'description', 'status', 'priority', 'dueDate', 'tags', 'attachments', 'reminderTime'
  ];
  const updateFields = fields.filter(f => Object.prototype.hasOwnProperty.call(updates, f));
  if (updateFields.length === 0) return await getTaskByIdDb(id);
  
  const setClause = updateFields.map(f => `${f} = ?`).join(', ');
  const values = updateFields.map(f => {
    if (f === 'tags' || f === 'attachments') {
      // 将数组转换为逗号分隔的字符串
      return Array.isArray(updates[f]) ? updates[f].join(',') : updates[f];
    }
    return updates[f];
  });
  values.push(id);
  
  await execute(
    `UPDATE task SET ${setClause} WHERE id = ?`,
    values
  );
  return await getTaskByIdDb(id);
}

export async function deleteTaskDb(id) {
  await execute('DELETE FROM `task` WHERE id = ?', [id]);
  return true;
}

/**
 * 丰富任务数据，包含文件信息
 * @param {Object} task 原始任务数据
 * @returns {Object} 包含文件信息的任务数据
 */
async function enrichTaskWithFiles(task) {
  // 将逗号分隔的字符串转换为数组
  const tags = task.tags ? task.tags.split(',').filter(tag => tag.trim()) : [];
  const attachmentIds = task.attachments ? task.attachments.split(',').filter(id => id.trim()) : [];
  
  // 获取附件文件信息
  let attachments = [];
  if (attachmentIds.length > 0) {
    const files = await getFilesByIdsDb(attachmentIds);
    attachments = files.map(file => ({
      id: file.id,
      name: file.originalName,
      url: `/api/file/download/${file.id}`,
      size: file.size,
      type: file.mimeType,
      uploadedAt: file.uploadedAt
    }));
  }
  
  return {
    ...task,
    tags,
    attachments
  };
}
