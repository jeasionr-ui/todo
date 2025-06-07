// 番茄钟业务逻辑函数

import {
  getAllTemplatesDb, getTemplateByIdDb, getDefaultTemplateDb, createTemplateDb,
  updateTemplateDb, deleteTemplateDb, setDefaultTemplateDb, countTemplatesDb,
  getAllSessionsDb, getSessionByIdDb, createSessionDb, updateSessionDb,
  deleteSessionDb, getActiveSessionDb, countSessionsDb,
  createPauseDb, updatePauseDb, getSessionPausesDb,
  getStatsDb, getStatsRangeDb, upsertStatsDb
} from '../../db/pomodoro/pomodoro_db.js';
import { PomodoroTemplateDTO, PomodoroSessionDTO, PomodoroPauseDTO, PomodoroStatsDTO } from '../../dto/pomodoro/PomodoroDTO.js';

/**
 * 获取所有番茄钟模板（支持分页）
 */
export async function getAllTemplates(options = {}) {
  try {
    const templates = await getAllTemplatesDb(options);
    const total = await countTemplatesDb(options);

    return {
      success: true,
      data: templates.map(template => new PomodoroTemplateDTO(template)),
      total,
      pagination: {
        page: Math.floor((options.offset || 0) / (options.limit || 10)) + 1,
        pageSize: options.limit || 10,
        total
      }
    };
  } catch (error) {
    console.error('获取模板列表失败:', error);
    return {
      success: false,
      message: '获取模板列表失败',
      error: error.message
    };
  }
}

/**
 * 根据ID获取模板
 */
export async function getTemplateById(templateId) {
  try {
    const template = await getTemplateByIdDb(templateId);

    if (!template) {
      return {
        success: false,
        message: '模板不存在'
      };
    }

    return {
      success: true,
      data: new PomodoroTemplateDTO(template)
    };
  } catch (error) {
    console.error('获取模板详情失败:', error);
    return {
      success: false,
      message: '获取模板详情失败',
      error: error.message
    };
  }
}

/**
 * 获取默认模板
 */
export async function getDefaultTemplate() {
  try {
    let template = await getDefaultTemplateDb();

    // 如果没有默认模板，创建一个
    if (!template) {
      const defaultTemplateData = {
        name: '经典番茄钟',
        description: '25分钟工作，5分钟短休息，15分钟长休息',
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        roundsBeforeLongBreak: 4,
        autoStartBreak: true,
        autoStartWork: false,
        enableNotifications: true,
        enableSounds: true,
        focusMode: false,
        isDefault: true
      };

      const createResult = await createTemplate(defaultTemplateData);
      if (createResult.success) {
        template = await getTemplateByIdDb(createResult.data.id);
      }
    }

    if (!template) {
      return {
        success: false,
        message: '获取默认模板失败'
      };
    }

    return {
      success: true,
      data: new PomodoroTemplateDTO(template)
    };
  } catch (error) {
    console.error('获取默认模板失败:', error);
    return {
      success: false,
      message: '获取默认模板失败',
      error: error.message
    };
  }
}

/**
 * 创建新模板
 */
export async function createTemplate(templateData) {
  try {
    const validation = PomodoroTemplateDTO.validateAndCreateTemplate(templateData);

    if (!validation.isValid) {
      return {
        success: false,
        message: '模板数据验证失败',
        errors: validation.errors
      };
    }

    // 如果设置为默认模板，先取消其他默认设置
    if (validation.template.isDefault) {
      await setDefaultTemplateDb(null); // 取消所有默认设置
    }

    const templateId = await createTemplateDb(validation.template);
    const createdTemplate = await getTemplateByIdDb(templateId);

    return {
      success: true,
      data: new PomodoroTemplateDTO(createdTemplate),
      message: '模板创建成功'
    };
  } catch (error) {
    console.error('创建模板失败:', error);
    return {
      success: false,
      message: '创建模板失败',
      error: error.message
    };
  }
}

/**
 * 更新模板
 */
