const Notification = require('../models/Notification');

// GET /api/notifications - Get user's notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name email')
      .populate('task', 'title')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .limit(50);
    
    const unreadCount = await Notification.countDocuments({ 
      recipient: req.user._id, 
      read: false 
    });
    
    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/notifications/:id/read - Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/notifications/read-all - Mark all as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/notifications/:id - Delete notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to create notification
const createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

module.exports = { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification,
  createNotification 
};
