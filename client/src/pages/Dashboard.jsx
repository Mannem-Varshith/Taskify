import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle, Clock, AlertCircle, ListTodo, Users, TrendingUp } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
const PIE_COLORS = ['#f59e0b', '#3b82f6', '#10b981'];

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center">
    <div className={`p-4 rounded-full mr-4 ${colorClass}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [teamPerformance, setTeamPerformance] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTeam, setLoadingTeam] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
        
        // Auto-select first admin project for team performance
        if (res.data.isAdmin && res.data.adminProjects && res.data.adminProjects.length > 0) {
          setSelectedProject(res.data.adminProjects[0]);
        }
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchTeamPerformance = async () => {
      if (!selectedProject || !stats?.isAdmin) return;
      
      setLoadingTeam(true);
      try {
        const res = await api.get(`/dashboard/team-performance/${selectedProject}`);
        setTeamPerformance(res.data);
      } catch (error) {
        if (error.response?.status === 403) {
          toast.error('Access denied. Only project admins can view team performance.');
        } else {
          toast.error('Failed to load team performance');
        }
      } finally {
        setLoadingTeam(false);
      }
    };
    
    fetchTeamPerformance();
  }, [selectedProject, stats?.isAdmin]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!stats) return null;

  const isAdmin = stats.isAdmin;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isAdmin ? 'Dashboard Overview' : 'My Dashboard'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isAdmin ? 'Project analytics and team performance' : 'Your personal task overview'}
          </p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium">
            <Users className="w-4 h-4" />
            Admin View
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={isAdmin ? "Total Tasks" : "My Tasks"} 
          value={stats.totalTasks} 
          icon={ListTodo} 
          colorClass="bg-indigo-500" 
        />
        <StatCard 
          title="Completed" 
          value={stats.completedTasks} 
          icon={CheckCircle} 
          colorClass="bg-green-500" 
        />
        <StatCard 
          title="In Progress" 
          value={stats.inProgressTasks} 
          icon={Clock} 
          colorClass="bg-blue-500" 
        />
        <StatCard 
          title={isAdmin ? "Overdue" : "Due Soon"} 
          value={stats.overdueTasks} 
          icon={AlertCircle} 
          colorClass="bg-red-500" 
        />
      </div>

      {/* Charts Section */}
      <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-2' : ''} gap-6 mt-8`}>
        {/* Tasks by Status - Available to all users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {isAdmin ? 'Tasks by Status' : 'My Tasks by Status'}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.tasksByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.tasksByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }}
                  itemStyle={{ color: '#f9fafb' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center mt-4 space-x-6">
            {stats.tasksByStatus.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: PIE_COLORS[index] }}></span>
                {entry.name}: {entry.value}
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Per Project - ADMIN ONLY */}
        {isAdmin && stats.projectStats && stats.projectStats.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Tasks Per Project</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.projectStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" tick={{fill: '#9ca3af'}} />
                  <YAxis stroke="#9ca3af" tick={{fill: '#9ca3af'}} allowDecimals={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(99, 102, 241, 0.1)'}}
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }}
                  />
                  <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
      
      {/* Team Performance Section - ADMIN ONLY */}
      {isAdmin && teamPerformance && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Team Performance - {teamPerformance.projectTitle}
              </h3>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {teamPerformance.totalMembers} members • {teamPerformance.totalTasks} tasks
            </div>
          </div>
          
          {loadingTeam ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : teamPerformance.tasksPerUser && teamPerformance.tasksPerUser.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Tasks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">In Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">To Do</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completion Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {teamPerformance.tasksPerUser.map((member, idx) => {
                    const completionRate = member.tasks > 0 ? Math.round((member.completed / member.tasks) * 100) : 0;
                    return (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{member.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{member.tasks}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium">{member.completed}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">{member.inProgress}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 dark:text-orange-400">{member.todo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <span className="mr-2 font-medium">{completionRate}%</span>
                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${completionRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No team members assigned to tasks yet
            </div>
          )}
        </div>
      )}

      {/* Member-specific helpful message */}
      {!isAdmin && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mt-6">
          <div className="flex items-start gap-3">
            <ListTodo className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                Your Personal Dashboard
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                This dashboard shows your assigned tasks and personal progress. 
                Team analytics are available to project administrators.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
