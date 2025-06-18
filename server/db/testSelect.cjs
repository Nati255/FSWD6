
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'natan123',
  database: 'fswd6'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('✅ Connected to fswd6 DB');

  const queries = [
    { table: 'users', sql: 'SELECT * FROM users LIMIT 5' },
    { table: 'auth', sql: 'SELECT * FROM auth LIMIT 5' },
    { table: 'todos', sql: 'SELECT * FROM todos LIMIT 5' },
    { table: 'posts', sql: 'SELECT * FROM posts LIMIT 5' },
    { table: 'comments', sql: 'SELECT * FROM comments LIMIT 5' }
  ];

  queries.forEach(({ table, sql }) => {
    connection.query(sql, (err, results) => {
      if (err) {
        console.error(`❌ Error reading from ${table}:`, err.message);
      } else {
        console.log(`\n📦 Data from '${table}':`);
        console.table(results);
      }

      if (table === 'comments') {
        connection.end(); 
      }
    });
  });
});
