import { getAllTasksDb, createTaskDb, updateTaskDb, deleteTaskDb } from '../../db/task/task_db.js';

export async function getTodos() {
  return await getAllTasksDb();
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