export async function updateTemplate(templateId, templateData) {
  try {
    const existingTemplate = await getTemplateByIdDb(templateId);

    if (!existingTemplate) {
      return {
        success: false,
        message: '模板不存在'
      };
    }

    const validation = PomodoroTemplateDTO.validateAndUpdateTemplate(templateData, existingTemplate);

    if (!validation.isValid) {
      return {
        success: false,
        message: '模板数据验证失败',
        errors: validation.errors
      };
    }

    // 如果设置为默认模板，先取消其他默认设置
    if (validation.template.isDefault) {
      await setDefaultTemplateDb(templateId);
    }

    const updateData = validation.template.toDatabaseFormat();
    delete updateData.id;
    delete updateData.createdAt;

    const updated = await updateTemplateDb(templateId, updateData);

    if (!updated) {
      return {
        success: false,
        message: '更新模板失败'
      };
    }

    const updatedTemplate = await getTemplateByIdDb(templateId);

    return {
      success: true,
      data: new PomodoroTemplateDTO(updatedTemplate),
      message: '模板更新成功'
    };
  } catch (error) {
    console.error('更新模板失败:', error);
    return {
      success: false,
      message: '更新模板失败',
      error: error.message
    };
  }
}

/**
 * 删除模板
 */
export async function deleteTemplate(templateId, permanent = false) {
  try {
    const template = await getTemplateByIdDb(templateId);

    if (!template) {
      return {
        success: false,
        message: '模板不存在'
      };
    }

    // 如果是默认模板，不能删除
    if (template.isDefault && !permanent) {
      return {
        success: false,
        message: '不能删除默认模板，请先设置其他模板为默认模板'
      };
    }

    const deleted = await deleteTemplateDb(templateId, permanent);

    if (!deleted) {
      return {
        success: false,
        message: '删除模板失败'
      };
    }

    return {
      success: true,
      message: permanent ? '模板已永久删除' : '模板已归档'
    };
  } catch (error) {
    console.error('删除模板失败:', error);
    return {
      success: false,
      message: '删除模板失败',
      error: error.message
    };
  }
}

/**
 * 设置默认模板
 */
export async function setDefaultTemplate(templateId) {
  try {
    const template = await getTemplateByIdDb(templateId);

    if (!template) {
      return {
        success: false,
        message: '模板不存在'
      };
    }

    const updated = await setDefaultTemplateDb(templateId);

    if (!updated) {
      return {
        success: false,
        message: '设置默认模板失败'
      };
    }

    return {
      success: true,
      message: '默认模板设置成功'
    };
  } catch (error) {
    console.error('设置默认模板失败:', error);
    return {
      success: false,
      message: '设置默认模板失败',
      error: error.message
    };
  }
}

/**
 * 获取所有番茄钟会话（支持分页）
 */
export async function getAllSessions(options = {}) {
  try {
    const sessions = await getAllSessionsDb(options);
    const total = await countSessionsDb(options);

    return {
      success: true,
      data: sessions.map(session => new PomodoroSessionDTO(session)),
      total,
      pagination: {
        page: Math.floor((options.offset || 0) / (options.limit || 10)) + 1,
        pageSize: options.limit || 10,
        total
      }
    };
  } catch (error) {
    console.error('获取会话列表失败:', error);
    return {
      success: false,
      message: '获取会话列表失败',
      error: error.message
    };
  }
}

/**
 * 根据ID获取会话
 */
export async function getSessionById(sessionId, includePauses = false) {
  try {
    const session = await getSessionByIdDb(sessionId);

    if (!session) {
      return {
        success: false,
        message: '会话不存在'
      };
    }

    const sessionDTO = new PomodoroSessionDTO(session);

    // 如果需要包含暂停记录
    if (includePauses) {
      const pauses = await getSessionPausesDb(sessionId);
      sessionDTO.pauses = pauses.map(pause => new PomodoroPauseDTO(pause));
    }

    return {
      success: true,
      data: sessionDTO
    };
  } catch (error) {
    console.error('获取会话详情失败:', error);
    return {
      success: false,
      message: '获取会话详情失败',
      error: error.message
    };
  }
}

/**
 * 获取当前活跃的会话
 */
