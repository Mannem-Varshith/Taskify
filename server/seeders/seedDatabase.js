require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { seedUsers } = require('./seedUsers');
const { seedProjects } = require('./seedProjects');
const { seedTasks } = require('./seedTasks');

const MAIN_ACCOUNT_EMAIL = 'mannem.varshith1205@gmail.com';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const clearExistingData = async () => {
  try {
    console.log('🗑️  Clearing existing test data...');
    
    // Get the main account
    const mainAccount = await User.findOne({ email: MAIN_ACCOUNT_EMAIL });
    if (!mainAccount) {
      console.error(`❌ Main account ${MAIN_ACCOUNT_EMAIL} not found!`);
      console.log('Please register this account first before running the seeder.');
      process.exit(1);
    }
    
    // Delete all projects where main account is admin
    const projectsToDelete = await Project.find({ admin: mainAccount._id });
    const projectIds = projectsToDelete.map(p => p._id);
    
    // Delete all tasks in those projects
    await Task.deleteMany({ project: { $in: projectIds } });
    console.log('  ✓ Deleted existing tasks');
    
    // Delete the projects
    await Project.deleteMany({ admin: mainAccount._id });
    console.log('  ✓ Deleted existing projects');
    
    // Delete all users except the main account
    await User.deleteMany({ 
      email: { $ne: MAIN_ACCOUNT_EMAIL }
    });
    console.log('  ✓ Deleted existing team members');
    
    console.log('✅ Cleanup completed\n');
    return mainAccount;
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    console.log('🚀 Starting database seeding...\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('  Team Task Manager - Personalized Test Data Seeder');
    console.log('═══════════════════════════════════════════════════════\n');
    
    await connectDB();
    
    // Clear existing data and get main account
    const mainAccount = await clearExistingData();
    console.log(`👤 Using existing account: ${mainAccount.name} (${mainAccount.email})\n`);
    
    // Generate team members
    const teamMembers = await seedUsers(18); // 18 additional members
    console.log('');
    
    // Generate projects with main account as admin
    const projects = await seedProjects(mainAccount._id, teamMembers, 8);
    console.log('');
    
    // Generate tasks
    const allMembers = [mainAccount, ...teamMembers];
    const tasks = await seedTasks(projects, mainAccount._id, allMembers);
    console.log('');
    
    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('📊 Summary:');
    console.log(`   • Main Account: ${mainAccount.name}`);
    console.log(`   • Team Members: ${teamMembers.length}`);
    console.log(`   • Projects: ${projects.length}`);
    console.log(`   • Tasks: ${tasks.length}`);
    console.log('');
    console.log('🔐 Login Credentials:');
    console.log(`   Email: ${MAIN_ACCOUNT_EMAIL}`);
    console.log(`   Password: Varshith@1205`);
    console.log('');
    console.log('📝 Task Statistics:');
    const todoCount = tasks.filter(t => t.status === 'todo').length;
    const inProgressCount = tasks.filter(t => t.status === 'inprogress').length;
    const doneCount = tasks.filter(t => t.status === 'done').length;
    const overdueCount = tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
    ).length;
    const highPriorityCount = tasks.filter(t => t.priority === 'high').length;
    
    console.log(`   • To Do: ${todoCount}`);
    console.log(`   • In Progress: ${inProgressCount}`);
    console.log(`   • Done: ${doneCount}`);
    console.log(`   • Overdue: ${overdueCount}`);
    console.log(`   • High Priority: ${highPriorityCount}`);
    console.log('');
    console.log('🎉 Your dashboard is now populated with realistic demo data!');
    console.log('═══════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  }
};

// Run the seeder
seedDatabase();
