# Team Task Manager

A complete modern full-stack collaborative project and task management platform built with the MERN stack. Features advanced task management, role-based access control, real-time collaboration, and intelligent automation.

## ✨ Key Features

### 🔐 Authentication & Security
- **JWT-based Authentication** with bcrypt password hashing
- **Secure Session Management** with token-based authorization
- **Protected Routes** and API endpoints

### 👥 Role-Based Access Control
- **Project-Level Permissions**
  - **Project Admin**: Full control over project, tasks, and team
  - **Project Members**: Limited to assigned tasks and personal updates
- **Dashboard Access Restriction**
  - Admins see team analytics, performance metrics, and project-wide data
  - Members see only personal task statistics and assigned work
- **Granular Task Permissions**
  - Admins can edit, reassign, and delete any task
  - Members can only update status and add comments on their tasks

### 📊 Advanced Dashboard Analytics
- **Role-Aware Dashboard Views**
  - Admin view: Team performance, project analytics, member productivity
  - Member view: Personal task stats, assigned work, individual progress
- **Real-Time Metrics**
  - Total tasks, completed, in progress, overdue counts
  - Task distribution by status (pie charts)
  - Tasks per project (bar charts)
  - Team performance table with completion rates
- **Smart Data Filtering**
  - Backend enforces data isolation
  - Members only receive their assigned tasks
  - Admins get full project visibility

### 🎯 Intelligent Task Management
- **Advanced Task Cards**
  - Compact card view with essential information
  - Priority badges (Low, Medium, High)
  - Due date indicators with smart formatting
  - Overdue highlighting with visual alerts
  - "Due Soon" badges for tasks within 48 hours
  - Assigned user avatars
  - Comment count indicators
  
- **Auto-Status Transitions**
  - Tasks automatically move from "To Do" → "In Progress" when assigned member opens them
  - Smart tracking with `viewedByAssignedUser` flag
  - Activity logging for all status changes
  
- **Smart Task Ordering**
  - Overdue tasks appear first
  - Then sorted by priority (High → Medium → Low)
  - Then by nearest due date
  - Finally by creation date

- **Rich Task Details Modal**
  - Full task information with glassmorphism design
  - Inline editing for admins
  - Activity timeline showing all changes
  - Comments section with real-time updates
  - Task reassignment with member dropdown
  - Status change controls for members
  - Timestamps (created, started, completed)

### 🎨 Interactive Kanban Board
- **Drag-and-Drop Interface** (@hello-pangea/dnd)
  - Smooth animations with Framer Motion
  - Visual feedback during drag operations
  - Optimistic UI updates
- **Three-Column Layout**
  - To Do
  - In Progress
  - Done
- **Real-Time Synchronization**
  - Socket.IO for instant updates across all users
  - Live task creation, updates, and deletions
  - Automatic board refresh on changes

### 🎭 Modern UI/UX
- **Framer Motion Animations**
  - Smooth modal transitions
  - Card hover effects
  - Layout animations
- **Dark Mode Support** with seamless theme switching
- **Fully Responsive Design** (Mobile, Tablet, Desktop)
- **Glassmorphism Effects** for modern aesthetics
- **Tailwind CSS** for utility-first styling
- **Lucide React Icons** for consistent iconography

### 🔔 Real-Time Collaboration
- **Socket.IO Integration**
  - Live task updates across all connected users
  - Project room-based broadcasting
  - Instant notification of changes
- **Activity Logging**
  - Complete audit trail of all task changes
  - User attribution for every action
  - Timestamp tracking

### 📈 Project Management
- **Project Creation & Configuration**
  - Custom project titles and descriptions
  - Color coding for visual organization
  - Member invitation system
- **Team Management**
  - Add/remove project members
  - Admin assignment
  - Member list with roles

## 🛠 Tech Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **@hello-pangea/dnd** - Drag and drop
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt.js** - Password hashing
- **Socket.IO** - Real-time engine
- **Express Validator** - Input validation

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### 1. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   npm install
   ```

2. Configure environment variables:
   - The `.env` file is already configured with MongoDB Atlas
   - Update `JWT_SECRET`, `MONGO_URI`, and `CLIENT_URL` as needed

3. Start the backend server:
   ```bash
   npm run dev
   ```
   *Server runs on `http://localhost:5000`*

### 2. Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   npm install
   ```

2. Configure environment variables:
   - Create `.env` file if needed
   - Set `VITE_API_URL=http://localhost:5000`

3. Start the development server:
   ```bash
   npm run dev
   ```
   *Client runs on `http://localhost:5173`*

### 3. Usage
1. Open `http://localhost:5173` in your browser
2. **Register** a new account or **Login**
3. **Create a project** and invite team members
4. **Add tasks** to your project
5. **Drag and drop** tasks between columns
6. **Click on tasks** to view details and edit
7. **View dashboard** for analytics and team performance

---

## 📁 Project Structure

