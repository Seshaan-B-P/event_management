import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail, Phone, Calendar, Clock, Edit3, Check, ChevronRight, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const CRMManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);

  const [editForm, setEditForm] = useState({ status: '', adminNotes: '', eventDate: '', totalAmount: 0, paidAmount: 0, paymentStatus: 'Unpaid' });

  const [newBooking, setNewBooking] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: 'Manual Booking by Admin',
    eventDate: '',
    status: 'Pending',
    totalAmount: 0,
    paidAmount: 0,
    paymentStatus: 'Unpaid'
  });

  const CONTACT_API = `${API_BASE_URL}/api/contacts`;

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONTACT_API);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      toast.error('Failed to load inquiries', {
        style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-danger)', border: '1px solid var(--admin-danger)' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.firstName.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || msg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExpand = (msg) => {
    if (expandedId === msg._id) {
      setExpandedId(null);
    } else {
      setExpandedId(msg._id);
      const formattedDate = msg.eventDate ? new Date(msg.eventDate).toISOString().split('T')[0] : '';
      setEditForm({
        status: msg.status || 'Pending',
        adminNotes: msg.adminNotes || '',
        eventDate: formattedDate,
        totalAmount: msg.totalAmount || 0,
        paidAmount: msg.paidAmount || 0,
        paymentStatus: msg.paymentStatus || 'Unpaid'
      });
    }
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`${CONTACT_API}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Inquiry updated successfully', {
          style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-success)', border: '1px solid var(--admin-success)' }
        });
        setMessages(messages.map(m => m._id === id ? data.data : m));
        setExpandedId(null);
      } else {
        toast.error(data.error || 'Failed to update');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const handleAddBooking = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch(CONTACT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Booking added successfully', {
          style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-success)', border: '1px solid var(--admin-success)' }
        });
        setMessages([data.data, ...messages]);
        setShowAddForm(false);
        setNewBooking({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: 'Manual Booking by Admin',
          eventDate: '',
          status: 'Pending',
          totalAmount: 0,
          paidAmount: 0,
          paymentStatus: 'Unpaid'
        });
      } else {
        toast.error(data.error || 'Failed to add booking');
      }
    } catch (err) {
      toast.error('Server error');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>CRM & Leads</h2>
          <p style={styles.subtitle}>Manage client inquiries and bookings</p>
        </div>

        <div style={styles.controls}>
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={18} />
            {showAddForm ? 'Cancel' : 'Add Booking'}
          </button>

          <div style={styles.searchBox}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="admin-input"
              style={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={styles.filterBox}>
            <Filter size={18} style={styles.filterIcon} />
            <select
              className="admin-input"
              style={styles.select}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Contacted">Contacted</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {showAddForm && (
        <form className="admin-glass-panel admin-animate-fade" style={styles.addForm} onSubmit={handleAddBooking}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--admin-text-main)', fontSize: '18px' }}>Add Manual Booking</h3>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>First Name</label>
              <input
                className="admin-input"
                required
                value={newBooking.firstName}
                onChange={e => setNewBooking({ ...newBooking, firstName: e.target.value })}
              />
            </div>
            <div>
              <label style={styles.label}>Last Name</label>
              <input
                className="admin-input"
                required
                value={newBooking.lastName}
                onChange={e => setNewBooking({ ...newBooking, lastName: e.target.value })}
              />
            </div>
            <div>
              <label style={styles.label}>Email</label>
              <input
                className="admin-input"
                type="email"
                required
                value={newBooking.email}
                onChange={e => setNewBooking({ ...newBooking, email: e.target.value })}
              />
            </div>
            <div>
              <label style={styles.label}>Phone</label>
              <input
                className="admin-input"
                required
                value={newBooking.phone}
                onChange={e => setNewBooking({ ...newBooking, phone: e.target.value })}
              />
            </div>
            <div>
              <label style={styles.label}>Event Date</label>
              <input
                type="date"
                className="admin-input"
                value={newBooking.eventDate}
                onChange={e => setNewBooking({ ...newBooking, eventDate: e.target.value })}
              />
            </div>
            <div>
              <label style={styles.label}>Initial Status</label>
              <select
                className="admin-input"
                value={newBooking.status}
                onChange={e => setNewBooking({ ...newBooking, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Contacted">Contacted</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Total Amount (₹)</label>
              <input
                type="number"
                className="admin-input"
                value={newBooking.totalAmount}
                onChange={e => setNewBooking({ ...newBooking, totalAmount: Number(e.target.value) })}
              />
            </div>
            <div>
              <label style={styles.label}>Paid Amount (₹)</label>
              <input
                type="number"
                className="admin-input"
                value={newBooking.paidAmount}
                onChange={e => setNewBooking({ ...newBooking, paidAmount: Number(e.target.value) })}
              />
            </div>
            <div>
              <label style={styles.label}>Payment Status</label>
              <select
                className="admin-input"
                value={newBooking.paymentStatus}
                onChange={e => setNewBooking({ ...newBooking, paymentStatus: e.target.value })}
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.label}>Client Message / Notes</label>
              <textarea
                className="admin-input"
                value={newBooking.message}
                onChange={e => setNewBooking({ ...newBooking, message: e.target.value })}
                style={{ minHeight: '80px', resize: 'vertical' }}
              />
            </div>
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" style={styles.submitButton} disabled={adding}>
            {adding ? 'Adding...' : 'Create Booking'}
          </button>
        </form>
      )}

      <div className="admin-glass-panel" style={styles.tableContainer}>
        {loading ? (
          <div style={styles.emptyState}>Loading inquiries...</div>
        ) : filteredMessages.length === 0 ? (
          <div style={styles.emptyState}>No inquiries found matching your filters.</div>
        ) : (
          <div className="admin-scroll" style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>Client</th>
                  <th style={styles.th}>Contact Info</th>
                  <th style={styles.th}>Event Date</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((msg) => (
                  <React.Fragment key={msg._id}>
                    <tr style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.clientName}>{msg.firstName} {msg.lastName}</div>
                        <div style={styles.clientMessage}>{msg.message.substring(0, 50)}...</div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.contactInfo}>
                          <Mail size={14} style={{ color: 'var(--admin-text-muted)' }} /> {msg.email}
                        </div>
                        <div style={styles.contactInfo}>
                          <Phone size={14} style={{ color: 'var(--admin-text-muted)' }} /> {msg.phone}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.dateInfo}>
                          <Calendar size={14} style={{ color: 'var(--admin-text-muted)' }} /> {msg.eventDate ? new Date(msg.eventDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.statusBadge(msg.status)}>{msg.status}</span>
                      </td>
                      <td style={styles.td}>
                        <button style={styles.actionButton} onClick={() => handleExpand(msg)}>
                          <ChevronRight size={18} style={{ transform: expandedId === msg._id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', color: 'var(--admin-primary)' }} />
                        </button>
                      </td>
                    </tr>
                    {expandedId === msg._id && (
                      <tr style={styles.expandedRow}>
                        <td colSpan="5" style={styles.expandedTd}>
                          <div className="admin-glass-panel" style={styles.expandedContent}>
                            <div style={styles.detailsCol}>
                              <h4 style={{ color: 'var(--admin-primary)', margin: '0 0 12px 0' }}>Full Message</h4>
                              <p style={styles.fullMessage}>{msg.message}</p>
                            </div>
                            <div style={styles.financeCol}>
                              <h4 style={{ color: 'var(--admin-primary)', margin: '0 0 12px 0' }}>Invoicing & Payments</h4>

                              <label style={styles.label}>Total Amount (₹)</label>
                              <input
                                type="number"
                                className="admin-input"
                                value={editForm.totalAmount}
                                onChange={(e) => setEditForm({ ...editForm, totalAmount: Number(e.target.value) })}
                              />

                              <label style={styles.label}>Paid Amount (₹)</label>
                              <input
                                type="number"
                                className="admin-input"
                                value={editForm.paidAmount}
                                onChange={(e) => setEditForm({ ...editForm, paidAmount: Number(e.target.value) })}
                              />

                              <label style={styles.label}>Payment Status</label>
                              <select
                                className="admin-input"
                                value={editForm.paymentStatus}
                                onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value })}
                              >
                                <option value="Unpaid">Unpaid</option>
                                <option value="Partial">Partial</option>
                                <option value="Paid">Paid</option>
                              </select>
                            </div>
                            <div style={styles.editCol}>
                              <h4 style={{ color: 'var(--admin-primary)', margin: '0 0 12px 0' }}>Manage Inquiry</h4>
                              <label style={styles.label}>Update Status</label>
                              <select
                                className="admin-input"
                                value={editForm.status}
                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Completed">Completed</option>
                              </select>

                              <label style={styles.label}>Event Date</label>
                              <input
                                type="date"
                                className="admin-input"
                                value={editForm.eventDate}
                                onChange={(e) => setEditForm({ ...editForm, eventDate: e.target.value })}
                              />

                              <label style={styles.label}>Admin Notes</label>
                              <textarea
                                className="admin-input"
                                style={{ minHeight: '80px', resize: 'vertical' }}
                                value={editForm.adminNotes}
                                onChange={(e) => setEditForm({ ...editForm, adminNotes: e.target.value })}
                                placeholder="Add private notes about this client..."
                              />
                              <div style={styles.buttonGroup}>
                                <button className="admin-btn admin-btn-primary" onClick={() => handleSave(msg._id)}>Save Changes</button>
                                <button className="admin-btn admin-btn-secondary" onClick={() => setExpandedId(null)}>Cancel</button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
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
    gap: '24px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--admin-text-main)',
    margin: 0
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--admin-text-muted)',
    marginTop: '4px'
  },
  controls: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  searchBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--admin-text-muted)',
    zIndex: 1
  },
  searchInput: {
    paddingLeft: '36px',
    width: '250px'
  },
  filterBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  filterIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--admin-text-muted)',
    zIndex: 1
  },
  select: {
    paddingLeft: '36px',
    width: '180px',
    cursor: 'pointer'
  },
  addForm: {
    padding: '32px',
    marginBottom: '8px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  submitButton: {
    marginTop: '24px'
  },
  tableContainer: {
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  thRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderBottom: '1px solid var(--admin-border)'
  },
  th: {
    padding: '16px 24px',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--admin-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'background-color 0.2s',
    backgroundColor: 'transparent'
  },
  td: {
    padding: '16px 24px',
    verticalAlign: 'middle'
  },
  clientName: {
    fontWeight: '600',
    color: 'var(--admin-text-main)',
    marginBottom: '4px',
    fontSize: '15px'
  },
  clientMessage: {
    fontSize: '13px',
    color: 'var(--admin-text-muted)'
  },
  contactInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: 'var(--admin-text-main)',
    marginBottom: '4px'
  },
  dateInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: 'var(--admin-text-main)'
  },
  statusBadge: (status) => {
    let bg = 'rgba(255, 255, 255, 0.1)';
    let color = 'var(--admin-text-muted)';
    let border = 'transparent';

    if (status === 'Pending') {
      bg = 'rgba(212, 175, 55, 0.1)';
      color = 'var(--admin-primary)';
      border = 'rgba(212, 175, 55, 0.3)';
    } else if (status === 'Contacted') {
      bg = 'rgba(59, 130, 246, 0.1)';
      color = '#3b82f6';
      border = 'rgba(59, 130, 246, 0.3)';
    } else if (status === 'Completed') {
      bg = 'rgba(16, 185, 129, 0.1)';
      color = 'var(--admin-success)';
      border = 'rgba(16, 185, 129, 0.3)';
    }

    return {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: bg,
      color: color,
      border: `1px solid ${border}`,
      display: 'inline-block'
    };
  },
  actionButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid transparent',
    color: 'var(--admin-text-main)',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },
  emptyState: {
    padding: '48px',
    textAlign: 'center',
    color: 'var(--admin-text-muted)',
    fontSize: '15px'
  },
  expandedRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderBottom: '1px solid var(--admin-border)'
  },
  expandedTd: {
    padding: '24px'
  },
  expandedContent: {
    display: 'flex',
    gap: '32px',
    padding: '24px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    boxShadow: 'none',
    border: '1px solid var(--admin-border)',
    flexWrap: 'wrap'
  },
  detailsCol: {
    flex: 1,
    minWidth: '250px'
  },
  financeCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: '250px'
  },
  editCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: '250px'
  },
  fullMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid var(--admin-border)',
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'var(--admin-text-main)',
    fontStyle: 'italic'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--admin-text-muted)',
    marginTop: '4px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '12px'
  }
};

export default CRMManager;
