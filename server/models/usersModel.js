import db from './db.js';

export async function getAllUsers() {
  const [rows] = await db.query('SELECT * FROM users');
  return rows;
}

export async function getUserById(id) {
  if (!id) throw new Error('Missing user ID');
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
}

export async function createUser(user) {
  const { id, name, email, phone } = user;

  if (!id || !name || !email || !phone) {
    throw new Error('Missing required fields: id, name, email, phone');
  }

  const existing = await getUserById(id);
  if (existing) throw new Error(`User with ID ${id} already exists`);

  await db.query(
    'INSERT INTO users (id, name, email, phone) VALUES (?, ?, ?, ?)',
    [id, name, email, phone]
  );

  return getUserById(id);
}

export async function updateUser(id, user) {
  if (!id) throw new Error('Missing user ID');
  const existing = await getUserById(id);
  if (!existing) throw new Error(`User with ID ${id} not found`);

  const { name, email, phone } = user;
  if (!name || !email || !phone) {
    throw new Error('Missing required fields for update: name, email, phone');
  }

  await db.query(
    'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
    [name, email, phone, id]
  );

  return getUserById(id);
}

export async function deleteUser(id) {
  if (!id) throw new Error('Missing user ID');
  const existing = await getUserById(id);
  if (!existing) throw new Error(`User with ID ${id} not found`);

  
  await db.query(`
    DELETE FROM comments
    WHERE post_id IN (SELECT id FROM posts WHERE user_id = ?)
  `, [id]);

  
  await db.query('DELETE FROM posts WHERE user_id = ?', [id]);

  
  await db.query('DELETE FROM todos WHERE user_id = ?', [id]);

  
  await db.query('DELETE FROM auth WHERE user_id = ?', [id]);

  
  await db.query('DELETE FROM users WHERE id = ?', [id]);

  return { message: `User ${id} deleted along with related data.` };
}


