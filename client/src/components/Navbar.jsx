import { useState, useEffect, useRef } from 'react';
import { Menu, Moon, Sun, Bell, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    
    // Setup socket connection for real-time notifications
    if (user?._id) {
      socketRef.current = io(API_URL, { 
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 10000,
        reconnectionAttempts: 5,
        timeout: 20000,
        autoConnect: true
      });
      
      socketRef.current.on('connect', () => {
        console.log('Socket connected for notifications');
        // Join user's personal room for notifications
        socketRef.current.emit('join:user', user._id);
      });
      
      socketRef.current.on('notification:new', () => {
        // Refresh notifications when new one arrives
        fetchNotifications();
      });
      
      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
      });
      
      socketRef.current.on('reconnect_attempt', (attemptNumber) => {
        console.log(`Reconnection attempt ${attemptNumber}`);
      });
      
      socketRef.current.on('reconnect_failed', () => {
        console.error('Socket reconnection failed after max attempts');
      });
      
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [user?._id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  const handleNotificationClick = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      // Mark all as read when opened
      try {
        await api.put('/notifications/read-all');
        setUnreadCount(0);
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      } catch (error) {
        console.error('Failed to mark notifications as read');
      }
    }
  };

  const handleNotificationItemClick = async (notification) => {
    // Mark as read
    if (!notification.read) {
      try {
        await api.put(`/notifications/${notification._id}/read`);
      } catch (error) {
        console.error('Failed to mark notification as read');
      }
    }
    
    // Navigate to link
    if (notification.link) {
      navigate(notification.link);
      setShowNotifications(false);
    }
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications(notifications.filter(n => n._id !== notificationId));
      if (unreadCount > 0) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification');
    }
  };

  const clearAllNotifications = async () => {
    try {
      await Promise.all(notifications.map(n => api.delete(`/notifications/${n._id}`)));
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to clear notifications');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      task_assigned: '📋',
      task_comment: '💬',
      task_completed: '✅',
      task_status_changed: '🔄',
      member_added: '👥',
      task_due_soon: '⏰'
    };
    return icons[type] || '🔔';
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 z-10">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 mr-4 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white hidden sm:block">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h2>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={handleNotificationClick}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[600px] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Notifications {unreadCount > 0 && `(${unreadCount})`}
                </h3>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="overflow-y-auto flex-1">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => handleNotificationItemClick(notification)}
                      className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white">
                            <span className="font-medium">{notification.sender?.name}</span>
                            <span className="text-gray-600 dark:text-gray-400"> {notification.message}</span>
                          </p>
                          {notification.project && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {notification.project.title}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDeleteNotification(e, notification._id)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      You'll be notified when someone assigns you a task or comments
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <button 
          onClick={toggleDarkMode}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
