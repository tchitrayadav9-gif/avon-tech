import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext, API_URL } from '../context/AuthContext';
import {
  CheckSquare,
  Plus,
  Search,
  Trash2,
  Edit,
  X,
  Calendar,
  Clock,
  User,
  Briefcase,
  AlertCircle,
  FileText,
  Activity
} from 'lucide-react';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  // Option lists for Admin Task creation
  const [projectsList, setProjectsList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('');
  
  // Daily updates log input
  const [dailyUpdate, setDailyUpdate] = useState('');

  const [formError, setFormError] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const url = `${API_URL}/tasks?status=${selectedStatus === 'All' ? '' : selectedStatus}&priority=${selectedPriority === 'All' ? '' : selectedPriority}`;
      const res = await axios.get(url);
      if (res.data.success) {
        let list = res.data.data;
        if (searchQuery) {
          list = list.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        setTasks(list);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminOptions = async () => {
    if (user.role !== 'admin') return;
    try {
      const projRes = await axios.get(`${API_URL}/projects`);
      const empRes = await axios.get(`${API_URL}/employees`);
      setProjectsList(projRes.data.data);
      setEmployeesList(empRes.data.data);
    } catch (err) {
      console.error('Error loading tasks options:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchAdminOptions();
  }, [selectedStatus, selectedPriority]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  const handleOpenAdd = () => {
    setTitle('');
    setDescription('');
    setProject(projectsList[0]?._id || projectsList[0]?.id || '');
    setAssignedTo(employeesList[0]?.user?._id || employeesList[0]?.user?.id || employeesList[0]?.user || '');
    setPriority('Medium');
    setDueDate(new Date(Date.now() + 7*24*60*60*1000).toISOString().substring(0, 10)); // 7 days from now
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setSelectedTask(task);
    setTitle(task.title || '');
    setDescription(task.description || '');
    setProject(task.project?._id || task.project?.id || task.project || '');
    setAssignedTo(task.assignedTo?._id || task.assignedTo?.id || task.assignedTo || '');
    setPriority(task.priority || 'Medium');
    setStatus(task.status || 'Pending');
    setDueDate(new Date(task.dueDate).toISOString().substring(0, 10));
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleOpenDetail = (task) => {
    setSelectedTask(task);
    setDailyUpdate('');
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const res = await axios.delete(`${API_URL}/tasks/${id}`);
        if (res.data.success) {
          fetchTasks();
        }
      } catch (err) {
        alert('Error deleting task.');
      }
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !project || !assignedTo || !dueDate) {
      return setFormError('Please fill in all required fields');
    }

    try {
      const res = await axios.post(`${API_URL}/tasks`, {
        title,
        description,
        project,
        assignedTo,
        priority,
        dueDate
      });

      if (res.data.success) {
        setIsAddModalOpen(false);
        fetchTasks();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error creating task.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/tasks/${selectedTask._id}`, {
        title,
        description,
        assignedTo,
        priority,
        status,
        dueDate
      });

      if (res.data.success) {
        setIsEditModalOpen(false);
        fetchTasks();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error updating task.');
    }
  };

  const handleQuickStatusSubmit = async (taskId, statusVal, updateText) => {
    try {
      const res = await axios.put(`${API_URL}/tasks/${taskId}`, {
        status: statusVal,
        dailyUpdate: updateText || undefined
      });

      if (res.data.success) {
        fetchTasks();
        setDailyUpdate('');
        // Refresh details modal context
        const reloadRes = await axios.get(`${API_URL}/tasks`);
        const updatedTask = reloadRes.data.data.find(t => t._id === taskId);
        setSelectedTask(updatedTask);
        alert('Task successfully updated.');
      }
    } catch (err) {
      alert('Error updating task details.');
    }
  };

  const priorities = ['Low', 'Medium', 'High'];
  const statuses = ['Pending', 'In Progress', 'Completed'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Sprint Tasks</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track and update specific development deliverables.</p>
        </div>
        {user.role === 'admin' && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg flex items-center space-x-2 transition self-start shadow-md shadow-brand-900/10"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Create Task</span>
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-enterprise-900 p-4 border border-slate-200 dark:border-enterprise-800 rounded-2xl shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm w-full bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </form>

        <div className="flex flex-wrap gap-4 justify-end w-full md:w-auto text-xs">
          {/* Status filter */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-semibold">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2 py-1.5 bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-800 rounded-lg"
            >
              <option value="All">All Statuses</option>
              {statuses.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Priority filter */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-semibold">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2 py-1.5 bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-800 rounded-lg"
            >
              <option value="All">All Priorities</option>
              {priorities.map(pr => (
                <option key={pr} value={pr}>{pr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Grid */}
      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl">
          <p className="text-slate-500 dark:text-slate-400 text-sm">No tasks assigned matching filters.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-enterprise-850 bg-slate-50/50 dark:bg-enterprise-900/40 text-xs font-bold text-slate-400 uppercase">
                  <th className="py-3 px-6">Task Title</th>
                  <th className="py-3 px-6">Assigned Project</th>
                  <th className="py-3 px-6">Assigned To</th>
                  <th className="py-3 px-6">Priority</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Due Date</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-enterprise-850 text-sm">
                {tasks.map(t => (
                  <tr key={t._id || t.id} className="hover:bg-slate-50/50 dark:hover:bg-enterprise-850/20">
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200">{t.title}</td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs font-medium">{t.project?.name || 'N/A'}</td>
                    <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300 font-semibold">{t.assignedTo?.name || 'Unassigned'}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'High' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400' :
                        t.priority === 'Medium' ? 'bg-yellow-50 text-yellow-750 dark:bg-yellow-950/20 dark:text-yellow-400' :
                        'bg-slate-100 text-slate-600 dark:bg-enterprise-800 dark:text-slate-400'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                        t.status === 'In Progress' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400">{new Date(t.dueDate).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenDetail(t)}
                          className="px-2.5 py-1 bg-slate-50 dark:bg-enterprise-850 hover:bg-slate-100 rounded text-xs font-semibold"
                        >
                          Log Update
                        </button>
                        {user.role === 'admin' && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(t)}
                              className="p-1 text-slate-400 hover:text-brand-600"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(t._id)}
                              className="p-1 text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- ADD TASK MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 dark:border-enterprise-800 flex justify-between items-center bg-slate-50 dark:bg-enterprise-900/40">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Assign New Task</h3>
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
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">{formError}</div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Task Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Implement auth routers"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description *</label>
                  <textarea
                    required
                    placeholder="Write detailed deliverables regarding database connections, filters, or routing..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none h-20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Allocation *</label>
                    <select
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    >
                      <option value="">Select Project</option>
                      {projectsList.map(p => (
                        <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assign To Developer *</label>
                    <select
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    >
                      <option value="">Select Developer</option>
                      {employeesList.map(emp => (
                        <option key={emp._id || emp.id} value={emp.user?._id || emp.user?.id || emp.user}>{emp.user?.name} ({emp.department})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Priority *</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    >
                      {priorities.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Due Date *</label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
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
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT TASK MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 dark:border-enterprise-800 flex justify-between items-center bg-slate-50 dark:bg-enterprise-900/40">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Modify Task details</h3>
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
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">{formError}</div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Task Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description *</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none h-20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assign To Developer *</label>
                    <select
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    >
                      {employeesList.map(emp => (
                        <option key={emp._id || emp.id} value={emp.user?._id || emp.user?.id || emp.user}>{emp.user?.name} ({emp.department})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Priority *</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    >
                      {priorities.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status *</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    >
                      {statuses.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Due Date *</label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
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

      {/* --- TASK DETAILS & DAILY LOG UPDATE MODAL --- */}
      {isDetailModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 dark:border-enterprise-800 flex justify-between items-center bg-slate-50 dark:bg-enterprise-900/40">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Developer Log: {selectedTask.title}</h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-enterprise-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Task Details */}
              <div className="space-y-2 text-xs">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Deliverable Brief</span>
                <p className="p-3 bg-slate-50 dark:bg-enterprise-950 border border-slate-100 dark:border-enterprise-850 text-slate-700 dark:text-slate-300 rounded-lg leading-relaxed">
                  {selectedTask.description}
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] font-semibold text-slate-500">
                  <div className="flex items-center space-x-1.5">
                    <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Project: {selectedTask.project?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Assignee: {selectedTask.assignedTo?.name || 'Unassigned'}</span>
                  </div>
                </div>
              </div>

              {/* Status configuration */}
              {(user.role === 'admin' || (selectedTask.assignedTo && (selectedTask.assignedTo._id || selectedTask.assignedTo) === (user._id || user.id))) && (
                <div className="p-4 bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900 rounded-xl space-y-3">
                  <span className="text-[9px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest block font-mono">Quick Status Update</span>
                  <div className="flex items-center space-x-2">
                    {statuses.map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleQuickStatusSubmit(selectedTask._id, st, '')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          selectedTask.status === st
                            ? 'bg-brand-600 text-white shadow-sm'
                            : 'bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Historical Daily Updates Logs */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Daily Updates Log History</span>
                <div className="space-y-2.5 max-h-40 overflow-y-auto border border-slate-100 dark:border-enterprise-850 p-3 bg-slate-50/50 dark:bg-enterprise-950/20 rounded-xl">
                  {(!selectedTask.dailyUpdates || selectedTask.dailyUpdates.length === 0) ? (
                    <p className="text-xs text-slate-400 italic">No daily logs registered for this deliverable.</p>
                  ) : (
                    selectedTask.dailyUpdates.map((u, idx) => (
                      <div key={idx} className="p-2.5 bg-white dark:bg-enterprise-900 border border-slate-200/50 dark:border-enterprise-800 rounded-lg text-xs space-y-1">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{u.update}</p>
                        <span className="text-[9px] text-slate-400 font-mono block text-right">{new Date(u.date).toLocaleString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Submit new daily update log */}
              {(user.role === 'admin' || (selectedTask.assignedTo && (selectedTask.assignedTo._id || selectedTask.assignedTo) === (user._id || user.id))) && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleQuickStatusSubmit(selectedTask._id, selectedTask.status, dailyUpdate);
                  }}
                  className="space-y-2 pt-2 border-t border-slate-100 dark:border-enterprise-850"
                >
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Submit Work Update Note</label>
                  <textarea
                    placeholder="Log details regarding current work progress, completed blockers, or pending questions..."
                    value={dailyUpdate}
                    required
                    onChange={(e) => setDailyUpdate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none h-16 resize-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs transition float-right"
                  >
                    Post Update
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
