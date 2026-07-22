import React, { useState, useEffect } from 'react';
import { Package, Plus, Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

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
  const staffName = localStorage.getItem('bps_staff_username');

  useEffect(() => {
    if (staffId) {
      fetchRequests();
      fetchInventory();
    }
  }, [staffId]);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`http://https://event-management-kvfo.onrender.com/api/inventory-requests/staff/${staffId}`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (err) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch('http://https://event-management-kvfo.onrender.com/api/inventory');
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
      toast.error('Please select an item and valid quantity');
      return;
    }

    const selectedItem = inventory.find(i => i._id === formData.itemId);
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('http://https://event-management-kvfo.onrender.com/api/inventory-requests', {
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
        toast.success('Equipment request submitted');
        setRequests([data.data, ...requests]);
        setShowForm(false);
        setFormData({ itemId: '', quantityRequested: 1, reason: '' });
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
      case 'Returned': return <CheckCircle size={16} color="var(--admin-primary)" />;
      default: return <Clock size={16} color="var(--admin-warning)" />;
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-animate-fade" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Equipment Requests</h2>
          <p style={styles.subtitle}>Request tools and gear for your tasks</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={styles.addButton}>
            <Plus size={18} /> New Request
          </button>
        )}
      </div>

      {showForm && (
        <div className="admin-glass-panel" style={styles.formCard}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Request Equipment</h3>
          <form onSubmit={handleSubmit} style={styles.form}>

            <div style={styles.formGroup}>
              <label style={styles.label}>Select Item</label>
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--admin-text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search equipment..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ ...styles.input, paddingLeft: '32px', marginBottom: '8px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div className="admin-scroll" style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid var(--admin-border)', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                {filteredInventory.map(item => (
                  <div
                    key={item._id}
                    onClick={() => setFormData({ ...formData, itemId: item._id })}
                    style={{
                      padding: '10px 12px',
                      cursor: 'pointer',
                      backgroundColor: formData.itemId === item._id ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex', justifyContent: 'space-between'
                    }}
                  >
                    <span>{item.name} <small style={{ color: 'var(--admin-text-muted)' }}>({item.category})</small></span>
                    <span style={{ fontSize: '12px', color: item.quantity > 0 ? 'var(--admin-success)' : 'var(--admin-danger)' }}>
                      {item.quantity} available
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Quantity Needed</label>
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
              <label style={styles.label}>Reason / Event Details</label>
              <textarea
                value={formData.reason}
                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                style={{ ...styles.input, minHeight: '60px', resize: 'vertical' }}
                placeholder="Why do you need this equipment?"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" disabled={isSubmitting || !formData.itemId} style={{ ...styles.submitButton, opacity: formData.itemId ? 1 : 0.5 }}>
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
        ) : requests.length === 0 ? (
          <div className="admin-glass-panel" style={styles.emptyState}>
            <Package size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p>You haven't made any equipment requests.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {requests.map(req => (
              <div key={req._id} className="admin-glass-panel" style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getStatusIcon(req.status)}
                    <span style={{ fontWeight: '600' }}>{req.status}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                    {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ margin: '12px 0' }}>
                  <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
                    {req.itemName} (x{req.quantityRequested})
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', margin: 0 }}>
                    {req.reason || 'No reason provided'}
                  </p>
                </div>

                {req.adminReply && (
                  <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'rgba(212, 175, 55, 0.05)', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--admin-primary)', marginBottom: '4px', fontWeight: '600' }}>Admin Reply:</div>
                    <div style={{ fontSize: '13px' }}>{req.adminReply}</div>
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
    flex: 1
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

export default WorkerInventory;
