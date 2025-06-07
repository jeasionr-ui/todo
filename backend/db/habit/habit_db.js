import { Habit, HabitCompletion } from '../../entity/habit/HabitType.js';
import { generateId } from '../../utils/common.js';

/**
 * 习惯数据库操作类
 */
class HabitDB {
  constructor(connection) {
    this.connection = connection;
  }

  /**
   * 创建新习惯
   * @param {Habit} habit - 习惯实体对象
   * @returns {Promise<string>} 返回创建的习惯ID
   */
  async createHabit(habit) {
    try {
      const habitId = generateId();
      const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // 转换为 MySQL DATETIME 格式
      
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
      
      await this.connection.execute(sql, values);
      return habitId;
    } catch (error) {
      console.error('创建习惯失败:', error);
      throw new Error('创建习惯失败');
    }
  }

  /**
   * 根据ID获取习惯
   * @param {string} habitId - 习惯ID
   * @returns {Promise<Habit|null>} 返回习惯实体对象或null
   */
  async getHabitById(habitId) {
    try {
      const sql = 'SELECT * FROM habit WHERE id = ? AND isArchived = FALSE';
      const [rows] = await this.connection.execute(sql, [habitId]);
      
      if (rows.length === 0) {
        return null;
      }
      
      return Habit.fromDatabaseFormat(rows[0]);
    } catch (error) {
      console.error('获取习惯失败:', error);
      throw new Error('获取习惯失败');
    }
  }

  /**
   * 获取所有习惯列表
   * @param {Object} options - 查询选项
   * @param {boolean} options.includeArchived - 是否包含已归档的习惯
   * @param {string} options.category - 按分类筛选
   * @param {number} options.limit - 限制数量
   * @param {number} options.offset - 偏移量
   * @returns {Promise<Array<Habit>>} 返回习惯实体对象数组
   */
  async getAllHabits(options = {}) {
    try {
      let sql = 'SELECT * FROM habit WHERE 1=1';
      const values = [];
      
      // 是否包含已归档的习惯
      if (!options.includeArchived) {
        sql += ' AND isArchived = FALSE';
      }
      
      // 按分类筛选
      if (options.category) {
        sql += ' AND category = ?';
        values.push(options.category);
      }
      
      // 排序
      sql += ' ORDER BY createdAt DESC';
      
      // 分页
      if (options.limit) {
        sql += ' LIMIT ?';
        values.push(options.limit);
        
        if (options.offset) {
          sql += ' OFFSET ?';
          values.push(options.offset);
        }
      }
      
      const [rows] = await this.connection.execute(sql, values);
      return rows.map(row => Habit.fromDatabaseFormat(row));
    } catch (error) {
      console.error('获取习惯列表失败:', error);
      throw new Error('获取习惯列表失败');
    }
  }

  /**
   * 更新习惯
   * @param {string} habitId - 习惯ID
   * @param {Habit} habit - 更新的习惯实体对象
   * @returns {Promise<boolean>} 返回是否更新成功
   */
  async updateHabit(habitId, habit) {
    try {
      habit.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' '); // 转换为 MySQL DATETIME 格式
      const habitData = habit.toDatabaseFormat();
      
      const sql = `
        UPDATE habit SET
          name = ?, description = ?, category = ?, tags = ?, frequencyType = ?,
          daysOfWeek = ?, daysOfMonth = ?, startDate = ?, endDate = ?, reminderTime = ?,
          reminderType = ?, reminderLocation = ?, color = ?, icon = ?, cronExpression = ?,
          isArchived = ?, updatedAt = ?, streakCount = ?, longestStreak = ?,
          totalCompletions = ?, lastCompletedAt = ?
        WHERE id = ?
      `;
      
      const values = [
        habitData.name, habitData.description, habitData.category, habitData.tags,
        habitData.frequencyType, habitData.daysOfWeek, habitData.daysOfMonth,
        habitData.startDate, habitData.endDate, habitData.reminderTime, habitData.reminderType,
        habitData.reminderLocation, habitData.color, habitData.icon, habitData.cronExpression,
        habitData.isArchived, habitData.updatedAt, habitData.streakCount,
        habitData.longestStreak, habitData.totalCompletions, habitData.lastCompletedAt,
        habitId
      ];
      
      const [result] = await this.connection.execute(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('更新习惯失败:', error);
      throw new Error('更新习惯失败');
    }
  }

