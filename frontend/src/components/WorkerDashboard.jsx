import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WorkerAuth from './worker/WorkerAuth';
import WorkerLayout from './worker/WorkerLayout';
import WorkerTasks from './worker/WorkerTasks';
import WorkerChat from './worker/WorkerChat';
import WorkerLeave from './worker/WorkerLeave';
import WorkerInventory from './worker/WorkerInventory';
import WorkerReports from './worker/WorkerReports';
const WorkerDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('bps_staff_token')
  );

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/worker/login" replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route 
        path="/worker/login" 
        element={
          isAuthenticated ? 
          <Navigate to="/worker" replace /> : 
          <WorkerAuth onLogin={setIsAuthenticated} />
        } 
      />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <WorkerLayout onLogout={setIsAuthenticated} />
          </ProtectedRoute>
        }
      >
        <Route index element={<WorkerTasks />} />
        <Route path="tasks" element={<WorkerTasks />} />
        <Route path="chat" element={<WorkerChat />} />
        <Route path="leave" element={<WorkerLeave />} />
        <Route path="inventory" element={<WorkerInventory />} />
        <Route path="reports" element={<WorkerReports />} />
      </Route>
    </Routes>
  );
};

export default WorkerDashboard;
