import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  MessageSquare,
  Star,
  ImageIcon,
  LogOut,
  Settings,
  ShieldCheck,
  Calendar,
  Briefcase,
  ClipboardList,
  Users,
  IndianRupee,
  Truck,
  Package,
  Bell,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  Send,
  Layers,
  MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLayout = ({ onLogout }) => {
  const navigate = useNavigate();

  const userRole = localStorage.getItem('bps_admin_role') || 'superadmin';
  const username = localStorage.getItem('bps_admin_username') || 'Administrator';
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [newNotif, setNewNotif] = useState({ title: '', message: '', type: 'info', targetRole: 'all' });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/notifications?role=${userRole}`);
        const data = await res.json();
        if (data.success) {
          setNotifications(data.data);
        }
      } catch (err) {
        console.error('Failed to load notifications');
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10s

    // Close dropdown on click outside
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearInterval(interval);
    };
  }, [userRole]);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${id}/read`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/read-all`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!newNotif.title || !newNotif.message) return toast.error('Title and message are required');

    setIsSending(true);
    try {
      const res = await fetch('http://localhost:5000/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotif)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Notification sent successfully');
        setShowSendModal(false);
        setNewNotif({ title: '', message: '', type: 'info', targetRole: 'all' });
        if (data.data.targetRole === 'all' || data.data.targetRole === userRole) {
          setNotifications([data.data, ...notifications]);
        }
      } else {
        toast.error(data.error || 'Failed to send notification');
      }
    } catch (err) {
      toast.error('Server error while sending notification');
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    localStorage.removeItem('bps_admin_token');
    localStorage.removeItem('bps_admin_username');
    localStorage.removeItem('bps_admin_role');
    onLogout(false);
    toast.success('Logged out successfully', {
      style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-text-main)', border: '1px solid var(--admin-border)' }
    });
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', name: 'Analytics', icon: BarChart3, exact: true, roles: ['superadmin', 'manager'] },
    { path: '/admin/finance', name: 'Finance', icon: IndianRupee, roles: ['superadmin'] },
    { path: '/admin/staff', name: 'Team & Staff', icon: Users, roles: ['superadmin', 'staff'] },
    { path: '/admin/tasks', name: 'Task Board', icon: ClipboardList, roles: ['superadmin', 'manager', 'staff'] },
    { path: '/admin/services', name: 'Services (CMS)', icon: Briefcase, roles: ['superadmin', 'manager'] },
    { path: '/admin/packages', name: 'Packages Builder', icon: Layers, roles: ['superadmin', 'manager'] },
    { path: '/admin/calendar', name: 'Calendar', icon: Calendar, roles: ['superadmin', 'manager', 'staff'] },
    { path: '/admin/chat', name: 'Communication Hub', icon: MessageCircle, roles: ['superadmin', 'manager'] },
    { path: '/admin/vendors', name: 'Vendors', icon: Truck, roles: ['superadmin', 'manager'] },
    { path: '/admin/inventory', name: 'Inventory', icon: Package, roles: ['superadmin', 'manager'] },
    { path: '/admin/crm', name: 'CRM & Leads', icon: MessageSquare, roles: ['superadmin', 'manager'] },
    { path: '/admin/gallery', name: 'Gallery', icon: ImageIcon, roles: ['superadmin', 'manager'] },
    { path: '/admin/reviews', name: 'Reviews', icon: Star, roles: ['superadmin', 'manager'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="admin-bg-gradient" style={styles.container}>
      {/* Sidebar */}
      <aside className="admin-glass-panel" style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <img
            src="/logo.png"
            alt="BPS Events Logo"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '2px solid var(--admin-primary)',
              objectFit: 'cover',
              boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)'
            }}
          />
          <h1 style={styles.logoText}>BPS Admin</h1>
        </div>

        <nav className="admin-scroll" style={styles.nav}>
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {})
              })}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div style={styles.bottomNav}>
          <button style={styles.logoutButton} onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={styles.main}>
        {/* Global Transparent Watermark */}
        <div style={{
          position: 'absolute',
          top: 200,
          bottom: 200,
          left: 0,
          width: '100%',
          height: '60%',
          opacity: 0.2,
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage: 'url(/banner.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}></div>

        <div style={styles.topbar}>
          <div style={styles.greeting}>
            <h2 style={{ color: 'var(--admin-text-main)', margin: 0, fontSize: '20px', fontWeight: '600' }}>
              Dashboard Overview
            </h2>
            <p style={{ color: 'var(--admin-text-muted)', margin: '4px 0 0 0', fontSize: '13px' }}>
              Manage your event platform effectively
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Notification Bell */}
            <div style={{ position: 'relative' }} ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  background: 'none', border: 'none', color: 'var(--admin-text-main)',
                  cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)'
                }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '6px', right: '8px', width: '8px', height: '8px',
                    backgroundColor: 'var(--admin-danger)', borderRadius: '50%', border: '2px solid #0a0a0a'
                  }}></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div style={{
                  position: 'absolute', top: '50px', right: '0', width: '320px',
                  backgroundColor: '#1E1E1E', border: '1px solid var(--admin-border)',
                  borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', zIndex: 100,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Notifications</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {(userRole === 'superadmin' || userRole === 'manager') && (
                        <button onClick={() => { setShowNotifications(false); setShowSendModal(true); }} style={{ background: 'none', border: 'none', color: 'var(--admin-primary)', fontSize: '12px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Send size={12} /> Send
                        </button>
                      )}
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllAsRead} style={{ background: 'none', border: 'none', color: 'var(--admin-text-main)', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ maxHeight: '360px', overflowY: 'auto' }} className="admin-scroll">
                    {notifications.length === 0 ? (
                      <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '14px' }}>
                        No new notifications
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif._id}
                          onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                          style={{
                            padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.02)',
                            backgroundColor: notif.isRead ? 'transparent' : 'rgba(212, 175, 55, 0.05)',
                            cursor: notif.isRead ? 'default' : 'pointer', transition: 'background-color 0.2s',
                            display: 'flex', gap: '12px', alignItems: 'flex-start'
                          }}
                        >
                          <div style={{
                            color: notif.type === 'warning' ? 'var(--admin-primary)' : notif.type === 'error' ? 'var(--admin-danger)' : 'var(--admin-text-muted)',
                            marginTop: '2px'
                          }}>
                            {notif.type === 'warning' ? <AlertTriangle size={16} /> : notif.type === 'error' ? <Info size={16} /> : <CheckCircle size={16} />}
                          </div>
                          <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: notif.isRead ? '500' : '600', color: notif.isRead ? 'var(--admin-text-muted)' : 'var(--admin-text-main)' }}>
                              {notif.title}
                            </p>
                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-muted)', lineHeight: '1.4' }}>
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div style={styles.adminProfile}>
              <div style={styles.avatar}>{username.charAt(0).toUpperCase()}</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{username}</span>
                <span style={{ fontSize: '12px', color: 'var(--admin-primary)', textTransform: 'capitalize' }}>
                  {userRole.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-scroll admin-animate-fade" style={styles.content}>
          <Outlet />
        </div>

        {/* Send Notification Modal */}
        {showSendModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
          }}>
            <div style={{
              backgroundColor: '#1E1E1E', borderRadius: '16px', width: '90%', maxWidth: '500px',
              border: '1px solid var(--admin-border)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}>
              <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={20} color="var(--admin-primary)" />
                  Send Notification
                </h3>
                <button onClick={() => setShowSendModal(false)} style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSendNotification} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--admin-text-muted)' }}>Title</label>
                  <input
                    type="text"
                    value={newNotif.title}
                    onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }}
                    placeholder="E.g., System Maintenance"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--admin-text-muted)' }}>Message</label>
                  <textarea
                    value={newNotif.message}
                    onChange={(e) => setNewNotif({ ...newNotif, message: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'white', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box' }}
                    placeholder="Enter notification details..."
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--admin-text-muted)' }}>Type</label>
                    <select
                      value={newNotif.type}
                      onChange={(e) => setNewNotif({ ...newNotif, type: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1A1A1A', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'white' }}
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--admin-text-muted)' }}>Target Role</label>
                    <select
                      value={newNotif.targetRole}
                      onChange={(e) => setNewNotif({ ...newNotif, targetRole: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1A1A1A', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'white' }}
                    >
                      <option value="all">All Users</option>
                      <option value="superadmin">Super Admins</option>
                      <option value="manager">Managers</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowSendModal(false)}
                    style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'transparent', color: 'white', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--admin-primary)', color: '#000', fontWeight: '600', cursor: isSending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {isSending ? 'Sending...' : <><Send size={16} /> Send</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Inter, var(--font-sans)',
    overflow: 'hidden',
    color: 'var(--admin-text-main)'
  },
  sidebar: {
    width: '280px',
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 32px)',
    margin: '16px',
    borderRadius: '24px',
    zIndex: 20
  },
  logoContainer: {
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    borderBottom: '1px solid var(--admin-border)'
  },
  logoIconBg: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px rgba(212, 175, 55, 0.1)'
  },
  logoIcon: {
    color: 'var(--admin-primary)'
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '0.5px',
    background: 'linear-gradient(90deg, #fff, #d4af37)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  nav: {
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
    overflowY: 'auto'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 18px',
    borderRadius: '12px',
    color: 'var(--admin-text-muted)',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  navItemActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    color: 'var(--admin-primary)',
    boxShadow: 'inset 4px 0 0 0 var(--admin-primary)'
  },
  bottomNav: {
    padding: '24px 16px',
    borderTop: '1px solid var(--admin-border)'
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 18px',
    width: '100%',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.1)',
    color: 'var(--admin-danger)',
    fontWeight: '500',
    fontSize: '15px',
    cursor: 'pointer',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative'
  },
  topbar: {
    height: '88px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 40px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: 'linear-gradient(180deg, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0) 100%)',
    backdropFilter: 'blur(8px)',
  },
  adminProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '8px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--admin-border)',
    borderRadius: '30px',
    backdropFilter: 'blur(10px)'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--admin-primary)',
    color: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '16px',
    boxShadow: '0 0 15px rgba(212, 175, 55, 0.4)'
  },
  content: {
    padding: '0 40px 40px 40px',
    flex: 1,
    overflowY: 'auto'
  }
};

export default AdminLayout;
