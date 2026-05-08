# Team Task Manager - Test Data Seeder

## Overview

This seeder system generates realistic, production-quality test data for the Team Task Manager application. It's specifically designed to work with your existing account and populate your dashboard with meaningful demo data.

## Features

✅ **Personalized Data** - Uses your existing account (mannem.varshith1205@gmail.com) as the project admin  
✅ **Realistic Projects** - 8 diverse projects across different domains  
✅ **Smart Task Generation** - 120-200 tasks with realistic distributions  
✅ **Activity History** - Automated activity logs and comments  
✅ **Dashboard Ready** - Instant analytics and metrics  
✅ **Safe Execution** - Never overwrites your main account  

## What Gets Generated

### Team Members (18)
- Realistic names using Faker.js
- Valid email addresses
- All verified and active
- Default password: `Password@123`

### Projects (8)
- AI Dashboard System
- Smart CRM Platform
- ZeroWaste Management
- HR Management Portal
- Food Delivery Tracker
- Team Collaboration Suite
- E-Learning Platform
- Healthcare Management System
- Inventory Control System
- Social Media Analytics

Each project includes:
- 3-8 randomly assigned team members
- Detailed descriptions
- Unique color themes
- Your account as the admin

### Tasks (120-200)
Realistic task distribution:
- **Status**: 40% To Do, 35% In Progress, 25% Done
- **Priority**: 20% High, 50% Medium, 30% Low
- **Assignment**: 80% assigned to team members
- **Due Dates**: 70% have due dates, 30% of active tasks are overdue
- **Comments**: 0-5 comments per task
- **Activity Logs**: Automatic tracking of changes

Task categories include:
- Development tasks (authentication, features, optimization)
- Design tasks (UI/UX, mockups, branding)
- Testing tasks (QA, security, performance)
- Documentation tasks (guides, API docs, specs)
- Management tasks (planning, reviews, meetings)

## Usage

### Prerequisites

1. **Register your account first**:
   - Email: `mannem.varshith1205@gmail.com`
   - Password: `Varshith@1205`
   - The seeder will NOT create this account - it must exist!

2. **Environment setup**:
   - Ensure `.env` file has valid `MONGO_URI`
   - Database connection must be working

### Running the Seeder

```bash
# From the server directory
npm run seed
```

### What Happens

1. ✅ Connects to MongoDB
2. 🗑️ Clears existing test data (keeps your main account)
3. 👥 Generates 18 team members
4. 📁 Creates 8 projects with you as admin
5. ✅ Generates 120-200 realistic tasks
6. 📊 Displays summary statistics

### Expected Output

```
🚀 Starting database seeding...

═══════════════════════════════════════════════════════
  Team Task Manager - Personalized Test Data Seeder
═══════════════════════════════════════════════════════

✅ MongoDB Connected
🗑️  Clearing existing test data...
  ✓ Deleted existing tasks
  ✓ Deleted existing projects
  ✓ Deleted existing team members
✅ Cleanup completed

👤 Using existing account: Mannem Varshith (mannem.varshith1205@gmail.com)

🌱 Generating 18 team members...
✅ Created 18 team members

🌱 Generating 8 projects...
✅ Created 8 projects

🌱 Generating tasks for 8 projects...
✅ Created 156 tasks

═══════════════════════════════════════════════════════
✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!
═══════════════════════════════════════════════════════

📊 Summary:
   • Main Account: Mannem Varshith
   • Team Members: 18
   • Projects: 8
   • Tasks: 156

🔐 Login Credentials:
   Email: mannem.varshith1205@gmail.com
   Password: Varshith@1205

📝 Task Statistics:
   • To Do: 62
   • In Progress: 55
   • Done: 39
   • Overdue: 18
   • High Priority: 31

🎉 Your dashboard is now populated with realistic demo data!
═══════════════════════════════════════════════════════
```

## Safety Features

### Account Protection
- ✅ Never creates duplicate accounts
- ✅ Never overwrites your password
- ✅ Validates account exists before seeding
- ✅ Only deletes data created by seeder

### Data Integrity
- ✅ Tasks only assigned to project members
- ✅ Activity logs reference valid users
- ✅ Comments from project participants only
- ✅ Proper date sequencing (created < started < completed)

### Error Handling
- ✅ Validates main account exists
- ✅ Graceful error messages
- ✅ Automatic cleanup on failure
- ✅ Database connection management

## Re-running the Seeder

You can run the seeder multiple times safely:

```bash
npm run seed
```

Each run will:
1. Delete all previous seeded data
2. Keep your main account intact
3. Generate fresh test data
4. Maintain data consistency

## Customization

### Adjust Team Size

Edit `seedDatabase.js`:
```javascript
const teamMembers = await seedUsers(25); // Change from 18 to 25
```

### Adjust Project Count

Edit `seedDatabase.js`:
```javascript
const projects = await seedProjects(mainAccount._id, teamMembers, 10); // Change from 8 to 10
```

### Adjust Tasks Per Project

Edit `seedTasks.js`:
```javascript
const taskCount = faker.number.int({ min: 20, max: 30 }); // Change from 15-25
```

### Add Custom Project Templates

Edit `seedProjects.js`:
```javascript
const projectTemplates = [
  {
    title: 'Your Custom Project',
    description: 'Your project description',
    color: '#hexcolor'
  },
  // ... existing templates
];
```

### Add Custom Task Templates

Edit `seedTasks.js`:
```javascript
const taskTemplates = {
  development: [
    'Your custom task title',
    // ... existing tasks
  ],
  // ... other categories
};
```

## Troubleshooting

### "Main account not found"
**Solution**: Register the account first at the login page before running seeder.

### "MongoDB Connection Error"
**Solution**: Check your `.env` file has valid `MONGO_URI`.

### "Duplicate key error"
**Solution**: The seeder clears data automatically. If this persists, manually clear the database.

### Tasks not showing in dashboard
**Solution**: Ensure you're logged in with `mannem.varshith1205@gmail.com`.

## Admin-Only Task Deletion

### Backend Protection
- ✅ DELETE endpoint validates project admin
- ✅ Returns 403 error for non-admins
- ✅ Activity logging for deletions
- ✅ Real-time socket updates

### Frontend Protection
- ✅ Delete button only visible to admins
- ✅ Confirmation modal before deletion
- ✅ "Cannot be undone" warning
- ✅ API error handling for members

### Testing Deletion

1. Login as admin (mannem.varshith1205@gmail.com)
2. Open any task
3. Click "Delete Task" button
4. Confirm deletion in modal
5. Task removed from all views

Members will NOT see the delete button and API calls will be rejected.

## File Structure

```
server/seeders/
├── README.md           # This file
├── seedDatabase.js     # Main seeder orchestrator
├── seedUsers.js        # Team member generation
├── seedProjects.js     # Project generation
└── seedTasks.js        # Task generation with activities
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify your `.env` configuration
3. Ensure MongoDB is running
4. Check console output for specific errors

---

**Happy Seeding! 🌱**
