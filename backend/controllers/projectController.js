const dbClient = require('../database/dbClient');

// @desc    Get all projects (scoped by role)
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    let filter = {};

    // Scope projects based on role
    if (req.user.role === 'employee') {
      filter.team = req.user._id || req.user.id;
    } else if (req.user.role === 'client') {
      filter.client = req.user._id || req.user.id;
    }

    let projectResults = await dbClient.projects.find(filter);
    projectResults = await projectResults.populate('team');
    projectResults = await projectResults.populate('client');

    let projects = Array.isArray(projectResults) ? projectResults : projectResults.data;

    // Optional query filters
    const { projectType, status, search } = req.query;

    if (projectType) {
      projects = projects.filter(p => p.projectType === projectType);
    }
    if (status) {
      projects = projects.filter(p => p.status === status);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      projects = projects.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }

    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project details
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res) => {
  try {
    const projResult = await dbClient.projects.findById(req.params.id);
    let project = await projResult.populate('team');
    project = await project.populate('client');

    let data = Array.isArray(project.data) ? project.data[0] : project.data;
    if (!data) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Role verification: check access permissions
    if (req.user.role === 'employee') {
      const isMember = data.team.some(member => member._id.toString() === req.user._id.toString() || member.id === req.user.id);
      if (!isMember) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this project' });
      }
    } else if (req.user.role === 'client') {
      const isOwner = (data.client._id && data.client._id.toString() === req.user._id.toString()) || (data.client && data.client.toString() === req.user.id);
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this project' });
      }
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new software project
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res) => {
  const { name, description, projectType, startDate, endDate, client, team, milestones } = req.body;

  try {
    const newProject = await dbClient.projects.create({
      name,
      description,
      projectType,
      startDate,
      endDate,
      client,
      team: team || [],
      milestones: milestones || [],
      progress: 0,
      status: 'Planned'
    });

    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update project info (Admin or Employee team member)
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  const { name, description, status, progress, milestones, team, client } = req.body;

  try {
    const projResult = await dbClient.projects.findById(req.params.id);
    const project = Array.isArray(projResult.data) ? projResult.data[0] : projResult.data;
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Role-based auth check
    if (req.user.role === 'employee') {
      const isMember = project.team.some(id => id.toString() === req.user._id.toString() || id.toString() === req.user.id);
      if (!isMember) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this project' });
      }
    } else if (req.user.role === 'client') {
      return res.status(403).json({ success: false, message: 'Clients cannot modify project records' });
    }

    // Admin can update everything. Employees can update status, progress, milestones.
    let updateFields = {};
    if (req.user.role === 'admin') {
      updateFields = { name, description, status, progress, milestones, team, client };
    } else {
      updateFields = { status, progress, milestones };
    }

    const updatedProject = await dbClient.projects.findByIdAndUpdate(req.params.id, updateFields);

    res.json({ success: true, data: updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res) => {
  try {
    const projResult = await dbClient.projects.findById(req.params.id);
    const project = Array.isArray(projResult.data) ? projResult.data[0] : projResult.data;
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await dbClient.projects.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
