import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calendar, Flag, User, Clock, MessageSquare, 
  Edit2, Save, XCircle, Activity, CheckCircle2, AlertCircle 
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const TaskDetailsModal = ({ taskId, isOpen, onClose, onTaskUpdate, isAdmin, project }) => {
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Edit form states
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'todo',
    assignedTo: ''
  });

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTask();
    }
  }, [isOpen, taskId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tasks/${taskId}`);
      setTask(res.data);
      setEditForm({
        title: res.data.title,
        description: res.data.description || '',
        priority: res.data.priority,
        dueDate: res.data.dueDate ? new Date(res.data.dueDate).toISOString().split('T')[0] : '',
        status: res.data.status,
        assignedTo: res.data.assignedTo?._id || ''
      });
    } catch (error) {
      toast.error('Failed to load task details');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updateData = { ...editForm };
      if (!updateData.dueDate) updateData.dueDate = null;
      if (!updateData.assignedTo) updateData.assignedTo = null;

      const res = await api.put(`/tasks/${taskId}`, updateData);
      setTask(res.data);
      setIsEditing(false);
      toast.success('Task updated successfully');
      if (onTaskUpdate) onTaskUpdate(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);
      const res = await api.post(`/tasks/${taskId}/comments`, { text: commentText });
      setTask(prev => ({
        ...prev,
        comments: [...(prev.comments || []), res.data]
      }));
      setCommentText('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTask(res.data);
      setEditForm(prev => ({ ...prev, status: newStatus }));
      toast.success(`Task moved to ${newStatus}`);
      if (onTaskUpdate) onTaskUpdate(res.data);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    inprogress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    done: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  };

  const isOverdue = task?.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : task ? (
              <>
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
                  <div className="flex-1 pr-4">
                    {isEditing && isAdmin ? (
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full text-2xl font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-2 border-indigo-300 dark:border-indigo-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{task.title}</h2>
                    )}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${priorityColors[task.priority]}`}>
                        {task.priority} Priority
                      </span>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[task.status]}`}>
                        {task.status === 'inprogress' ? 'In Progress' : task.status === 'todo' ? 'To Do' : 'Done'}
                      </span>
                      {isOverdue && (
                        <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Description */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Description
                        </h3>
                        {isEditing && isAdmin ? (
                          <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            rows="6"
                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Add a description..."
                          />
                        ) : (
                          <div className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 min-h-[100px]">
                            {task.description || <span className="italic text-gray-400">No description provided</span>}
                          </div>
                        )}
                      </div>

                      {/* Activity Timeline */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Activity
                        </h3>
                        <div className="space-y-3">
                          {task.activityLog && task.activityLog.length > 0 ? (
                            task.activityLog.slice().reverse().map((activity, idx) => (
                              <div key={idx} className="flex items-start gap-3 text-sm">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-semibold text-xs flex-shrink-0">
                                  {activity.user?.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div className="flex-1">
                                  <p className="text-gray-900 dark:text-white">
                                    <span className="font-medium">{activity.user?.name || 'Unknown'}</span>
                                    <span className="text-gray-600 dark:text-gray-400"> {activity.action}</span>
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                                    {new Date(activity.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No activity yet</p>
                          )}
                        </div>
                      </div>

                      {/* Comments */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Comments ({task.comments?.length || 0})
                        </h3>
                        
                        {/* Add Comment Form */}
                        <form onSubmit={handleAddComment} className="mb-4">
                          <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold text-xs flex-shrink-0">
                              {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                              />
                              <button
                                type="submit"
                                disabled={!commentText.trim() || submittingComment}
                                className="mt-2 px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {submittingComment ? 'Posting...' : 'Post Comment'}
                              </button>
                            </div>
                          </div>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-4">
                          {task.comments && task.comments.length > 0 ? (
                            task.comments.map((comment, idx) => (
                              <div key={idx} className="flex gap-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center font-semibold text-xs flex-shrink-0">
                                  {comment.user?.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                                      {comment.user?.name || 'Unknown'}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-500">
                                      {new Date(comment.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No comments yet</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                      {/* Edit/Save Buttons */}
                      {isAdmin && (
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-900 rounded-lg p-4 border border-indigo-100 dark:border-gray-700">
                          {isEditing ? (
                            <div className="flex gap-2">
                              <button
                                onClick={handleSaveEdit}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                              >
                                <Save className="w-4 h-4" />
                                Save Changes
                              </button>
                              <button
                                onClick={() => {
                                  setIsEditing(false);
                                  setEditForm({
                                    title: task.title,
                                    description: task.description || '',
                                    priority: task.priority,
                                    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                                    status: task.status,
                                    assignedTo: task.assignedTo?._id || ''
                                  });
                                }}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setIsEditing(true)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit Task
                            </button>
                          )}
                        </div>
                      )}

                      {/* Status Change (for members) */}
                      {!isAdmin && task.assignedTo?._id === user?._id && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Update Status</h4>
                          <div className="space-y-2">
                            {['todo', 'inprogress', 'done'].map(status => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(status)}
                                disabled={task.status === status}
                                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  task.status === status
                                    ? 'bg-indigo-600 text-white cursor-default'
                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                              >
                                {status === 'inprogress' ? 'In Progress' : status === 'todo' ? 'To Do' : 'Done'}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Task Details */}
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Details</h4>
                        
                        {/* Assigned To */}
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
                            <User className="w-3 h-3" />
                            Assigned To
                          </label>
                          {isEditing && isAdmin ? (
                            <select
                              value={editForm.assignedTo}
                              onChange={(e) => setEditForm({ ...editForm, assignedTo: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            >
                              <option value="">Unassigned</option>
                              {project && (
                                <>
                                  <option value={project.admin._id}>
                                    {project.admin.name} (Admin)
                                  </option>
                                  {project.members && project.members.map(member => (
                                    <option key={member._id} value={member._id}>
                                      {member.name}
                                    </option>
                                  ))}
                                </>
                              )}
                            </select>
                          ) : (
                            <div className="flex items-center gap-2">
                              {task.assignedTo ? (
                                <>
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold text-[10px]">
                                    {task.assignedTo.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="text-sm text-gray-900 dark:text-white">{task.assignedTo.name}</span>
                                </>
                              ) : (
                                <span className="text-sm text-gray-500 dark:text-gray-400 italic">Unassigned</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Priority */}
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
                            <Flag className="w-3 h-3" />
                            Priority
                          </label>
                          {isEditing && isAdmin ? (
                            <select
                              value={editForm.priority}
                              onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          ) : (
                            <span className={`inline-block text-xs font-medium px-2 py-1 rounded ${priorityColors[task.priority]}`}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                          )}
                        </div>

                        {/* Status */}
                        {isEditing && isAdmin && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Status
                            </label>
                            <select
                              value={editForm.status}
                              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            >
                              <option value="todo">To Do</option>
                              <option value="inprogress">In Progress</option>
                              <option value="done">Done</option>
                            </select>
                          </div>
                        )}

                        {/* Due Date */}
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
                            <Calendar className="w-3 h-3" />
                            Due Date
                          </label>
                          {isEditing && isAdmin ? (
                            <input
                              type="date"
                              value={editForm.dueDate}
                              onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm [color-scheme:light] dark:[color-scheme:dark]"
                            />
                          ) : (
                            <span className="text-sm text-gray-900 dark:text-white">
                              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                            </span>
                          )}
                        </div>

                        {/* Created By */}
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Created By</label>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-teal-600 text-white flex items-center justify-center font-semibold text-[10px]">
                              {task.createdBy?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <span className="text-sm text-gray-900 dark:text-white">{task.createdBy?.name || 'Unknown'}</span>
                          </div>
                        </div>

                        {/* Timestamps */}
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Created: {new Date(task.createdAt).toLocaleString()}</span>
                          </div>
                          {task.startedAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Started: {new Date(task.startedAt).toLocaleString()}</span>
                            </div>
                          )}
                          {task.completedAt && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Completed: {new Date(task.completedAt).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailsModal;
