import db from './db.js';

export async function getAllPosts() {
  const [rows] = await db.query('SELECT * FROM posts');
  return rows;
}

export async function getPostById(id) {
  if (!id) throw new Error('Missing post ID');
  const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
  return rows[0];
}

export async function createPost(post) {
  const { id, user_id, title, body } = post;
  if (id == null || user_id == null || !title || !body)
    throw new Error('Missing required fields: id, user_id, title, body');

  await db.query(
    'INSERT INTO posts (id, user_id, title, body) VALUES (?, ?, ?, ?)',
    [id, user_id, title, body]
  );
  return getPostById(id);
}

export async function updatePost(id, post) {
  if (!id) throw new Error('Missing post ID');
  const existing = await getPostById(id);
  if (!existing) throw new Error(`Post with ID ${id} not found`);

  const { title, body } = post;
  if (!title || !body)
    throw new Error('Missing required fields for update: title, body');

  await db.query(
    'UPDATE posts SET title = ?, body = ? WHERE id = ?',
    [title, body, id]
  );
  return getPostById(id);
}

export async function deletePost(id) {
  if (!id) throw new Error('Missing post ID');
  const existing = await getPostById(id);
  if (!existing) throw new Error(`Post with ID ${id} not found`);

  await db.query('DELETE FROM comments WHERE post_id = ?', [id]);

  await db.query('DELETE FROM posts WHERE id = ?', [id]);

  return { message: `Post ${id} deleted (including comments).` };
}
