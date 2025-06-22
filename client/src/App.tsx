// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { CreateAppraisal } from './pages/CreateAppraisal';
import { ViewAppraisal } from './pages/ViewAppraisal';
import { GiveFeedback } from './pages/GiveFeedback';
import { NotFound } from './pages/NotFound';
import { Role } from './types';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // ✅ important for toast styles

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <ToastContainer position="top-center" autoClose={2000} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appraisals/create"
              element={
                <ProtectedRoute allowedRoles={[Role.EMPLOYEE]}>
                  <CreateAppraisal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appraisals/:id"
              element={
                <ProtectedRoute>
                  <ViewAppraisal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appraisals/:id/feedback"
              element={
                <ProtectedRoute allowedRoles={[Role.PEER, Role.JUNIOR]}>
                  <GiveFeedback />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
