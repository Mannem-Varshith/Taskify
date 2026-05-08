const express = require('express');
const router = express.Router();
const { getProjects, getProject, createProject, updateMembers, deleteProject, getProjectStats } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { validateProject } = require('../middleware/validate');

router.use(protect);

router.get('/', getProjects);
router.post('/', validateProject, createProject);
router.get('/:id', getProject);
router.get('/:id/stats', getProjectStats);
router.put('/:id/members', updateMembers);
router.delete('/:id', deleteProject);

module.exports = router;
