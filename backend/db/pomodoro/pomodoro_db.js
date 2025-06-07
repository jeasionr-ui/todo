// 番茄钟数据库操作函数

import { query, execute } from '../exec_api.js';
import { generateId } from '../../utils/common.js';
import { PomodoroTemplate, PomodoroSession, PomodoroPause, PomodoroStats } from '../../entity/pomodoro/PomodoroType.js';

/**
 * 获取所有番茄钟模板
 */
export async function getAllTemplatesDb(options = {}) {
  try {
    let sql = 'SELECT * FROM pomodoro_template WHERE 1=1';
    const values = [];

    // 是否包含已归档的模板
    if (!options.includeArchived) {
      sql += ' AND isArchived = FALSE';
    }

    // 排序
    sql += ' ORDER BY isDefault DESC, createdAt DESC';

    // 分页
    if (options.limit) {
      sql += ' LIMIT ?';
      values.push(options.limit);

      if (options.offset) {
        sql += ' OFFSET ?';
        values.push(options.offset);
      }
    }

    const rows = await query(sql, values);
    return rows.map(row => PomodoroTemplate.fromDatabaseFormat(row));
  } catch (error) {
    console.error('获取番茄钟模板列表失败:', error);
    throw new Error('获取番茄钟模板列表失败');
  }
}

/**
 * 获取模板总数（用于分页）
 */
export async function countTemplatesDb(options = {}) {
  try {
    let sql = 'SELECT COUNT(*) as count FROM pomodoro_template WHERE 1=1';
    const values = [];

    if (!options.includeArchived) {
      sql += ' AND isArchived = FALSE';
    }

    const rows = await query(sql, values);
    return rows[0].count;
  } catch (error) {
    console.error('获取模板总数失败:', error);
    throw new Error('获取模板总数失败');
  }
}

/**
 * 根据ID获取模板
 */
export async function getTemplateByIdDb(templateId) {
  try {
    const sql = 'SELECT * FROM pomodoro_template WHERE id = ?';
    const rows = await query(sql, [templateId]);

    if (rows.length === 0) {
      return null;
    }

    return PomodoroTemplate.fromDatabaseFormat(rows[0]);
  } catch (error) {
    console.error('获取模板详情失败:', error);
    throw new Error('获取模板详情失败');
  }
}

/**
 * 获取默认模板
 */
export async function getDefaultTemplateDb() {
  try {
    const sql = 'SELECT * FROM pomodoro_template WHERE isDefault = TRUE AND isArchived = FALSE LIMIT 1';
    const rows = await query(sql);

    if (rows.length === 0) {
      return null;
    }

    return PomodoroTemplate.fromDatabaseFormat(rows[0]);
  } catch (error) {
    console.error('获取默认模板失败:', error);
    throw new Error('获取默认模板失败');
  }
}

/**
 * 创建新模板
 */
