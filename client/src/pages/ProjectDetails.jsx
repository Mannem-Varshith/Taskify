import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, UserPlus, Mail, Layout, Trash2, BarChart3, Activity, ListTodo } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [stats, setStats] = useState(null);
  const [teamPerformance, setTeamPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPerformance, setLoadingPerformance] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const [projectRes, statsRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/projects/${id}/stats`)
        ]);
        setProject(projectRes.data);
        setStats(statsRes.data);
      } catch (error) {
        toast.error('Failed to load project details');
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [id, navigate]);

  useEffect(() => {
    const fetchTeamPerformance = async () => {
      if (activeTab === 'team' && project && project.admin._id === user._id) {
        setLoadingPerformance(true);
        try {
          const res = await api.get(`/dashboard/team-performance/${id}`);
          setTeamPerformance(res.data);
        } catch (error) {
          toast.error('Failed to load team performance');
        } finally {
          setLoadingPerformance(false);
        }
      }
    };
    fetchTeamPerformance();
  }, [activeTab, id, project, user]);

  const handleUpdateMember = async (e, action, email) => {
    if (e) e.preventDefault();
    setActionLoading(true);
    try {
      const res = await api.put(`/projects/${id}/members`, { memberEmail: email, action });
      setProject(res.data);
      toast.success(action === 'add' ? 'Member added successfully' : 'Member removed successfully');
      setMemberEmail('');
      // Refresh stats and team performance
      const statsRes = await api.get(`/projects/${id}/stats`);
      setStats(statsRes.data);
      if (activeTab === 'team') {
        const perfRes = await api.get(`/dashboard/team-performance/${id}`);
        setTeamPerformance(perfRes.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} member`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!project) return null;

  const isAdmin = project.admin._id === user._id;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layout },
    { id: 'team', label: 'Team Performance', icon: BarChart3, adminOnly: true },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <Link to="/projects" className="flex items-center hover:text-indigo-600 dark:hover:text-indigo-400">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Projects
        </Link>
      </div>

      {/* Project Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-4 w-full" style={{ backgroundColor: project.color }}></div>
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">{project.description || 'No description provided.'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            if (tab.adminOnly && !isAdmin) return null;
            
            const TabIcon = tab.icon;
            const isActive = tab.id === activeTab;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Project Stats */}
              {stats && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Total Tasks</p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-300 mt-1">{stats.totalTasks}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800">
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">Completed</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-300 mt-1">{stats.completedTasks}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">In Progress</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-300 mt-1">{stats.inProgressTasks}</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-100 dark:border-orange-800">
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">To Do</p>
                      <p className="text-2xl font-bold text-orange-900 dark:text-orange-300 mt-1">{stats.todoTasks}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Action */}
              <div className="flex justify-center">
                <Link
                  to={`/projects/${id}/tasks`}
                  className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-lg"
                >
                  <Layout className="w-6 h-6 mr-3" />
                  Go to Task Board
                </Link>
              </div>

              {/* Team Members */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-indigo-500" />
                  Team Members ({project.members.length + 1})
                </h3>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                  <div className="space-y-3">
                    {/* Admin */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold mr-4 border border-indigo-200 dark:border-indigo-800">
                          {project.admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                            {project.admin.name}
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-full">Admin</span>
                          </p>
                          <p className="text-sm text-gray-500 flex items-center mt-0.5">
                            <Mail className="w-3 h-3 mr-1" />
                            {project.admin.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Members */}
                    {project.members.map(member => (
                      <div key={member._id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold mr-4">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                            <p className="text-sm text-gray-500 flex items-center mt-0.5">
                              <Mail className="w-3 h-3 mr-1" />
                              {member.email}
                            </p>
                          </div>
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() => handleUpdateMember(null, 'remove', member.email)}
                            disabled={actionLoading}
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors disabled:opacity-50"
                            title="Remove member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Member Form (Admin only) */}
                  {isAdmin && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Add New Member</h3>
                      <form onSubmit={(e) => handleUpdateMember(e, 'add', memberEmail)} className="flex gap-3">
                        <div className="flex-1 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            required
                            placeholder="Enter user email address"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
                            value={memberEmail}
                            onChange={(e) => setMemberEmail(e.target.value)}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={actionLoading || !memberEmail}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Team Performance Tab (Admin Only) */}
          {activeTab === 'team' && isAdmin && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-indigo-500" />
                    Team Performance - {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Performance metrics for this project only
                  </p>
                </div>
                {teamPerformance && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {teamPerformance.totalMembers} members • {teamPerformance.totalTasks} tasks
                  </div>
                )}
              </div>

              {loadingPerformance ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : teamPerformance && teamPerformance.tasksPerUser && teamPerformance.tasksPerUser.length > 0 ? (
                <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
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
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No team members assigned to tasks yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
