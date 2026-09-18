import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { FileText, Plus, Check, AlertTriangle, Clock, ShieldCheck, Sparkles, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import TiltCard3D from '../TiltCard3D';

const WorkerReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const [formData, setFormData] = useState({
    reportType: 'Daily Shift',
    content: ''
  });

  const staffId = localStorage.getItem('bps_staff_id');
  const staffName = localStorage.getItem('bps_staff_username') || 'Field Specialist';

  useEffect(() => {
    if (staffId) {
      fetchReports();
    }
  }, [staffId]);

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reports/staff/${staffId}`);
      const data = await res.json();
      if (data.success) {
        setReports(data.data);
      }
    } catch (err) {
      toast.error('Failed to load activity reports');
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
      const res = await fetch(`${API_BASE_URL}/api/reports`, {
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
        toast.success('Shift report filed successfully');
        setReports([data.data, ...reports]);
        setShowForm(false);
        setFormData({ reportType: 'Daily Shift', content: '' });
      } else {
        toast.error('Failed to transmit report');
      }
    } catch (err) {
      toast.error('Server connection error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metrics
  const totalReports = reports.length;
  const incidentCount = reports.filter(r => r.reportType === 'Incident').length;
  const shiftCount = reports.filter(r => r.reportType === 'Daily Shift').length;
  const acknowledgedCount = reports.filter(r => r.status === 'Read').length;

  const filteredReports = reports.filter(r => {
    if (selectedFilter === 'ALL') return true;
    return r.reportType === selectedFilter;
  });

  return (
    <div className="admin-animate-fade" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={styles.title}>Field Shift & Incident Reports</h2>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700',
              padding: '4px 10px', borderRadius: '12px', backgroundColor: 'rgba(212, 175, 55, 0.1)',
              color: 'var(--admin-primary)', border: '1px solid rgba(212, 175, 55, 0.25)'
            }}>
              <Sparkles size={12} /> Live Debrief
            </span>
          </div>
          <p style={styles.subtitle}>Document daily operations, venue turnovers, logistical hazards, and event milestones.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={styles.addButton} className="tactile-press">
            <Plus size={18} /> File Report
          </button>
        )}
      </div>

      {/* 3D Metrics Strip */}
      <div style={styles.metricGrid}>
        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>TOTAL FILED</div>
          <div style={styles.metricValue}>{totalReports}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Operational logs</div>
        </TiltCard3D>

        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>DAILY SHIFTS</div>
          <div style={{ ...styles.metricValue, color: 'var(--admin-primary)' }}>{shiftCount}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Routine debriefs</div>
        </TiltCard3D>

        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>INCIDENTS</div>
          <div style={{ ...styles.metricValue, color: incidentCount > 0 ? 'var(--admin-danger)' : 'var(--admin-success)' }}>{incidentCount}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Safety/Gear flags</div>
        </TiltCard3D>

        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>ADMIN REVIEWED</div>
          <div style={{ ...styles.metricValue, color: 'var(--admin-success)' }}>{acknowledgedCount}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Audited & signed off</div>
        </TiltCard3D>
      </div>

      {/* Form Drawer */}
      {showForm && (
        <div className="admin-glass-panel hologram-border admin-animate-fade" style={styles.formCard}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '17px', fontWeight: '700', color: 'var(--admin-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--admin-primary)" />
            Transmit Field Report to Management
          </h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Classification Type</label>
              <select
                value={formData.reportType}
                onChange={e => setFormData({ ...formData, reportType: e.target.value })}
                className="admin-input"
              >
                <option value="Daily Shift">Daily Shift Summary</option>
                <option value="Incident">Critical Incident Report</option>
                <option value="Other">General Debrief / Note</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Debrief Content *</label>
              <textarea
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                className="admin-input"
                style={{ minHeight: '120px', resize: 'vertical' }}
                placeholder="Log event progress, client requests handled, equipment status, or any unexpected challenges encountered..."
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
              <button type="submit" disabled={isSubmitting} className="admin-btn admin-btn-primary tactile-press" style={styles.submitButton}>
                {isSubmitting ? 'Transmitting...' : 'File Report'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="admin-btn admin-btn-secondary tactile-press" style={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['ALL', 'Daily Shift', 'Incident', 'Other'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedFilter(type)}
            className="tactile-press"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: selectedFilter === type ? 'var(--admin-primary)' : 'rgba(255,255,255,0.05)',
              color: selectedFilter === type ? '#000' : 'var(--admin-text-muted)'
            }}
          >
            {type === 'ALL' ? 'All Reports' : type}
          </button>
        ))}
      </div>

      {/* Reports Feed */}
      <div style={styles.content}>
        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading activity reports...</div>
        ) : filteredReports.length === 0 ? (
          <div className="admin-glass-panel" style={styles.emptyState}>
            <FileText size={48} style={{ opacity: 0.25, marginBottom: '16px', color: 'var(--admin-primary)' }} />
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>No reports logged under this filter.</p>
            <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Click "File Report" to document today's work.</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredReports.map(report => (
              <TiltCard3D key={report._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800',
                      backgroundColor: report.reportType === 'Incident' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(212, 175, 55, 0.15)',
                      color: report.reportType === 'Incident' ? 'var(--admin-danger)' : 'var(--admin-primary)',
                      border: report.reportType === 'Incident' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(212, 175, 55, 0.3)',
                      letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      {report.reportType === 'Incident' && <AlertTriangle size={12} />}
                      {report.reportType.toUpperCase()}
                    </span>

                    {report.status === 'Read' ? (
                      <span style={{ fontSize: '11px', color: 'var(--admin-success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
                        <Check size={13} /> Audited
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--admin-warning)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                        <Clock size={11} /> Sent
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ marginTop: '14px', fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap', color: 'var(--admin-text-main)', flex: 1 }}>
                  {report.content}
                </div>
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
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--admin-text-muted)'
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

export default WorkerReports;

