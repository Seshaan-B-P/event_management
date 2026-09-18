import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { Package, Plus, Clock, CheckCircle, XCircle, Search, ShieldCheck, AlertCircle, Sparkles, Box } from 'lucide-react';
import toast from 'react-hot-toast';
import TiltCard3D from '../TiltCard3D';

const WorkerInventory = () => {
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    itemId: '',
    quantityRequested: 1,
    reason: ''
  });

  const staffId = localStorage.getItem('bps_staff_id');
  const staffName = localStorage.getItem('bps_staff_username') || 'Crew Specialist';

  useEffect(() => {
    if (staffId) {
      fetchRequests();
      fetchInventory();
    }
  }, [staffId]);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory-requests/staff/${staffId}`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (err) {
      toast.error('Failed to load gear requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory`);
      const data = await res.json();
      if (data.success) {
        setInventory(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.itemId || formData.quantityRequested < 1) {
      toast.error('Select equipment asset and valid quantity');
      return;
    }

    const selectedItem = inventory.find(i => i._id === formData.itemId);
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          itemName: selectedItem.name,
          staffId,
          staffName
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Equipment requisition submitted');
        setRequests([data.data, ...requests]);
        setShowForm(false);
        setFormData({ itemId: '', quantityRequested: 1, reason: '' });
      } else {
        toast.error(data.error || 'Failed to submit requisition');
      }
    } catch (err) {
      toast.error('Server error during submission');
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
      case 'Returned':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '800', color: 'var(--admin-primary)', padding: '3px 8px', borderRadius: '6px', backgroundColor: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <CheckCircle size={12} /> RETURNED
          </span>
        );
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '800', color: 'var(--admin-warning)', padding: '3px 8px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <Clock size={12} /> PENDING ADMIN
          </span>
        );
    }
  };

  const filteredInventory = inventory.filter(item =>
    (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Metrics
  const totalRequisitions = requests.length;
  const approvedCount = requests.filter(r => r.status === 'Approved').length;
  const pendingCount = requests.filter(r => r.status === 'Pending').length;

  return (
    <div className="admin-animate-fade" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={styles.title}>Field Gear & Inventory Requisitions</h2>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700',
              padding: '4px 10px', borderRadius: '12px', backgroundColor: 'rgba(212, 175, 55, 0.1)',
              color: 'var(--admin-primary)', border: '1px solid rgba(212, 175, 55, 0.25)'
            }}>
              <Sparkles size={12} /> Armory Link
            </span>
          </div>
          <p style={styles.subtitle}>Check out tools, audio gear, decorative assets, and lighting rigs for on-site operations.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={styles.addButton} className="tactile-press">
            <Plus size={18} /> Requisition Gear
          </button>
        )}
      </div>

      {/* 3D Metrics Strip */}
      <div style={styles.metricGrid}>
        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>TOTAL REQUISITIONS</div>
          <div style={styles.metricValue}>{totalRequisitions}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Your requested items</div>
        </TiltCard3D>

        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>APPROVED ASSETS</div>
          <div style={{ ...styles.metricValue, color: 'var(--admin-success)' }}>{approvedCount}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Authorized for field use</div>
        </TiltCard3D>

        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>IN REVIEW</div>
          <div style={{ ...styles.metricValue, color: pendingCount > 0 ? 'var(--admin-warning)' : 'var(--admin-text-muted)' }}>{pendingCount}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Awaiting admin dispatch</div>
        </TiltCard3D>

        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>AVAILABLE CATALOG</div>
          <div style={{ ...styles.metricValue, color: 'var(--admin-primary)' }}>{inventory.length}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>In company storage</div>
        </TiltCard3D>
      </div>

      {/* Form Drawer */}
      {showForm && (
        <div className="admin-glass-panel hologram-border admin-animate-fade" style={styles.formCard}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '17px', fontWeight: '700', color: 'var(--admin-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box size={18} color="var(--admin-primary)" />
            Requisition Equipment for Task
          </h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Gear Asset from Armory</label>
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--admin-text-muted)' }} />
                <input
                  type="text"
                  placeholder="Filter available gear..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ ...styles.input, paddingLeft: '34px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div className="admin-scroll" style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid var(--admin-border)', borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                {filteredInventory.map(item => (
                  <div
                    key={item._id}
                    onClick={() => setFormData({ ...formData, itemId: item._id })}
                    style={{
                      padding: '11px 14px',
                      cursor: 'pointer',
                      backgroundColor: formData.itemId === item._id ? 'rgba(212, 175, 55, 0.18)' : 'transparent',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: '600', color: 'var(--admin-text-main)', fontSize: '13px' }}>{item.name}</span>
                      <span style={{ color: 'var(--admin-text-muted)', fontSize: '11px', marginLeft: '8px' }}>({item.category})</span>
                    </div>
                    <span style={{
                      fontSize: '11px', fontWeight: '700',
                      color: item.quantity > 0 ? 'var(--admin-success)' : 'var(--admin-danger)',
                      padding: '2px 8px', borderRadius: '6px', backgroundColor: item.quantity > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'
                    }}>
                      {item.quantity} in stock
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Quantity Required</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantityRequested}
                  onChange={e => setFormData({ ...formData, quantityRequested: parseInt(e.target.value) || 1 })}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Assignment / Venue Purpose</label>
              <textarea
                value={formData.reason}
                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                style={{ ...styles.input, minHeight: '70px', resize: 'vertical' }}
                placeholder="e.g. Required for Stage sound setup at Grand Palace hall tomorrow..."
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
              <button
                type="submit"
                disabled={isSubmitting || !formData.itemId}
                className="tactile-press"
                style={{
                  ...styles.submitButton,
                  opacity: formData.itemId ? 1 : 0.5,
                  cursor: formData.itemId ? 'pointer' : 'not-allowed'
                }}
              >
                {isSubmitting ? 'Transmitting Request...' : 'Submit Requisition'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={styles.cancelButton} className="tactile-press">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requisition Cards Grid */}
      <div style={styles.content}>
        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading your gear requisitions...</div>
        ) : requests.length === 0 ? (
          <div className="admin-glass-panel" style={styles.emptyState}>
            <Package size={48} style={{ opacity: 0.25, marginBottom: '16px', color: 'var(--admin-primary)' }} />
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>No active equipment requisitions.</p>
            <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Need microphones, speakers, or lighting? Click "Requisition Gear" above.</span>
          </div>
        ) : (
          <div style={styles.grid}>
            {requests.map(req => (
              <TiltCard3D key={req._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>{getStatusBadge(req.status)}</div>
                  <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                    {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ margin: '14px 0', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--admin-text-main)' }}>
                      {req.itemName}
                    </div>
                    <span style={{
                      fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px',
                      backgroundColor: 'rgba(212,175,55,0.12)', color: 'var(--admin-primary)', border: '1px solid rgba(212,175,55,0.25)'
                    }}>
                      x{req.quantityRequested} UNITS
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', margin: 0, lineHeight: '1.5' }}>
                    {req.reason || 'No assignment details specified'}
                  </p>
                </div>

                {req.adminReply && (
                  <div style={{
                    marginTop: '12px', padding: '12px', backgroundColor: 'rgba(212, 175, 55, 0.06)',
                    borderRadius: '10px', borderLeft: '3px solid var(--admin-primary)', borderTop: '1px solid rgba(212,175,55,0.15)',
                    borderRight: '1px solid rgba(212,175,55,0.15)', borderBottom: '1px solid rgba(212,175,55,0.15)'
                  }}>
                    <div style={{ fontSize: '11px', color: 'var(--admin-primary)', marginBottom: '3px', fontWeight: '800', letterSpacing: '0.4px' }}>
                      ADMIN INSTRUCTION:
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--admin-text-main)', lineHeight: '1.4' }}>
                      {req.adminReply}
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
    flex: 1
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
    backgroundColor: 'var(--admin-primary)',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '13px'
  },
  cancelButton: {
    padding: '11px 22px',
    backgroundColor: 'transparent',
    color: 'var(--admin-text-main)',
    border: '1px solid var(--admin-border)',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
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

export default WorkerInventory;