  /**
   * 删除习惯（软删除，设置为已归档）
   * @param {string} habitId - 习惯ID
   * @returns {Promise<boolean>} 返回是否删除成功
   */
  async deleteHabit(habitId) {
    try {
      const sql = 'UPDATE habit SET isArchived = TRUE, updatedAt = ? WHERE id = ?';
      const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // 转换为 MySQL DATETIME 格式
      
      const [result] = await this.connection.execute(sql, [now, habitId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('删除习惯失败:', error);
      throw new Error('删除习惯失败');
    }
  }

  /**
   * 永久删除习惯
   * @param {string} habitId - 习惯ID
   * @returns {Promise<boolean>} 返回是否删除成功
   */
  async permanentDeleteHabit(habitId) {
    try {
      // 先删除相关的完成记录
      await this.deleteAllCompletionsByHabitId(habitId);
      
      // 再删除习惯本身
      const sql = 'DELETE FROM habit WHERE id = ?';
      const [result] = await this.connection.execute(sql, [habitId]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('永久删除习惯失败:', error);
      throw new Error('永久删除习惯失败');
    }
  }

  /**
   * 创建习惯完成记录
   * @param {HabitCompletion} completion - 完成记录实体对象
   * @returns {Promise<string>} 返回创建的完成记录ID
   */
  async createCompletion(completion) {
    try {
      const completionId = generateId();
      const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // 转换为 MySQL DATETIME 格式
      
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
      
      await this.connection.execute(sql, values);
      return completionId;
    } catch (error) {
      console.error('创建完成记录失败:', error);
      throw new Error('创建完成记录失败');
    }
  }

  /**
   * 更新习惯完成记录
   * @param {string} completionId - 完成记录ID
   * @param {Object} updateData - 要更新的数据
   * @returns {Promise<boolean>} 返回是否更新成功
   */
  async updateCompletion(completionId, updateData) {
    try {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // 转换为 MySQL DATETIME 格式
      updateData.updatedAt = now;
      
      const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updateData);
      values.push(completionId);
      
      const sql = `UPDATE habit_completion SET ${fields} WHERE id = ?`;
      
      const [result] = await this.connection.execute(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('更新完成记录失败:', error);
      throw new Error('更新完成记录失败');
    }
  }

  /**
   * 获取习惯的完成历史记录
   * @param {string} habitId - 习惯ID
   * @param {string} startDate - 开始日期 (可选)
   * @param {string} endDate - 结束日期 (可选)
   * @returns {Promise<Array<HabitCompletion>>} 返回完成记录数组
   */
  async getCompletionHistory(habitId, startDate = null, endDate = null) {
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
      
      const [rows] = await this.connection.execute(sql, values);
      return rows.map(row => new HabitCompletion(row));
    } catch (error) {
      console.error('获取完成历史记录失败:', error);
      throw new Error('获取完成历史记录失败');
    }
  }

  /**
   * 删除习惯的所有完成记录
   * @param {string} habitId - 习惯ID
   * @returns {Promise<boolean>} 返回是否删除成功
   */
  async deleteAllCompletionsByHabitId(habitId) {
    try {
      const sql = 'DELETE FROM habit_completion WHERE habitId = ?';
      const [result] = await this.connection.execute(sql, [habitId]);
      
      return result.affectedRows >= 0; // 即使没有记录也算成功
    } catch (error) {
      console.error('删除完成记录失败:', error);
      throw new Error('删除完成记录失败');
    }
  }

  /**
   * 获取习惯统计信息
   * @param {string} habitId - 习惯ID
   * @returns {Promise<Object>} 返回统计信息
   */
  async getHabitStats(habitId) {
    try {
      const sql = `
        SELECT 
          COUNT(*) as totalRecords,
          SUM(CASE WHEN isCompleted = TRUE THEN 1 ELSE 0 END) as completedCount,
          MAX(date) as lastRecordDate
        FROM habit_completion 
        WHERE habitId = ?
      `;
      
      const [rows] = await this.connection.execute(sql, [habitId]);
      
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
}

export default HabitDB;
