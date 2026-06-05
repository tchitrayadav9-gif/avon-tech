const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeId: {
    type: String,
    required: [true, 'Please add an Employee ID'],
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Please add a department'],
    enum: ['Frontend', 'Backend', 'QA', 'ERP/BaaN', 'CRM', 'HR', 'DevOps']
  },
  role: {
    type: String,
    required: [true, 'Please add a job role designation'],
    trim: true
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  skills: {
    type: [String],
    default: []
  },
  assignedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  performanceRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.0
  },
  attendanceRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 95
  },
  taskCompletionRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 90
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
