const bcrypt = require('bcryptjs');
const dbClient = require('../database/dbClient');
const { getDbType } = require('../config/db');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private/Admin
exports.getClients = async (req, res) => {
  try {
    const { industry, service } = req.query;
    let filter = {};

    if (industry) {
      filter.industry = industry;
    }
    if (service) {
      filter.assignedService = service;
    }

    let clientResults = await dbClient.clients.find(filter);
    clientResults = await clientResults.populate('user');
    
    let clients = Array.isArray(clientResults) ? clientResults : clientResults.data;

    // Filter by search query if present (name, email, companyName, contactPerson)
    const { search } = req.query;
    if (search) {
      const searchLower = search.toLowerCase();
      clients = clients.filter(c => {
        const nameMatch = c.user && c.user.name.toLowerCase().includes(searchLower);
        const emailMatch = c.user && c.user.email.toLowerCase().includes(searchLower);
        const compMatch = c.companyName.toLowerCase().includes(searchLower);
        const contactMatch = c.contactPerson.toLowerCase().includes(searchLower);
        return nameMatch || emailMatch || compMatch || contactMatch;
      });
    }

    res.json({ success: true, count: clients.length, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single client by ID
// @route   GET /api/clients/:id
// @access  Private/Admin
exports.getClientById = async (req, res) => {
  try {
    const clientResult = await dbClient.clients.findById(req.params.id);
    const client = await clientResult.populate('user');

    if (!client || (Array.isArray(client.data) && client.data.length === 0)) {
      return res.status(404).json({ success: false, message: 'Client profile not found' });
    }

    res.json({ success: true, data: Array.isArray(client.data) ? client.data[0] : client.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private/Admin
exports.createClient = async (req, res) => {
  const { name, email, password, companyName, contactPerson, phone, industry, assignedService } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await dbClient.users.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email address already registered' });
    }

    // 2. Encrypt password if JSON db fallback
    let hashedPassword = password || 'client123';
    if (getDbType() === 'json') {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(hashedPassword, salt);
    }

    // 3. Create User (Client role)
    const user = await dbClient.users.create({
      name,
      email,
      password: hashedPassword,
      role: 'client',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${companyName.replace(/\s+/g, '')}`
    });

    // 4. Create Client Profile
    const client = await dbClient.clients.create({
      user: user._id || user.id,
      companyName,
      contactPerson: contactPerson || name,
      phone,
      industry,
      assignedService,
      projectStatus: 'Discovery',
      communicationNotes: [{
        note: `Onboarded client with assigned service: ${assignedService}`,
        addedBy: 'System'
      }]
    });

    res.status(201).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update client profile
// @route   PUT /api/clients/:id
// @access  Private/Admin
exports.updateClient = async (req, res) => {
  const { name, email, companyName, contactPerson, phone, industry, assignedService, projectStatus } = req.body;

  try {
    const clientResult = await dbClient.clients.findById(req.params.id);
    const client = Array.isArray(clientResult.data) ? clientResult.data[0] : clientResult.data;
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client profile not found' });
    }

    // Update User
    const userId = client.user._id || client.user;
    await dbClient.users.findByIdAndUpdate(userId, { name, email });

    // Update Client Profile
    const updatedClient = await dbClient.clients.findByIdAndUpdate(req.params.id, {
      companyName,
      contactPerson,
      phone,
      industry,
      assignedService,
      projectStatus: projectStatus || client.projectStatus
    });

    res.json({ success: true, data: updatedClient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete client profile and user account
// @route   DELETE /api/clients/:id
// @access  Private/Admin
exports.deleteClient = async (req, res) => {
  try {
    const clientResult = await dbClient.clients.findById(req.params.id);
    const client = Array.isArray(clientResult.data) ? clientResult.data[0] : clientResult.data;
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client profile not found' });
    }

    // Delete User
    const userId = client.user._id || client.user;
    await dbClient.users.findByIdAndDelete(userId);

    // Delete Client Profile
    await dbClient.clients.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Client and associated user profile successfully deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add communication note
// @route   POST /api/clients/:id/notes
// @access  Private/Admin
exports.addCommunicationNote = async (req, res) => {
  const { note } = req.body;

  if (!note) {
    return res.status(400).json({ success: false, message: 'Note content is required' });
  }

  try {
    const clientResult = await dbClient.clients.findById(req.params.id);
    const client = Array.isArray(clientResult.data) ? clientResult.data[0] : clientResult.data;
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client profile not found' });
    }

    const updatedClient = await dbClient.clients.findByIdAndUpdate(req.params.id, {
      $push: {
        communicationNotes: {
          note,
          addedBy: req.user.name,
          date: new Date().toISOString()
        }
      }
    });

    res.json({ success: true, data: updatedClient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