export async function getActiveSession() {
  try {
    const session = await getActiveSessionDb();

    if (!session) {
      return {
        success: true,
        data: null,
        message: '没有活跃的会话'
      };
    }

    return {
      success: true,
      data: new PomodoroSessionDTO(session)
    };
  } catch (error) {
    console.error('获取活跃会话失败:', error);
    return {
      success: false,
      message: '获取活跃会话失败',
      error: error.message
    };
  }
}

/**
 * 创建新会话
 */
export async function createSession(sessionData) {
  try {
    // 检查是否有活跃的会话
    const activeSession = await getActiveSessionDb();
    if (activeSession) {
      return {
        success: false,
        message: '已有活跃的会话，请先完成或取消当前会话'
      };
    }

    const validation = PomodoroSessionDTO.validateAndCreateSession(sessionData);

    if (!validation.isValid) {
      return {
        success: false,
        message: '会话数据验证失败',
        errors: validation.errors
      };
    }

    const sessionId = await createSessionDb(validation.session);
    const createdSession = await getSessionByIdDb(sessionId);

    return {
      success: true,
      data: new PomodoroSessionDTO(createdSession),
      message: '会话创建成功'
    };
  } catch (error) {
    console.error('创建会话失败:', error);
    return {
      success: false,
      message: '创建会话失败',
      error: error.message
    };
  }
}

/**
 * 开始会话
 */
