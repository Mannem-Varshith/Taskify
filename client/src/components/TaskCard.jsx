import { Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const TaskCard = ({ task, onClick, isDragging }) => {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800'
  };

  const priorityBadgeColors = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  };

  // Check if task is overdue
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  
  // Check if due soon (within 48 hours)
  const isDueSoon = task.dueDate && !isOverdue && task.status !== 'done' && 
    (new Date(task.dueDate) - new Date()) < (48 * 60 * 60 * 1000);

  const formatDueDate = (date) => {
    const dueDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dueDate.toDateString() === today.toDateString()) {
      return 'Due Today';
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
      return 'Due Tomorrow';
    } else {
      return `Due ${dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: isDragging ? 1 : 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`
        group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 cursor-pointer
        transition-all duration-200 hover:shadow-md
        ${isOverdue 
          ? 'border-red-400 dark:border-red-600 shadow-red-100 dark:shadow-red-900/20 hover:shadow-red-200 dark:hover:shadow-red-900/30' 
          : isDueSoon
          ? 'border-orange-300 dark:border-orange-700'
          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
        }
        ${isDragging ? 'rotate-2 scale-105 shadow-lg' : ''}
      `}
    >
      {/* Overdue glow effect */}
      {isOverdue && (
        <div className="absolute inset-0 rounded-lg bg-red-400/10 dark:bg-red-600/10 animate-pulse pointer-events-none" />
      )}

      <div className="p-4 relative">
        {/* Priority Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${priorityColors[task.priority]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${priorityBadgeColors[task.priority]}`} />
              {task.priority}
            </span>
            {task.status === 'inprogress' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                In Progress
              </span>
            )}
          </div>
        </div>

        {/* Task Title */}
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {task.title}
        </h4>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {/* Due Date */}
            {task.dueDate && (
              <div 
                className={`flex items-center gap-1 ${
                  isOverdue 
                    ? 'text-red-600 dark:text-red-400 font-semibold' 
                    : isDueSoon 
                    ? 'text-orange-600 dark:text-orange-400 font-medium'
                    : ''
                }`}
                title={new Date(task.dueDate).toLocaleString()}
              >
                {isOverdue && <AlertCircle className="w-3.5 h-3.5" />}
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[11px]">{formatDueDate(task.dueDate)}</span>
              </div>
            )}

            {/* Comments Count */}
            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center gap-1" title={`${task.comments.length} comments`}>
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{task.comments.length}</span>
              </div>
            )}
          </div>

          {/* Assigned User Avatar */}
          {task.assignedTo && task.assignedTo.name && (
            <div 
              className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold text-[11px] shadow-sm ring-2 ring-white dark:ring-gray-800" 
              title={`Assigned to ${task.assignedTo.name}`}
            >
              {task.assignedTo.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Due Soon Badge */}
        {isDueSoon && !isOverdue && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-300 dark:border-orange-700">
              Due Soon
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;
