const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'natan123',
  multipleStatements: true
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');

  const sql = `DROP DATABASE IF EXISTS fswd6;`;

  connection.query(sql, (err) => {
    if (err) throw err;
    console.log('Database fswd6 deleted!');
    connection.end();
  });
});
