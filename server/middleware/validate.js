const { validationResult, body } = require('express-validator');

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateProject = [
  body('title').notEmpty().withMessage('Project title is required').trim().isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  validateResult
];

const validateTask = [
  body('title').notEmpty().withMessage('Task title is required').trim().isLength({ max: 100 }),
  body('projectId').notEmpty().withMessage('Project ID is required'),
  validateResult
];

module.exports = { validateProject, validateTask, validateResult };
