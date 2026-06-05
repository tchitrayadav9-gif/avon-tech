import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext, API_URL } from '../context/AuthContext';
import {
  Ticket,
  Plus,
  Search,
  X,
  MessageSquare,
  Clock,
  User,
  ShieldAlert,
  Send,
  CornerDownRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';

const Tickets = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  // Option list for Admin assignment
  const [employeesList, setEmployeesList] = useState([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  
  // Comment log input
  const [commentText, setCommentText] = useState('');

  const [formError, setFormError] = useState('');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const url = `${API_URL}/tickets?status=${selectedStatus === 'All' ? '' : selectedStatus}&priority=${selectedPriority === 'All' ? '' : selectedPriority}`;
      const res = await axios.get(url);
      if (res.data.success) {
        setTickets(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminOptions = async () => {
    if (user.role !== 'admin' && user.role !== 'employee') return;
    try {
      const empRes = await axios.get(`${API_URL}/employees`);
      setEmployeesList(empRes.data.data);
    } catch (err) {
      console.error('Error loading ticket admin lists:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchAdminOptions();
  }, [selectedStatus, selectedPriority]);

  const handleOpenAdd = () => {
    setTitle('');
    setDescription('');
    setPriority('Low');
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenDetail = (tkt) => {
    setSelectedTicket(tkt);
    setCommentText('');
    setIsDetailModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      return setFormError('Please fill in all required fields');
    }

    try {
      const res = await axios.post(`${API_URL}/tickets`, {
        title,
        description,
        priority
      });

      if (res.data.success) {
        setIsAddModalOpen(false);
        fetchTickets();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error raising ticket.');
    }
  };

  const handleUpdateTicketParams = async (tktId, statusVal, priorityVal, assigneeVal) => {
    try {
      const res = await axios.put(`${API_URL}/tickets/${tktId}`, {
        status: statusVal,
        priority: priorityVal,
        assignedTo: assigneeVal || undefined
      });

      if (res.data.success) {
        fetchTickets();
        // Refresh detail modal
        const reloadRes = await axios.get(`${API_URL}/tickets`);
        const updatedTicket = reloadRes.data.data.find(t => t._id === tktId);
        setSelectedTicket(updatedTicket);
        alert('Ticket updated successfully.');
      }
    } catch (err) {
      alert('Error updating ticket parameter.');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText) return;

    try {
      const res = await axios.post(`${API_URL}/tickets/${selectedTicket._id}/comments`, {
        text: commentText
      });

      if (res.data.success) {
        setCommentText('');
        // Reload details modal context
        const reloadRes = await axios.get(`${API_URL}/tickets`);
        const updatedTicket = reloadRes.data.data.find(t => t._id === selectedTicket._id);
        setSelectedTicket(updatedTicket);
        fetchTickets();
      }
    } catch (err) {
      alert('Error sending comment.');
    }
  };

  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const statuses = ['Open', 'Pending', 'Resolved'];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Support Helpdesk</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">File bug reports, ask questions, or assign developers to resolve blockers.</p>
        </div>
        {user.role === 'client' && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg flex items-center space-x-2 transition self-start shadow-md shadow-brand-900/10"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Raise Ticket</span>
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-enterprise-900 p-4 border border-slate-200 dark:border-enterprise-800 rounded-2xl shadow-sm text-xs">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Status selection */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-semibold">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2 py-1.5 bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-800 rounded-lg focus:outline-none"
            >
              <option value="All">All Statuses</option>
              {statuses.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Priority selection */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-semibold">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2 py-1.5 bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-800 rounded-lg focus:outline-none"
            >
              <option value="All">All Priorities</option>
              {priorities.map(pr => (
                <option key={pr} value={pr}>{pr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl">
          <p className="text-slate-500 dark:text-slate-400 text-sm">No support tickets currently found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {tickets.map(tkt => {
            const commentsCount = tkt.comments ? tkt.comments.length : 0;
            return (
              <div
                key={tkt._id || tkt.id}
                className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl flex flex-col justify-between hover:shadow-lg transition space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">
                      {tkt.ticketId}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      tkt.priority === 'Critical' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400' :
                      tkt.priority === 'High' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-450' :
                      tkt.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20' :
                      'bg-slate-100 text-slate-600 dark:bg-enterprise-800 dark:text-slate-400'
                    }`}>
                      {tkt.priority}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 line-clamp-1">{tkt.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{tkt.description}</p>

                  <div className="pt-2 flex flex-col space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">Raised by: {tkt.raisedBy?.name || 'Client'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">Assignee: {tkt.assignedTo?.name || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-enterprise-850 flex items-center justify-between text-xs text-slate-500">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    tkt.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' :
                    tkt.status === 'Pending' ? 'bg-yellow-50 text-yellow-750' :
                    'bg-slate-100 text-slate-650'
                  }`}>
                    {tkt.status}
                  </span>
                  <button
                    onClick={() => handleOpenDetail(tkt)}
                    className="text-brand-600 dark:text-brand-400 font-bold hover:underline inline-flex items-center space-x-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat Thread ({commentsCount})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- ADD TICKET MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 dark:border-enterprise-800 flex justify-between items-center bg-slate-50 dark:bg-enterprise-900/40">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Raise Support Ticket</h3>
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
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ticket Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Database Connection Timeout on ERP"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Issue Description *</label>
                  <textarea
                    required
                    placeholder="Provide details of the bug, page URLs, error codes, and instructions to reproduce..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none h-24 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Priority Level *</label>
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
                  File Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DETAILED VIEW & COMMENTS CHAT MODAL --- */}
      {isDetailModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col h-[80vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-enterprise-800 flex justify-between items-center bg-slate-50 dark:bg-enterprise-900/40 shrink-0">
              <div className="flex items-center space-x-3">
                <Ticket className="w-5 h-5 text-slate-400" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">{selectedTicket.title}</h3>
                  <span className="text-[10px] text-slate-500 font-mono">ID: {selectedTicket.ticketId}</span>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-enterprise-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body & Comment Thread */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Ticket details description */}
              <div className="space-y-1.5 text-xs bg-slate-50 dark:bg-enterprise-950 p-4 rounded-xl border border-slate-100 dark:border-enterprise-850">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Original Issue Report</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium mt-1">
                  {selectedTicket.description}
                </p>
                <div className="pt-3 border-t border-slate-200/60 dark:border-enterprise-850 mt-3 flex justify-between text-[10px] text-slate-500 font-semibold font-mono">
                  <span>Client Contact: {selectedTicket.raisedBy?.name || 'N/A'}</span>
                  <span>Created: {new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Admin/Employee Controls to Assign and toggle Status/Priority */}
              {user.role !== 'client' && (
                <div className="p-4 bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900 rounded-xl space-y-3">
                  <span className="text-[9px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest block font-mono">Helpdesk Administration Controls</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="flex flex-col space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Status</span>
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => handleUpdateTicketParams(selectedTicket._id, e.target.value, selectedTicket.priority, selectedTicket.assignedTo?._id || selectedTicket.assignedTo)}
                        className="p-1.5 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-lg focus:outline-none"
                      >
                        {statuses.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Priority</span>
                      <select
                        value={selectedTicket.priority}
                        onChange={(e) => handleUpdateTicketParams(selectedTicket._id, selectedTicket.status, e.target.value, selectedTicket.assignedTo?._id || selectedTicket.assignedTo)}
                        className="p-1.5 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-lg focus:outline-none"
                      >
                        {priorities.map(pr => (
                          <option key={pr} value={pr}>{pr}</option>
                        ))}
                      </select>
                    </div>

                    {user.role === 'admin' && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Assignee</span>
                        <select
                          value={selectedTicket.assignedTo?._id || selectedTicket.assignedTo || ''}
                          onChange={(e) => handleUpdateTicketParams(selectedTicket._id, selectedTicket.status, selectedTicket.priority, e.target.value)}
                          className="p-1.5 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-lg focus:outline-none"
                        >
                          <option value="">Unassigned</option>
                          {employeesList.map(emp => (
                            <option key={emp._id || emp.id} value={emp.user?._id || emp.user?.id || emp.user}>{emp.user?.name} ({emp.department})</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Chat thread comments */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Discussion & Resolution Thread</span>
                <div className="space-y-4">
                  {(!selectedTicket.comments || selectedTicket.comments.length === 0) ? (
                    <p className="text-xs text-slate-400 italic text-center py-4">No thread messages posted. Start discussion below.</p>
                  ) : (
                    selectedTicket.comments.map((comment, idx) => {
                      const isSelf = (comment.sender?._id || comment.sender) === (user._id || user.id);
                      return (
                        <div key={idx} className={`flex items-start space-x-2.5 ${isSelf ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          {/* Sender icon */}
                          <img
                            src={comment.sender?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=user`}
                            alt="Avatar"
                            className="w-7 h-7 rounded-full border border-slate-100 shrink-0"
                          />
                          <div className={`p-3 rounded-2xl max-w-sm text-xs space-y-1 ${
                            isSelf 
                              ? 'bg-brand-600 text-white rounded-tr-none shadow-sm'
                              : 'bg-slate-100 dark:bg-enterprise-850 text-slate-800 dark:text-slate-200 rounded-tl-none'
                          }`}>
                            {!isSelf && <span className="font-bold text-[9px] block text-brand-600 dark:text-brand-400">{comment.sender?.name || 'Reply'}</span>}
                            <p className="leading-relaxed">{comment.text}</p>
                            <span className={`text-[8px] block text-right font-mono ${isSelf ? 'text-brand-200' : 'text-slate-400'}`}>
                              {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Chat Thread Input Form (Sticky Footer) */}
            <form onSubmit={handleAddComment} className="p-4 border-t border-slate-100 dark:border-enterprise-800 bg-slate-50 dark:bg-enterprise-900/40 flex items-center space-x-2 shrink-0">
              <input
                type="text"
                placeholder="Type your resolution update or question..."
                value={commentText}
                required
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-grow px-3 py-2 text-sm bg-white dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-855 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
