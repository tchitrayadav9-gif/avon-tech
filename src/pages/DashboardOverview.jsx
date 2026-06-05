import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext, API_URL } from '../context/AuthContext';
import {
  Users,
  Layers,
  Briefcase,
  Ticket,
  CheckCircle,
  TrendingUp,
  Clock,
  HelpCircle,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const DashboardOverview = () => {
  const { user, profile } = useContext(AuthContext);
  const [stats, setStats] = useState({
    employeesCount: 0,
    clientsCount: 0,
    projectsCount: 0,
    ticketsCount: 0,
    resolvedTickets: 0
  });
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Projects
        const projRes = await axios.get(`${API_URL}/projects`);
        if (projRes.data.success) {
          setProjects(projRes.data.data);
        }

        // 2. Fetch Tasks (Scoped)
        const taskRes = await axios.get(`${API_URL}/tasks`);
        if (taskRes.data.success) {
          setTasks(taskRes.data.data);
        }

        // 3. Fetch Tickets (Scoped)
        try {
          const tktRes = await axios.get(`${API_URL}/tickets`);
          if (tktRes.data.success) {
            setTickets(tktRes.data.data);
          }
        } catch (e) {
          // If role is employee, might not see all tickets, handled gracefully
        }

        // 4. Fetch counters if admin
        if (user.role === 'admin') {
          const empRes = await axios.get(`${API_URL}/employees`);
          const clRes = await axios.get(`${API_URL}/clients`);
          
          setStats({
            employeesCount: empRes.data.count || 0,
            clientsCount: clRes.data.count || 0,
            projectsCount: projRes.data.count || 0,
            ticketsCount: tickets.length,
            resolvedTickets: tickets.filter(t => t.status === 'Resolved').length
          });
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Make sure to load tickets count when tickets state updates for Admin stats
  useEffect(() => {
    if (user.role === 'admin') {
      setStats(prev => ({
        ...prev,
        ticketsCount: tickets.length,
        resolvedTickets: tickets.filter(t => t.status === 'Resolved').length
      }));
    }
  }, [tickets]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- RENDERING ADMIN DASHBOARD ---
  const renderAdminDashboard = () => {
    // Dummy charting datasets
    const projectProgressData = projects.map(p => ({
      name: p.name.substring(0, 12) + '...',
      Progress: p.progress
    }));

    const ticketResolutionData = [
      { name: 'Open', count: tickets.filter(t => t.status === 'Open').length },
      { name: 'Pending', count: tickets.filter(t => t.status === 'Pending').length },
      { name: 'Resolved', count: tickets.filter(t => t.status === 'Resolved').length }
    ];

    const COLORS = ['#6366f1', '#eab308', '#10b981'];

    return (
      <div className="space-y-8 animate-fade-in">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl flex items-center space-x-4 shadow-sm">
            <div className="p-4 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Employees</h4>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.employeesCount}</p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl flex items-center space-x-4 shadow-sm">
            <div className="p-4 bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Clients</h4>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.clientsCount}</p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl flex items-center space-x-4 shadow-sm">
            <div className="p-4 bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 rounded-xl">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Projects</h4>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.projectsCount}</p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl flex items-center space-x-4 shadow-sm">
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Helpdesk Tickets</h4>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {stats.ticketsCount} <span className="text-xs font-normal text-slate-400">({stats.resolvedTickets} resolved)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Progress bar chart */}
          <div className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl shadow-sm lg:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-850 dark:text-white text-base">Project Status & Progress</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectProgressData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} unit="%" />
                  <Tooltip cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
                  <Bar dataKey="Progress" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ticket status pie chart */}
          <div className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-850 dark:text-white text-base">Support Ticket Status</h3>
            <div className="h-64 flex flex-col justify-between">
              <div className="h-48 relative">
                {tickets.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">No support tickets raised</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ticketResolutionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {ticketResolutionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="flex justify-around text-xs font-semibold">
                <span className="text-brand-600">● Open</span>
                <span className="text-yellow-500">● Pending</span>
                <span className="text-emerald-500">● Resolved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Active Projects Grid */}
        <div className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-850 dark:text-white text-base">Active Projects Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-enterprise-850 text-xs font-bold text-slate-400 uppercase">
                  <th className="pb-3">Project Name</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Progress</th>
                  <th className="pb-3">Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-enterprise-850 text-sm">
                {projects.slice(0, 5).map(p => (
                  <tr key={p._id || p.id} className="hover:bg-slate-50/50 dark:hover:bg-enterprise-850/20">
                    <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{p.name}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400 text-xs">{p.projectType}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        p.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' :
                        p.status === 'Testing' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' :
                        'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2 w-32">
                        <div className="w-full bg-slate-100 dark:bg-enterprise-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-brand-600 h-full" style={{ width: `${p.progress}%` }}></div>
                        </div>
                        <span className="text-xs font-bold">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-slate-500 dark:text-slate-400">
                      {new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // --- RENDERING EMPLOYEE DASHBOARD ---
  const renderEmployeeDashboard = () => {
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status !== 'Completed').length;

    // Attendance and stats from profile
    const attendance = profile?.attendanceRate || 95;
    const completion = profile?.taskCompletionRate || 90;
    const rating = profile?.performanceRating || 4.5;

    return (
      <div className="space-y-8 animate-fade-in">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl flex items-center space-x-4 shadow-sm">
            <div className="p-4 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Tasks</h4>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{completedTasks}</p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl flex items-center space-x-4 shadow-sm">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Tasks</h4>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{pendingTasks}</p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl flex items-center space-x-4 shadow-sm">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attendance Rate</h4>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{attendance}%</p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl flex items-center space-x-4 shadow-sm">
            <div className="p-4 bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Performance Rating</h4>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{rating} <span className="text-xs text-slate-400">/ 5.0</span></p>
            </div>
          </div>
        </div>

        {/* Task lists and stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assigned Tasks list */}
          <div className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl shadow-sm lg:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-850 dark:text-white text-base">My Sprint Tasks</h3>
            {tasks.length === 0 ? (
              <p className="text-xs text-slate-400">No tasks currently assigned.</p>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map(task => (
                  <div key={task._id || task.id} className="p-4 bg-slate-50 dark:bg-enterprise-950 border border-slate-100 dark:border-enterprise-850 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{task.title}</h4>
                      <p className="text-xs text-slate-500 truncate max-w-sm">{task.description}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      task.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' :
                      task.status === 'In Progress' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' :
                      'bg-slate-100 text-slate-700 dark:bg-enterprise-850 dark:text-slate-400'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Productivity stats */}
          <div className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl shadow-sm space-y-6 flex flex-col justify-between">
            <h3 className="font-bold text-slate-850 dark:text-white text-base">Productivity Stats</h3>
            <div className="space-y-4 flex-grow flex flex-col justify-center">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Task Completion SLA</span>
                  <span className="font-bold">{completion}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-enterprise-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-600 h-full" style={{ width: `${completion}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Department Attendance</span>
                  <span className="font-bold">{attendance}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-enterprise-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${attendance}%` }}></div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-brand-50 dark:bg-brand-950/50 rounded-xl border border-brand-100 dark:border-brand-900 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Keep it up!</strong> Your current performance rating places you in the top 10% of the Frontend/Backend development department.
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- RENDERING CLIENT DASHBOARD ---
  const renderClientDashboard = () => {
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl flex items-center space-x-4 shadow-sm">
            <div className="p-4 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-xl">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Service</h4>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight mt-1">{profile?.assignedService}</p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl flex items-center space-x-4 shadow-sm">
            <div className="p-4 bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Project Lifecycle Status</h4>
              <p className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1 capitalize">{profile?.projectStatus}</p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl flex items-center space-x-4 shadow-sm">
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Support Tickets</h4>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{tickets.length}</p>
            </div>
          </div>
        </div>

        {/* Client active project tracking progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl shadow-sm lg:col-span-2 space-y-6">
            <h3 className="font-bold text-slate-850 dark:text-white text-base">Project Milestone Progress</h3>
            {projects.length === 0 ? (
              <p className="text-xs text-slate-400">No active development projects currently assigned.</p>
            ) : (
              <div className="space-y-6">
                {projects.map(proj => (
                  <div key={proj._id || proj.id} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{proj.name}</h4>
                        <p className="text-xs text-slate-500">{proj.description}</p>
                      </div>
                      <span className="text-sm font-bold text-brand-600">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-enterprise-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-brand-600 h-full" style={{ width: `${proj.progress}%` }}></div>
                    </div>

                    {/* Milestones check */}
                    {proj.milestones && proj.milestones.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 dark:border-enterprise-850 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Milestones:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {proj.milestones.map((m, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <span className={`w-2 h-2 rounded-full ${m.status === 'Completed' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-enterprise-700'}`} />
                              <span className={m.status === 'Completed' ? 'line-through text-slate-400' : ''}>{m.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Support Tickets overview */}
          <div className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-850 dark:text-white text-base">Support Tickets</h3>
            {tickets.length === 0 ? (
              <p className="text-xs text-slate-400">No tickets raised. Nav to Support page to file inquiries.</p>
            ) : (
              <div className="space-y-3">
                {tickets.slice(0, 4).map(t => (
                  <div key={t._id || t.id} className="p-3 bg-slate-50 dark:bg-enterprise-950 rounded-xl flex items-center justify-between border border-slate-100 dark:border-enterprise-850">
                    <div>
                      <h5 className="font-bold text-xs">{t.title}</h5>
                      <span className="text-[9px] text-slate-400">ID: {t.ticketId}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-850 dark:text-white">
          Welcome back, {user.name}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Role: <span className="capitalize font-bold text-brand-600">{user.role}</span> | Location: Hyderabad, Telangana
        </p>
      </div>

      {user.role === 'admin' && renderAdminDashboard()}
      {user.role === 'employee' && renderEmployeeDashboard()}
      {user.role === 'client' && renderClientDashboard()}
    </div>
  );
};

export default DashboardOverview;
