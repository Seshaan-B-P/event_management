import { API_BASE_URL } from '../../config';
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LogOut,
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Wrench,
  ClipboardList,
  MessageSquare,
  Calendar,
  Package,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const WorkerLayout = ({ onLogout }) => {
  const navigate = useNavigate();

  const userRole = localStorage.getItem('bps_staff_role') || 'staff';
  const username = localStorage.getItem('bps_staff_username') || 'Worker';
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/notifications?role=${userRole}`);
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
      const res = await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, { method: 'PUT' });
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
      const res = await fetch(`${API_BASE_URL}/api/notifications/read-all`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    localStorage.removeItem('bps_staff_token');
    localStorage.removeItem('bps_staff_username');
    localStorage.removeItem('bps_staff_role');
    onLogout(false);
    toast.success('Logged out successfully', {
      style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-text-main)', border: '1px solid var(--admin-border)' }
    });
    navigate('/worker/login');
  };

  const navItems = [
    { path: '/worker/tasks', name: 'My Tasks', icon: ClipboardList },
    { path: '/worker/chat', name: 'Team Chat', icon: MessageSquare },
    { path: '/worker/leave', name: 'Leave Requests', icon: Calendar },
    { path: '/worker/inventory', name: 'Equipment', icon: Package },
    { path: '/worker/reports', name: 'Shift Reports', icon: FileText },
  ];

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
          <h1 style={styles.logoText}>Staff Portal</h1>
        </div>

        <nav className="admin-scroll" style={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
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
              Welcome back, {username}!
            </h2>
            <p style={{ color: 'var(--admin-text-muted)', margin: '4px 0 0 0', fontSize: '13px' }}>
              Here is what is happening today.
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

export default WorkerLayout;
