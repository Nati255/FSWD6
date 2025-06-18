import db from './db.js';

export async function getAllComments() {
  const [rows] = await db.query('SELECT * FROM comments');
  return rows;
}

export async function getCommentById(id) {
  if (!id) throw new Error('Missing comment ID');
  const [rows] = await db.query('SELECT * FROM comments WHERE id = ?', [id]);
  return rows[0];
}

export async function getCommentsByPostId(postId) {
  if (!postId) throw new Error('Missing post ID');
  const [rows] = await db.query('SELECT * FROM comments WHERE post_id = ?', [postId]);
  return rows;
}

export async function createComment(comment) {
  const { id, post_id, name, email, body } = comment;
  if (id == null || post_id == null || !name || !email || !body)
    throw new Error('Missing required fields: id, post_id, name, email, body');

  await db.query(
    'INSERT INTO comments (id, post_id, name, email, body) VALUES (?, ?, ?, ?, ?)',
    [id, post_id, name, email, body]
  );
  return getCommentById(id);
}

export async function updateComment(id, comment) {
  if (!id) throw new Error('Missing comment ID');
  const existing = await getCommentById(id);
  if (!existing) throw new Error(`Comment with ID ${id} not found`);

  const { name, email, body } = comment;
  if (!name || !email || !body)
    throw new Error('Missing required fields for update: name, email, body');

  await db.query(
    'UPDATE comments SET name = ?, email = ?, body = ? WHERE id = ?',
    [name, email, body, id]
  );
  return getCommentById(id);
}

export async function deleteComment(id) {
  if (!id) throw new Error('Missing comment ID');
  const existing = await getCommentById(id);
  if (!existing) throw new Error(`Comment with ID ${id} not found`);

  await db.query('DELETE FROM comments WHERE id = ?', [id]);
  return { message: `Comment ${id} deleted.` };
}
