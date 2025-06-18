import mysql from 'mysql2';
import fs from 'fs';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'natan123',
  database: 'fswd6',
  multipleStatements: true
});

connection.connect(async (err) => {
  if (err) throw err;
  console.log('Connected to fswd6 DB');

  const raw = fs.readFileSync('db.json', 'utf-8');
  const data = JSON.parse(raw);

  try {
    await Promise.all([
      insertUsers(data.users),
      insertTodos(data.todos),
      insertPosts(data.posts),
      insertComments(data.comments)
    ]);

    console.log(' All data inserted successfully!');
  } catch (error) {
    console.error(' Error inserting data:', error);
  } finally {
    connection.end();
  }
});

function insertUsers(users) {
  return Promise.all(users.map(user => {
    return new Promise((resolve, reject) => {
      const { id, name, email, phone, website } = user;

      const sqlUser = 'INSERT INTO users (id, name, email, phone) VALUES (?, ?, ?, ?)';
      connection.query(sqlUser, [id, name, email, phone], (err) => {
        if (err) {
          console.error(`User ${id} failed:`, err.message);
          return reject(err);
        }

        const sqlAuth = 'INSERT INTO auth (user_id, password) VALUES (?, ?)';
        connection.query(sqlAuth, [id, website], (err) => {
          if (err) {
            console.error(`Password insert failed for ${id}:`, err.message);
            return reject(err);
          }

          resolve();
        });
      });
    });
  }));
}

function insertTodos(todos) {
  return Promise.all(todos.map(todo => {
    return new Promise((resolve, reject) => {
      const { id, userId, title, completed } = todo;
      const sql = 'INSERT INTO todos (id, user_id, title, completed) VALUES (?, ?, ?, ?)';
      connection.query(sql, [id, userId, title, completed], (err) => {
        if (err) {
          console.error(`Todo ${id} failed:`, err.message);
          return reject(err);
        }
        resolve();
      });
    });
  }));
}

function insertPosts(posts) {
  return Promise.all(posts.map(post => {
    return new Promise((resolve, reject) => {
      const { id, userId, title, body } = post;
      const sql = 'INSERT INTO posts (id, user_id, title, body) VALUES (?, ?, ?, ?)';
      connection.query(sql, [id, userId, title, body], (err) => {
        if (err) {
          console.error(`Post ${id} failed:`, err.message);
          return reject(err);
        }
        resolve();
      });
    });
  }));
}

function insertComments(comments) {
  return Promise.all(comments.map(comment => {
    return new Promise((resolve, reject) => {
      const { id, postId, name, email, body } = comment;
      const sql = 'INSERT INTO comments (id, post_id, name, email, body) VALUES (?, ?, ?, ?, ?)';
      connection.query(sql, [id, postId, name, email, body], (err) => {
        if (err) {
          console.error(`Comment ${id} failed:`, err.message);
          return reject(err);
        }
        resolve();
      });
    });
  }));
}
