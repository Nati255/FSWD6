import express from 'express';
import {
  getAllComments,
  getCommentById,
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment
} from '../models/commentsModel.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const comments = await getAllComments();
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const comment = await getCommentById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json(comment);
  } catch (err) {
    next(err);
  }
});

router.get('/post/:postId', async (req, res, next) => {
  try {
    const comments = await getCommentsByPostId(req.params.postId);
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Missing request body' });
    }

    const comment = await createComment(req.body);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const comment = await updateComment(req.params.id, req.body);
    res.json(comment);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await deleteComment(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
