import express from 'express'
import { 
  getAllHabits, 
  getHabitById, 
  createHabit, 
  updateHabit, 
  deleteHabit,
  archiveHabit,
  unarchiveHabit,
  recordCompletion,
  getCompletionHistory,
  getHabitStats
} from '../../biz/habit/habit_biz_functions.js'

const router = express.Router()
/**
 * 获取习惯分类列表
 * GET /api/habits/categories
 */
router.get('/categories', async (req, res) => {
  try {
    // 这里可以返回预定义的分类或从数据库动态获取
    const categories = [
      { id: 'health', name: '健康', icon: '🏃' },
      { id: 'learning', name: '学习', icon: '📚' },
      { id: 'work', name: '工作', icon: '💼' },
      { id: 'social', name: '社交', icon: '👥' },
      { id: 'hobby', name: '兴趣', icon: '🎨' },
      { id: 'mindfulness', name: '冥想', icon: '🧘' },
      { id: 'finance', name: '理财', icon: '💰' },
      { id: 'household', name: '家务', icon: '🏠' },
      { id: 'other', name: '其他', icon: '📝' },
    ]

    res.status(200).json({
      success: true,
      message: '获取习惯分类成功',
      data: categories,
    })
  } catch (error) {
    console.error('获取习惯分类API错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message,
    })
  }
})

/**
 * 批量操作习惯
 * POST /api/habits/batch
 */
router.post('/batch', async (req, res) => {
  try {
    const { action, habitIds } = req.body

    if (!action || !Array.isArray(habitIds) || habitIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: '无效的批量操作参数',
      })
    }

    const results = []

    for (const habitId of habitIds) {
      let result

      switch (action) {
        case 'archive':
          result = await deleteHabit(habitId, false)
          break
        case 'delete':
          result = await deleteHabit(habitId, true)
          break
        default:
          result = {
            success: false,
            message: '不支持的批量操作类型',
          }
      }

      results.push({
        habitId,
        ...result,
      })
    }

    const successCount = results.filter((r) => r.success).length

    res.status(200).json({
      success: true,
      message: `批量操作完成，成功处理 ${successCount}/${habitIds.length} 个习惯`,
      data: results,
    })
  } catch (error) {
    console.error('批量操作习惯API错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message,
    })
  }
})

/**
 * 获取所有习惯列表
 * GET /api/habits
 */
router.get('/', async (req, res) => {
  try {
    const options = {
      includeArchived: req.query.includeArchived === 'true',
      category: req.query.category,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined,
    }

    const result = await getAllHabits(options)

    if (result.success) {
      res.status(200).json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('获取习惯列表API错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message,
    })
  }
})

/**
 * 创建新习惯
 * POST /api/habits
 */
router.post('/', async (req, res) => {
  try {
    const result = await createHabit(req.body)

    if (result.success) {
      res.status(201).json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('创建习惯API错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message,
    })
  }
})

/**
 * 获取习惯详情
 * GET /api/habits/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const habitId = req.params.id
    const includeHistory = req.query.includeHistory === 'true'

    const result = await getHabitById(habitId, includeHistory)

    if (result.success) {
      res.status(200).json(result)
    } else {
      if (result.message === '习惯不存在') {
        res.status(404).json(result)
      } else {
        res.status(400).json(result)
      }
    }
  } catch (error) {
    console.error('获取习惯详情API错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message,
    })
  }
})

/**
 * 更新习惯
 * PUT /api/habits/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const habitId = req.params.id

    const result = await updateHabit(habitId, req.body)

    if (result.success) {
      res.status(200).json(result)
    } else {
      if (result.message === '习惯不存在') {
        res.status(404).json(result)
      } else {
        res.status(400).json(result)
      }
    }
  } catch (error) {
    console.error('更新习惯API错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message,
    })
  }
})

/**
 * 删除习惯
 * DELETE /api/habits/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const habitId = req.params.id
    const permanent = req.query.permanent === 'true'

    const result = await deleteHabit(habitId, permanent)

    if (result.success) {
      res.status(200).json(result)
    } else {
      if (result.message === '习惯不存在') {
        res.status(404).json(result)
      } else {
        res.status(400).json(result)
      }
    }
  } catch (error) {
    console.error('删除习惯API错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message,
    })
  }
})

/**
 * 归档习惯
 * PUT /api/habits/:id/archive
 */
router.put('/:id/archive', async (req, res) => {
  try {
    const habitId = req.params.id

    const result = await archiveHabit(habitId)

    if (result.success) {
      res.status(200).json(result)
    } else {
      if (result.message === '习惯不存在') {
        res.status(404).json(result)
      } else {
        res.status(400).json(result)
      }
    }
  } catch (error) {
    console.error('归档习惯API错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message,
    })
  }
})

/**
 * 取消归档习惯
 * PUT /api/habits/:id/unarchive
 */
router.put('/:id/unarchive', async (req, res) => {
  try {
    const habitId = req.params.id

    const result = await unarchiveHabit(habitId)

    if (result.success) {
      res.status(200).json(result)
    } else {
      if (result.message === '习惯不存在') {
        res.status(404).json(result)
      } else {
        res.status(400).json(result)
      }
    }
  } catch (error) {
    console.error('取消归档习惯API错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message,
    })
  }
})

/**
 * 标记习惯完成
 * POST /api/habits/:id/complete
 */
router.post('/:id/complete', async (req, res) => {
  try {
    const habitId = req.params.id
    const { date } = req.body

    const result = await recordCompletion(habitId, {
      completedAt: date,
      isCompleted: true,
    })

    if (result.success) {
      res.status(201).json(result)
    } else {
      if (result.message === '习惯不存在') {
        res.status(404).json(result)
      } else {
        res.status(400).json(result)
      }
    }
  } catch (error) {
    console.error('标记习惯完成API错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message,
    })
  }
})

/**
 * 标记习惯未完成
 * DELETE /api/habits/:id/complete
 */
router.delete('/:id/complete', async (req, res) => {
  try {
    const habitId = req.params.id
    const date = req.query.date

    const result = await recordCompletion(habitId, {
      completedAt: date,
      isCompleted: false,
    })

    if (result.success) {
      res.status(200).json(result)
    } else {
      if (result.message === '习惯不存在') {
        res.status(404).json(result)
      } else {
        res.status(400).json(result)
      }
    }
  } catch (error) {
    console.error('标记习惯未完成API错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message,
    })
  }
})

/**
 * 获取习惯完成历史
 * GET /api/habits/:id/completions
 */
router.get('/:id/completions', async (req, res) => {
  try {
    const habitId = req.params.id
    const startDate = req.query.startDate
    const endDate = req.query.endDate

    const result = await getCompletionHistory(habitId, startDate, endDate)

    if (result.success) {
      res.status(200).json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('获取习惯完成历史API错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message,
    })
  }
})

/**
 * 获取习惯统计信息
 * GET /api/habits/:id/stats
 */
router.get('/:id/stats', async (req, res) => {
  try {
    const habitId = req.params.id

    const result = await getHabitStats(habitId)

    if (result.success) {
      res.status(200).json(result)
    } else {
      if (result.message === '习惯不存在') {
        res.status(404).json(result)
      } else {
        res.status(400).json(result)
      }
    }
  } catch (error) {
    console.error('获取习惯统计信息API错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message,
    })
  }
})

export default router