export async function startSession(sessionId) {
  try {
    const session = await getSessionByIdDb(sessionId);

    if (!session) {
      return {
        success: false,
        message: '会话不存在'
      };
    }

    if (session.status !== 'pending' && session.status !== 'paused') {
      return {
        success: false,
        message: '只能开始待定或暂停状态的会话'
      };
    }

    // 检查是否有其他活跃的会话
    const activeSession = await getActiveSessionDb();
    if (activeSession && activeSession.id !== sessionId) {
      return {
        success: false,
        message: '已有其他活跃的会话，请先完成或取消'
      };
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updateData = {
      status: 'running'
    };

    // 如果是第一次开始，设置开始时间
    if (session.status === 'pending') {
      updateData.startTime = now;
    }

    const updated = await updateSessionDb(sessionId, updateData);

    if (!updated) {
      return {
        success: false,
        message: '开始会话失败'
      };
    }

    const updatedSession = await getSessionByIdDb(sessionId);

    return {
      success: true,
      data: new PomodoroSessionDTO(updatedSession),
      message: '会话已开始'
    };
  } catch (error) {
    console.error('开始会话失败:', error);
    return {
      success: false,
      message: '开始会话失败',
      error: error.message
    };
  }
}

/**
 * 暂停会话
 */
export async function pauseSession(sessionId, reason = '') {
  try {
    const session = await getSessionByIdDb(sessionId);

    if (!session) {
      return {
        success: false,
        message: '会话不存在'
      };
    }

    if (session.status !== 'running') {
      return {
        success: false,
        message: '只能暂停运行中的会话'
      };
    }

    // 创建暂停记录
    const pauseData = {
      sessionId: sessionId,
      pauseTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      reason: reason
    };

    const pauseValidation = PomodoroPauseDTO.validateAndCreatePause(pauseData);
    if (pauseValidation.isValid) {
      await createPauseDb(pauseValidation.pause);
    }

    // 更新会话状态
    const updateData = {
      status: 'paused',
      pauseCount: session.pauseCount + 1
    };

    const updated = await updateSessionDb(sessionId, updateData);

    if (!updated) {
      return {
        success: false,
        message: '暂停会话失败'
      };
    }

    const updatedSession = await getSessionByIdDb(sessionId);

    return {
      success: true,
      data: new PomodoroSessionDTO(updatedSession),
      message: '会话已暂停'
    };
  } catch (error) {
    console.error('暂停会话失败:', error);
    return {
      success: false,
      message: '暂停会话失败',
      error: error.message
    };
  }
}

/**
 * 恢复会话
 */
export async function resumeSession(sessionId) {
  try {
    const session = await getSessionByIdDb(sessionId);

    if (!session) {
      return {
        success: false,
        message: '会话不存在'
      };
    }

    if (session.status !== 'paused') {
      return {
        success: false,
        message: '只能恢复暂停状态的会话'
      };
    }

    // 更新最后一条暂停记录的恢复时间
    const pauses = await getSessionPausesDb(sessionId);
    const lastPause = pauses.find(pause => !pause.resumeTime);
    
    if (lastPause) {
      const resumeTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const pauseStart = new Date(lastPause.pauseTime);
      const pauseEnd = new Date(resumeTime);
      const duration = Math.round((pauseEnd - pauseStart) / (1000 * 60)); // 分钟

      await updatePauseDb(lastPause.id, {
        resumeTime: resumeTime,
        duration: duration
      });

      // 更新会话的总暂停时间
      await updateSessionDb(sessionId, {
        pausedDuration: session.pausedDuration + duration
      });
    }

    // 更新会话状态
    const updated = await updateSessionDb(sessionId, { status: 'running' });

    if (!updated) {
      return {
        success: false,
        message: '恢复会话失败'
      };
    }

    const updatedSession = await getSessionByIdDb(sessionId);

    return {
      success: true,
      data: new PomodoroSessionDTO(updatedSession),
      message: '会话已恢复'
    };
  } catch (error) {
    console.error('恢复会话失败:', error);
    return {
      success: false,
      message: '恢复会话失败',
      error: error.message
    };
  }
}

/**
 * 完成会话
 */
export async function completeSession(sessionId, sessionData = {}) {
  try {
    const session = await getSessionByIdDb(sessionId);

    if (!session) {
      return {
        success: false,
        message: '会话不存在'
      };
    }

    if (session.status === 'completed') {
      return {
        success: false,
        message: '会话已经完成'
      };
    }

    // 如果会话正在暂停，先处理暂停记录
    if (session.status === 'paused') {
      const pauses = await getSessionPausesDb(sessionId);
      const lastPause = pauses.find(pause => !pause.resumeTime);
      
      if (lastPause) {
        const resumeTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const pauseStart = new Date(lastPause.pauseTime);
        const pauseEnd = new Date(resumeTime);
        const duration = Math.round((pauseEnd - pauseStart) / (1000 * 60));

        await updatePauseDb(lastPause.id, {
          resumeTime: resumeTime,
          duration: duration
        });

        sessionData.pausedDuration = session.pausedDuration + duration;
      }
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    // 计算实际时长
    let actualDuration = sessionData.actualDuration;
    if (!actualDuration && session.startTime) {
      const startTime = new Date(session.startTime);
      const endTime = new Date(now);
      actualDuration = Math.round((endTime - startTime) / (1000 * 60)) - (sessionData.pausedDuration || session.pausedDuration || 0);
    }

    const updateData = {
      status: 'completed',
      endTime: now,
      actualDuration: actualDuration || session.plannedDuration,
      ...sessionData
    };

    const updated = await updateSessionDb(sessionId, updateData);

    if (!updated) {
      return {
        success: false,
        message: '完成会话失败'
      };
    }

    const updatedSession = await getSessionByIdDb(sessionId);

    // 更新统计数据
    await updateDailyStats(updatedSession);

    return {
      success: true,
      data: new PomodoroSessionDTO(updatedSession),
      message: '会话已完成'
    };
  } catch (error) {
    console.error('完成会话失败:', error);
    return {
      success: false,
      message: '完成会话失败',
      error: error.message
    };
  }
}

/**
 * 取消会话
 */
export async function cancelSession(sessionId) {
  try {
    const session = await getSessionByIdDb(sessionId);

    if (!session) {
      return {
        success: false,
        message: '会话不存在'
      };
    }

    if (session.status === 'completed' || session.status === 'cancelled') {
      return {
        success: false,
        message: '会话已经结束'
      };
    }

    const updateData = {
      status: 'cancelled',
      endTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const updated = await updateSessionDb(sessionId, updateData);

    if (!updated) {
      return {
        success: false,
        message: '取消会话失败'
      };
    }

    const updatedSession = await getSessionByIdDb(sessionId);

    return {
      success: true,
      data: new PomodoroSessionDTO(updatedSession),
      message: '会话已取消'
    };
  } catch (error) {
    console.error('取消会话失败:', error);
    return {
      success: false,
      message: '取消会话失败',
      error: error.message
    };
  }
}

/**
 * 获取统计数据
 */
export async function getStats(date) {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const stats = await getStatsDb(targetDate);

    if (!stats) {
      // 如果没有统计数据，返回空数据
      const emptyStats = new PomodoroStats();
      emptyStats.date = targetDate;
      return {
        success: true,
        data: new PomodoroStatsDTO(emptyStats)
      };
    }

    return {
      success: true,
      data: new PomodoroStatsDTO(stats)
    };
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return {
      success: false,
      message: '获取统计数据失败',
      error: error.message
    };
  }
}

/**
 * 获取日期范围内的统计数据
 */
export async function getStatsRange(startDate, endDate) {
  try {
    const stats = await getStatsRangeDb(startDate, endDate);

    return {
      success: true,
      data: stats.map(stat => new PomodoroStatsDTO(stat))
    };
  } catch (error) {
    console.error('获取统计数据范围失败:', error);
    return {
      success: false,
      message: '获取统计数据范围失败',
      error: error.message
    };
  }
}

/**
 * 更新每日统计数据
 */
async function updateDailyStats(session) {
  try {
    const date = session.createdAt.split(' ')[0]; // 提取日期部分
    let stats = await getStatsDb(date);

    if (!stats) {
      stats = new PomodoroStats();
      stats.date = date;
    }

    // 更新统计数据
    stats.totalSessions += 1;
    if (session.status === 'completed') {
      stats.completedSessions += 1;
    }

    if (session.type === 'work' && session.actualDuration) {
      stats.totalWorkTime += session.actualDuration;
      if (session.actualDuration > stats.longestFocusSession) {
        stats.longestFocusSession = session.actualDuration;
      }
    } else if (session.type !== 'work' && session.actualDuration) {
      stats.totalBreakTime += session.actualDuration;
    }

    if (session.pausedDuration) {
      stats.totalPauseTime += session.pausedDuration;
    }

    if (session.interruptions) {
      stats.interruptions += session.interruptions;
    }

    // 重新计算平均值
    const completedSessions = await getAllSessionsDb({
      startDate: date,
      endDate: date,
      status: 'completed'
    });

    if (completedSessions.length > 0) {
      // 计算平均生产力
      const productivityValues = completedSessions
        .filter(s => s.productivity)
        .map(s => {
          const mapping = { very_low: 1, low: 2, medium: 3, high: 4, very_high: 5 };
          return mapping[s.productivity] || 3;
        });
      
      if (productivityValues.length > 0) {
        stats.averageProductivity = productivityValues.reduce((a, b) => a + b, 0) / productivityValues.length;
      }

      // 计算平均心情
      const moodValues = completedSessions
        .filter(s => s.mood)
        .map(s => {
          const mapping = { very_bad: 1, bad: 2, neutral: 3, good: 4, very_good: 5 };
          return mapping[s.mood] || 3;
        });
      
      if (moodValues.length > 0) {
        stats.averageMood = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
      }

      // 计算平均精力
      const energyValues = completedSessions
        .filter(s => s.energy)
        .map(s => {
          const mapping = { very_low: 1, low: 2, medium: 3, high: 4, very_high: 5 };
          return mapping[s.energy] || 3;
        });
      
      if (energyValues.length > 0) {
        stats.averageEnergy = energyValues.reduce((a, b) => a + b, 0) / energyValues.length;
      }
    }

    await upsertStatsDb(stats);
  } catch (error) {
    console.error('更新每日统计数据失败:', error);
    // 不抛出错误，因为这不应该影响主要功能
  }
}

/**
 * 获取会话历史
 */
export async function getSessionHistory(options = {}) {
  try {
    const sessions = await getAllSessionsDb(options);
    const total = await countSessionsDb(options);

    return {
      success: true,
      data: sessions.map(session => new PomodoroSessionDTO(session)),
      total,
      pagination: {
        page: Math.floor((options.offset || 0) / (options.limit || 10)) + 1,
        pageSize: options.limit || 10,
        total
      }
    };
  } catch (error) {
    console.error('获取会话历史失败:', error);
    return {
      success: false,
      message: '获取会话历史失败',
      error: error.message
    };
  }
}

/**
 * 获取每日统计
 */
export async function getDailyStats(options = {}) {
  try {
    if (options.date) {
      // 获取单日统计
      const stats = await getStatsDb(options.date);
      return {
        success: true,
        data: stats ? new PomodoroStatsDTO(stats) : null
      };
    } else if (options.startDate && options.endDate) {
      // 获取日期范围统计
      const stats = await getStatsRangeDb(options.startDate, options.endDate);
      return {
        success: true,
        data: stats.map(stat => new PomodoroStatsDTO(stat))
      };
    } else {
      // 获取今日统计
      const today = new Date().toISOString().split('T')[0];
      const stats = await getStatsDb(today);
      return {
        success: true,
        data: stats ? new PomodoroStatsDTO(stats) : null
      };
    }
  } catch (error) {
    console.error('获取每日统计失败:', error);
    return {
      success: false,
      message: '获取每日统计失败',
      error: error.message
    };
  }
}

/**
 * 获取每周统计
 */
export async function getWeeklyStats(options = {}) {
  try {
    const { weekStart, weeksCount = 4 } = options;
    
    // 计算周统计的日期范围
    const startDate = weekStart ? new Date(weekStart) : new Date();
    if (!weekStart) {
      // 如果没有指定开始日期，从本周一开始
      const dayOfWeek = startDate.getDay();
      const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate.setDate(diff);
    }
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (weeksCount * 7) - 1);
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    const stats = await getStatsRangeDb(startDateStr, endDateStr);
    
    // 按周分组统计
    const weeklyStats = [];
    for (let i = 0; i < weeksCount; i++) {
      const weekStartDate = new Date(startDate);
      weekStartDate.setDate(startDate.getDate() + (i * 7));
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekStartDate.getDate() + 6);
      
      const weekStartStr = weekStartDate.toISOString().split('T')[0];
      const weekEndStr = weekEndDate.toISOString().split('T')[0];
      
      const weekStats = stats.filter(stat => 
        stat.date >= weekStartStr && stat.date <= weekEndStr
      );
      
      // 汇总周统计
      const weekSummary = {
        weekStart: weekStartStr,
        weekEnd: weekEndStr,
        totalSessions: weekStats.reduce((sum, stat) => sum + stat.totalSessions, 0),
        completedSessions: weekStats.reduce((sum, stat) => sum + stat.completedSessions, 0),
        totalWorkTime: weekStats.reduce((sum, stat) => sum + stat.totalWorkTime, 0),
        totalBreakTime: weekStats.reduce((sum, stat) => sum + stat.totalBreakTime, 0),
        averageProductivity: weekStats.length > 0 
          ? weekStats.reduce((sum, stat) => sum + (stat.averageProductivity || 0), 0) / weekStats.length 
          : 0,
        dailyStats: weekStats.map(stat => new PomodoroStatsDTO(stat))
      };
      
      weeklyStats.push(weekSummary);
    }
    
    return {
      success: true,
      data: weeklyStats
    };
  } catch (error) {
    console.error('获取每周统计失败:', error);
    return {
      success: false,
      message: '获取每周统计失败',
      error: error.message
    };
  }
}

