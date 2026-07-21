import React, { useState, useEffect } from 'react';
import { FileText, Plus, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const WorkerReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    reportType: 'Daily Shift',
    content: ''
  });

  const staffId = localStorage.getItem('bps_staff_id');
  const staffName = localStorage.getItem('bps_staff_username');

  useEffect(() => {
    if (staffId) {
      fetchReports();
    }
  }, [staffId]);

  const fetchReports = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/reports/staff/${staffId}`);
      const data = await res.json();
      if (data.success) {
        setReports(data.data);
      }
    } catch (err) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      toast.error('Report content cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/reports', {
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
        toast.success('Report submitted successfully');
        setReports([data.data, ...reports]);
        setShowForm(false);
        setFormData({ reportType: 'Daily Shift', content: '' });
      } else {
        toast.error('Failed to submit report');
      }
    } catch (err) {
      toast.error('Server error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-animate-fade" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Shift & Incident Reports</h2>
          <p style={styles.subtitle}>Submit daily summaries or report issues</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={styles.addButton}>
            <Plus size={18} /> New Report
          </button>
        )}
      </div>

      {showForm && (
        <div className="admin-glass-panel" style={styles.formCard}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Submit a Report</h3>
          <form onSubmit={handleSubmit} style={styles.form}>

            <div style={styles.formGroup}>
              <label style={styles.label}>Report Type</label>
              <select
                value={formData.reportType}
                onChange={e => setFormData({ ...formData, reportType: e.target.value })}
                style={styles.input}
              >
                <option value="Daily Shift">Daily Shift Summary</option>
                <option value="Incident">Incident Report</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Report Content</label>
              <textarea
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                style={{ ...styles.input, minHeight: '120px', resize: 'vertical' }}
                placeholder="Describe what happened today, or provide details about the incident..."
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" disabled={isSubmitting} style={styles.submitButton}>
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
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
        ) : reports.length === 0 ? (
          <div className="admin-glass-panel" style={styles.emptyState}>
            <FileText size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p>You haven't submitted any reports.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reports.map(report => (
              <div key={report._id} className="admin-glass-panel" style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                      backgroundColor: report.reportType === 'Incident' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(212, 175, 55, 0.1)',
                      color: report.reportType === 'Incident' ? 'var(--admin-danger)' : 'var(--admin-primary)'
                    }}>
                      {report.reportType}
                    </span>
                    {report.status === 'Read' && <span style={{ fontSize: '11px', color: 'var(--admin-success)', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={12} /> Seen by Admin</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                    {new Date(report.createdAt).toLocaleString()}
                  </div>
                </div>

                <div style={{ marginTop: '16px', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {report.content}
                </div>
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
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
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
    outline: 'none',
    fontFamily: 'inherit'
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

export default WorkerReports;
