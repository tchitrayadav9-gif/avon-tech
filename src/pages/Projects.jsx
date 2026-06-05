import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext, API_URL } from '../context/AuthContext';
import {
  Briefcase,
  Plus,
  Search,
  Trash2,
  Edit,
  X,
  Calendar,
  CheckSquare,
  Users,
  ChevronRight,
  UserCheck,
  TrendingUp,
  FolderOpen
} from 'lucide-react';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Admin options lists
  const [employeesList, setEmployeesList] = useState([]);
  const [clientsList, setClientsList] = useState([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProj, setSelectedProj] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('Web Applications');
  const [status, setStatus] = useState('Planned');
  const [progress, setProgress] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [client, setClient] = useState('');
  const [team, setTeam] = useState([]);
  
  // Milestones local state
  const [milestones, setMilestones] = useState([]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDeadline, setNewMilestoneDeadline] = useState('');

  const [formError, setFormError] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const url = `${API_URL}/projects?status=${selectedStatus === 'All' ? '' : selectedStatus}&search=${searchQuery}`;
      const res = await axios.get(url);
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminOptions = async () => {
    if (user.role !== 'admin') return;
    try {
      const empRes = await axios.get(`${API_URL}/employees`);
      const clRes = await axios.get(`${API_URL}/clients`);
      setEmployeesList(empRes.data.data);
      setClientsList(clRes.data.data);
    } catch (err) {
      console.error('Error fetching admin option lists:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchAdminOptions();
  }, [selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleOpenAdd = () => {
    setName('');
    setDescription('');
    setProjectType('Web Applications');
    setStatus('Planned');
    setProgress(0);
    setStartDate(new Date().toISOString().substring(0, 10));
    setEndDate(new Date(Date.now() + 60*24*60*60*1000).toISOString().substring(0, 10)); // 60 days from now
    setClient(clientsList[0]?.user?._id || clientsList[0]?.user || '');
    setTeam([]);
    setMilestones([]);
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setSelectedProj(proj);
    setName(proj.name || '');
    setDescription(proj.description || '');
    setProjectType(proj.projectType || 'Web Applications');
    setStatus(proj.status || 'Planned');
    setProgress(proj.progress || 0);
    setStartDate(new Date(proj.startDate).toISOString().substring(0, 10));
    setEndDate(new Date(proj.endDate).toISOString().substring(0, 10));
    
    // Extract ID values for mappings
    const clientId = proj.client?._id || proj.client?.id || proj.client || '';
    setClient(clientId);

    const teamIds = proj.team ? proj.team.map(member => member._id || member.id || member) : [];
    setTeam(teamIds);

    setMilestones(proj.milestones || []);
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleOpenDetail = (proj) => {
    setSelectedProj(proj);
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const res = await axios.delete(`${API_URL}/projects/${id}`);
        if (res.data.success) {
          fetchProjects();
        }
      } catch (err) {
        alert('Error deleting project.');
      }
    }
  };

  // Team allocation checklist toggle
  const handleToggleTeam = (empUserId) => {
    if (team.includes(empUserId)) {
      setTeam(prev => prev.filter(id => id !== empUserId));
    } else {
      setTeam(prev => [...prev, empUserId]);
    }
  };

  // Milestones manipulation
  const handleAddMilestone = () => {
    if (!newMilestoneTitle) return;
    setMilestones(prev => [
      ...prev,
      {
        title: newMilestoneTitle,
        status: 'Pending',
        deadline: newMilestoneDeadline || new Date().toISOString()
      }
    ]);
    setNewMilestoneTitle('');
    setNewMilestoneDeadline('');
  };

  const handleRemoveMilestone = (index) => {
    setMilestones(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleToggleMilestoneStatus = (index) => {
    setMilestones(prev => prev.map((m, idx) => {
      if (idx === index) {
        return {
          ...m,
          status: m.status === 'Completed' ? 'Pending' : 'Completed'
        };
      }
      return m;
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !client || !startDate || !endDate) {
      return setFormError('Please fill in all required fields');
    }

    try {
      const res = await axios.post(`${API_URL}/projects`, {
        name,
        description,
        projectType,
        startDate,
        endDate,
        client,
        team,
        milestones
      });

      if (res.data.success) {
        setIsAddModalOpen(false);
        fetchProjects();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error creating project.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/projects/${selectedProj._id}`, {
        name,
        description,
        projectType,
        status,
        progress: Number(progress),
        client,
        team,
        milestones
      });

      if (res.data.success) {
        setIsEditModalOpen(false);
        fetchProjects();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error updating project.');
    }
  };

  const handleQuickProgressSubmit = async (projId, progressVal, statusVal, milestonesList) => {
    try {
      const res = await axios.put(`${API_URL}/projects/${projId}`, {
        progress: progressVal,
        status: statusVal,
        milestones: milestonesList
      });
      if (res.data.success) {
        fetchProjects();
        if (selectedProj && selectedProj._id === projId) {
          setSelectedProj(res.data.data);
        }
        alert('Project status successfully updated.');
      }
    } catch (err) {
      alert('Error updating progress.');
    }
  };

  const projectTypes = ['ERP Projects', 'CRM Projects', 'Web Applications', 'Mobile Apps', 'Enterprise Portals'];
  const projectStatuses = ['Planned', 'Development', 'Testing', 'Deployment', 'Completed'];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Software Project Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track milestones, sprint progression, timelines, and team allocations.</p>
        </div>
        {user.role === 'admin' && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg flex items-center space-x-2 transition self-start shadow-md shadow-brand-900/10"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Create Project</span>
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-enterprise-900 p-4 border border-slate-200 dark:border-enterprise-800 rounded-2xl shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by project name, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm w-full bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </form>

        <div className="flex flex-wrap gap-2 justify-end w-full sm:w-auto">
          {['All', ...projectStatuses].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedStatus === st
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-50 dark:bg-enterprise-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-enterprise-850'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Projects */}
      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl">
          <p className="text-slate-500 dark:text-slate-400 text-sm">No software projects found matching these criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {projects.map(proj => {
            const completedMilestones = proj.milestones ? proj.milestones.filter(m => m.status === 'Completed').length : 0;
            const totalMilestones = proj.milestones ? proj.milestones.length : 0;

            return (
              <div
                key={proj._id || proj.id}
                className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl flex flex-col justify-between hover:shadow-lg transition space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="inline-block px-2.5 py-0.5 text-[9px] font-bold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded uppercase">
                      {proj.projectType}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      proj.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' :
                      proj.status === 'Testing' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' :
                      'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                    }`}>
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 line-clamp-1">{proj.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{proj.description}</p>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Progression</span>
                      <span className="font-bold text-brand-600">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-enterprise-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-600 h-full" style={{ width: `${proj.progress}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-enterprise-850 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <CheckSquare className="w-4 h-4 text-slate-400" />
                    <span>{completedMilestones}/{totalMilestones} Milestones</span>
                  </div>
                  <button
                    onClick={() => handleOpenDetail(proj)}
                    className="text-brand-600 dark:text-brand-400 font-bold hover:underline inline-flex items-center"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {user.role === 'admin' && (
                  <div className="pt-3 border-t border-slate-100 dark:border-enterprise-850 flex items-center space-x-3 justify-end">
                    <button
                      onClick={() => handleOpenEdit(proj)}
                      className="p-1 text-slate-500 hover:text-brand-600 hover:bg-slate-50 rounded"
                      title="Edit project parameters"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj._id)}
                      className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* --- ADD PROJECT MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 dark:border-enterprise-800 flex justify-between items-center bg-slate-50 dark:bg-enterprise-900/40">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Create Development Project</h3>
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
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Avon ERP Customer Portal Integration"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description *</label>
                  <textarea
                    required
                    placeholder="Detail the project deliverables, client parameters, and developer tasks..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none h-20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Type *</label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    >
                      {projectTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Owner (Client) *</label>
                    <select
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    >
                      <option value="">Select Corporate Client</option>
                      {clientsList.map(c => (
                        <option key={c._id || c.id} value={c.user?._id || c.user?.id || c.user}>{c.companyName} ({c.contactPerson})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">End Date (Estimated) *</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                {/* Team allocation checklist */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Allocate Developers</label>
                  <div className="grid grid-cols-2 gap-2 border border-slate-100 dark:border-enterprise-850 p-3 bg-slate-50/50 dark:bg-enterprise-950/20 rounded-xl max-h-32 overflow-y-auto">
                    {employeesList.map(emp => {
                      const empUserId = emp.user?._id || emp.user?.id || emp.user;
                      return (
                        <label key={emp._id || emp.id} className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={team.includes(empUserId)}
                            onChange={() => handleToggleTeam(empUserId)}
                            className="rounded text-brand-600 focus:ring-brand-500"
                          />
                          <span>{emp.user?.name} ({emp.department})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Milestones config */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-enterprise-850">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Define Milestones</label>
                  
                  {/* Milestones Add Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Milestone title"
                      value={newMilestoneTitle}
                      onChange={(e) => setNewMilestoneTitle(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none sm:col-span-2"
                    />
                    <button
                      type="button"
                      onClick={handleAddMilestone}
                      className="px-3 py-1.5 bg-brand-600 text-white font-semibold rounded-lg text-xs hover:bg-brand-700 transition"
                    >
                      Add Milestone
                    </button>
                  </div>

                  {/* Milestones List */}
                  <div className="space-y-1.5">
                    {milestones.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-enterprise-950 rounded-lg border border-slate-100 dark:border-enterprise-850 text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {m.title} <span className="text-[10px] text-slate-400">(Deadline: {new Date(m.deadline).toLocaleDateString()})</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(idx)}
                          className="text-rose-600 font-bold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
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
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT PROJECT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 dark:border-enterprise-800 flex justify-between items-center bg-slate-50 dark:bg-enterprise-900/40">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Modify Project Fields</h3>
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
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Type *</label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    >
                      {projectTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lifecycle Status *</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    >
                      {projectStatuses.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Progress Percentage *</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => setProgress(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Owner (Client) *</label>
                  <select
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                  >
                    <option value="">Select Corporate Client</option>
                    {clientsList.map(c => (
                      <option key={c._id || c.id} value={c.user?._id || c.user?.id || c.user}>{c.companyName} ({c.contactPerson})</option>
                    ))}
                  </select>
                </div>

                {/* Team allocation checklist */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Allocate Developers</label>
                  <div className="grid grid-cols-2 gap-2 border border-slate-100 dark:border-enterprise-850 p-3 bg-slate-50/50 dark:bg-enterprise-950/20 rounded-xl max-h-32 overflow-y-auto">
                    {employeesList.map(emp => {
                      const empUserId = emp.user?._id || emp.user?.id || emp.user;
                      return (
                        <label key={emp._id || emp.id} className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={team.includes(empUserId)}
                            onChange={() => handleToggleTeam(empUserId)}
                            className="rounded text-brand-600 focus:ring-brand-500"
                          />
                          <span>{emp.user?.name} ({emp.department})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Milestones config */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-enterprise-850">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Define Milestones</label>
                  
                  {/* Milestones Add Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Milestone title"
                      value={newMilestoneTitle}
                      onChange={(e) => setNewMilestoneTitle(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none sm:col-span-2"
                    />
                    <button
                      type="button"
                      onClick={handleAddMilestone}
                      className="px-3 py-1.5 bg-brand-600 text-white font-semibold rounded-lg text-xs hover:bg-brand-700 transition"
                    >
                      Add Milestone
                    </button>
                  </div>

                  {/* Milestones List */}
                  <div className="space-y-1.5">
                    {milestones.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-enterprise-950 rounded-lg border border-slate-100 dark:border-enterprise-850 text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {m.title} <span className="text-[10px] text-slate-400">(Deadline: {new Date(m.deadline).toLocaleDateString()})</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(idx)}
                          className="text-rose-600 font-bold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
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

      {/* --- DETAILED VIEW MODAL --- */}
      {isDetailModalOpen && selectedProj && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 dark:border-enterprise-800 flex justify-between items-center bg-slate-50 dark:bg-enterprise-900/40">
              <div className="flex items-center space-x-2">
                <FolderOpen className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Project Blueprint: {selectedProj.name}</h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-enterprise-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Overview Description</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-enterprise-950 p-3 rounded-lg border border-slate-100 dark:border-enterprise-850">
                  {selectedProj.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Client detail */}
                <div className="space-y-1 bg-slate-50 dark:bg-enterprise-950/20 border border-slate-100 dark:border-enterprise-850 p-3 rounded-lg">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Client Account</span>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block mt-1">
                    {selectedProj.client?.name || 'Administrative Owner'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">{selectedProj.client?.email || 'System Account'}</span>
                </div>

                {/* Status details */}
                <div className="space-y-1 bg-slate-50 dark:bg-enterprise-950/20 border border-slate-100 dark:border-enterprise-850 p-3 rounded-lg flex flex-col justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Status & Progress</span>
                  <div className="flex items-center justify-between text-xs font-semibold mt-1">
                    <span className="capitalize">{selectedProj.status}</span>
                    <span className="font-bold text-brand-600">{selectedProj.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-enterprise-800 h-1 rounded-full overflow-hidden mt-1">
                    <div className="bg-brand-600 h-full" style={{ width: `${selectedProj.progress}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Milestones list with toggle for Developer / Admin */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Milestones Checklist</span>
                <div className="space-y-2 border border-slate-100 dark:border-enterprise-850 p-3 bg-slate-50/50 dark:bg-enterprise-950/20 rounded-xl">
                  {(!selectedProj.milestones || selectedProj.milestones.length === 0) ? (
                    <p className="text-xs text-slate-400 italic">No milestones defined for this project.</p>
                  ) : (
                    selectedProj.milestones.map((m, idx) => {
                      const isCompleted = m.status === 'Completed';
                      const canToggle = user.role === 'admin' || user.role === 'employee';
                      return (
                        <div key={idx} className="flex items-center justify-between bg-white dark:bg-enterprise-900 border border-slate-200/50 dark:border-enterprise-800 rounded-lg p-2.5 text-xs">
                          <label className={`flex items-center space-x-2 font-semibold ${canToggle ? 'cursor-pointer' : ''}`}>
                            <input
                              type="checkbox"
                              disabled={!canToggle}
                              checked={isCompleted}
                              onChange={() => {
                                if (canToggle) {
                                  const updatedMilestones = [...selectedProj.milestones];
                                  updatedMilestones[idx].status = isCompleted ? 'Pending' : 'Completed';
                                  
                                  // Compute new progress automatically: completed/total * 100
                                  const totalM = updatedMilestones.length;
                                  const completedM = updatedMilestones.filter(x => x.status === 'Completed').length;
                                  const newProgress = Math.round((completedM / totalM) * 100);
                                  const newStatus = newProgress === 100 ? 'Completed' : selectedProj.status;

                                  handleQuickProgressSubmit(selectedProj._id, newProgress, newStatus, updatedMilestones);
                                }
                              }}
                              className="rounded text-brand-600 focus:ring-brand-500"
                            />
                            <span className={isCompleted ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}>{m.title}</span>
                          </label>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Deadline: {new Date(m.deadline).toLocaleDateString()}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Allocated Team Members */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Allocated Engineering Team</span>
                <div className="grid grid-cols-2 gap-3">
                  {(!selectedProj.team || selectedProj.team.length === 0) ? (
                    <p className="text-xs text-slate-400 italic">No developers assigned.</p>
                  ) : (
                    selectedProj.team.map(member => (
                      <div key={member._id || member.id} className="p-2 border border-slate-200/60 dark:border-enterprise-800 rounded-xl flex items-center space-x-2 bg-slate-50/20">
                        <img
                          src={member.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${member.name}`}
                          alt="Avatar"
                          className="w-7 h-7 rounded-full border border-slate-100"
                        />
                        <div className="truncate">
                          <span className="text-xs font-bold block truncate text-slate-800 dark:text-slate-200">{member.name}</span>
                          <span className="text-[9px] text-slate-500 block truncate">{member.email}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Update progress bar for allocated employees */}
              {user.role === 'employee' && (
                <div className="pt-4 border-t border-slate-100 dark:border-enterprise-850 space-y-3">
                  <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest block font-mono">Update Project Progression (Employee Actions)</span>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedProj.progress}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSelectedProj(prev => ({ ...prev, progress: val }));
                      }}
                      className="w-full accent-brand-600"
                    />
                    <select
                      value={selectedProj.status}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedProj(prev => ({ ...prev, status: val }));
                      }}
                      className="px-2 py-1 text-xs bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-800 rounded-lg focus:outline-none"
                    >
                      {projectStatuses.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleQuickProgressSubmit(selectedProj._id, selectedProj.progress, selectedProj.status, selectedProj.milestones)}
                      className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs transition"
                    >
                      Save Status
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
