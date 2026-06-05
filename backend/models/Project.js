const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  projectType: {
    type: String,
    required: [true, 'Please add a project type'],
    enum: ['ERP Projects', 'CRM Projects', 'Web Applications', 'Mobile Apps', 'Enterprise Portals']
  },
  status: {
    type: String,
    required: [true, 'Please add status'],
    enum: ['Planned', 'Development', 'Testing', 'Deployment', 'Completed'],
    default: 'Planned'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  startDate: {
    type: Date,
    required: [true, 'Please add start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add end date']
  },
  milestones: [{
    title: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending'
    },
    deadline: {
      type: Date
    }
  }],
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
