import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, X, Search, Filter, Box, Users, Truck, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const PackageManager = () => {
  const [packages, setPackages] = useState([]);
  const [services, setServices] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    staffCount: 0,
    services: [],
    vendors: [],
    inventoryItems: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pkgRes, srvRes, invRes, vndRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/packages`),
        fetch(`${API_BASE_URL}/api/services`),
        fetch(`${API_BASE_URL}/api/inventory`),
        fetch(`${API_BASE_URL}/api/vendors`)
      ]);
      const [pkgData, srvData, invData, vndData] = await Promise.all([
        pkgRes.json(), srvRes.json(), invRes.json(), vndRes.json()
      ]);

      if (pkgData.success) setPackages(pkgData.data);
      if (srvData.success) setServices(srvData.data);
      if (invData.success) setInventory(invData.data);
      if (vndData.success) setVendors(vndData.data);
    } catch (err) {
      toast.error('Failed to load package builder data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (e, field) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, [field]: options }));
  };

  const addInventoryItem = () => {
    setFormData(prev => ({
      ...prev,
      inventoryItems: [...prev.inventoryItems, { item: '', quantity: 1 }]
    }));
  };

  const updateInventoryItem = (index, field, value) => {
    const newItems = [...formData.inventoryItems];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, inventoryItems: newItems }));
  };

  const removeInventoryItem = (index) => {
    const newItems = formData.inventoryItems.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, inventoryItems: newItems }));
  };

  const openModal = (pkg = null) => {
    if (pkg) {
      setEditingId(pkg._id);
      setFormData({
        name: pkg.name,
        description: pkg.description,
        price: pkg.price,
        staffCount: pkg.staffCount,
        services: pkg.services.map(s => s._id),
        vendors: pkg.vendors.map(v => v._id),
        inventoryItems: pkg.inventoryItems.map(i => ({ item: i.item ? i.item._id : '', quantity: i.quantity }))
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', description: '', price: 0, staffCount: 0, services: [], vendors: [], inventoryItems: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingId
        ? `${API_BASE_URL}/api/packages/${editingId}`
        : `${API_BASE_URL}/api/packages`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        toast.success(editingId ? 'Package updated' : 'Package created');
        fetchData(); // reload
        setIsModalOpen(false);
      } else {
        toast.error(data.error || 'Failed to save');
      }
    } catch (err) {
      toast.error('Server error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this package?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/packages/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPackages(packages.filter(p => p._id !== id));
        toast.success('Package deleted');
      }
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--admin-border)',
    borderRadius: '8px', color: 'var(--admin-text-main)', fontSize: '14px', outline: 'none'
  };

  const labelStyle = { display: 'block', margin: '0 0 6px 4px', fontSize: '13px', color: 'var(--admin-text-muted)' };

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>Packages Builder</h1>
          <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>Bundle services, inventory, and staff for quick bookings.</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
          backgroundColor: 'var(--admin-primary)', color: '#000', border: 'none',
          borderRadius: '12px', fontWeight: '600', cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)'
        }} onClick={() => openModal()}>
          <Plus size={18} /> Build New Package
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>Loading packages...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {packages.map(pkg => (
            <div key={pkg._id} style={{
              backgroundColor: 'var(--admin-bg-panel)', border: '1px solid var(--admin-border)',
              borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600', color: 'var(--admin-primary)' }}>{pkg.name}</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--admin-text-muted)' }}>{pkg.description}</p>
                </div>
                <div style={{ fontWeight: '700', fontSize: '18px' }}>Rs. {pkg.price}</div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#ccc' }}>
                  <Briefcase size={14} color="var(--admin-primary)" /> {pkg.services.length} Services
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#ccc' }}>
                  <Box size={14} color="var(--admin-primary)" /> {pkg.inventoryItems.length} Items
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#ccc' }}>
                  <Truck size={14} color="var(--admin-primary)" /> {pkg.vendors.length} Vendors
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#ccc' }}>
                  <Users size={14} color="var(--admin-primary)" /> {pkg.staffCount} Staff
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--admin-border)', paddingTop: '16px' }}>
                <button
                  onClick={() => openModal(pkg)}
                  style={{ flex: 1, padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', color: 'var(--admin-text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg._id)}
                  style={{ flex: 1, padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '8px', color: 'var(--admin-danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--admin-bg-panel)', border: '1px solid var(--admin-border)',
            borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column', boxShadow: '0 24px 48px rgba(0,0,0,0.5)'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>{editingId ? 'Edit Package' : 'Build Package'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Basic Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Package Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} style={inputStyle} placeholder="e.g. Premium Wedding" />
                </div>
                <div>
                  <label style={labelStyle}>Base Price (Rs)</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleInputChange} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ ...inputStyle, height: '80px', resize: 'vertical' }} placeholder="What does this package include?" />
              </div>

              {/* Resource Allocation */}
              <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '20px', marginTop: '10px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--admin-primary)' }}>Resource Allocation</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {/* Services Multi-Select */}
                  <div>
                    <label style={labelStyle}>Included Services</label>
                    <select multiple name="services" value={formData.services} onChange={(e) => handleMultiSelect(e, 'services')} style={{ ...inputStyle, height: '120px' }}>
                      {services.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
                    </select>
                    <small style={{ color: 'var(--admin-text-muted)', fontSize: '11px' }}>Hold Ctrl/Cmd to select multiple</small>
                  </div>

                  {/* Vendors Multi-Select */}
                  <div>
                    <label style={labelStyle}>Assigned Vendors</label>
                    <select multiple name="vendors" value={formData.vendors} onChange={(e) => handleMultiSelect(e, 'vendors')} style={{ ...inputStyle, height: '120px' }}>
                      {vendors.map(v => <option key={v._id} value={v._id}>{v.name} ({v.category})</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Inventory & Staff */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', borderTop: '1px solid var(--admin-border)', paddingTop: '20px' }}>

                {/* Inventory Builder */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={labelStyle}>Inventory Requirements</label>
                    <button type="button" onClick={addInventoryItem} style={{ background: 'none', border: '1px solid var(--admin-primary)', color: 'var(--admin-primary)', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}>+ Add Item</button>
                  </div>

                  {formData.inventoryItems.length === 0 && (
                    <div style={{ padding: '16px', textAlign: 'center', border: '1px dashed var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                      No inventory allocated.
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {formData.inventoryItems.map((inv, index) => (
                      <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <select
                          value={inv.item}
                          onChange={(e) => updateInventoryItem(index, 'item', e.target.value)}
                          style={{ ...inputStyle, flex: 1 }}
                          required
                        >
                          <option value="">Select Item...</option>
                          {inventory.map(i => <option key={i._id} value={i._id}>{i.name} ({i.quantity} available)</option>)}
                        </select>
                        <input
                          type="number"
                          min="1"
                          value={inv.quantity}
                          onChange={(e) => updateInventoryItem(index, 'quantity', e.target.value)}
                          style={{ ...inputStyle, width: '80px' }}
                        />
                        <button type="button" onClick={() => removeInventoryItem(index)} style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', padding: '8px' }}>
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Staffing */}
                <div>
                  <label style={labelStyle}>Staff Members Required</label>
                  <input type="number" min="0" name="staffCount" value={formData.staffCount} onChange={handleInputChange} style={{ ...inputStyle, fontSize: '24px', padding: '16px' }} />
                </div>

              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', borderTop: '1px solid var(--admin-border)', paddingTop: '24px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-main)', cursor: 'pointer', fontWeight: '500' }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} style={{ padding: '10px 24px', backgroundColor: 'var(--admin-primary)', border: 'none', borderRadius: '8px', color: '#000', cursor: 'pointer', fontWeight: '600' }}>
                  {isSubmitting ? 'Saving...' : 'Save Package'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageManager;
