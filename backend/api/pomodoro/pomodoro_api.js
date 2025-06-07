import express from 'express';
import {
  // 模板相关
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  
  // 会话相关
  getActiveSession,
  createSession,
  startSession,
  pauseSession,
  resumeSession,
  completeSession,
  cancelSession,
  getSessionById,
  getSessionHistory,
  
  // 统计相关
  getDailyStats,
  getWeeklyStats,
  getMonthlyStats,
  
  // 焦点模式相关
  getFocusSettings,
  updateFocusSettings
} from '../../biz/pomodoro/pomodoro_biz.js';

const router = express.Router();

// ==================== 模板管理 API ====================

/**
 * 获取所有番茄钟模板
 * GET /api/pomodoro/templates
 */
router.get('/templates', async (req, res) => {
  try {
    const result = await getAllTemplates();
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('获取模板列表API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

/**
 * 获取模板详情
 * GET /api/pomodoro/templates/:id
 */
router.get('/templates/:id', async (req, res) => {
  try {
    const templateId = req.params.id;
    const result = await getTemplateById(templateId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('获取模板详情API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

/**
 * 创建新模板
 * POST /api/pomodoro/templates
 */
router.post('/templates', async (req, res) => {
  try {
    const result = await createTemplate(req.body);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('创建模板API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

/**
 * 更新模板
 * PUT /api/pomodoro/templates/:id
 */
router.put('/templates/:id', async (req, res) => {
  try {
    const templateId = req.params.id;
    const result = await updateTemplate(templateId, req.body);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      if (result.message === '模板不存在') {
        res.status(404).json(result);
      } else {
        res.status(400).json(result);
      }
    }
  } catch (error) {
    console.error('更新模板API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

/**
 * 删除模板
 * DELETE /api/pomodoro/templates/:id
 */
router.delete('/templates/:id', async (req, res) => {
  try {
    const templateId = req.params.id;
    const result = await deleteTemplate(templateId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      if (result.message === '模板不存在') {
        res.status(404).json(result);
      } else {
        res.status(400).json(result);
      }
    }
  } catch (error) {
    console.error('删除模板API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// ==================== 会话管理 API ====================

/**
 * 获取当前活跃会话
 * GET /api/pomodoro/sessions/active
 */
router.get('/sessions/active', async (req, res) => {
  try {
    const result = await getActiveSession();
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('获取活跃会话API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

/**
 * 创建新会话
 * POST /api/pomodoro/sessions
 */
router.post('/sessions', async (req, res) => {
  try {
    const result = await createSession(req.body);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('创建会话API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

/**
 * 开始会话
 * POST /api/pomodoro/sessions/:id/start
 */
router.post('/sessions/:id/start', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const result = await startSession(sessionId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      if (result.message === '会话不存在') {
        res.status(404).json(result);
      } else {
        res.status(400).json(result);
      }
    }
  } catch (error) {
    console.error('开始会话API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

/**
 * 暂停会话
 * POST /api/pomodoro/sessions/:id/pause
 */
router.post('/sessions/:id/pause', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const result = await pauseSession(sessionId, req.body.reason);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      if (result.message === '会话不存在') {
        res.status(404).json(result);
      } else {
        res.status(400).json(result);
      }
    }
  } catch (error) {
    console.error('暂停会话API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

/**
 * 恢复会话
 * POST /api/pomodoro/sessions/:id/resume
 */
router.post('/sessions/:id/resume', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const result = await resumeSession(sessionId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      if (result.message === '会话不存在') {
        res.status(404).json(result);
      } else {
        res.status(400).json(result);
      }
    }
  } catch (error) {
    console.error('恢复会话API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

/**
 * 完成会话
 * POST /api/pomodoro/sessions/:id/complete
 */
router.post('/sessions/:id/complete', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { productivityRating, notes } = req.body;
    
    // Map productivityRating to productivity for database consistency
    const sessionData = { notes };
    if (productivityRating) {
      sessionData.productivity = productivityRating;
    }
    
    const result = await completeSession(sessionId, sessionData);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      if (result.message === '会话不存在') {
        res.status(404).json(result);
      } else {
        res.status(400).json(result);
      }
    }
  } catch (error) {
    console.error('完成会话API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

/**
 * 取消会话
 * POST /api/pomodoro/sessions/:id/cancel
 */
router.post('/sessions/:id/cancel', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { reason } = req.body;
    const result = await cancelSession(sessionId, reason);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      if (result.message === '会话不存在') {
        res.status(404).json(result);
      } else {
        res.status(400).json(result);
      }
    }
  } catch (error) {
    console.error('取消会话API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

/**
 * 获取会话详情
 * GET /api/pomodoro/sessions/:id
 */
router.get('/sessions/:id', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const result = await getSessionById(sessionId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('获取会话详情API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

/**
 * 获取会话历史
 * GET /api/pomodoro/sessions
 */
router.get('/sessions', async (req, res) => {
  try {
    const options = {
      status: req.query.status,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      taskId: req.query.taskId,
      limit: req.query.limit ? parseInt(req.query.limit) : 10,
      offset: req.query.offset ? parseInt(req.query.offset) : 0
    };
    
    const result = await getSessionHistory(options);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('获取会话历史API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// ==================== 统计报告 API ====================

/**
 * 获取每日统计
 * GET /api/pomodoro/stats/daily
 */
router.get('/stats/daily', async (req, res) => {
  try {
    const options = {
      date: req.query.date,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const result = await getDailyStats(options);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('获取每日统计API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

/**
 * 获取每周统计
 * GET /api/pomodoro/stats/weekly
 */
router.get('/stats/weekly', async (req, res) => {
  try {
    const options = {
      weekStart: req.query.weekStart,
      weeksCount: req.query.weeksCount ? parseInt(req.query.weeksCount) : 4
    };
    
    const result = await getWeeklyStats(options);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('获取每周统计API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

/**
 * 获取每月统计
 * GET /api/pomodoro/stats/monthly
 */
router.get('/stats/monthly', async (req, res) => {
  try {
    const options = {
      year: req.query.year ? parseInt(req.query.year) : new Date().getFullYear(),
      month: req.query.month ? parseInt(req.query.month) : undefined,
      monthsCount: req.query.monthsCount ? parseInt(req.query.monthsCount) : 6
    };
    
    const result = await getMonthlyStats(options);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('获取每月统计API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// ==================== 焦点模式 API ====================

/**
 * 获取焦点模式设置
 * GET /api/pomodoro/focus-settings
 */
router.get('/focus-settings', async (req, res) => {
  try {
    const result = await getFocusSettings();
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('获取焦点模式设置API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

/**
 * 更新焦点模式设置
 * PUT /api/pomodoro/focus-settings
 */
router.put('/focus-settings', async (req, res) => {
  try {
    const result = await updateFocusSettings(req.body);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('更新焦点模式设置API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// ==================== 健康检查 API ====================

/**
 * 健康检查
 * GET /api/pomodoro/health
 */
router.get('/health', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: '番茄钟服务运行正常',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  } catch (error) {
    console.error('健康检查API错误:', error);
    res.status(500).json({
      success: false,
      message: '服务异常',
      error: error.message
    });
  }
});

export default router;
