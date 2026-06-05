import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import ServicesCatalog from './pages/ServicesCatalog';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Guarded Pages
import ProtectedRoute from './components/ProtectedRoute';
import DashboardOverview from './pages/DashboardOverview';
import Employees from './pages/Employees';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Tickets from './pages/Tickets';
import AIChat from './pages/AIChat';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Landing Pages */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<ServicesCatalog />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Guarded Enterprise Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverview />} />
              <Route path="ai-chat" element={<AIChat />} />
              
              {/* Admin-only paths */}
              <Route
                path="employees"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Employees />
                  </ProtectedRoute>
                }
              />
              <Route
                path="clients"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Clients />
                  </ProtectedRoute>
                }
              />

              {/* Shared role paths */}
              <Route path="projects" element={<Projects />} />
              <Route
                path="tasks"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'employee']}>
                    <Tasks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="tickets"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'client']}>
                    <Tickets />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
