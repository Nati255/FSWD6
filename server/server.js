import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.js';
import todosRouter from './routes/todos.js';
import postsRouter from './routes/posts.js';
import commentsRouter from './routes/comments.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/users', usersRouter);
app.use('/todos', todosRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

// שגיאות כלליות
// middleware לשגיאות
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    error: 'Server error',
    message: err.message  
  });
});


// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
