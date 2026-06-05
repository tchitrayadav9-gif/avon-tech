import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Ticket,
  Bot,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  User,
  Shield,
  Layers,
  CheckSquare
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  if (!user) return null;

  // Define sidebar navigation items based on user roles
  const getNavLinks = () => {
    const common = [
      { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
      { path: '/dashboard/ai-chat', label: 'AI FAQ Assistant', icon: Bot }
    ];

    if (user.role === 'admin') {
      return [
        ...common,
        { path: '/dashboard/employees', label: 'Employees', icon: Users },
        { path: '/dashboard/clients', label: 'Clients', icon: Layers },
        { path: '/dashboard/projects', label: 'Projects', icon: Briefcase },
        { path: '/dashboard/tickets', label: 'Support Tickets', icon: Ticket }
      ];
    } else if (user.role === 'employee') {
      return [
        ...common,
        { path: '/dashboard/projects', label: 'Assigned Projects', icon: Briefcase },
        { path: '/dashboard/tasks', label: 'My Tasks', icon: CheckSquare }
      ];
    } else if (user.role === 'client') {
      return [
        ...common,
        { path: '/dashboard/projects', label: 'My Projects', icon: Briefcase },
        { path: '/dashboard/tickets', label: 'Support Tickets', icon: Ticket }
      ];
    }
    return common;
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-enterprise-950 transition-colors duration-200">
      {/* Sidebar - Desktop */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } hidden md:flex flex-col border-r border-slate-200 dark:border-enterprise-800 bg-white dark:bg-enterprise-900 transition-all duration-300 z-30`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-enterprise-800">
          <Link to="/" className="flex items-center space-x-2 overflow-hidden">
            <div className="p-2 bg-brand-600 rounded-lg text-white">
              <Shield className="w-5 h-5 flex-shrink-0" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg text-slate-800 dark:text-slate-50 whitespace-nowrap animate-fade-in">
                Avon Portal
              </span>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-enterprise-850"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-enterprise-850 hover:text-slate-800 dark:hover:text-slate-200'
                  }`
                }
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                {sidebarOpen && <span className="animate-fade-in">{link.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-enterprise-800 bg-slate-50/50 dark:bg-enterprise-950/20">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-2 overflow-hidden">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-enterprise-700"
                />
                <div className="flex flex-col truncate">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className={`p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all ${
                !sidebarOpen ? 'mx-auto' : ''
              }`}
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar - Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 border-r border-slate-200 dark:border-enterprise-800 bg-white dark:bg-enterprise-900 transition-transform duration-300 z-50 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-enterprise-800">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-brand-600 rounded-lg text-white">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-800 dark:text-slate-50">Avon Portal</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-enterprise-850"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-enterprise-850'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-enterprise-800 absolute bottom-0 left-0 right-0 bg-slate-50/50 dark:bg-enterprise-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-enterprise-700"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>
                <span className="text-[10px] text-slate-500 capitalize">{user.role}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-enterprise-800 bg-white dark:bg-enterprise-900 z-10">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-enterprise-850 md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page Title Context */}
          <div className="hidden sm:block text-sm font-semibold text-slate-500 dark:text-slate-400 capitalize">
            {location.pathname.replace('/dashboard', 'Dashboard').replace('/', ' / ')}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-enterprise-850 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Profile Avatar Quick Dropdown */}
            <div className="flex items-center space-x-2 border-l pl-4 border-slate-200 dark:border-enterprise-800">
              <span className="hidden lg:inline-block text-xs font-medium text-slate-700 dark:text-slate-300">
                {user.name}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded uppercase">
                {user.role}
              </span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
