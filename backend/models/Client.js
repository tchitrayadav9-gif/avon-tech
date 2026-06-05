const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true
  },
  contactPerson: {
    type: String,
    required: [true, 'Please add a contact person name'],
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    required: [true, 'Please add an industry sector'],
    trim: true
  },
  assignedService: {
    type: String,
    required: [true, 'Please select an assigned service'],
    enum: [
      'Enterprise Software Solutions',
      'Web Development',
      'Mobile App Development',
      'CRM Services',
      'ERP/BaaN Solutions',
      'BI Reporting Tools',
      'Enterprise Portals',
      'Technical Support'
    ]
  },
  projectStatus: {
    type: String,
    default: 'Discovery'
  },
  communicationNotes: [{
    note: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    addedBy: {
      type: String,
      default: 'System'
    }
  }]
});

module.exports = mongoose.model('Client', ClientSchema);
