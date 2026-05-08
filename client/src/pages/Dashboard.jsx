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
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/recent-activity')
        ]);
        setStats(statsRes.data);
        setRecentActivity(activityRes.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Here's your overview across all projects
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Tasks" 
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
          title="Overdue" 
          value={stats.overdueTasks} 
          icon={AlertCircle} 
          colorClass="bg-red-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Tasks by Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Tasks by Status
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

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-semibold text-xs flex-shrink-0">
                    {activity.userName?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white">
                      <span className="font-medium">{activity.userName}</span>
                      <span className="text-gray-600 dark:text-gray-400"> {activity.action}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                      {activity.projectTitle} • {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 border border-indigo-100 dark:border-gray-700 rounded-xl p-6 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Ready to get started?
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View your projects and manage tasks efficiently
            </p>
          </div>
          <a
            href="/projects"
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Go to Projects
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
