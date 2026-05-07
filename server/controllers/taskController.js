const Task = require('../models/Task');
const Project = require('../models/Project');

const checkAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return { error: 'Project not found', status: 404 };
  
  const isAdmin = project.admin.toString() === userId.toString();
  const isMember = project.members.some(m => m.toString() === userId.toString());
  
  if (!isAdmin && !isMember) return { error: 'Access denied', status: 403 };
  return { project, isAdmin };
};

// GET /api/tasks/project/:id
const getTasksByProject = async (req, res) => {
  try {
    const access = await checkAccess(req.params.id, req.user._id);
    if (access.error) return res.status(access.status).json({ message: access.error });
    const { status, priority, assignedTo } = req.query;
    const filter = { project: req.params.id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// GET /api/tasks/:id - Get single task with auto-status transition
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role')
      .populate('comments.user', 'name email role')
      .populate('activityLog.user', 'name email');
    
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    const access = await checkAccess(task.project.toString(), req.user._id);
    if (access.error) return res.status(access.status).json({ message: access.error });

    // Auto-transition logic: todo -> inprogress when assigned user opens task
    if (
      task.status === 'todo' &&
      task.assignedTo &&
      task.assignedTo._id.toString() === req.user._id.toString() &&
      !task.viewedByAssignedUser
    ) {
      task.status = 'inprogress';
      task.viewedByAssignedUser = true;
      task.startedAt = new Date();
      task.activityLog.push({
        user: req.user._id,
        action: 'Task automatically moved to In Progress'
      });
      await task.save();
      
      // Emit socket event for real-time update
      if (req.io) {
        req.io.to(task.project.toString()).emit('task:updated', task);
      }
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo, projectId } = req.body;
    const access = await checkAccess(projectId, req.user._id);
    if (access.error) return res.status(access.status).json({ message: access.error });
    
    if (!access.isAdmin) {
      return res.status(403).json({ message: 'Only project admin can create tasks' });
    }
    
    const task = await Task.create({
      title, description, dueDate, priority, assignedTo: assignedTo || null,
      project: projectId, createdBy: req.user._id,
      activityLog: [{ user: req.user._id, action: 'Task created' }],
    });
    
    await task.populate('assignedTo', 'name email role');
    await task.populate('createdBy', 'name email role');
    if (req.io) req.io.to(projectId).emit('task:created', task);
    res.status(201).json(task);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    const access = await checkAccess(task.project.toString(), req.user._id);
    if (access.error) return res.status(access.status).json({ message: access.error });

    let activityMessage = 'Task updated';

    if (!access.isAdmin) {
      // Member whitelist validation
      const allowedFields = ["status", "comments"];
      Object.keys(req.body).forEach((field) => {
        if (!allowedFields.includes(field)) {
          delete req.body[field];
        }
      });
      
      if (req.body.status) {
        const oldStatus = task.status;
        task.status = req.body.status;
        activityMessage = `Status changed from ${oldStatus} to ${req.body.status}`;
        
        // Track completion time
        if (req.body.status === 'done' && !task.completedAt) {
          task.completedAt = new Date();
        }
      }
    } else {
      // Project admin
      const { title, description, dueDate, priority, status, assignedTo } = req.body;
      
      if (title && title !== task.title) {
        activityMessage = `Title changed to "${title}"`;
        task.title = title;
      }
      if (description !== undefined && description !== task.description) {
        task.description = description;
      }
      if (dueDate !== undefined) {
        if (dueDate !== task.dueDate) {
          activityMessage = `Due date changed`;
        }
        task.dueDate = dueDate;
      }
      if (priority && priority !== task.priority) {
        activityMessage = `Priority changed to ${priority}`;
        task.priority = priority;
      }
      if (status && status !== task.status) {
        activityMessage = `Status changed to ${status}`;
        task.status = status;
        
        // Track completion time
        if (status === 'done' && !task.completedAt) {
          task.completedAt = new Date();
        }
      }
      if (assignedTo !== undefined) {
        const oldAssignee = task.assignedTo;
        task.assignedTo = assignedTo || null;
        if (assignedTo && (!oldAssignee || oldAssignee.toString() !== assignedTo)) {
          activityMessage = 'Task reassigned';
          // Reset viewed flag when reassigned
          task.viewedByAssignedUser = false;
        }
      }
    }

    task.activityLog.push({ user: req.user._id, action: activityMessage });
    const updated = await task.save();
    await updated.populate('assignedTo', 'name email role');
    await updated.populate('createdBy', 'name email role');
    await updated.populate('comments.user', 'name email role');
    await updated.populate('activityLog.user', 'name email');
    
    if (req.io) req.io.to(task.project.toString()).emit('task:updated', updated);
    res.json(updated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    const access = await checkAccess(task.project.toString(), req.user._id);
    if (access.error) return res.status(access.status).json({ message: access.error });
    
    if (!access.isAdmin) {
      return res.status(403).json({ 
        success: false,
        message: 'Only project admin can delete tasks' 
      });
    }
    
    const taskTitle = task.title;
    
    if (req.io) req.io.to(task.project.toString()).emit('task:deleted', { taskId: task._id });
    await Task.findByIdAndDelete(req.params.id);
    
    console.log(`✅ Task deleted: "${taskTitle}" by ${req.user.name}`);
    res.json({ 
      success: true,
      message: 'Task deleted successfully' 
    });
  } catch (error) { 
    res.status(500).json({ 
      success: false,
      message: error.message 
    }); 
  }
};

// POST /api/tasks/:id/comments
const addComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    const access = await checkAccess(task.project.toString(), req.user._id);
    if (access.error) return res.status(access.status).json({ message: access.error });
    
    task.comments.push({ user: req.user._id, text: req.body.text });
    task.activityLog.push({ user: req.user._id, action: 'Added a comment' });
    await task.save();
    await task.populate('comments.user', 'name email role');
    
    if (req.io) req.io.to(task.project.toString()).emit('task:updated', task);
    res.status(201).json(task.comments[task.comments.length - 1]);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getTasksByProject, getTaskById, createTask, updateTask, deleteTask, addComment };
