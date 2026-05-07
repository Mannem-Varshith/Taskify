const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String },
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Task title is required'], trim: true },
    description: { type: String, default: '' },
    dueDate: { type: Date },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['todo', 'inprogress', 'done'], default: 'todo' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [commentSchema],
    activityLog: [activitySchema],
    viewedByAssignedUser: { type: Boolean, default: false },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
