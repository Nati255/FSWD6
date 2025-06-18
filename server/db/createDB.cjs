// fswd6/server/db/createDB.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'natan123',
  multipleStatements: true
});

const createTablesSQL = `
CREATE DATABASE IF NOT EXISTS fswd6;
USE fswd6;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(50) 
);

CREATE TABLE IF NOT EXISTS auth (
  user_id INT PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS todos (
  id INT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  completed BOOLEAN,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS posts (
  id INT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  body TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comments (
  id INT PRIMARY KEY,
  post_id INT,
  name VARCHAR(255),
  email VARCHAR(100),
  body TEXT,
  FOREIGN KEY (post_id) REFERENCES posts(id)
);
`;

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');

  connection.query(createTablesSQL, (err) => {
    if (err) throw err;
    console.log('Database and tables created successfully');
    connection.end();
  });
});
