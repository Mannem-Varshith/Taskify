# Taskify - Team Task Manager

> A modern full-stack collaborative project and task management platform built with the MERN stack.

## 🌐 Live Demo

**Production URL:** [https://taskify-production-live.up.railway.app](https://taskify-production-live.up.railway.app)

**Test Account:**
- Email: `mannem.varshith1205@gmail.com`
- Password: `Varshith@1205`

---

## ✨ Key Features

### 🔐 Authentication & Security
- JWT-based authentication with bcrypt password hashing
- Secure session management with token-based authorization
- Protected routes and API endpoints
- Role-based access control (Admin/Member)

### 🔔 Real-Time Notifications
- **Live notification system** with Socket.IO
- Instant notifications for:
  - Task assignments
  - New comments on tasks
  - Task completion updates
- Unread notification badge with count
- Click notification to navigate to task
- Delete individual or clear all notifications

### 📊 Advanced Dashboard Analytics
- **Role-aware dashboard views**
  - Admin: Team performance, project analytics, member productivity
  - Member: Personal task stats, assigned work, individual progress
- Real-time metrics with charts
  - Total tasks, completed, in progress, overdue counts
  - Task distribution by status (pie charts)
  - Tasks per project (bar charts)
- Recent activity feed showing latest 10 activities
- Smart data filtering with backend isolation

### 🎯 Intelligent Task Management
- **Advanced task cards** with priority badges and due date indicators
- **Auto-status transitions** - Tasks automatically move from "To Do" → "In Progress" when opened
- **Smart task ordering** - Overdue tasks first, then by priority and due date
- **Rich task details modal** with:
  - Inline editing for admins
  - Activity timeline
  - Comments section with real-time updates
  - Task reassignment
  - Status change controls
- **Admin-only task deletion** with confirmation modal
- Comment system with user attribution and timestamps

### 🎨 Interactive Kanban Board
- Drag-and-drop interface with smooth animations
- Three-column layout (To Do, In Progress, Done)
- Real-time synchronization across all users
- Visual feedback during drag operations

### 🎭 Modern UI/UX
- **Dark mode support** with seamless theme switching
- Fully responsive design (Mobile, Tablet, Desktop)
- Glassmorphism effects and Framer Motion animations
- Tailwind CSS for modern styling
- Lucide React icons

### � Project Management
- Project-level permissions (Admin/Member)
- Team management with add/remove members
- Project-specific team performance analytics
- Member list with roles and statistics

---

## 🛠 Tech Stack

### Frontend
- **React.js** + **Vite** - Fast development and optimized builds
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing with SPA support
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **@hello-pangea/dnd** - Drag and drop
- **Socket.IO Client** - Real-time notifications
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** + **Express.js** - RESTful API
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Secure authentication
- **bcrypt.js** - Password hashing
- **Socket.IO** - Real-time engine
- **Express Validator** - Input validation

### Deployment
- **Frontend**: Railway (Express server with SPA routing)
- **Backend**: Railway (Node.js server)
- **Database**: MongoDB Atlas

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### 1. Clone the Repository
```bash
git clone https://github.com/Mannem-Varshith/Taskify.git
cd Taskify
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file in `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```
Server runs on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd client
npm install
```

Create `.env` file in `client/` directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```
Client runs on `http://localhost:5173`

### 4. Seed Test Data (Optional)
```bash
cd server
npm run seed
```
This creates realistic test data with projects, tasks, and team members.

---

## 📁 Project Structure

```
Taskify/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Navbar.jsx             # Navigation with notifications
│   │   │   ├── TaskCard.jsx           # Task card component
│   │   │   ├── TaskDetailsModal.jsx   # Task details with comments
│   │   │   └── ...
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.jsx          # Analytics dashboard
│   │   │   ├── TaskBoard.jsx          # Kanban board
│   │   │   ├── Projects.jsx           # Project list
│   │   │   ├── ProjectDetails.jsx     # Project with team performance
│   │   │   └── ...
│   │   ├── context/          # React context
│   │   │   ├── AuthContext.jsx        # Authentication state
│   │   │   └── ThemeContext.jsx       # Dark mode state
│   │   └── services/         # API services
│   ├── server.js             # Express server for SPA routing
│   └── package.json
│
├── server/                    # Backend Node.js application
│   ├── controllers/          # Route controllers
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   ├── dashboardController.js
│   │   └── notificationController.js  # Notification logic
│   ├── models/               # Mongoose models
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── Notification.js            # Notification schema
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   ├── dashboard.js
│   │   └── notifications.js           # Notification endpoints
│   ├── middleware/           # Custom middleware
│   ├── seeders/              # Test data seeders
│   └── index.js              # Server entry with Socket.IO
│
└── README.md                  # This file
```

---

## 🔑 Key Features Implementation

### Real-Time Notifications
Notifications are automatically created when:
- Someone assigns you a task
- Someone comments on your task
- Someone completes a task you created

Socket.IO delivers notifications instantly without page refresh.

### Auto-Status Transition
When an assigned user opens a task for the first time:
```javascript
if (task.status === 'todo' && !task.viewedByAssignedUser) {
  task.status = 'inprogress';
  task.startedAt = new Date();
}
```

### Smart Task Ordering
Tasks are sorted by:
1. Overdue status (overdue first)
2. Priority (High → Medium → Low)
3. Due date (nearest first)
4. Creation date (newest first)

### Role-Based Access Control
- **Admins**: Create/edit/delete tasks, manage team, view all analytics
- **Members**: Update status, add comments, view personal stats

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create project (admin only)
- `GET /api/projects/:id` - Get project details
- `GET /api/projects/:id/stats` - Get project statistics
- `POST /api/projects/:id/members` - Add member (admin only)

### Tasks
- `GET /api/tasks/project/:id` - Get project tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task (admin only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (admin only)
- `POST /api/tasks/:id/comments` - Add comment

### Notifications
- `GET /api/notifications` - Get user's notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-activity` - Get recent activities
- `GET /api/dashboard/team-performance/:projectId` - Get team performance

---

## 🚀 Deployment

### Railway Deployment (Current Setup)

**Frontend:**
- Express server serves static files from `dist/`
- SPA routing with fallback to `index.html`
- Environment: `VITE_API_URL=<backend-url>`

**Backend:**
- Node.js server with Socket.IO
- Environment variables:
  - `MONGO_URI` - MongoDB connection string
  - `JWT_SECRET` - JWT secret key
  - `CLIENT_URL` - Frontend URL
  - `PORT` - Server port

Both services auto-deploy on git push to main branch.

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
- [ ] Mobile app

---

## �️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Role-based authorization
- XSS protection

---

## 📄 License

MIT License - Free to use for learning or production.

---

## 👨‍💻 Author

**Mannem Varshith**
- GitHub: [@Mannem-Varshith](https://github.com/Mannem-Varshith)
- Email: mannem.varshith1205@gmail.com

---

## 🙏 Acknowledgments

- Inspired by Jira, Asana, ClickUp, and Trello
- Built with modern web technologies
- Designed for productivity and collaboration

---

**🚀 Start managing your tasks efficiently with Taskify!**

Visit: [https://taskify-production-live.up.railway.app](https://taskify-production-live.up.railway.app)
