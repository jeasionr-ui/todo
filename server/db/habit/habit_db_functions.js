import { query, execute } from '../exec_api.js';
import { generateId } from '../../utils/common.js';
import { Habit, HabitCompletion } from '../../entity/habit/HabitType.js';

/**
 * 获取所有习惯
 */
export async function getAllHabitsDb(options = {}) {
  try {
    let sql = 'SELECT * FROM habit WHERE 1=1';
    const params = [];

    if (!options.includeArchived) {
      sql += ' AND isArchived = ?';
      params.push(false);
    }

    if (options.category) {
      sql += ' AND category = ?';
      params.push(options.category);
    }

    sql += ' ORDER BY createdAt DESC';

    if (options.limit) {
      sql += ' LIMIT ?';
      params.push(options.limit);
      
      if (options.offset) {
        sql += ' OFFSET ?';
        params.push(options.offset);
      }
    }

    const rows = await query(sql, params);
    return rows.map(row => new Habit(row));
  } catch (error) {
    console.error('获取习惯列表失败:', error);
    throw new Error('获取习惯列表失败');
  }
}

/**
 * 根据ID获取习惯
 */
export async function getHabitByIdDb(habitId) {
  try {
    const sql = 'SELECT * FROM habit WHERE id = ?';
    const rows = await query(sql, [habitId]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return new Habit(rows[0]);
  } catch (error) {
    console.error('获取习惯详情失败:', error);
    throw new Error('获取习惯详情失败');
  }
}

/**
 * 创建新习惯
 */
export async function createHabitDb(habit) {
  try {
    const habitId = generateId();
    const now = new Date().toISOString();
    
    habit.id = habitId;
    habit.createdAt = now;
    habit.updatedAt = now;
    
    const habitData = habit.toDatabaseFormat();
    
    const sql = `
      INSERT INTO habit (
        id, name, description, category, tags, frequencyType, daysOfWeek, daysOfMonth,
        startDate, endDate, reminderTime, reminderType, reminderLocation, color, icon,
        cronExpression, isArchived, createdAt, updatedAt, streakCount, longestStreak,
        totalCompletions, lastCompletedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      habitData.id, habitData.name, habitData.description, habitData.category,
      habitData.tags, habitData.frequencyType, habitData.daysOfWeek, habitData.daysOfMonth,
      habitData.startDate, habitData.endDate, habitData.reminderTime, habitData.reminderType,
      habitData.reminderLocation, habitData.color, habitData.icon, habitData.cronExpression,
      habitData.isArchived, habitData.createdAt, habitData.updatedAt, habitData.streakCount,
      habitData.longestStreak, habitData.totalCompletions, habitData.lastCompletedAt
    ];
    
    await execute(sql, values);
    return habitId;
  } catch (error) {
    console.error('创建习惯失败:', error);
    throw new Error('创建习惯失败');
  }
}

/**
 * 更新习惯
 */
export async function updateHabitDb(habitId, updateData) {
  try {
    const now = new Date().toISOString();
    updateData.updatedAt = now;
    
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(habitId);
    
    const sql = `UPDATE habit SET ${fields} WHERE id = ?`;
    
    const result = await execute(sql, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('更新习惯失败:', error);
    throw new Error('更新习惯失败');
  }
}

/**
 * 删除习惯
 */
export async function deleteHabitDb(habitId, permanent = false) {
  try {
    if (permanent) {
      // 永久删除：先删除完成记录，再删除习惯
      await execute('DELETE FROM habit_completion WHERE habitId = ?', [habitId]);
      const result = await execute('DELETE FROM habit WHERE id = ?', [habitId]);
      return result.affectedRows > 0;
    } else {
      // 归档：只是标记为已归档
      const result = await execute(
        'UPDATE habit SET isArchived = ?, archivedAt = ?, updatedAt = ? WHERE id = ?',
        [true, new Date().toISOString(), new Date().toISOString(), habitId]
      );
      return result.affectedRows > 0;
    }
  } catch (error) {
    console.error('删除习惯失败:', error);
    throw new Error('删除习惯失败');
  }
}

/**
 * 创建习惯完成记录
 */
export async function createCompletionDb(completion) {
  try {
    const completionId = generateId();
    const now = new Date().toISOString();
    
    completion.id = completionId;
    completion.createdAt = now;
    completion.updatedAt = now;
    
    const sql = `
      INSERT INTO habit_completion (id, habitId, date, isCompleted, note, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        isCompleted = VALUES(isCompleted),
        note = VALUES(note),
        updatedAt = VALUES(updatedAt)
    `;
    
    const values = [
      completion.id, completion.habitId, completion.date, completion.isCompleted,
      completion.note, completion.createdAt, completion.updatedAt
    ];
    
    await execute(sql, values);
    return completionId;
  } catch (error) {
    console.error('创建完成记录失败:', error);
    throw new Error('创建完成记录失败');
  }
}

/**
 * 更新习惯完成记录
 */
export async function updateCompletionDb(completionId, updateData) {
  try {
    const now = new Date().toISOString();
    updateData.updatedAt = now;
    
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(completionId);
    
    const sql = `UPDATE habit_completion SET ${fields} WHERE id = ?`;
    
    const result = await execute(sql, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('更新完成记录失败:', error);
    throw new Error('更新完成记录失败');
  }
}

/**
 * 获取习惯的完成历史记录
 */
export async function getCompletionHistoryDb(habitId, startDate = null, endDate = null) {
  try {
    let sql = 'SELECT * FROM habit_completion WHERE habitId = ?';
    const values = [habitId];
    
    if (startDate) {
      sql += ' AND date >= ?';
      values.push(startDate);
    }
    
    if (endDate) {
      sql += ' AND date <= ?';
      values.push(endDate);
    }
    
    sql += ' ORDER BY date DESC';
    
    const rows = await query(sql, values);
    return rows.map(row => new HabitCompletion(row));
  } catch (error) {
    console.error('获取完成历史记录失败:', error);
    throw new Error('获取完成历史记录失败');
  }
}

/**
 * 获取习惯统计信息
 */
export async function getHabitStatsDb(habitId) {
  try {
    const sql = `
      SELECT 
        COUNT(*) as totalRecords,
        SUM(CASE WHEN isCompleted = TRUE THEN 1 ELSE 0 END) as completedCount,
        MAX(date) as lastRecordDate
      FROM habit_completion 
      WHERE habitId = ?
    `;
    
    const rows = await query(sql, [habitId]);
    
    if (rows.length === 0) {
      return {
        totalRecords: 0,
        completedCount: 0,
        lastRecordDate: null
      };
    }
    
    return rows[0];
  } catch (error) {
    console.error('获取习惯统计信息失败:', error);
    throw new Error('获取习惯统计信息失败');
  }
}
