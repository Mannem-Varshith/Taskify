const express = require('express');
const router = express.Router();
const { getTasksByProject, getTaskById, createTask, updateTask, deleteTask, addComment } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validateTask } = require('../middleware/validate');

router.use(protect);

router.get('/project/:id', getTasksByProject);
router.get('/:id', getTaskById);
router.post('/', validateTask, createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/comments', addComment);

module.exports = router;
