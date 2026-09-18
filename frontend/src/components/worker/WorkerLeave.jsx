import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, CheckCircle, XCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import TiltCard3D from '../TiltCard3D';

const WorkerLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  const staffId = localStorage.getItem('bps_staff_id');
  const staffName = localStorage.getItem('bps_staff_username') || 'Field Specialist';

  useEffect(() => {
    if (staffId) {
      fetchLeaves();
    }
  }, [staffId]);

  const fetchLeaves = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/leaves/staff/${staffId}`);
      const data = await res.json();
      if (data.success) {
        setLeaves(data.data);
      }
    } catch (err) {
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) {
      toast.error('Select both start and return dates');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/leaves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          staffId,
          staffName
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Time-off request transmitted');
        setLeaves([data.data, ...leaves]);
        setShowForm(false);
        setFormData({ startDate: '', endDate: '', reason: '' });
      } else {
        toast.error(data.error || 'Failed to submit request');
      }
    } catch (err) {
      toast.error('Server connection error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '800', color: 'var(--admin-success)', padding: '3px 8px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <CheckCircle size={12} /> APPROVED
          </span>
        );
      case 'Rejected':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '800', color: 'var(--admin-danger)', padding: '3px 8px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <XCircle size={12} /> REJECTED
          </span>
        );
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '800', color: 'var(--admin-warning)', padding: '3px 8px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <Clock size={12} /> IN REVIEW
          </span>
        );
    }
  };

  // Metrics
  const totalRequests = leaves.length;
  const approvedCount = leaves.filter(l => l.status === 'Approved').length;
  const pendingCount = leaves.filter(l => l.status === 'Pending').length;

  return (
    <div className="admin-animate-fade" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={styles.title}>Crew Leave & Vacation Balance</h2>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700',
              padding: '4px 10px', borderRadius: '12px', backgroundColor: 'rgba(212, 175, 55, 0.1)',
              color: 'var(--admin-primary)', border: '1px solid rgba(212, 175, 55, 0.25)'
            }}>
              <Sparkles size={12} /> 3D Roster
            </span>
          </div>
          <p style={styles.subtitle}>Plan scheduled time-off, emergency leave, and track administrative sign-offs.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={styles.addButton} className="tactile-press">
            <Plus size={18} /> Request Leave
          </button>
        )}
      </div>

      {/* 3D Metrics Strip */}
      <div style={styles.metricGrid}>
        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>PAID ALLOWANCE</div>
          <div style={{ ...styles.metricValue, color: 'var(--admin-primary)' }}>18 DAYS</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Annual entitlement</div>
        </TiltCard3D>

        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>APPROVED GRANTED</div>
          <div style={{ ...styles.metricValue, color: 'var(--admin-success)' }}>{approvedCount}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Sanctioned leaves</div>
        </TiltCard3D>

        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>PENDING DISPATCH</div>
          <div style={{ ...styles.metricValue, color: pendingCount > 0 ? 'var(--admin-warning)' : 'var(--admin-text-muted)' }}>{pendingCount}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Awaiting HR signoff</div>
        </TiltCard3D>

        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>TOTAL APPLICATIONS</div>
          <div style={styles.metricValue}>{totalRequests}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Filed this fiscal year</div>
        </TiltCard3D>
      </div>

      {/* Form Drawer */}
      {showForm && (
        <div className="admin-glass-panel hologram-border admin-animate-fade" style={styles.formCard}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '17px', fontWeight: '700', color: 'var(--admin-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--admin-primary)" />
            Schedule Absence or Vacation
          </h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Return Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Absence Purpose / Note</label>
              <textarea
                value={formData.reason}
                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                placeholder="Personal commitment, family event, medical rest, etc..."
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
              <button type="submit" disabled={isSubmitting} className="admin-btn admin-btn-primary tactile-press" style={styles.submitButton}>
                {isSubmitting ? 'Transmitting...' : 'Submit Request'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="admin-btn admin-btn-secondary tactile-press" style={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leave Feed */}
      <div style={styles.content}>
        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading leave records...</div>
        ) : leaves.length === 0 ? (
          <div className="admin-glass-panel" style={styles.emptyState}>
            <Calendar size={48} style={{ opacity: 0.25, marginBottom: '16px', color: 'var(--admin-primary)' }} />
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>No leave requests on file.</p>
            <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Click "Request Leave" above to apply for time off.</span>
          </div>
        ) : (
          <div style={styles.grid}>
            {leaves.map(leave => (
              <TiltCard3D key={leave._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>{getStatusBadge(leave.status)}</div>
                  <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                    Filed: {new Date(leave.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ margin: '14px 0', flex: 1 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
                    backgroundColor: 'rgba(212,175,55,0.08)', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.2)',
                    marginBottom: '10px'
                  }}>
                    <Calendar size={14} color="var(--admin-primary)" />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--admin-text-main)' }}>
                      {new Date(leave.startDate).toLocaleDateString()}
                    </span>
                    <ArrowRight size={12} color="var(--admin-primary)" />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--admin-text-main)' }}>
                      {new Date(leave.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', margin: 0, lineHeight: '1.5' }}>
                    {leave.reason || 'No specific explanation provided'}
                  </p>
                </div>

                {leave.adminReply && (
                  <div style={{
                    marginTop: '12px', padding: '12px', backgroundColor: 'rgba(212, 175, 55, 0.06)',
                    borderRadius: '10px', borderLeft: '3px solid var(--admin-primary)', borderTop: '1px solid rgba(212,175,55,0.15)',
                    borderRight: '1px solid rgba(212,175,55,0.15)', borderBottom: '1px solid rgba(212,175,55,0.15)'
                  }}>
                    <div style={{ fontSize: '11px', color: 'var(--admin-primary)', marginBottom: '3px', fontWeight: '800' }}>
                      ADMIN NOTE:
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--admin-text-main)', lineHeight: '1.4' }}>
                      {leave.adminReply}
                    </div>
                  </div>
                )}
              </TiltCard3D>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    padding: '16px 0'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    margin: 0,
    color: 'var(--admin-text-main)',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--admin-text-muted)',
    margin: '4px 0 0 0'
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    backgroundColor: 'var(--admin-primary)',
    color: '#000',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '13px',
    boxShadow: '0 4px 16px rgba(212,175,55,0.25)'
  },
  metricGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  metricCard: {
    padding: '18px 20px',
    backgroundColor: 'var(--admin-bg-panel)',
    borderRadius: '14px',
    border: '1px solid var(--admin-border)'
  },
  metricLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--admin-text-muted)',
    letterSpacing: '0.8px'
  },
  metricValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--admin-text-main)',
    marginTop: '4px'
  },
  formCard: {
    padding: '24px',
    borderRadius: '16px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    minWidth: '180px'
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--admin-text-muted)'
  },
  input: {
    padding: '11px 14px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--admin-border)',
    borderRadius: '8px',
    color: 'var(--admin-text-main)',
    outline: 'none',
    fontSize: '13px'
  },
  submitButton: {
    padding: '11px 22px',
    fontWeight: '700',
    fontSize: '13px'
  },
  cancelButton: {
    padding: '11px 22px',
    fontWeight: '600',
    fontSize: '13px'
  },
  content: {
    flex: 1
  },
  emptyState: {
    padding: '60px 40px',
    textAlign: 'center',
    borderRadius: '16px',
    color: 'var(--admin-text-muted)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  card: {
    padding: '20px',
    borderRadius: '16px',
    backgroundColor: 'var(--admin-bg-panel)',
    border: '1px solid var(--admin-border)',
    display: 'flex',
    flexDirection: 'column'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.05)'
  }
};

export default WorkerLeave;

