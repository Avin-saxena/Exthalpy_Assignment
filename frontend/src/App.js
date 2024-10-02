import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminVideos from './components/admin/AdminVideos';
import PrivateRoute from './components/PrivateRoute';
import Unauthorized from './components/Unauthorized';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />

        {/* Protected Route for general users */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

       <Route path="/unauthorized" element={<Unauthorized />} />
        {/* Admin routes wrapped with PrivateRoute */}
        <Route element={<PrivateRoute roles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/videos" element={<AdminVideos />} />
        </Route>

       

      </Routes>
    </Router>
  );
}

function NotFound() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

export default App;
