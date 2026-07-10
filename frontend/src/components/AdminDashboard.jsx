import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminAuth from './admin/AdminAuth';
import AdminLayout from './admin/AdminLayout';
import DashboardAnalytics from './admin/DashboardAnalytics';
import CRMManager from './admin/CRMManager';
import GalleryManager from './admin/GalleryManager';
import ReviewManager from './admin/ReviewManager';
import CalendarManager from './admin/CalendarManager';
import ServiceManager from './admin/ServiceManager';
import KanbanBoard from './admin/KanbanBoard';
import StaffManager from './admin/StaffManager';
import FinanceManager from './admin/FinanceManager';
import VendorManager from './admin/VendorManager';
import InventoryManager from './admin/InventoryManager';
import PackageManager from './admin/PackageManager';
import CommunicationHub from './admin/CommunicationHub';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('bps_admin_token')
  );

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/admin/login" replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
          <Navigate to="/admin" replace /> : 
          <AdminAuth onLogin={setIsAuthenticated} />
        } 
      />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AdminLayout onLogout={setIsAuthenticated} />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardAnalytics />} />
        <Route path="finance" element={<FinanceManager />} />
        <Route path="crm" element={<CRMManager />} />
        <Route path="tasks" element={<KanbanBoard />} />
        <Route path="staff" element={<StaffManager />} />
        <Route path="services" element={<ServiceManager />} />
        <Route path="packages" element={<PackageManager />} />
        <Route path="chat" element={<CommunicationHub />} />
        <Route path="calendar" element={<CalendarManager />} />
        <Route path="vendors" element={<VendorManager />} />
        <Route path="inventory" element={<InventoryManager />} />
        <Route path="gallery" element={<GalleryManager />} />
        <Route path="reviews" element={<ReviewManager />} />
      </Route>
    </Routes>
  );
};

export default AdminDashboard;
