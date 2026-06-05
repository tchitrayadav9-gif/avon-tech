import React, { useContext, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, Shield, Globe } from 'lucide-react';

const PublicLayout = () => {
  const { user } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-enterprise-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Navbar */}
      <header className="sticky top-0 bg-white/80 dark:bg-enterprise-900/80 backdrop-blur-md border-b border-slate-200 dark:border-enterprise-800 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-brand-600 rounded-lg text-white">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">Avon Technologies</span>
          </Link>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400">Home</Link>
            <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400">About Company</Link>
            <Link to="/services" className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400">Services</Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-enterprise-850"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 text-sm font-semibold bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
                >
                  Client Portal
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu triggers */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white dark:bg-enterprise-950 z-40 md:hidden pt-20 px-6 flex flex-col space-y-4">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-bold py-2 border-b border-slate-100 dark:border-enterprise-900"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-bold py-2 border-b border-slate-100 dark:border-enterprise-900"
          >
            About Company
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-bold py-2 border-b border-slate-100 dark:border-enterprise-900"
          >
            Services
          </Link>

          <div className="pt-4 flex flex-col space-y-3">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center font-bold bg-brand-600 text-white rounded-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center font-bold border border-slate-200 dark:border-enterprise-800 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center font-bold bg-brand-600 text-white rounded-lg"
                >
                  Join Client Portal
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Outlet */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-enterprise-900 border-t border-slate-800 text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 text-white font-bold text-lg mb-4">
              <Shield className="w-6 h-6 text-brand-500" />
              <span>Avon Technologies</span>
            </div>
            <p className="text-sm">
              Enterprise management portal for managing software operations, employees, and clients. Specialized in ERP, CRM, and BI software.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Home Landing</Link></li>
              <li><Link to="/about" className="hover:text-white">About Company</Link></li>
              <li><Link to="/services" className="hover:text-white">Our Services</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-sm">
              <li>ERP & BaaN Systems</li>
              <li>CRM Architectures</li>
              <li>BI Reporting Analytics</li>
              <li>Enterprise Cloud Portals</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Office Location</h4>
            <p className="text-sm leading-relaxed">
              HITEC City, Hyderabad, <br />
              Telangana, India - 500081.<br />
              Email: contact@avontech.com<br />
              Phone: +91 40 4433 2211
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} Avon Technologies (India) Pvt. Ltd. All rights reserved.</span>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
