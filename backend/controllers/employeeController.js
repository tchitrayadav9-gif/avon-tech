const bcrypt = require('bcryptjs');
const dbClient = require('../database/dbClient');
const { getDbType } = require('../config/db');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
exports.getEmployees = async (req, res) => {
  try {
    const { department, search } = req.query;
    let filter = {};

    if (department) {
      filter.department = department;
    }

    let employeeResults = await dbClient.employees.find(filter);
    // Populate user reference
    employeeResults = await employeeResults.populate('user');
    
    let employees = Array.isArray(employeeResults) ? employeeResults : employeeResults.data;

    // Filter by search query if present (name or email or employeeId)
    if (search) {
      const searchLower = search.toLowerCase();
      employees = employees.filter(emp => {
        const nameMatch = emp.user && emp.user.name.toLowerCase().includes(searchLower);
        const emailMatch = emp.user && emp.user.email.toLowerCase().includes(searchLower);
        const idMatch = emp.employeeId.toLowerCase().includes(searchLower);
        const skillsMatch = emp.skills && emp.skills.some(s => s.toLowerCase().includes(searchLower));
        return nameMatch || emailMatch || idMatch || skillsMatch;
      });
    }

    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Private/Admin
exports.getEmployeeById = async (req, res) => {
  try {
    const empResult = await dbClient.employees.findById(req.params.id);
    const employee = await empResult.populate('user');
    
    if (!employee || (Array.isArray(employee.data) && employee.data.length === 0)) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, data: Array.isArray(employee.data) ? employee.data[0] : employee.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private/Admin
exports.createEmployee = async (req, res) => {
  const { name, email, password, employeeId, phone, department, role, joiningDate, skills } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await dbClient.users.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email address already registered' });
    }

    // 2. Check if employeeId is unique
    const empIdExists = await dbClient.employees.findOne({ employeeId });
    if (empIdExists) {
      return res.status(400).json({ success: false, message: 'Employee ID already exists' });
    }

    // 3. Encrypt password if JSON db fallback
    let hashedPassword = password || 'avon123'; // Default password if none provided
    if (getDbType() === 'json') {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(hashedPassword, salt);
    }

    // 4. Create User
    const user = await dbClient.users.create({
      name,
      email,
      password: hashedPassword,
      role: 'employee',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name.replace(/\s+/g, '')}`
    });

    // 5. Create Employee Profile
    const employee = await dbClient.employees.create({
      user: user._id || user.id,
      employeeId,
      phone,
      department,
      role,
      joiningDate: joiningDate || new Date().toISOString(),
      skills: skills ? skills.split(',').map(s => s.trim()) : [],
      performanceRating: 4.0,
      attendanceRate: 95,
      taskCompletionRate: 90,
      status: 'Active'
    });

    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update employee profile
// @route   PUT /api/employees/:id
// @access  Private/Admin
exports.updateEmployee = async (req, res) => {
  const { name, email, phone, department, role, joiningDate, skills, performanceRating, attendanceRate, taskCompletionRate, status } = req.body;

  try {
    // 1. Find the employee profile
    const empResult = await dbClient.employees.findById(req.params.id);
    const employee = Array.isArray(empResult.data) ? empResult.data[0] : empResult.data;
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    // 2. Update User details
    const userId = employee.user._id || employee.user;
    await dbClient.users.findByIdAndUpdate(userId, { name, email });

    // 3. Update Employee details
    const updatedEmployee = await dbClient.employees.findByIdAndUpdate(req.params.id, {
      phone,
      department,
      role,
      joiningDate,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      performanceRating: Number(performanceRating) || employee.performanceRating,
      attendanceRate: Number(attendanceRate) || employee.attendanceRate,
      taskCompletionRate: Number(taskCompletionRate) || employee.taskCompletionRate,
      status: status || employee.status
    });

    res.json({ success: true, data: updatedEmployee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete employee profile and user account
// @route   DELETE /api/employees/:id
// @access  Private/Admin
exports.deleteEmployee = async (req, res) => {
  try {
    const empResult = await dbClient.employees.findById(req.params.id);
    const employee = Array.isArray(empResult.data) ? empResult.data[0] : empResult.data;
    
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    // Delete User
    const userId = employee.user._id || employee.user;
    await dbClient.users.findByIdAndDelete(userId);

    // Delete Employee Profile
    await dbClient.employees.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Employee and user profile successfully deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
