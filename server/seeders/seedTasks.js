const { faker } = require('@faker-js/faker');
const Task = require('../models/Task');

const taskTemplates = {
  development: [
    'Fix JWT authentication bug',
    'Build analytics dashboard charts',
    'Create Kanban board component',
    'Optimize database queries',
    'Implement email verification',
    'Add real-time notifications',
    'Refactor API endpoints',
    'Setup CI/CD pipeline',
    'Implement file upload feature',
    'Add dark mode support',
    'Create user profile page',
    'Build search functionality',
    'Implement pagination',
    'Add data export feature',
    'Setup error logging',
    'Create admin dashboard',
    'Implement role-based access',
    'Add two-factor authentication',
    'Build reporting module',
    'Optimize frontend performance'
  ],
  design: [
    'Design dashboard UI mockups',
    'Create mobile responsive layouts',
    'Design user onboarding flow',
    'Create brand style guide',
    'Design email templates',
    'Create loading animations',
    'Design error pages',
    'Create icon set',
    'Design landing page',
    'Create component library'
  ],
  testing: [
    'Write unit tests for auth',
    'Perform security audit',
    'Test mobile responsiveness',
    'Conduct user acceptance testing',
    'Test API endpoints',
    'Perform load testing',
    'Test cross-browser compatibility',
    'Validate form inputs',
    'Test payment integration',
    'Perform accessibility audit'
  ],
  documentation: [
    'Write API documentation',
    'Create user guide',
    'Document deployment process',
    'Write technical specifications',
    'Create onboarding documentation',
    'Document database schema',
    'Write contributing guidelines',
    'Create troubleshooting guide',
    'Document security policies',
    'Write release notes'
  ],
  management: [
    'Review sprint progress',
    'Plan next sprint tasks',
    'Conduct team standup',
    'Review pull requests',
    'Update project roadmap',
    'Prepare client presentation',
    'Review budget allocation',
    'Schedule team training',
    'Conduct performance reviews',
    'Plan team building event'
  ]
};

const getAllTaskTitles = () => {
  return Object.values(taskTemplates).flat();
};

const generateTaskDescription = (title) => {
  const descriptions = [
    `${title}. This is a critical task that requires immediate attention and careful implementation.`,
    `Working on: ${title}. Need to coordinate with the team and ensure all requirements are met.`,
    `${title}. This will improve overall system performance and user experience significantly.`,
    `Task: ${title}. Dependencies need to be checked before starting implementation.`,
    `${title}. This feature has been requested by multiple stakeholders and is high priority.`,
    `Implementation of: ${title}. Requires thorough testing and documentation.`,
    `${title}. This will help streamline our workflow and increase productivity.`,
    `Working to complete: ${title}. Timeline is tight but achievable with focused effort.`
  ];
  return faker.helpers.arrayElement(descriptions);
};

const generateActivityLog = (createdBy, assignedTo) => {
  const activities = [
    { user: createdBy, action: 'Task created' }
  ];
  
  // Randomly add more activities
  if (faker.datatype.boolean()) {
    activities.push({
      user: createdBy,
      action: 'Priority changed to high',
      createdAt: faker.date.recent({ days: 5 })
    });
  }
  
  if (assignedTo && faker.datatype.boolean()) {
    activities.push({
      user: assignedTo,
      action: 'Task status updated',
      createdAt: faker.date.recent({ days: 3 })
    });
  }
  
  return activities;
};

const generateComments = (projectMembers) => {
  const commentCount = faker.number.int({ min: 0, max: 5 });
  const comments = [];
  
  const commentTexts = [
    'Great progress on this! Keep it up.',
    'I have some concerns about the implementation approach.',
    'Can we schedule a quick call to discuss this?',
    'This is looking good. Just a few minor tweaks needed.',
    'I\'ve completed my part. Ready for review.',
    'Need some clarification on the requirements.',
    'This is blocked by another task. Will update soon.',
    'Working on this now. Should be done by EOD.',
    'Excellent work! This exceeded expectations.',
    'Let\'s discuss this in the next standup.'
  ];
  
  for (let i = 0; i < commentCount; i++) {
    const member = faker.helpers.arrayElement(projectMembers);
    comments.push({
      user: member,
      text: faker.helpers.arrayElement(commentTexts),
      createdAt: faker.date.recent({ days: 7 })
    });
  }
  
  return comments;
};

const generateTasks = (projects, adminId, allMembers) => {
  const tasks = [];
  const allTaskTitles = getAllTaskTitles();
  
  // Generate 15-25 tasks per project
  projects.forEach(project => {
    const taskCount = faker.number.int({ min: 15, max: 25 });
    const projectMembers = [adminId, ...project.members];
    const shuffledTitles = faker.helpers.shuffle([...allTaskTitles]);
    
    for (let i = 0; i < taskCount; i++) {
      const title = shuffledTitles[i % shuffledTitles.length];
      
      // Priority distribution: 20% high, 50% medium, 30% low
      const priorityRoll = faker.number.float({ min: 0, max: 1 });
      let priority;
      if (priorityRoll < 0.2) priority = 'high';
      else if (priorityRoll < 0.7) priority = 'medium';
      else priority = 'low';
      
      // Status distribution: 40% todo, 35% inprogress, 25% done
      const statusRoll = faker.number.float({ min: 0, max: 1 });
      let status;
      if (statusRoll < 0.4) status = 'todo';
      else if (statusRoll < 0.75) status = 'inprogress';
      else status = 'done';
      
      // 80% of tasks are assigned
      const assignedTo = faker.datatype.boolean({ probability: 0.8 })
        ? faker.helpers.arrayElement(projectMembers)
        : null;
      
      // Due date logic
      let dueDate = null;
      if (faker.datatype.boolean({ probability: 0.7 })) {
        // 30% chance of overdue tasks for todo/inprogress
        if (status !== 'done' && faker.datatype.boolean({ probability: 0.3 })) {
          dueDate = faker.date.past({ days: 10 });
        } else {
          dueDate = faker.date.future({ days: 30 });
        }
      }
      
      const createdAt = faker.date.past({ days: 60 });
      
      const task = {
        title,
        description: generateTaskDescription(title),
        dueDate,
        priority,
        status,
        assignedTo,
        project: project._id,
        createdBy: adminId,
        comments: generateComments(projectMembers),
        activityLog: generateActivityLog(adminId, assignedTo),
        viewedByAssignedUser: status !== 'todo',
        createdAt,
        updatedAt: faker.date.between({ from: createdAt, to: new Date() })
      };
      
      // Add startedAt for inprogress and done tasks
      if (status === 'inprogress' || status === 'done') {
        task.startedAt = faker.date.between({ from: createdAt, to: new Date() });
      }
      
      // Add completedAt for done tasks
      if (status === 'done') {
        task.completedAt = faker.date.between({ 
          from: task.startedAt || createdAt, 
          to: new Date() 
        });
      }
      
      tasks.push(task);
    }
  });
  
  return tasks;
};

const seedTasks = async (projects, adminId, allMembers) => {
  try {
    console.log(`🌱 Generating tasks for ${projects.length} projects...`);
    const tasks = generateTasks(projects, adminId, allMembers);
    const createdTasks = await Task.insertMany(tasks);
    console.log(`✅ Created ${createdTasks.length} tasks`);
    return createdTasks;
  } catch (error) {
    console.error('❌ Error seeding tasks:', error.message);
    throw error;
  }
};

module.exports = { seedTasks, generateTasks };