export async function createTemplateDb(template) {
  try {
    const templateId = generateId();
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    template.id = templateId;
    template.createdAt = now;
    template.updatedAt = now;

    const templateData = template.toDatabaseFormat();

    const sql = `
      INSERT INTO pomodoro_template (
        id, name, description, workDuration, shortBreakDuration, longBreakDuration,
        roundsBeforeLongBreak, autoStartBreak, autoStartWork, enableNotifications,
        enableSounds, focusMode, isDefault, isArchived, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      templateData.id, templateData.name, templateData.description,
      templateData.workDuration, templateData.shortBreakDuration, templateData.longBreakDuration,
      templateData.roundsBeforeLongBreak, templateData.autoStartBreak, templateData.autoStartWork,
      templateData.enableNotifications, templateData.enableSounds, templateData.focusMode,
      templateData.isDefault, templateData.isArchived, templateData.createdAt, templateData.updatedAt
    ];

    await execute(sql, values);
    return templateId;
  } catch (error) {
    console.error('创建模板失败:', error);
    throw new Error('创建模板失败');
  }
}

/**
 * 更新模板
 */
export async function updateTemplateDb(templateId, updateData) {
  try {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    updateData.updatedAt = now;

    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(templateId);

    const sql = `UPDATE pomodoro_template SET ${fields} WHERE id = ?`;

    const result = await execute(sql, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('更新模板失败:', error);
    throw new Error('更新模板失败');
  }
}

/**
 * 删除模板
 */
export async function deleteTemplateDb(templateId, permanent = false) {
  try {
    if (permanent) {
      // 永久删除
      const result = await execute('DELETE FROM pomodoro_template WHERE id = ?', [templateId]);
      return result.affectedRows > 0;
    } else {
      // 归档
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const result = await execute(
        'UPDATE pomodoro_template SET isArchived = ?, updatedAt = ? WHERE id = ?',
        [true, now, templateId]
      );
      return result.affectedRows > 0;
    }
  } catch (error) {
    console.error('删除模板失败:', error);
    throw new Error('删除模板失败');
  }
}

/**
 * 设置默认模板
 */
export async function setDefaultTemplateDb(templateId) {
  try {
    // 先取消所有默认设置
    await execute('UPDATE pomodoro_template SET isDefault = FALSE');
    
    // 设置新的默认模板
    const result = await execute(
      'UPDATE pomodoro_template SET isDefault = TRUE WHERE id = ?',
      [templateId]
    );
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error('设置默认模板失败:', error);
    throw new Error('设置默认模板失败');
  }
}

/**
 * 获取所有番茄钟会话
 */
export async function getAllSessionsDb(options = {}) {
  try {
    let sql = 'SELECT * FROM pomodoro_session WHERE 1=1';
    const values = [];

    // 是否包含已归档的会话
    if (!options.includeArchived) {
      sql += ' AND isArchived = FALSE';
    }

    // 按状态筛选
    if (options.status) {
      sql += ' AND status = ?';
      values.push(options.status);
    }

    // 按类型筛选
    if (options.type) {
      sql += ' AND type = ?';
      values.push(options.type);
    }

    // 按任务ID筛选
    if (options.taskId) {
      sql += ' AND taskId = ?';
      values.push(options.taskId);
    }

    // 按日期范围筛选
    if (options.startDate) {
      sql += ' AND DATE(createdAt) >= ?';
      values.push(options.startDate);
    }

    if (options.endDate) {
      sql += ' AND DATE(createdAt) <= ?';
      values.push(options.endDate);
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

    const rows = await query(sql, values);
    return rows.map(row => PomodoroSession.fromDatabaseFormat(row));
  } catch (error) {
    console.error('获取番茄钟会话列表失败:', error);
    throw new Error('获取番茄钟会话列表失败');
  }
}

/**
 * 获取会话总数（用于分页）
 */
export async function countSessionsDb(options = {}) {
  try {
    let sql = 'SELECT COUNT(*) as count FROM pomodoro_session WHERE 1=1';
    const values = [];

    if (!options.includeArchived) {
      sql += ' AND isArchived = FALSE';
    }

    if (options.status) {
      sql += ' AND status = ?';
      values.push(options.status);
    }

    if (options.type) {
      sql += ' AND type = ?';
      values.push(options.type);
    }

    if (options.taskId) {
      sql += ' AND taskId = ?';
      values.push(options.taskId);
    }

    if (options.startDate) {
      sql += ' AND DATE(createdAt) >= ?';
      values.push(options.startDate);
    }

    if (options.endDate) {
      sql += ' AND DATE(createdAt) <= ?';
      values.push(options.endDate);
    }

    const rows = await query(sql, values);
    return rows[0].count;
  } catch (error) {
    console.error('获取会话总数失败:', error);
    throw new Error('获取会话总数失败');
  }
}

/**
 * 根据ID获取会话
 */
export async function getSessionByIdDb(sessionId) {
  try {
    const sql = 'SELECT * FROM pomodoro_session WHERE id = ?';
    const rows = await query(sql, [sessionId]);

    if (rows.length === 0) {
      return null;
    }

    return PomodoroSession.fromDatabaseFormat(rows[0]);
  } catch (error) {
    console.error('获取会话详情失败:', error);
    throw new Error('获取会话详情失败');
  }
}

/**
 * 创建新会话
 */
export async function createSessionDb(session) {
  try {
    const sessionId = generateId();
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    session.id = sessionId;
    session.createdAt = now;
    session.updatedAt = now;

    const sessionData = session.toDatabaseFormat();

    const sql = `
      INSERT INTO pomodoro_session (
        id, templateId, taskId, type, status, plannedDuration, actualDuration,
        startTime, endTime, pausedDuration, pauseCount, interruptions, notes,
        productivity, mood, energy, tags, isArchived, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      sessionData.id, sessionData.templateId, sessionData.taskId, sessionData.type,
      sessionData.status, sessionData.plannedDuration, sessionData.actualDuration,
      sessionData.startTime, sessionData.endTime, sessionData.pausedDuration,
      sessionData.pauseCount, sessionData.interruptions, sessionData.notes,
      sessionData.productivity, sessionData.mood, sessionData.energy, sessionData.tags,
      sessionData.isArchived, sessionData.createdAt, sessionData.updatedAt
    ];

    await execute(sql, values);
    return sessionId;
  } catch (error) {
    console.error('创建会话失败:', error);
    throw new Error('创建会话失败');
  }
}

