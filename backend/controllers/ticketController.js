const dbClient = require('../database/dbClient');

// @desc    Get all support tickets (scoped by role)
// @route   GET /api/tickets
// @access  Private
exports.getTickets = async (req, res) => {
  try {
    let filter = {};

    // Scoped views
    if (req.user.role === 'client') {
      filter.raisedBy = req.user._id || req.user.id;
    } else if (req.user.role === 'employee') {
      filter.assignedTo = req.user._id || req.user.id;
    }

    let ticketResults = await dbClient.tickets.find(filter);
    ticketResults = await ticketResults.populate('raisedBy');
    ticketResults = await ticketResults.populate('assignedTo');
    ticketResults = await ticketResults.populate('comments.sender');

    let tickets = Array.isArray(ticketResults) ? ticketResults : ticketResults.data;

    // Optional parameters filter
    const { status, priority } = req.query;
    if (status) {
      tickets = tickets.filter(t => t.status === status);
    }
    if (priority) {
      tickets = tickets.filter(t => t.priority === priority);
    }

    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Raise a support ticket
// @route   POST /api/tickets
// @access  Private/Client
exports.createTicket = async (req, res) => {
  const { title, description, priority } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Please provide title and description' });
  }

  try {
    // Generate simple readable ticketId e.g. TKT-4821
    const ticketId = `TKT-${Math.floor(Math.random() * 9000) + 1000}`;

    const ticket = await dbClient.tickets.create({
      ticketId,
      title,
      description,
      raisedBy: req.user._id || req.user.id,
      priority: priority || 'Low',
      status: 'Open',
      comments: []
    });

    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update ticket status, priority, or assignee (Admin/Employee)
// @route   PUT /api/tickets/:id
// @access  Private
exports.updateTicket = async (req, res) => {
  const { status, priority, assignedTo } = req.body;

  try {
    const ticketResult = await dbClient.tickets.findById(req.params.id);
    const ticket = Array.isArray(ticketResult.data) ? ticketResult.data[0] : ticketResult.data;
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Client cannot update ticket status directly unless raising comments
    if (req.user.role === 'client') {
      return res.status(403).json({ success: false, message: 'Clients cannot change ticket parameters directly' });
    }

    const updateFields = {
      status: status || ticket.status,
      priority: priority || ticket.priority,
      assignedTo: assignedTo || ticket.assignedTo
    };

    const updatedTicket = await dbClient.tickets.findByIdAndUpdate(req.params.id, updateFields);

    res.json({ success: true, data: updatedTicket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to ticket thread
// @route   POST /api/tickets/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, message: 'Comment content is required' });
  }

  try {
    const ticketResult = await dbClient.tickets.findById(req.params.id);
    const ticket = Array.isArray(ticketResult.data) ? ticketResult.data[0] : ticketResult.data;
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const updatedTicket = await dbClient.tickets.findByIdAndUpdate(req.params.id, {
      $push: {
        comments: {
          sender: req.user._id || req.user.id,
          text,
          timestamp: new Date().toISOString()
        }
      }
    });

    res.json({ success: true, data: updatedTicket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
