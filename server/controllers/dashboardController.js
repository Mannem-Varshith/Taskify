const Task = require('../models/Task');
const Project = require('../models/Project');

// GET /api/dashboard/stats
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get projects where user is admin or member
    const adminProjects = await Project.find({ admin: userId });
    const memberProjects = await Project.find({ 
      members: userId,
      admin: { $ne: userId }
    });
    
    const allProjects = [...adminProjects, ...memberProjects];
    const projectIds = allProjects.map(p => p._id);

    // Get all tasks user has access to (assigned or in their projects)
    const tasks = await Task.find({ 
      $or: [
        { assignedTo: userId },
        { project: { $in: projectIds } }
      ]
    })
      .populate('assignedTo', 'name email')
      .populate('project', 'title admin');

    const now = new Date();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'inprogress').length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;
    const overdueTasks = tasks.filter(t =>
      t.dueDate && new Date(t.dueDate) < now && t.status !== 'done'
    ).length;

    // Tasks by status
    const tasksByStatus = [
      { name: 'To Do', value: todoTasks },
      { name: 'In Progress', value: inProgressTasks },
      { name: 'Done', value: completedTasks },
    ];

    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      tasksByStatus,
      totalProjects: allProjects.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/dashboard/recent-activity
const getRecentActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get projects where user is admin or member
    const adminProjects = await Project.find({ admin: userId });
    const memberProjects = await Project.find({ members: userId });
    const allProjects = [...adminProjects, ...memberProjects];
    const projectIds = allProjects.map(p => p._id);

    // Get recent tasks with activity
    const recentTasks = await Task.find({ project: { $in: projectIds } })
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate('createdBy', 'name')
      .populate('assignedTo', 'name')
      .populate('project', 'title')
      .populate('activityLog.user', 'name');

    const activities = [];
    
    recentTasks.forEach(task => {
      if (task.activityLog && task.activityLog.length > 0) {
        const latestActivity = task.activityLog[task.activityLog.length - 1];
        activities.push({
          userName: latestActivity.user?.name || 'Unknown',
          action: latestActivity.action,
          projectTitle: task.project?.title || 'Unknown Project',
          timestamp: latestActivity.createdAt || task.updatedAt
        });
      }
    });

    // Sort by timestamp and limit to 10
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json(activities.slice(0, 10));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/dashboard/team-performance/:projectId
const getTeamPerformance = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    // Verify user is admin of this project
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.admin.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: 'Access denied. Only project admins can view team performance.' 
      });
    }

    // Get all tasks for this project
    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email');

    // Calculate team performance metrics
    const userTaskMap = {};
    tasks.forEach(task => {
      if (task.assignedTo) {
        const key = task.assignedTo._id.toString();
        if (!userTaskMap[key]) {
          userTaskMap[key] = { 
            name: task.assignedTo.name, 
            email: task.assignedTo.email,
            tasks: 0, 
            completed: 0,
            inProgress: 0,
            todo: 0
          };
        }
        userTaskMap[key].tasks += 1;
        if (task.status === 'done') userTaskMap[key].completed += 1;
        if (task.status === 'inprogress') userTaskMap[key].inProgress += 1;
        if (task.status === 'todo') userTaskMap[key].todo += 1;
      }
    });

    const tasksPerUser = Object.values(userTaskMap);

    res.json({
      projectId,
      projectTitle: project.title,
      tasksPerUser,
      totalTasks: tasks.length,
      totalMembers: tasksPerUser.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getRecentActivity, getTeamPerformance };