```
team-task-manager/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── TaskCard.jsx           # Compact task card
│   │   │   ├── TaskDetailsModal.jsx   # Full task details
│   │   │   ├── Modal.jsx              # Base modal
│   │   │   ├── Navbar.jsx             # Navigation
│   │   │   └── Sidebar.jsx            # Sidebar navigation
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.jsx          # Analytics dashboard
│   │   │   ├── TaskBoard.jsx          # Kanban board
│   │   │   ├── Projects.jsx           # Project list
│   │   │   ├── ProjectDetails.jsx     # Project info
│   │   │   ├── Login.jsx              # Authentication
│   │   │   └── Register.jsx           # User registration
│   │   ├── context/          # React context
│   │   │   ├── AuthContext.jsx        # Auth state
│   │   │   └── ThemeContext.jsx       # Theme state
│   │   ├── services/         # API services
│   │   │   └── api.js                 # Axios instance
│   │   └── main.jsx          # App entry point
│   └── package.json
│
├── server/                    # Backend Node.js application
│   ├── controllers/          # Route controllers
│   │   ├── authController.js          # Auth logic
│   │   ├── projectController.js       # Project logic
│   │   ├── taskController.js          # Task logic (with auto-transition)
│   │   └── dashboardController.js     # Analytics logic
│   ├── models/               # Mongoose models
│   │   ├── User.js                    # User schema
│   │   ├── Project.js                 # Project schema
│   │   └── Task.js                    # Task schema (with new fields)
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── dashboard.js
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js                    # JWT verification
│   │   ├── errorHandler.js            # Error handling
│   │   └── validate.js                # Input validation
│   ├── config/               # Configuration
│   │   └── db.js                      # MongoDB connection
│   ├── index.js              # Server entry point
│   └── package.json
│
└── README.md                  # This file
```

---

## 🔑 Key Implementation Details

### Auto-Status Transition Logic
When an assigned user opens a task for the first time:
```javascript
if (
  task.status === 'todo' &&
  task.assignedTo._id === currentUser._id &&
  !task.viewedByAssignedUser
) {
  task.status = 'inprogress';
  task.viewedByAssignedUser = true;
  task.startedAt = new Date();
}
```

### Smart Task Ordering Algorithm
Tasks are sorted by:
1. **Overdue status** (overdue tasks first)
2. **Priority** (High → Medium → Low)
3. **Due date** (nearest first)
4. **Creation date** (newest first)

### Role-Based Data Filtering
```javascript
// Backend automatically filters data
if (isAdmin) {
  tasks = await Task.find({ project: projectId });
} else {
  tasks = await Task.find({ 
    project: projectId,
    assignedTo: userId 
  });
}
```

---

## 🎨 UI Features

### Task Card States
- **Normal**: Clean white card with subtle shadow
- **Overdue**: Red border with pulsing glow effect
- **Due Soon**: Orange border with "Due Soon" badge
- **Dragging**: Rotated with elevated shadow
- **Hover**: Slight scale increase with enhanced shadow

### Modal Animations
- **Entry**: Fade in with scale and slide up
- **Exit**: Fade out with scale down
- **Backdrop**: Blur effect for depth

### Color Coding
- **Priority Badges**:
  - High: Red
  - Medium: Yellow
  - Low: Blue
- **Status Indicators**:
  - To Do: Gray
  - In Progress: Blue
  - Done: Green

---

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure authentication
- **Protected Routes**: Middleware-based authorization
- **Input Validation**: Express validator for all inputs
- **XSS Protection**: Sanitized user inputs
- **CORS Configuration**: Restricted origins
- **Role Verification**: Backend enforces permissions

---

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import repository in Vercel
3. Configure:
   - Framework: Vite
   - Root Directory: `client/`
   - Environment Variable: `VITE_API_URL=<backend-url>`
4. Deploy (vercel.json handles routing)

### Backend (Render / Railway / Heroku)
1. Push code to GitHub
2. Create new Web Service
3. Configure:
   - Root Directory: `server/`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `PORT`
5. Deploy

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create project (admin only)
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)
- `POST /api/projects/:id/members` - Add member (admin only)

### Tasks
- `GET /api/tasks/project/:id` - Get project tasks
- `GET /api/tasks/:id` - Get single task (with auto-transition)
- `POST /api/tasks` - Create task (admin only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (admin only)
- `POST /api/tasks/:id/comments` - Add comment

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (role-aware)
- `GET /api/dashboard/team-performance/:projectId` - Get team performance (admin only)

---

## 🎯 Future Enhancements

- [ ] File attachments for tasks
- [ ] Task labels and tags
- [ ] Advanced filtering and search
- [ ] Email notifications
- [ ] Task templates
- [ ] Time tracking
- [ ] Sprint planning
- [ ] Calendar view
- [ ] Export reports (PDF/CSV)
- [ ] Mobile app (React Native)

---

## 📄 License

MIT License - feel free to use this project for learning or production.

---

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by Jira, Asana, ClickUp, and Trello
- Designed for productivity and collaboration

---

**Happy Task Managing! 🚀**
