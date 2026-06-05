const dbClient = require('../database/dbClient');

// @desc    Get all tasks (scoped by user role)
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    let filter = {};

    // Role-based filtering
    if (req.user.role === 'employee') {
      filter.assignedTo = req.user._id || req.user.id;
    } else if (req.user.role === 'client') {
      // Find projects owned by this client
      const clientProjectsResult = await dbClient.projects.find({ client: req.user._id || req.user.id });
      const clientProjects = Array.isArray(clientProjectsResult) ? clientProjectsResult : clientProjectsResult.data;
      const projectIds = clientProjects.map(p => p._id || p.id);
      filter.project = { $in: projectIds };
    }

    let taskResults = await dbClient.tasks.find(filter);
    taskResults = await taskResults.populate('assignedTo');
    taskResults = await taskResults.populate('project');

    let tasks = Array.isArray(taskResults) ? taskResults : taskResults.data;

    // Optional parameters filters
    const { status, priority, projectId } = req.query;
    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }
    if (priority) {
      tasks = tasks.filter(t => t.priority === priority);
    }
    if (projectId) {
      tasks = tasks.filter(t => (t.project && (t.project._id || t.project).toString() === projectId));
    }

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private/Admin
exports.createTask = async (req, res) => {
  const { title, description, project, assignedTo, priority, dueDate } = req.body;

  try {
    // Check if project exists
    const projResult = await dbClient.projects.findById(project);
    const proj = Array.isArray(projResult.data) ? projResult.data[0] : projResult.data;
    if (!proj) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const task = await dbClient.tasks.create({
      title,
      description,
      project,
      assignedTo,
      priority,
      dueDate,
      status: 'Pending',
      dailyUpdates: []
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task status, priority, or add daily updates
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  const { title, description, assignedTo, priority, status, dueDate, dailyUpdate } = req.body;

  try {
    const taskResult = await dbClient.tasks.findById(req.params.id);
    const task = Array.isArray(taskResult.data) ? taskResult.data[0] : taskResult.data;
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Auth verification: employees can only update tasks assigned to them
    if (req.user.role === 'employee') {
      const assignedId = task.assignedTo._id ? task.assignedTo._id.toString() : task.assignedTo.toString();
      if (assignedId !== (req.user._id || req.user.id).toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this task' });
      }
    }

    let updateFields = {};
    if (req.user.role === 'admin') {
      updateFields = { title, description, assignedTo, priority, status, dueDate };
    } else {
      // Employees can only update status
      updateFields = { status };
    }

    // Add daily update if provided
    if (dailyUpdate) {
      await dbClient.tasks.findByIdAndUpdate(req.params.id, {
        $push: {
          dailyUpdates: {
            update: dailyUpdate,
            date: new Date().toISOString()
          }
        }
      });
    }

    const updatedTask = await dbClient.tasks.findByIdAndUpdate(req.params.id, updateFields);

    res.json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
exports.deleteTask = async (req, res) => {
  try {
    const taskResult = await dbClient.tasks.findById(req.params.id);
    const task = Array.isArray(taskResult.data) ? taskResult.data[0] : taskResult.data;
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await dbClient.tasks.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Task successfully deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
