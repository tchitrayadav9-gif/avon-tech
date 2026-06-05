import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Trash2,
  Edit,
  X,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Plus
} from 'lucide-react';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Frontend');
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().substring(0, 10));
  const [performanceRating, setPerformanceRating] = useState('4.0');
  const [status, setStatus] = useState('Active');

  const [formError, setFormError] = useState('');

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const url = `${API_URL}/employees?department=${selectedDept === 'All' ? '' : selectedDept}&search=${searchQuery}`;
      const res = await axios.get(url);
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [selectedDept]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEmployees();
  };

  const handleOpenEdit = (emp) => {
    setSelectedEmp(emp);
    setName(emp.user?.name || '');
    setEmail(emp.user?.email || '');
    setEmployeeId(emp.employeeId || '');
    setPhone(emp.phone || '');
    setDepartment(emp.department || 'Frontend');
    setRole(emp.role || '');
    setSkills(emp.skills ? emp.skills.join(', ') : '');
    setJoiningDate(new Date(emp.joiningDate).toISOString().substring(0, 10));
    setPerformanceRating(emp.performanceRating || '4.0');
    setStatus(emp.status || 'Active');
    
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleOpenAdd = () => {
    setName('');
    setEmail('');
    setPassword('');
    // Auto-generate employee ID
    setEmployeeId(`AVN-2026-${Math.floor(Math.random() * 900) + 100}`);
    setPhone('');
    setDepartment('Frontend');
    setRole('');
    setSkills('');
    setJoiningDate(new Date().toISOString().substring(0, 10));
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee? This will also remove their user account.')) {
      try {
        const res = await axios.delete(`${API_URL}/employees/${id}`);
        if (res.data.success) {
          fetchEmployees();
        }
      } catch (err) {
        alert('Error deleting employee.');
      }
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !employeeId || !role) {
      return setFormError('Please fill in all required fields');
    }

    try {
      const res = await axios.post(`${API_URL}/employees`, {
        name,
        email,
        password: password || 'avon123',
        employeeId,
        phone,
        department,
        role,
        joiningDate,
        skills
      });

      if (res.data.success) {
        setIsAddModalOpen(false);
        fetchEmployees();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error creating employee.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !role) {
      return setFormError('Please fill in all required fields');
    }

    try {
      const res = await axios.put(`${API_URL}/employees/${selectedEmp._id}`, {
        name,
        email,
        phone,
        department,
        role,
        joiningDate,
        skills,
        performanceRating,
        status
      });

      if (res.data.success) {
        setIsEditModalOpen(false);
        fetchEmployees();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error updating employee.');
    }
  };

  const depts = ['All', 'Frontend', 'Backend', 'QA', 'ERP/BaaN', 'CRM', 'HR', 'DevOps'];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Employee Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage developer teams, departments, ratings, and skills.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg flex items-center space-x-2 transition self-start shadow-md shadow-brand-900/10"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-enterprise-900 p-4 border border-slate-200 dark:border-enterprise-800 rounded-2xl shadow-sm">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm w-full bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </form>

        {/* Dept Selector */}
        <div className="flex flex-wrap gap-2 justify-end w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 self-center hidden sm:block mr-1" />
          {depts.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDept(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedDept === d
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-50 dark:bg-enterprise-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-enterprise-850'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Grid */}
      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl">
          <p className="text-slate-500 dark:text-slate-400 text-sm">No employee records found matching your filters.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-enterprise-850 bg-slate-50/50 dark:bg-enterprise-900/40 text-xs font-bold text-slate-400 uppercase">
                  <th className="py-3 px-6">Employee</th>
                  <th className="py-3 px-6">ID & Dept</th>
                  <th className="py-3 px-6">Skills Set</th>
                  <th className="py-3 px-6">Perf Rating</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-enterprise-850 text-sm">
                {employees.map(emp => (
                  <tr key={emp._id || emp.id} className="hover:bg-slate-50/50 dark:hover:bg-enterprise-850/20">
                    {/* Employee Profile Cell */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={emp.user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${emp._id}`}
                          alt="Avatar"
                          className="w-9 h-9 rounded-full border border-slate-200 dark:border-enterprise-800"
                        />
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                            {emp.user?.name || 'Deleted Account'}
                          </span>
                          <span className="text-[11px] text-slate-400">{emp.user?.email || 'N/A'}</span>
                        </div>
                      </div>
                    </td>

                    {/* ID and Dept */}
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold block text-slate-700 dark:text-slate-300">{emp.employeeId}</span>
                      <span className="inline-block px-2 py-0.5 mt-1 text-[9px] font-bold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded uppercase">
                        {emp.department}
                      </span>
                    </td>

                    {/* Skills Set */}
                    <td className="py-4 px-6 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {emp.skills && emp.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-100 dark:bg-enterprise-800 text-[10px] text-slate-600 dark:text-slate-300 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Performance Rating */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-extrabold">{emp.performanceRating || '4.0'}</span>
                        <span className="text-xs text-slate-400">/ 5.0</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        emp.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-enterprise-800 dark:text-slate-400'
                      }`}>
                        {emp.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          className="p-1 text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-enterprise-800 rounded-lg transition"
                          title="Edit Employee"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="p-1 text-slate-500 hover:text-rose-600 dark:hover:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- ADD EMPLOYEE MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 dark:border-enterprise-800 flex justify-between items-center bg-slate-50 dark:bg-enterprise-900/40">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Onboard New Employee</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-enterprise-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employee Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="developer@avontech.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employee ID *</label>
                    <input
                      type="text"
                      required
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone / Mobile</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department *</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    >
                      {depts.filter(d => d !== 'All').map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Job Designation *</label>
                    <input
                      type="text"
                      required
                      placeholder="Senior React Developer"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Skills (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="React, Redux, Node.js, Tailwind"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Joining Date</label>
                    <input
                      type="date"
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Temporary Password</label>
                    <input
                      type="text"
                      placeholder="Default: avon123"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-enterprise-800 bg-slate-50 dark:bg-enterprise-900/40 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-200 dark:bg-enterprise-850 text-slate-700 dark:text-slate-300 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition"
                >
                  Onboard Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT EMPLOYEE MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 dark:border-enterprise-800 flex justify-between items-center bg-slate-50 dark:bg-enterprise-900/40">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Modify Employee Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-enterprise-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employee Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employee ID (Read Only)</label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={employeeId}
                      className="w-full px-3 py-2 text-sm bg-slate-100 dark:bg-enterprise-850 border border-slate-200 dark:border-enterprise-800 text-slate-400 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone / Mobile</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department *</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    >
                      {depts.filter(d => d !== 'All').map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Job Designation *</label>
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Skills (Comma-separated)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Performance Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={performanceRating}
                      onChange={(e) => setPerformanceRating(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Joining Date</label>
                    <input
                      type="date"
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Account Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-enterprise-800 bg-slate-50 dark:bg-enterprise-900/40 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-200 dark:bg-enterprise-850 text-slate-700 dark:text-slate-300 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
