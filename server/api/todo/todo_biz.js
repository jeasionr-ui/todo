import { getTodosDb, createTodoDb, updateTodoDb, deleteTodoDb } from '../../db/todo/todo_db.js';

export async function getTodos() {
  return await getTodosDb();
}

export async function createTodo(data) {
  return await createTodoDb(data);
}

export async function updateTodo(id, data) {
  return await updateTodoDb(id, data);
}

export async function deleteTodo(id) {
  return await deleteTodoDb(id);
}