/**
 * 获取每月统计
 */
export async function getMonthlyStats(options = {}) {
  try {
    const { year = new Date().getFullYear(), month, monthsCount = 6 } = options;
    
    const monthlyStats = [];
    const startMonth = month || new Date().getMonth() + 1 - monthsCount + 1;
    
    for (let i = 0; i < monthsCount; i++) {
      const targetMonth = startMonth + i;
      const targetYear = year + Math.floor((targetMonth - 1) / 12);
      const normalizedMonth = ((targetMonth - 1) % 12) + 1;
      
      // 计算月份的开始和结束日期
      const monthStart = new Date(targetYear, normalizedMonth - 1, 1);
      const monthEnd = new Date(targetYear, normalizedMonth, 0);
      
      const startDateStr = monthStart.toISOString().split('T')[0];
      const endDateStr = monthEnd.toISOString().split('T')[0];
      
      const stats = await getStatsRangeDb(startDateStr, endDateStr);
      
      // 汇总月统计
      const monthSummary = {
        year: targetYear,
        month: normalizedMonth,
        monthName: monthStart.toLocaleDateString('zh-CN', { month: 'long' }),
        totalSessions: stats.reduce((sum, stat) => sum + stat.totalSessions, 0),
        completedSessions: stats.reduce((sum, stat) => sum + stat.completedSessions, 0),
        totalWorkTime: stats.reduce((sum, stat) => sum + stat.totalWorkTime, 0),
        totalBreakTime: stats.reduce((sum, stat) => sum + stat.totalBreakTime, 0),
        averageProductivity: stats.length > 0 
          ? stats.reduce((sum, stat) => sum + (stat.averageProductivity || 0), 0) / stats.length 
          : 0,
        daysActive: stats.filter(stat => stat.totalSessions > 0).length,
        dailyStats: stats.map(stat => new PomodoroStatsDTO(stat))
      };
      
      monthlyStats.push(monthSummary);
    }
    
    return {
      success: true,
      data: monthlyStats
    };
  } catch (error) {
    console.error('获取每月统计失败:', error);
    return {
      success: false,
      message: '获取每月统计失败',
      error: error.message
    };
  }
}

