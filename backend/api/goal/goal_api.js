import express from 'express';
import {
  getGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  getGoalMilestones,
  createGoalMilestone,
  updateGoalMilestone,
  deleteGoalMilestone,
  linkGoalTask,
  unlinkGoalTask,
  getGoalTasks,
  getGoalReviews,
  createGoalReview,
  updateGoalReview,
  deleteGoalReview,
  getGoalStats,
  updateGoalProgress
} from '../../biz/goal/goal_biz.js';

const router = express.Router();

// 获取目标列表
router.get('/', async (req, res) => {
  try {
    const options = {
      category: req.query.category,
      status: req.query.status,
      priority: req.query.priority,
      parentGoalId: req.query.parentGoalId,
      includeArchived: req.query.includeArchived === 'true',
      limit: req.query.pageSize ? parseInt(req.query.pageSize) : (req.query.limit ? parseInt(req.query.limit) : 10),
      offset: req.query.offset ? parseInt(req.query.offset) : undefined,
      page: req.query.page ? parseInt(req.query.page) : 1
    };
    
    const result = await getGoals(options);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 获取目标详情
router.get('/:id', async (req, res) => {
  try {
    const result = await getGoalById(req.params.id);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 创建新目标
router.post('/', async (req, res) => {
  try {
    const result = await createGoal(req.body);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 更新目标
router.put('/:id', async (req, res) => {
  try {
    const result = await updateGoal(req.params.id, req.body);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 删除目标
router.delete('/:id', async (req, res) => {
  try {
    const permanent = req.query.permanent === 'true';
    const result = await deleteGoal(req.params.id, permanent);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 获取目标里程碑
router.get('/:id/milestones', async (req, res) => {
  try {
    const result = await getGoalMilestones(req.params.id);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 创建目标里程碑
router.post('/:id/milestones', async (req, res) => {
  try {
    const result = await createGoalMilestone(req.params.id, req.body);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 更新目标里程碑
router.put('/milestones/:milestoneId', async (req, res) => {
  try {
    const result = await updateGoalMilestone(req.params.milestoneId, req.body);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 删除目标里程碑
router.delete('/milestones/:milestoneId', async (req, res) => {
  try {
    const result = await deleteGoalMilestone(req.params.milestoneId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 关联目标和任务
router.post('/:id/tasks/:taskId', async (req, res) => {
  try {
    const result = await linkGoalTask(req.params.id, req.params.taskId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 获取目标关联的任务列表
router.get('/:id/tasks', async (req, res) => {
  try {
    const result = await getGoalTasks(req.params.id);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 取消目标和任务的关联
router.delete('/:id/tasks/:taskId', async (req, res) => {
  try {
    const result = await unlinkGoalTask(req.params.id, req.params.taskId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 获取目标回顾记录
router.get('/:id/reviews', async (req, res) => {
  try {
    const result = await getGoalReviews(req.params.id);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 创建目标回顾记录
router.post('/:id/reviews', async (req, res) => {
  try {
    const result = await createGoalReview(req.params.id, req.body);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 更新目标回顾记录
router.put('/:goalId/reviews/:reviewId', async (req, res) => {
  try {
    const result = await updateGoalReview(req.params.reviewId, req.body);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 删除目标回顾记录
router.delete('/:goalId/reviews/:reviewId', async (req, res) => {
  try {
    const result = await deleteGoalReview(req.params.reviewId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 更新目标进度
router.post('/:id/update-progress', async (req, res) => {
  try {
    const result = await updateGoalProgress(req.params.id);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 获取目标统计信息
router.get('/statistics/overview', async (req, res) => {
  try {
    const result = await getGoalStats();
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

export default router;
