import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import TaskCard from '../components/TaskCard';
import TaskDetailsModal from '../components/TaskDetailsModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TaskBoard = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [tasks, setTasks] = useState({ todo: [], inprogress: [], done: [] });
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [socket, setSocket] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  // Smart task ordering function
  const sortTasks = (taskList) => {
    return [...taskList].sort((a, b) => {
      // Priority weights
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      
      // Check if overdue
      const now = new Date();
      const aOverdue = a.dueDate && new Date(a.dueDate) < now && a.status !== 'done';
      const bOverdue = b.dueDate && new Date(b.dueDate) < now && b.status !== 'done';
      
      // Overdue tasks first
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      
      // Then by priority
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by due date (nearest first)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      
      // Finally by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const fetchTasks = async () => {
    try {
      const [tasksRes, projectRes] = await Promise.all([
        api.get(`/tasks/project/${id}`),
        api.get(`/projects/${id}`)
      ]);
      
      const allTasks = tasksRes.data;
      setTasks({
        todo: sortTasks(allTasks.filter(t => t.status === 'todo')),
        inprogress: sortTasks(allTasks.filter(t => t.status === 'inprogress')),
        done: sortTasks(allTasks.filter(t => t.status === 'done'))
      });
      setProject(projectRes.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    const newSocket = io(API_URL, { transports: ['websocket', 'polling'] });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join:project', id);
    });

    newSocket.on('task:created', (newTask) => {
      setTasks(prev => {
        const newState = { ...prev };
        newState[newTask.status] = sortTasks([newTask, ...newState[newTask.status]]);
        return newState;
      });
    });

    newSocket.on('task:updated', (updatedTask) => {
      setTasks(prev => {
        const newState = { ...prev };
        // Remove from all lists
        ['todo', 'inprogress', 'done'].forEach(col => {
          newState[col] = newState[col].filter(t => t._id !== updatedTask._id);
        });
        // Add to correct list and sort
        newState[updatedTask.status] = sortTasks([updatedTask, ...newState[updatedTask.status]]);
        return newState;
      });
    });

    newSocket.on('task:deleted', ({ taskId }) => {
      setTasks(prev => {
        const newState = { ...prev };
        ['todo', 'inprogress', 'done'].forEach(col => {
          newState[col] = newState[col].filter(t => t._id !== taskId);
        });
        return newState;
      });
    });

    return () => {
      newSocket.emit('leave:project', id);
      newSocket.disconnect();
    };
  }, [id]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const start = tasks[source.droppableId];
    const finish = tasks[destination.droppableId];
    
    // UI optimistic update
    if (source.droppableId === destination.droppableId) {
      const newList = Array.from(start);
      const [removed] = newList.splice(source.index, 1);
      newList.splice(destination.index, 0, removed);
      setTasks(prev => ({ ...prev, [source.droppableId]: newList }));
    } else {
      const startList = Array.from(start);
      const finishList = Array.from(finish);
      const [removed] = startList.splice(source.index, 1);
      removed.status = destination.droppableId;
      finishList.splice(destination.index, 0, removed);
      
      setTasks(prev => ({
        ...prev,
        [source.droppableId]: startList,
        [destination.droppableId]: sortTasks(finishList)
      }));
    }

    // Backend update
    if (source.droppableId !== destination.droppableId) {
      try {
        await api.put(`/tasks/${draggableId}`, { status: destination.droppableId });
      } catch (error) {
        toast.error('Failed to update task status');
        fetchTasks();
      }
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        title, description, priority, projectId: id,
        dueDate: dueDate || undefined,
        assignedTo: assignedTo || undefined
      });
      toast.success('Task created');
      setIsModalOpen(false);
      setTitle(''); setDescription(''); setPriority('medium'); setDueDate(''); setAssignedTo('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleTaskClick = (taskId) => {
    setSelectedTaskId(taskId);
    setIsTaskModalOpen(true);
  };

  const handleTaskUpdate = (updatedTask) => {
    // Task will be updated via socket event
    fetchTasks();
  };

  if (loading || !project) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const isAdmin = project?.admin?._id === user?._id;

  const columns = [
    { id: 'todo', title: 'To Do', bgColor: 'bg-gray-50 dark:bg-gray-800/30' },
    { id: 'inprogress', title: 'In Progress', bgColor: 'bg-blue-50 dark:bg-blue-900/10' },
    { id: 'done', title: 'Done', bgColor: 'bg-green-50 dark:bg-green-900/10' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            <Link to={`/projects/${id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Project Details
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            {project.title}
            <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full">
              Task Board
            </span>
          </h1>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        )}
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full min-w-max">
            {columns.map(column => (
              <div 
                key={column.id} 
                className={`w-80 flex flex-col rounded-xl border-2 border-gray-200 dark:border-gray-700 ${column.bgColor} shadow-sm`}
              >
                <div className="p-4 border-b-2 border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-t-xl">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">{column.title}</h3>
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-3 rounded-full text-xs font-bold">
                    {tasks[column.id].length}
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-4 overflow-y-auto min-h-[200px] space-y-3 transition-colors ${
                        snapshot.isDraggingOver ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                      }`}
                    >
                      {tasks[column.id].map((task, index) => (
                        <Draggable 
                          key={task._id} 
                          draggableId={task._id} 
                          index={index}
                          isDragDisabled={!isAdmin && task.assignedTo?._id !== user?._id}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard 
                                task={task} 
                                onClick={() => handleTaskClick(task._id)}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {tasks[column.id].length === 0 && (
                        <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm italic">
                          No tasks yet
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Create Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Title</label>
            <input 
              type="text" 
              required 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
              placeholder="Enter task title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea 
              rows="3" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Add a description..."
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
              <input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign To</label>
            <select 
              value={assignedTo} 
              onChange={(e) => setAssignedTo(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Unassigned</option>
              <option value={project.admin._id}>{project.admin.name} (Admin)</option>
              {project.members.map(m => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)} 
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>

      {/* Task Details Modal */}
      <TaskDetailsModal
        taskId={selectedTaskId}
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTaskId(null);
        }}
        onTaskUpdate={handleTaskUpdate}
        isAdmin={isAdmin}
        project={project}
      />
    </div>
  );
};

export default TaskBoard;
