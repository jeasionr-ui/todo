import express from 'express';
import reportBiz from '../../biz/report/report_biz.js';

const router = express.Router();

// 获取个人生产力分析报表
router.get('/productivity', async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: '开始日期和结束日期不能为空'
      });
    }

    const result = await reportBiz.getProductivityReport({
      startDate,
      endDate,
      userId
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('获取生产力报表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取生产力报表失败',
      error: error.message
    });
  }
});

// 获取习惯养成趋势分析报表
router.get('/habits', async (req, res) => {
  try {
    const { startDate, endDate, userId, habitId } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: '开始日期和结束日期不能为空'
      });
    }

    const result = await reportBiz.getHabitReport({
      startDate,
      endDate,
      userId,
      habitId
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('获取习惯报表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取习惯报表失败',
      error: error.message
    });
  }
});

// 获取目标完成率与偏差分析报表
router.get('/goals', async (req, res) => {
  try {
    const { startDate, endDate, userId, goalId } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: '开始日期和结束日期不能为空'
      });
    }

    const result = await reportBiz.getGoalReport({
      startDate,
      endDate,
      userId,
      goalId
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('获取目标报表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取目标报表失败',
      error: error.message
    });
  }
});

// 获取时间利用效率报表
router.get('/time-efficiency', async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: '开始日期和结束日期不能为空'
      });
    }

    const result = await reportBiz.getTimeEfficiencyReport({
      startDate,
      endDate,
      userId
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('获取时间效率报表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取时间效率报表失败',
      error: error.message
    });
  }
});

// 获取任务管理分析报表
router.get('/tasks', async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: '开始日期和结束日期不能为空'
      });
    }

    const result = await reportBiz.getTaskReport({
      startDate,
      endDate,
      userId
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('获取任务报表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取任务报表失败',
      error: error.message
    });
  }
});

// 获取番茄钟统计分析报表
router.get('/pomodoro', async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: '开始日期和结束日期不能为空'
      });
    }

    const result = await reportBiz.getPomodoroReport({
      startDate,
      endDate,
      userId
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('获取番茄钟报表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取番茄钟报表失败',
      error: error.message
    });
  }
});

// 获取综合分析报表（仪表板）
router.get('/dashboard', async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: '开始日期和结束日期不能为空'
      });
    }

    const result = await reportBiz.getDashboardReport({
      startDate,
      endDate,
      userId
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('获取仪表板报表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取仪表板报表失败',
      error: error.message
    });
  }
});

// 导出报表数据
router.post('/export', async (req, res) => {
  try {
    const { reportType, startDate, endDate, userId, format = 'json' } = req.body;
    
    if (!reportType || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: '报表类型、开始日期和结束日期不能为空'
      });
    }

    const result = await reportBiz.exportReport({
      reportType,
      startDate,
      endDate,
      userId,
      format
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('导出报表失败:', error);
    res.status(500).json({
      success: false,
      message: '导出报表失败',
      error: error.message
    });
  }
});

export default router;
