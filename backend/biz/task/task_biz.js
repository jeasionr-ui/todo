import { getAllTasksDb, createTaskDb, updateTaskDb, deleteTaskDb, countTasksDb } from '../../db/task/task_db.js';

export async function getTodos(options = {}) {
  try {
    // 获取总数（用于分页）
    const totalCount = await countTasksDb(options);
    
    // 获取任务列表
    const tasks = await getAllTasksDb(options);
    
    // 计算分页信息
    const pageInfo = {
      total: totalCount,
      pageSize: options.limit || totalCount,
      currentPage: options.offset ? Math.floor(options.offset / (options.limit || totalCount)) + 1 : 1,
      totalPages: options.limit ? Math.ceil(totalCount / options.limit) : 1
    };
    
    return {
      success: true,
      message: '获取任务列表成功',
      data: tasks,
      pagination: pageInfo
    };
  } catch (error) {
    console.error('获取任务列表失败:', error);
    return {
      success: false,
      message: '获取任务列表失败',
      error: error.message
    };
  }
}

export async function createTodo(task) {
  return await createTaskDb(task);
}

export async function updateTodo(id, updates) {
  return await updateTaskDb(id, updates);
}

export async function deleteTodo(id) {
  return await deleteTaskDb(id);
}
