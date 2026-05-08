const { faker } = require('@faker-js/faker');
const Project = require('../models/Project');

const projectTemplates = [
  {
    title: 'AI Dashboard System',
    description: 'Building an intelligent analytics dashboard with machine learning insights and real-time data visualization for business intelligence.',
    color: '#6366f1'
  },
  {
    title: 'Smart CRM Platform',
    description: 'Customer relationship management system with automated workflows, lead tracking, and sales pipeline management.',
    color: '#8b5cf6'
  },
  {
    title: 'ZeroWaste Management',
    description: 'Sustainability platform for tracking waste reduction, carbon footprint analysis, and environmental impact reporting.',
    color: '#10b981'
  },
  {
    title: 'HR Management Portal',
    description: 'Comprehensive human resources system for employee onboarding, performance reviews, and payroll management.',
    color: '#f59e0b'
  },
  {
    title: 'Food Delivery Tracker',
    description: 'Real-time order tracking system with route optimization, delivery analytics, and customer feedback integration.',
    color: '#ef4444'
  },
  {
    title: 'Team Collaboration Suite',
    description: 'Unified workspace for team communication, file sharing, video conferencing, and project coordination.',
    color: '#3b82f6'
  },
  {
    title: 'E-Learning Platform',
    description: 'Interactive online education system with course management, video streaming, quizzes, and progress tracking.',
    color: '#ec4899'
  },
  {
    title: 'Healthcare Management System',
    description: 'Patient records management, appointment scheduling, telemedicine integration, and medical billing automation.',
    color: '#14b8a6'
  },
  {
    title: 'Inventory Control System',
    description: 'Warehouse management with stock tracking, automated reordering, supplier management, and analytics.',
    color: '#f97316'
  },
  {
    title: 'Social Media Analytics',
    description: 'Multi-platform social media monitoring, sentiment analysis, engagement metrics, and content scheduling.',
    color: '#a855f7'
  }
];

const generateProjects = (adminId, teamMembers, count = 8) => {
  const projects = [];
  const shuffledTemplates = faker.helpers.shuffle([...projectTemplates]);
  
  for (let i = 0; i < Math.min(count, shuffledTemplates.length); i++) {
    const template = shuffledTemplates[i];
    
    // Randomly select 3-8 team members for each project
    const memberCount = faker.number.int({ min: 3, max: Math.min(8, teamMembers.length) });
    const selectedMembers = faker.helpers.shuffle([...teamMembers])
      .slice(0, memberCount)
      .map(m => m._id);
    
    projects.push({
      title: template.title,
      description: template.description,
      admin: adminId,
      members: selectedMembers,
      color: template.color
    });
  }
  
  return projects;
};

const seedProjects = async (adminId, teamMembers, count = 8) => {
  try {
    console.log(`🌱 Generating ${count} projects...`);
    const projects = generateProjects(adminId, teamMembers, count);
    const createdProjects = await Project.insertMany(projects);
    console.log(`✅ Created ${createdProjects.length} projects`);
    return createdProjects;
  } catch (error) {
    console.error('❌ Error seeding projects:', error.message);
    throw error;
  }
};

module.exports = { seedProjects, generateProjects };
