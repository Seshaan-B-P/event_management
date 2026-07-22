import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Mail, Phone, Users, Check, X, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const StaffManager = () => {
  const [staffList, setStaffList] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('staff');
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    contactNumber: '',
    email: '',
    status: 'Active',
    username: '',
    password: ''
  });

  const API_URL = 'http://https://event-management-kvfo.onrender.com/api/staff';

  useEffect(() => {
    fetchStaff();
    fetchLeaves();
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('http://https://event-management-kvfo.onrender.com/api/reports');
      const data = await res.json();
      if (data.success) {
        setReports(data.data);
      }
    } catch (err) {
      toast.error('Failed to fetch reports');
    }
  };

  const handleMarkReportRead = async (id) => {
    try {
      const res = await fetch(`http://https://event-management-kvfo.onrender.com/api/reports/${id}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Report marked as read');
        setReports(reports.map(r => r._id === id ? { ...r, status: 'Read' } : r));
      }
    } catch (err) {
      toast.error('Failed to update report status');
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await fetch('http://https://event-management-kvfo.onrender.com/api/leaves');
      const data = await res.json();
      if (data.success) {
        setLeaves(data.data);
      }
    } catch (err) {
      toast.error('Failed to fetch leave requests');
    }
  };

  const handleLeaveAction = async (id, status) => {
    try {
      const res = await fetch(`http://https://event-management-kvfo.onrender.com/api/leaves/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Leave request ${status.toLowerCase()}`);
        setLeaves(leaves.map(l => l._id === id ? { ...l, status } : l));
        if (status === 'Approved') fetchStaff(); // Refresh staff status
      }
    } catch (err) {
      toast.error('Failed to update leave request');
    }
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) {
        setStaffList(data.data);
      }
    } catch (err) {
      toast.error('Failed to fetch staff', {
        style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-danger)', border: '1px solid var(--admin-danger)' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (staff) => {
    setEditingId(staff._id);
    setIsAdding(true);
    setFormData({
      name: staff.name,
      role: staff.role,
      contactNumber: staff.contactNumber,
      email: staff.email || '',
      status: staff.status,
      username: staff.username || '',
      password: '' // Don't populate password on edit, let them set a new one if they want
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      name: '',
      role: '',
      contactNumber: '',
      email: '',
      status: 'Active',
      username: '',
      password: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.endsWith('@bpsevent.com')) {
      toast.error('Login Username must end with @bpsevent.com');
      return;
    }

    try {
      let res;
      if (editingId) {
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? 'Staff updated' : 'Staff added', {
          style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-success)', border: '1px solid var(--admin-success)' }
        });
        fetchStaff();
        handleCancel();
      } else {
        toast.error(data.error || 'Failed to save');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Staff removed', {
          style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-text-main)', border: '1px solid var(--admin-border)' }
        });
        fetchStaff();
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--admin-success)' };
      case 'On Leave': return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' };
      case 'Inactive': return { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--admin-danger)' };
      default: return { bg: 'rgba(255, 255, 255, 0.1)', text: 'var(--admin-text-muted)' };
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Team & Staff Directory</h2>
          <p style={styles.subtitle}>Manage your event crew, vendors, and coordinators.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '4px' }}>
            <button
              onClick={() => setActiveTab('staff')}
              style={{ ...styles.tabBtn, backgroundColor: activeTab === 'staff' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'staff' ? 'var(--admin-primary)' : 'var(--admin-text-muted)' }}
            >
              Staff Directory
            </button>
            <button
              onClick={() => setActiveTab('leaves')}
              style={{ ...styles.tabBtn, backgroundColor: activeTab === 'leaves' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'leaves' ? 'var(--admin-primary)' : 'var(--admin-text-muted)' }}
            >
              Leave Requests
              {leaves.filter(l => l.status === 'Pending').length > 0 && (
                <span style={{ marginLeft: '6px', padding: '2px 6px', backgroundColor: 'var(--admin-danger)', color: 'white', borderRadius: '10px', fontSize: '10px' }}>
                  {leaves.filter(l => l.status === 'Pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              style={{ ...styles.tabBtn, backgroundColor: activeTab === 'reports' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'reports' ? 'var(--admin-primary)' : 'var(--admin-text-muted)' }}
            >
              Staff Reports
              {reports.filter(r => r.status === 'Unread').length > 0 && (
                <span style={{ marginLeft: '6px', padding: '2px 6px', backgroundColor: 'var(--admin-danger)', color: 'white', borderRadius: '10px', fontSize: '10px' }}>
                  {reports.filter(r => r.status === 'Unread').length}
                </span>
              )}
            </button>
          </div>
          {activeTab === 'staff' && !isAdding && (
            <button onClick={() => setIsAdding(true)} className="admin-btn admin-btn-primary">
              <Plus size={18} /> Add Staff
            </button>
          )}
        </div>
      </div>

      {activeTab === 'staff' && isAdding && (
        <div className="admin-glass-panel admin-animate-fade" style={styles.formCard}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--admin-text-main)', fontSize: '18px' }}>
            {editingId ? 'Edit Staff Member' : 'Add New Staff'}
          </h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="admin-input" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Role (e.g. Decorator) *</label>
                <input required type="text" name="role" value={formData.role} onChange={handleInputChange} className="admin-input" />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Contact Number *</label>
                <input required type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="admin-input" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="admin-input" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="admin-input">
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Login Username *</label>
                <input required type="text" name="username" value={formData.username} onChange={handleInputChange} className="admin-input" placeholder="e.g. jdoe@bpsevent.com" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>{editingId ? 'New Password (leave blank to keep current)' : 'Password *'}</label>
                <input required={!editingId} type="password" name="password" value={formData.password} onChange={handleInputChange} className="admin-input" placeholder="Secure password" />
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" className="admin-btn admin-btn-primary">{editingId ? 'Update Staff' : 'Save Staff'}</button>
              <button type="button" onClick={handleCancel} className="admin-btn admin-btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'staff' && !isAdding && (
        <div className="admin-glass-panel" style={styles.tableContainer}>
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading staff...</div>
          ) : staffList.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              <Users size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5, color: 'var(--admin-primary)' }} />
              <p>No staff members found.</p>
            </div>
          ) : (
            <div className="admin-scroll" style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Name & Role</th>
                    <th style={styles.th}>Contact Info</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map((staff) => (
                    <tr key={staff._id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.nameWrap}>
                          <div style={styles.avatar}>
                            {staff.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={styles.staffName}>{staff.name}</div>
                            <div style={styles.staffRole}>{staff.role}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.contactInfo}>
                          <Phone size={14} style={{ color: 'var(--admin-text-muted)' }} /> {staff.contactNumber}
                        </div>
                        {staff.email && (
                          <div style={styles.contactInfo}>
                            <Mail size={14} style={{ color: 'var(--admin-text-muted)' }} /> {staff.email}
                          </div>
                        )}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(staff.status).bg,
                          color: getStatusColor(staff.status).text,
                          border: `1px solid ${getStatusColor(staff.status).bg}`
                        }}>
                          {staff.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button onClick={() => handleEdit(staff)} style={styles.iconBtn}>
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(staff._id)} style={{ ...styles.iconBtn, color: 'var(--admin-danger)' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'leaves' && (
        <div className="admin-glass-panel" style={styles.tableContainer}>
          {leaves.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              <p>No leave requests found.</p>
            </div>
          ) : (
            <div className="admin-scroll" style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Staff Member</th>
                    <th style={styles.th}>Dates</th>
                    <th style={styles.th}>Reason</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave._id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={{ fontWeight: '600', color: 'var(--admin-text-main)' }}>{leave.staffName}</div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontSize: '13px' }}>
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', maxWidth: '200px' }}>
                          {leave.reason || '-'}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                          backgroundColor: leave.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : leave.status === 'Rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: leave.status === 'Approved' ? 'var(--admin-success)' : leave.status === 'Rejected' ? 'var(--admin-danger)' : '#f59e0b'
                        }}>
                          {leave.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {leave.status === 'Pending' && (
                          <div style={styles.actions}>
                            <button onClick={() => handleLeaveAction(leave._id, 'Approved')} style={{ ...styles.iconBtn, color: 'var(--admin-success)' }} title="Approve">
                              <Check size={16} />
                            </button>
                            <button onClick={() => handleLeaveAction(leave._id, 'Rejected')} style={{ ...styles.iconBtn, color: 'var(--admin-danger)' }} title="Reject">
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="admin-glass-panel" style={styles.tableContainer}>
          {reports.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              <FileText size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5, color: 'var(--admin-primary)' }} />
              <p>No worker reports found.</p>
            </div>
          ) : (
            <div className="admin-scroll" style={{ overflowX: 'auto', padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reports.map(report => (
                  <div key={report._id} style={{
                    padding: '20px',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontWeight: '600', color: 'var(--admin-text-main)', fontSize: '16px' }}>{report.staffName}</span>
                        <span style={{
                          padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                          backgroundColor: report.reportType === 'Incident' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(212, 175, 55, 0.1)',
                          color: report.reportType === 'Incident' ? 'var(--admin-danger)' : 'var(--admin-primary)'
                        }}>
                          {report.reportType}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                          {new Date(report.createdAt).toLocaleString()}
                        </span>
                        {report.status === 'Unread' ? (
                          <button onClick={() => handleMarkReportRead(report._id)} style={{ ...styles.iconBtn, color: 'var(--admin-primary)', padding: '4px 8px', fontSize: '12px' }}>
                            Mark as Read
                          </button>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--admin-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Check size={14} /> Read
                          </span>
                        )}
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '15px', color: 'var(--admin-text-main)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                      {report.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
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
    alignItems: 'flex-start',
    marginBottom: '8px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--admin-text-main)',
    margin: '0 0 4px 0'
  },
  subtitle: {
    color: 'var(--admin-text-muted)',
    margin: 0
  },
  tabBtn: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center'
  },
  formCard: {
    padding: '24px',
    marginBottom: '8px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
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
    fontWeight: '600',
    color: 'var(--admin-text-muted)'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px'
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
  nameWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    color: 'var(--admin-primary)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '16px',
    boxShadow: '0 0 10px rgba(212, 175, 55, 0.1)'
  },
  staffName: {
    fontWeight: '600',
    color: 'var(--admin-text-main)',
    fontSize: '15px'
  },
  staffRole: {
    fontSize: '13px',
    color: 'var(--admin-primary)'
  },
  contactInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: 'var(--admin-text-main)',
    marginBottom: '4px'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block'
  },
  actions: {
    display: 'flex',
    gap: '8px'
  },
  iconBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid transparent',
    color: 'var(--admin-text-main)',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
  }
};

export default StaffManager;
