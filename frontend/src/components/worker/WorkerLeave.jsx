import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

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
  const staffName = localStorage.getItem('bps_staff_username');

  useEffect(() => {
    if (staffId) {
      fetchLeaves();
    }
  }, [staffId]);

  const fetchLeaves = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/leaves/staff/${staffId}`);
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
      toast.error('Please fill in all dates');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/leaves', {
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
        toast.success('Leave request submitted');
        setLeaves([data.data, ...leaves]);
        setShowForm(false);
        setFormData({ startDate: '', endDate: '', reason: '' });
      } else {
        toast.error('Failed to submit request');
      }
    } catch (err) {
      toast.error('Server error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle size={16} color="var(--admin-success)" />;
      case 'Rejected': return <XCircle size={16} color="var(--admin-danger)" />;
      default: return <Clock size={16} color="var(--admin-warning)" />;
    }
  };

  return (
    <div className="admin-animate-fade" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Time Off & Leave</h2>
          <p style={styles.subtitle}>Manage your leave requests</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={styles.addButton}>
            <Plus size={18} /> Request Leave
          </button>
        )}
      </div>

      {showForm && (
        <div className="admin-glass-panel" style={styles.formCard}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>New Leave Request</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>End Date</label>
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
              <label style={styles.label}>Reason</label>
              <textarea
                value={formData.reason}
                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                placeholder="Reason for leave..."
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" disabled={isSubmitting} style={styles.submitButton}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.content}>
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading...</div>
        ) : leaves.length === 0 ? (
          <div className="admin-glass-panel" style={styles.emptyState}>
            <Calendar size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p>You haven't requested any time off yet.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {leaves.map(leave => (
              <div key={leave._id} className="admin-glass-panel" style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getStatusIcon(leave.status)}
                    <span style={{ fontWeight: '600' }}>{leave.status}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                    {new Date(leave.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ margin: '12px 0' }}>
                  <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                    <strong>From:</strong> {new Date(leave.startDate).toLocaleDateString()} <br />
                    <strong>To:</strong> {new Date(leave.endDate).toLocaleDateString()}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', margin: 0 }}>
                    {leave.reason || 'No reason provided'}
                  </p>
                </div>

                {leave.adminReply && (
                  <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'rgba(212, 175, 55, 0.05)', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--admin-primary)', marginBottom: '4px', fontWeight: '600' }}>Admin Reply:</div>
                    <div style={{ fontSize: '13px' }}>{leave.adminReply}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: 'var(--admin-text-main)'
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--admin-text-muted)',
    margin: 0
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'var(--admin-primary)',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  formCard: {
    padding: '24px',
    marginBottom: '24px',
    borderRadius: '16px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
    minWidth: '200px'
  },
  label: {
    fontSize: '13px',
    color: 'var(--admin-text-muted)'
  },
  input: {
    padding: '12px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--admin-border)',
    borderRadius: '8px',
    color: 'var(--admin-text-main)',
    outline: 'none'
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: 'var(--admin-primary)',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: 'var(--admin-text-main)',
    border: '1px solid var(--admin-border)',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
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
    borderRadius: '12px'
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
