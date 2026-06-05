import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import {
  Layers,
  Plus,
  Search,
  Trash2,
  Edit,
  X,
  Building,
  Mail,
  Phone,
  Bookmark,
  MessageSquare,
  History,
  Tag
} from 'lucide-react';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState('');
  const [assignedService, setAssignedService] = useState('Enterprise Software Solutions');
  const [projectStatus, setProjectStatus] = useState('Discovery');
  
  // Note state
  const [newNote, setNewNote] = useState('');

  const [formError, setFormError] = useState('');

  const fetchClients = async () => {
    try {
      setLoading(true);
      const url = `${API_URL}/clients?search=${searchQuery}`;
      const res = await axios.get(url);
      if (res.data.success) {
        let list = res.data.data;
        if (selectedIndustry !== 'All') {
          list = list.filter(c => c.industry === selectedIndustry);
        }
        setClients(list);
      }
    } catch (err) {
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [selectedIndustry]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchClients();
  };

  const handleOpenAdd = () => {
    setName('');
    setEmail('');
    setPassword('');
    setCompanyName('');
    setPhone('');
    setIndustry('');
    setAssignedService('Enterprise Software Solutions');
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (client) => {
    setSelectedClient(client);
    setName(client.contactPerson || client.user?.name || '');
    setEmail(client.user?.email || '');
    setCompanyName(client.companyName || '');
    setPhone(client.phone || '');
    setIndustry(client.industry || '');
    setAssignedService(client.assignedService || 'Enterprise Software Solutions');
    setProjectStatus(client.projectStatus || 'Discovery');
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleOpenNotes = (client) => {
    setSelectedClient(client);
    setNewNote('');
    setIsNotesModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client? This will remove their user credentials.')) {
      try {
        const res = await axios.delete(`${API_URL}/clients/${id}`);
        if (res.data.success) {
          fetchClients();
        }
      } catch (err) {
        alert('Error deleting client.');
      }
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !companyName || !industry) {
      return setFormError('Please fill in all required fields');
    }

    try {
      const res = await axios.post(`${API_URL}/clients`, {
        name,
        email,
        password: password || 'client123',
        companyName,
        phone,
        industry,
        assignedService
      });

      if (res.data.success) {
        setIsAddModalOpen(false);
        fetchClients();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error onboarding client.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !companyName || !industry) {
      return setFormError('Please fill in all required fields');
    }

    try {
      const res = await axios.put(`${API_URL}/clients/${selectedClient._id}`, {
        name,
        email,
        companyName,
        contactPerson: name,
        phone,
        industry,
        assignedService,
        projectStatus
      });

      if (res.data.success) {
        setIsEditModalOpen(false);
        fetchClients();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error updating client details.');
    }
  };

  const handleAddNoteSubmit = async (e) => {
    e.preventDefault();
    if (!newNote) return;

    try {
      const res = await axios.post(`${API_URL}/clients/${selectedClient._id}/notes`, {
        note: newNote
      });

      if (res.data.success) {
        setNewNote('');
        // Reload notes modal context
        const reloadRes = await axios.get(`${API_URL}/clients`);
        const updatedList = reloadRes.data.data;
        setClients(updatedList);
        const refreshedClient = updatedList.find(c => c._id === selectedClient._id);
        setSelectedClient(refreshedClient);
      }
    } catch (err) {
      alert('Error saving communication note.');
    }
  };

  const services = [
    'Enterprise Software Solutions',
    'Web Development',
    'Mobile App Development',
    'CRM Services',
    'ERP/BaaN Solutions',
    'BI Reporting Tools',
    'Enterprise Portals',
    'Technical Support'
  ];

  const statuses = ['Discovery', 'Development', 'Testing', 'Deployment', 'Completed'];

  // Extract industries for filters
  const industries = ['All', ...new Set(clients.map(c => c.industry).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Client Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Onboard client accounts, link requested services, and log communication notes.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg flex items-center space-x-2 transition self-start shadow-md shadow-brand-900/10"
        >
          <Building className="w-4 h-4" />
          <span>Onboard Client</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-enterprise-900 p-4 border border-slate-200 dark:border-enterprise-800 rounded-2xl shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company, contact person..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm w-full bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </form>

        <div className="flex flex-wrap gap-2 justify-end w-full sm:w-auto">
          {industries.slice(0, 5).map(ind => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedIndustry === ind
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-50 dark:bg-enterprise-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-enterprise-850'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Client Table List */}
      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl">
          <p className="text-slate-500 dark:text-slate-400 text-sm">No client accounts found matching search guidelines.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-enterprise-850 bg-slate-50/50 dark:bg-enterprise-900/40 text-xs font-bold text-slate-400 uppercase">
                  <th className="py-3 px-6">Company & Contact</th>
                  <th className="py-3 px-6">Industry</th>
                  <th className="py-3 px-6">Assigned Tech Service</th>
                  <th className="py-3 px-6">Project Status</th>
                  <th className="py-3 px-6 text-center">Comm Log</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-enterprise-850 text-sm">
                {clients.map(client => (
                  <tr key={client._id || client.id} className="hover:bg-slate-50/50 dark:hover:bg-enterprise-850/20">
                    {/* Company info */}
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                        {client.companyName}
                      </span>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        {client.contactPerson} | {client.user?.email || 'N/A'}
                      </span>
                    </td>

                    {/* Industry */}
                    <td className="py-4 px-6">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{client.industry}</span>
                    </td>

                    {/* Purchased Service */}
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-enterprise-800 text-slate-700 dark:text-slate-300 rounded">
                        {client.assignedService}
                      </span>
                    </td>

                    {/* Project Status */}
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        client.projectStatus === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                        client.projectStatus === 'Discovery' ? 'bg-slate-100 text-slate-600' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {client.projectStatus}
                      </span>
                    </td>

                    {/* Communication Log note trigger */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleOpenNotes(client)}
                        className="px-3 py-1 bg-slate-50 dark:bg-enterprise-850 hover:bg-slate-100 border border-slate-200 dark:border-enterprise-800 rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        <span>Log ({client.communicationNotes ? client.communicationNotes.length : 0})</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleOpenEdit(client)}
                          className="p-1 text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg transition"
                          title="Edit Client details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(client._id)}
                          className="p-1 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition"
                          title="Delete Client"
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

      {/* --- ADD CLIENT MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 dark:border-enterprise-800 flex justify-between items-center bg-slate-50 dark:bg-enterprise-900/40">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Onboard Corporate Client</h3>
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
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="TechCorp Pvt Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Industry Sector *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Banking, Supply Chain"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Karan Singh"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email (Portal Username) *</label>
                    <input
                      type="email"
                      required
                      placeholder="contact@techcorp.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Phone</label>
                    <input
                      type="text"
                      placeholder="+91 99000 88000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Requested Service *</label>
                    <select
                      value={assignedService}
                      onChange={(e) => setAssignedService(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    >
                      {services.map(srv => (
                        <option key={srv} value={srv}>{srv}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Temporary Password</label>
                  <input
                    type="text"
                    placeholder="Default: client123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                  />
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
                  Onboard Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT CLIENT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 dark:border-enterprise-800 flex justify-between items-center bg-slate-50 dark:bg-enterprise-900/40">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Modify Client Profile</h3>
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
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Industry Sector *</label>
                    <input
                      type="text"
                      required
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email (Read Only)</label>
                    <input
                      type="email"
                      readOnly
                      disabled
                      value={email}
                      className="w-full px-3 py-2 text-sm bg-slate-100 dark:bg-enterprise-850 border border-slate-200 dark:border-enterprise-800 text-slate-400 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assigned Tech Service *</label>
                    <select
                      value={assignedService}
                      onChange={(e) => setAssignedService(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                    >
                      {services.map(srv => (
                        <option key={srv} value={srv}>{srv}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Lifecycle Status</label>
                  <select
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                  >
                    {statuses.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
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

      {/* --- COMMUNICATION LOGS MODAL --- */}
      {isNotesModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 dark:border-enterprise-800 flex justify-between items-center bg-slate-50 dark:bg-enterprise-900/40">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Comm History: {selectedClient.companyName}</h3>
              </div>
              <button
                onClick={() => setIsNotesModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-enterprise-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Existing Notes */}
              <div className="space-y-3 max-h-60 overflow-y-auto border border-slate-100 dark:border-enterprise-850 p-3 bg-slate-50/50 dark:bg-enterprise-950/20 rounded-xl">
                {(!selectedClient.communicationNotes || selectedClient.communicationNotes.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">No notes logged yet.</p>
                ) : (
                  selectedClient.communicationNotes.map((n, idx) => (
                    <div key={idx} className="p-2.5 bg-white dark:bg-enterprise-900 border border-slate-200/50 dark:border-enterprise-800 rounded-lg text-xs space-y-1">
                      <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{n.note}</p>
                      <div className="flex justify-between text-[9px] text-slate-450 font-semibold font-mono">
                        <span>Logged by: {n.addedBy}</span>
                        <span>{new Date(n.date).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNoteSubmit} className="space-y-2">
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider block">Add New History Log Note</label>
                <textarea
                  placeholder="Type updates regarding phone calls, business milestones, scope approvals..."
                  value={newNote}
                  required
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none h-20 resize-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition float-right"
                >
                  Save Log Entry
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