/**
 * 获取焦点模式设置
 */
export async function getFocusSettings() {
  try {
    // 这里可以从数据库或配置文件获取焦点模式设置
    // 暂时返回默认设置
    const defaultSettings = {
      disableNotifications: true,
      enableFullscreen: false,
      blockWebsites: false,
      blockedWebsites: [],
      playWhiteNoise: false,
      whiteNoiseType: 'rain',
      dimScreen: false,
      dimLevel: 30,
      hideTaskbar: false,
      enableBreakReminders: true,
      breakReminderTime: 5, // 分钟
      customMessage: '',
      enableAutoStart: false
    };
    
    return {
      success: true,
      data: defaultSettings
    };
  } catch (error) {
    console.error('获取焦点模式设置失败:', error);
    return {
      success: false,
      message: '获取焦点模式设置失败',
      error: error.message
    };
  }
}

/**
 * 更新焦点模式设置
 */
export async function updateFocusSettings(settings) {
  try {
    // 验证设置数据
    const validSettings = {
      disableNotifications: typeof settings.disableNotifications === 'boolean' 
        ? settings.disableNotifications : true,
      enableFullscreen: typeof settings.enableFullscreen === 'boolean' 
        ? settings.enableFullscreen : false,
      blockWebsites: typeof settings.blockWebsites === 'boolean' 
        ? settings.blockWebsites : false,
      blockedWebsites: Array.isArray(settings.blockedWebsites) 
        ? settings.blockedWebsites : [],
      playWhiteNoise: typeof settings.playWhiteNoise === 'boolean' 
        ? settings.playWhiteNoise : false,
      whiteNoiseType: settings.whiteNoiseType || 'rain',
      dimScreen: typeof settings.dimScreen === 'boolean' 
        ? settings.dimScreen : false,
      dimLevel: (typeof settings.dimLevel === 'number' && settings.dimLevel >= 0 && settings.dimLevel <= 100)
        ? settings.dimLevel : 30,
      hideTaskbar: typeof settings.hideTaskbar === 'boolean' 
        ? settings.hideTaskbar : false,
      enableBreakReminders: typeof settings.enableBreakReminders === 'boolean' 
        ? settings.enableBreakReminders : true,
      breakReminderTime: (typeof settings.breakReminderTime === 'number' && settings.breakReminderTime > 0)
        ? settings.breakReminderTime : 5,
      customMessage: settings.customMessage || '',
      enableAutoStart: typeof settings.enableAutoStart === 'boolean' 
        ? settings.enableAutoStart : false
    };
    
    // 这里应该保存到数据库或配置文件
    // 暂时直接返回设置
    
    return {
      success: true,
      message: '焦点模式设置更新成功',
      data: validSettings
    };
  } catch (error) {
    console.error('更新焦点模式设置失败:', error);
    return {
      success: false,
      message: '更新焦点模式设置失败',
      error: error.message
    };
  }
}
