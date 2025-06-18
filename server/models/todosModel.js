import db from './db.js';

export async function getAllTodos() {
  const [rows] = await db.query('SELECT * FROM todos');
  return rows;
}

export async function getTodoById(id) {
  if (!id) throw new Error('Missing todo ID');
  const [rows] = await db.query('SELECT * FROM todos WHERE id = ?', [id]);
  return rows[0];
}

export async function createTodo(todo) {
  const { id, user_id, title, completed } = todo;
  if (id == null || user_id == null || !title || completed == null)
    throw new Error('Missing required fields: id, user_id, title, completed');

  await db.query(
    'INSERT INTO todos (id, user_id, title, completed) VALUES (?, ?, ?, ?)',
    [id, user_id, title, completed]
  );
  return getTodoById(id);
}

export async function updateTodo(id, todo) {
  if (!id) throw new Error('Missing todo ID');
  const existing = await getTodoById(id);
  if (!existing) throw new Error(`Todo with ID ${id} not found`);

  const { title, completed } = todo;
  if (!title || completed == null)
    throw new Error('Missing required fields for update: title, completed');

  await db.query(
    'UPDATE todos SET title = ?, completed = ? WHERE id = ?',
    [title, completed, id]
  );
  return getTodoById(id);
}

export async function deleteTodo(id) {
  if (!id) throw new Error('Missing todo ID');
  const existing = await getTodoById(id);
  if (!existing) throw new Error(`Todo with ID ${id} not found`);

  await db.query('DELETE FROM todos WHERE id = ?', [id]);
  return { message: `Todo ${id} deleted.` };
}
