const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    type: { 
      type: String, 
      enum: ['task_assigned', 'task_comment', 'task_status_changed', 'task_completed', 'member_added', 'task_due_soon'],
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    task: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Task' 
    },
    project: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Project' 
    },
    read: { 
      type: Boolean, 
      default: false 
    },
    link: { 
      type: String 
    }
  },
  { timestamps: true }
);

// Index for faster queries
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
