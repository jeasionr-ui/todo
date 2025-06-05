import { query, execute } from '../exec_api.js';

export async function getTodosDb() {
  return await query('SELECT * FROM todos');
}

export async function createTodoDb(data) {
  const { title, completed = 0 } = data;
  const result = await execute('INSERT INTO todos (title, completed) VALUES (?, ?)', [title, completed ? 1 : 0]);
  return { id: result.insertId, title, completed: !!completed };
}

export async function updateTodoDb(id, data) {
  const { title, completed } = data;
  await execute('UPDATE todos SET title = ?, completed = ? WHERE id = ?', [title, completed ? 1 : 0, id]);
  return { id, title, completed: !!completed };
}

export async function deleteTodoDb(id) {
  await execute('DELETE FROM todos WHERE id = ?', [id]);
}