/**
 * 更新会话
 */
export async function updateSessionDb(sessionId, updateData) {
  try {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    updateData.updatedAt = now;

    // 处理标签字段
    if (updateData.tags && Array.isArray(updateData.tags)) {
      updateData.tags = updateData.tags.join(',');
    }

    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(sessionId);

    const sql = `UPDATE pomodoro_session SET ${fields} WHERE id = ?`;

    const result = await execute(sql, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('更新会话失败:', error);
    throw new Error('更新会话失败');
  }
}

/**
 * 删除会话
 */
export async function deleteSessionDb(sessionId, permanent = false) {
  try {
    if (permanent) {
      // 永久删除：先删除暂停记录，再删除会话
      await execute('DELETE FROM pomodoro_pause WHERE sessionId = ?', [sessionId]);
      const result = await execute('DELETE FROM pomodoro_session WHERE id = ?', [sessionId]);
      return result.affectedRows > 0;
    } else {
      // 归档
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const result = await execute(
        'UPDATE pomodoro_session SET isArchived = ?, updatedAt = ? WHERE id = ?',
        [true, now, sessionId]
      );
      return result.affectedRows > 0;
    }
  } catch (error) {
    console.error('删除会话失败:', error);
    throw new Error('删除会话失败');
  }
}

/**
 * 获取当前运行中的会话
 */
export async function getActiveSessionDb() {
  try {
    const sql = 'SELECT * FROM pomodoro_session WHERE status IN ("running", "paused") ORDER BY startTime DESC LIMIT 1';
    const rows = await query(sql);

    if (rows.length === 0) {
      return null;
    }

    return PomodoroSession.fromDatabaseFormat(rows[0]);
  } catch (error) {
    console.error('获取活跃会话失败:', error);
    throw new Error('获取活跃会话失败');
  }
}

/**
 * 创建暂停记录
 */
export async function createPauseDb(pause) {
  try {
    const pauseId = generateId();
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    pause.id = pauseId;
    pause.createdAt = now;

    const pauseData = pause.toDatabaseFormat();

    const sql = `
      INSERT INTO pomodoro_pause (id, sessionId, pauseTime, resumeTime, duration, reason, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      pauseData.id, pauseData.sessionId, pauseData.pauseTime, pauseData.resumeTime,
      pauseData.duration, pauseData.reason, pauseData.createdAt
    ];

    await execute(sql, values);
    return pauseId;
  } catch (error) {
    console.error('创建暂停记录失败:', error);
    throw new Error('创建暂停记录失败');
  }
}

/**
 * 更新暂停记录
 */
export async function updatePauseDb(pauseId, updateData) {
  try {
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(pauseId);

    const sql = `UPDATE pomodoro_pause SET ${fields} WHERE id = ?`;

    const result = await execute(sql, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('更新暂停记录失败:', error);
    throw new Error('更新暂停记录失败');
  }
}

/**
 * 获取会话的暂停记录
 */
export async function getSessionPausesDb(sessionId) {
  try {
    const sql = 'SELECT * FROM pomodoro_pause WHERE sessionId = ? ORDER BY pauseTime ASC';
    const rows = await query(sql, [sessionId]);
    return rows.map(row => PomodoroPause.fromDatabaseFormat(row));
  } catch (error) {
    console.error('获取暂停记录失败:', error);
    throw new Error('获取暂停记录失败');
  }
}

/**
 * 获取统计数据
 */
export async function getStatsDb(date) {
  try {
    const sql = 'SELECT * FROM pomodoro_stats WHERE date = ?';
    const rows = await query(sql, [date]);

    if (rows.length === 0) {
      return null;
    }

    return PomodoroStats.fromDatabaseFormat(rows[0]);
  } catch (error) {
    console.error('获取统计数据失败:', error);
    throw new Error('获取统计数据失败');
  }
}

/**
 * 获取日期范围内的统计数据
 */
export async function getStatsRangeDb(startDate, endDate) {
  try {
    const sql = 'SELECT * FROM pomodoro_stats WHERE date >= ? AND date <= ? ORDER BY date ASC';
    const rows = await query(sql, [startDate, endDate]);
    return rows.map(row => PomodoroStats.fromDatabaseFormat(row));
  } catch (error) {
    console.error('获取统计数据范围失败:', error);
    throw new Error('获取统计数据范围失败');
  }
}

/**
 * 创建或更新统计数据
 */
export async function upsertStatsDb(stats) {
  try {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    if (!stats.id) {
      stats.id = generateId();
      stats.createdAt = now;
    }
    stats.updatedAt = now;

    const statsData = stats.toDatabaseFormat();

    const sql = `
      INSERT INTO pomodoro_stats (
        id, date, totalSessions, completedSessions, totalWorkTime, totalBreakTime,
        totalPauseTime, averageProductivity, averageMood, averageEnergy, interruptions,
        tasksCompleted, longestFocusSession, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        totalSessions = VALUES(totalSessions),
        completedSessions = VALUES(completedSessions),
        totalWorkTime = VALUES(totalWorkTime),
        totalBreakTime = VALUES(totalBreakTime),
        totalPauseTime = VALUES(totalPauseTime),
        averageProductivity = VALUES(averageProductivity),
        averageMood = VALUES(averageMood),
        averageEnergy = VALUES(averageEnergy),
        interruptions = VALUES(interruptions),
        tasksCompleted = VALUES(tasksCompleted),
        longestFocusSession = VALUES(longestFocusSession),
        updatedAt = VALUES(updatedAt)
    `;

    const values = [
      statsData.id, statsData.date, statsData.totalSessions, statsData.completedSessions,
      statsData.totalWorkTime, statsData.totalBreakTime, statsData.totalPauseTime,
      statsData.averageProductivity, statsData.averageMood, statsData.averageEnergy,
      statsData.interruptions, statsData.tasksCompleted, statsData.longestFocusSession,
      statsData.createdAt, statsData.updatedAt
    ];

    await execute(sql, values);
    return statsData.id;
  } catch (error) {
    console.error('创建或更新统计数据失败:', error);
    throw new Error('创建或更新统计数据失败');
  }
}
