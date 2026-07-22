import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Plus, AlertTriangle, Box, Check, X, Edit2, Trash2, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const InventoryManager = () => {
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItem, setNewItem] = useState({
    itemId: '',
    name: '',
    category: '',
    quantity: 0,
    status: 'In Stock'
  });

  useEffect(() => {
    fetchInventory();
    fetchRequests();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch('http://https://event-management-kvfo.onrender.com/api/inventory');
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (err) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://https://event-management-kvfo.onrender.com/api/inventory-requests');
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (err) {
      toast.error('Failed to load inventory requests');
    }
  };

  const handleRequestAction = async (id, status) => {
    try {
      const res = await fetch(`http://https://event-management-kvfo.onrender.com/api/inventory-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Request ${status.toLowerCase()}`);
        setRequests(requests.map(r => r._id === id ? { ...r, status } : r));
        if (status === 'Approved' || status === 'Returned') {
          fetchInventory(); // update stock
        }
      } else {
        toast.error(data.error || 'Failed to update request');
      }
    } catch (err) {
      toast.error('Failed to update request');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingItemId
        ? `http://https://event-management-kvfo.onrender.com/api/inventory/${editingItemId}`
        : 'http://https://event-management-kvfo.onrender.com/api/inventory';
      const method = editingItemId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      const data = await res.json();
      if (data.success) {
        if (editingItemId) {
          setItems(items.map(item => item._id === editingItemId ? data.data : item));
          toast.success('Item updated successfully');
        } else {
          setItems([data.data, ...items]);
          toast.success('Item added successfully');
        }
        closeModal();
      } else {
        toast.error(data.message || 'Failed to save item');
      }
    } catch (err) {
      toast.error('Failed to save item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItemId(null);
    setNewItem({ itemId: '', name: '', category: '', quantity: 0, status: 'In Stock' });
  };

  const openEditModal = (item) => {
    setNewItem({
      itemId: item.itemId || '',
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      status: item.status
    });
    setEditingItemId(item._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`http://https://event-management-kvfo.onrender.com/api/inventory/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setItems(items.filter(item => item._id !== id));
        toast.success('Item deleted');
      } else {
        toast.error('Failed to delete item');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'var(--admin-success)';
      case 'Low Stock': return 'var(--admin-warning)';
      case 'Out of Stock': return 'var(--admin-danger)';
      default: return 'var(--admin-text-muted)';
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Item Name', 'Category', 'Quantity', 'Status'];
    const rows = items.map(item => [
      item.itemId || '',
      `"${item.name || ''}"`,
      `"${item.category || ''}"`,
      item.quantity || 0,
      item.status || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'BPS_Inventory.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>Inventory & Equipment</h1>
          <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>Track props, electronics, and physical assets.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '4px' }}>
            <button
              onClick={() => setActiveTab('inventory')}
              style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', backgroundColor: activeTab === 'inventory' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'inventory' ? 'var(--admin-primary)' : 'var(--admin-text-muted)' }}
            >
              Catalog
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', backgroundColor: activeTab === 'requests' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'requests' ? 'var(--admin-primary)' : 'var(--admin-text-muted)', display: 'flex', alignItems: 'center' }}
            >
              Requests
              {requests.filter(r => r.status === 'Pending').length > 0 && (
                <span style={{ marginLeft: '6px', padding: '2px 6px', backgroundColor: 'var(--admin-danger)', color: 'white', borderRadius: '10px', fontSize: '10px' }}>
                  {requests.filter(r => r.status === 'Pending').length}
                </span>
              )}
            </button>
          </div>
          {activeTab === 'inventory' && (
            <>
              <button style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
                backgroundColor: 'transparent', color: 'var(--admin-primary)', border: '1px solid var(--admin-primary)',
                borderRadius: '12px', fontWeight: '600', cursor: 'pointer'
              }} onClick={exportToCSV}>
                <Download size={18} /> Export CSV
              </button>
              <button style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
                backgroundColor: 'var(--admin-primary)', color: '#000', border: 'none',
                borderRadius: '12px', fontWeight: '600', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)'
              }} onClick={() => setIsModalOpen(true)}>
                <Plus size={18} /> Add Item
              </button>
            </>
          )}
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--admin-border)',
          borderRadius: '16px', overflow: 'hidden'
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Equipment Catalog</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--admin-text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '8px 12px 8px 36px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--admin-border)',
                    borderRadius: '8px', color: 'var(--admin-text-main)', fontSize: '14px', outline: 'none'
                  }}
                />
              </div>
              <button style={{
                padding: '8px 12px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--admin-border)',
                borderRadius: '8px', color: 'var(--admin-text-main)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
              }}>
                <Filter size={16} /> Filter
              </button>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(0,0,0,0.2)', textAlign: 'left' }}>
                <th style={{ padding: '16px 24px', color: 'var(--admin-text-muted)', fontWeight: '500', fontSize: '13px' }}>ID</th>
                <th style={{ padding: '16px 24px', color: 'var(--admin-text-muted)', fontWeight: '500', fontSize: '13px' }}>Item Name</th>
                <th style={{ padding: '16px 24px', color: 'var(--admin-text-muted)', fontWeight: '500', fontSize: '13px' }}>Category</th>
                <th style={{ padding: '16px 24px', color: 'var(--admin-text-muted)', fontWeight: '500', fontSize: '13px' }}>Quantity</th>
                <th style={{ padding: '16px 24px', color: 'var(--admin-text-muted)', fontWeight: '500', fontSize: '13px' }}>Status</th>
                <th style={{ padding: '16px 24px', color: 'var(--admin-text-muted)', fontWeight: '500', fontSize: '13px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading inventory...</td></tr>
              ) : items.filter(item =>
                (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.itemId && item.itemId.toLowerCase().includes(searchQuery.toLowerCase()))
              ).length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No inventory found.</td></tr>
              ) : items.filter(item =>
                (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.itemId && item.itemId.toLowerCase().includes(searchQuery.toLowerCase()))
              ).map((item) => (
                <tr key={item._id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                  <td style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--admin-text-muted)' }}>{item.itemId || item._id}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box size={16} color="var(--admin-text-muted)" />
                      </div>
                      {item.name}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--admin-text-muted)' }}>{item.category}</td>
                  <td style={{ padding: '16px 24px', fontWeight: '600' }}>{item.quantity}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px',
                      backgroundColor: `${getStatusColor(item.status)}15`, color: getStatusColor(item.status),
                      borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                    }}>
                      {item.status === 'In Stock' && <Check size={12} />}
                      {item.status !== 'In Stock' && <AlertTriangle size={12} />}
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button onClick={() => openEditModal(item)} style={{
                        background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer', padding: '4px'
                      }} onMouseEnter={e => e.currentTarget.style.color = 'var(--admin-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--admin-text-muted)'}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item._id)} style={{
                        background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer', padding: '4px'
                      }} onMouseEnter={e => e.currentTarget.style.color = 'var(--admin-danger)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--admin-text-muted)'}>
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

      {activeTab === 'requests' && (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--admin-border)',
          borderRadius: '16px', overflow: 'hidden'
        }}>
          {requests.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              <p>No equipment requests found.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(0,0,0,0.2)', textAlign: 'left' }}>
                  <th style={{ padding: '16px 24px', color: 'var(--admin-text-muted)', fontWeight: '500', fontSize: '13px' }}>Worker</th>
                  <th style={{ padding: '16px 24px', color: 'var(--admin-text-muted)', fontWeight: '500', fontSize: '13px' }}>Item (Qty)</th>
                  <th style={{ padding: '16px 24px', color: 'var(--admin-text-muted)', fontWeight: '500', fontSize: '13px' }}>Reason</th>
                  <th style={{ padding: '16px 24px', color: 'var(--admin-text-muted)', fontWeight: '500', fontSize: '13px' }}>Status</th>
                  <th style={{ padding: '16px 24px', color: 'var(--admin-text-muted)', fontWeight: '500', fontSize: '13px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                    <td style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--admin-text-main)' }}>{req.staffName}</td>
                    <td style={{ padding: '16px 24px' }}>
                      {req.itemName} <span style={{ color: 'var(--admin-primary)' }}>(x{req.quantityRequested})</span>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--admin-text-muted)', maxWidth: '200px' }}>{req.reason || '-'}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                        backgroundColor: req.status === 'Approved' || req.status === 'Returned' ? 'rgba(16, 185, 129, 0.1)' : req.status === 'Rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: req.status === 'Approved' || req.status === 'Returned' ? 'var(--admin-success)' : req.status === 'Rejected' ? 'var(--admin-danger)' : '#f59e0b'
                      }}>
                        {req.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      {req.status === 'Pending' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button onClick={() => handleRequestAction(req._id, 'Approved')} style={{ background: 'rgba(16, 185, 129, 0.1)', border: 'none', color: 'var(--admin-success)', cursor: 'pointer', padding: '6px', borderRadius: '6px' }} title="Approve">
                            <Check size={16} />
                          </button>
                          <button onClick={() => handleRequestAction(req._id, 'Rejected')} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', padding: '6px', borderRadius: '6px' }} title="Reject">
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      {req.status === 'Approved' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button onClick={() => handleRequestAction(req._id, 'Returned')} style={{ background: 'rgba(212, 175, 55, 0.1)', border: 'none', color: 'var(--admin-primary)', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                            Mark Returned
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#1E1E1E', border: '1px solid var(--admin-border)',
            borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '500px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
                {editingItemId ? 'Edit Inventory Item' : 'Add New Inventory Item'}
              </h2>
              <button onClick={closeModal} style={{
                background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer'
              }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--admin-text-muted)', fontSize: '14px' }}>Item ID</label>
                <input
                  type="text"
                  required
                  value={newItem.itemId}
                  onChange={(e) => setNewItem({ ...newItem, itemId: e.target.value })}
                  style={{
                    width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-main)', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--admin-text-muted)', fontSize: '14px' }}>Item Name</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  style={{
                    width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-main)', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--admin-text-muted)', fontSize: '14px' }}>Category</label>
                <input
                  type="text"
                  required
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  style={{
                    width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-main)', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--admin-text-muted)', fontSize: '14px' }}>Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                    style={{
                      width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-main)', boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--admin-text-muted)', fontSize: '14px' }}>Status</label>
                  <select
                    value={newItem.status}
                    onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                    style={{
                      width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-main)', boxSizing: 'border-box'
                    }}
                  >
                    <option style={{ color: '#000' }} value="In Stock">In Stock</option>
                    <option style={{ color: '#000' }} value="Low Stock">Low Stock</option>
                    <option style={{ color: '#000' }} value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={closeModal} style={{
                  flex: 1, padding: '12px', backgroundColor: 'transparent', border: '1px solid var(--admin-border)',
                  borderRadius: '8px', color: 'var(--admin-text-main)', fontWeight: '600', cursor: 'pointer'
                }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} style={{
                  flex: 1, padding: '12px', backgroundColor: 'var(--admin-primary)', border: 'none',
                  borderRadius: '8px', color: '#000', fontWeight: '600', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1
                }}>
                  {isSubmitting ? 'Saving...' : (editingItemId ? 'Save Changes' : 'Add Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
