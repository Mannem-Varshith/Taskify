const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ admin: req.user._id }, { members: req.user._id }],
    }).populate('admin', 'name email role').populate('members', 'name email role').sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// GET /api/projects/:id
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('admin', 'name email role').populate('members', 'name email role');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    const isAdmin = project.admin._id.toString() === req.user._id.toString();
    const isMember = project.members.some(m => m._id.toString() === req.user._id.toString());
    if (!isAdmin && !isMember) return res.status(403).json({ message: 'Access denied' });
    
    res.json(project);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// POST /api/projects
const createProject = async (req, res) => {
  const { title, description, color } = req.body;
  try {
    // Anyone (even members) can create a project and become its admin
    const project = await Project.create({ title, description, admin: req.user._id, color: color || '#6366f1' });
    await project.populate('admin', 'name email role');
    res.status(201).json(project);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// PUT /api/projects/:id/members
const updateMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Strict Ownership Check
    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. Only project admin can manage members.' });
    }

    const { memberEmail, action } = req.body;
    const memberUser = await User.findOne({ email: memberEmail });
    if (!memberUser) return res.status(404).json({ message: 'User not found with that email' });
    if (memberUser._id.toString() === project.admin.toString()) {
      return res.status(400).json({ message: 'Admin cannot be added as a standard member' });
    }

    if (action === 'add') {
      if (!project.members.map(m => m.toString()).includes(memberUser._id.toString())) {
        project.members.push(memberUser._id);
      }
    } else if (action === 'remove') {
      project.members = project.members.filter(m => m.toString() !== memberUser._id.toString());
      
      // If a member is removed, also remove them from assigned tasks in this project
      await Task.updateMany(
        { project: project._id, assignedTo: memberUser._id },
        { $unset: { assignedTo: 1 } }
      );
    }
    
    await project.save();
    await project.populate('admin', 'name email role');
    await project.populate('members', 'name email role');
    res.json(project);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Strict Ownership Check
    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. Only project admin can delete the project.' });
    }
    
    await Task.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// GET /api/projects/:id/stats
const getProjectStats = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Check access
    const isAdmin = project.admin.toString() === req.user._id.toString();
    const isMember = project.members.some(m => m.toString() === req.user._id.toString());
    if (!isAdmin && !isMember) return res.status(403).json({ message: 'Access denied' });
    
    // Get tasks for this project only
    const tasks = await Task.find({ project: req.params.id });
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'inprogress').length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;
    
    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks
    });
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

module.exports = { getProjects, getProject, createProject, updateMembers, deleteProject, getProjectStats };
