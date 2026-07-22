import { API_BASE_URL } from '../../config';
import React, { useState } from 'react';
import { Lock, User, ChevronRight, Loader2, Wrench, Calendar, MessageSquare, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const WorkerAuth = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/staff-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Welcome back, ${data.username}!`, {
          style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-primary)', border: '1px solid var(--admin-border)', backdropFilter: 'blur(10px)' }
        });
        localStorage.setItem('bps_staff_token', data.token);
        localStorage.setItem('bps_staff_username', data.username);
        localStorage.setItem('bps_staff_role', data.role || 'staff');
        if (data._id) localStorage.setItem('bps_staff_id', data._id);
        onLogin(true);
        navigate('/worker');
      } else {
        toast.error(data.message || 'Invalid credentials', {
          style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-danger)', border: '1px solid var(--admin-danger)' }
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/staff-forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: forgotUsername })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message, { style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-primary)', border: '1px solid var(--admin-border)' } });
        setShowForgot(false);
      } else {
        toast.error(data.message || 'Error sending request');
      }
    } catch (err) {
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.leftPanel}>
        <div style={styles.overlay}></div>
        <div style={styles.leftContent} className="admin-animate-fade">
          <div style={styles.brandIcon}>
            <img
              src="/logo.png"
              alt="BPS Events Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}
            />
          </div>
          <h1 style={styles.heroTitle}>Staff Portal</h1>
          <p style={styles.heroSubtitle}>
            Manage your tasks, collaborate with the team, and keep events running smoothly.
          </p>

          <div style={styles.features}>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}><ClipboardList size={20} /></div>
              <div>
                <h4 style={styles.featureTitle}>Task Management</h4>
                <p style={styles.featureDesc}>View and update your assignments</p>
              </div>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}><MessageSquare size={20} /></div>
              <div>
                <h4 style={styles.featureTitle}>Team Chat</h4>
                <p style={styles.featureDesc}>Instant communication with staff</p>
              </div>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}><Calendar size={20} /></div>
              <div>
                <h4 style={styles.featureTitle}>Event Schedule</h4>
                <p style={styles.featureDesc}>Stay on top of timelines</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel} className="admin-mesh-background">
        <div className="admin-glass-panel admin-animate-fade" style={styles.card}>
          <div style={styles.header}>
            <div style={styles.iconContainer}>
              <Wrench size={32} style={{ color: 'var(--admin-primary)' }} />
            </div>
            <h2 style={styles.title}>{showForgot ? 'Reset Password' : 'Worker Login'}</h2>
            <p style={styles.subtitle}>{showForgot ? 'Request Admin Assistance' : 'Staff Access Only'}</p>
          </div>

          {showForgot ? (
            <form onSubmit={handleForgotSubmit} style={styles.form}>
              <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px', marginBottom: '8px', lineHeight: '1.5' }}>
                Enter your login ID. A notification will be sent to the Administrator to reset your password.
              </p>
              <div style={styles.inputGroup}>
                <User size={18} style={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="Login ID (e.g. john@bpsevent.com)"
                  value={forgotUsername}
                  onChange={(e) => setForgotUsername(e.target.value)}
                  className="admin-input"
                  style={{ paddingLeft: '44px' }}
                  required
                />
              </div>
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                style={{ marginTop: '12px', height: '48px', fontSize: '15px' }}
                disabled={loading}
              >
                {loading ? 'Sending Request...' : 'Send Request to Admin'}
              </button>
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                style={{ ...styles.forgotLink, textAlign: 'center', marginTop: '12px' }}
              >
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.inputGroup}>
                <User size={18} style={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="admin-input"
                  style={{ paddingLeft: '44px' }}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <Lock size={18} style={styles.inputIcon} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input"
                  style={{ paddingLeft: '44px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px' }}>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  style={styles.forgotLink}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                style={{ marginTop: '12px', height: '48px', fontSize: '15px' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="admin-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Secure Login
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          <div style={styles.footer}>
            <p style={styles.footerText}>© {new Date().getFullYear()} Elite Events. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: 'var(--admin-bg-base)'
  },
  leftPanel: {
    flex: '1.2',
    position: 'relative',
    backgroundImage: 'url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 10, 0.75)',
    backdropFilter: 'blur(3px)',
    zIndex: 1
  },
  leftContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '500px',
    color: '#ffffff'
  },
  brandIcon: {
    width: '72px',
    height: '72px',
    backgroundColor: 'transparent',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '32px',
    boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)'
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '800',
    lineHeight: '1.1',
    marginBottom: '24px',
    background: 'linear-gradient(45deg, #ffffff, #d4af37)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '48px'
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  featureIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--admin-primary)',
    border: '1px solid rgba(212, 175, 55, 0.2)'
  },
  featureTitle: {
    margin: '0 0 4px 0',
    fontSize: '16px',
    fontWeight: '600'
  },
  featureDesc: {
    margin: 0,
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)'
  },
  rightPanel: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    minWidth: '450px'
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '48px 40px',
    position: 'relative',
    zIndex: 10
  },
  header: {
    textAlign: 'center',
    marginBottom: '36px'
  },
  iconContainer: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    boxShadow: '0 0 20px rgba(212, 175, 55, 0.1)'
  },
  title: {
    color: 'var(--admin-text-main)',
    fontSize: '26px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    letterSpacing: '0.5px'
  },
  subtitle: {
    color: 'var(--admin-text-muted)',
    fontSize: '13px',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontWeight: '600'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    color: 'var(--admin-text-muted)',
    pointerEvents: 'none'
  },
  footer: {
    marginTop: '40px',
    textAlign: 'center'
  },
  footerText: {
    color: 'var(--admin-text-muted)',
    fontSize: '13px'
  },
  forgotLink: {
    background: 'none',
    border: 'none',
    color: 'var(--admin-text-muted)',
    fontSize: '13px',
    cursor: 'pointer',
    padding: '4px',
    transition: 'color 0.2s',
    textDecoration: 'underline'
  }
};

export default WorkerAuth;
