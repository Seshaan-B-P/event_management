import React, { useState, useEffect } from 'react';
import { Truck, Search, Filter, Plus, Phone, Mail, MapPin, Star, X, Trash2, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const VendorManager = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newVendor, setNewVendor] = useState({
    name: '',
    category: '',
    phone: '',
    location: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/vendors');
        const data = await res.json();
        if (data.success) {
          setVendors(data.data);
        }
      } catch (err) {
        toast.error('Failed to load vendors');
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const handleAddVendor = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newVendor)
      });
      const data = await res.json();
      if (data.success) {
        setVendors([data.data, ...vendors]);
        setIsModalOpen(false);
        setNewVendor({ name: '', category: '', phone: '', location: '', rating: 5 });
        toast.success('Vendor added successfully');
      } else {
        toast.error(data.message || 'Failed to add vendor');
      }
    } catch (err) {
      toast.error('Failed to add vendor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVendor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/vendors/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setVendors(vendors.filter(v => v._id !== id));
        toast.success('Vendor deleted');
      } else {
        toast.error('Failed to delete vendor');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const exportToCSV = () => {
    const headers = ['Vendor Name', 'Category', 'Phone', 'Location', 'Rating'];
    const rows = vendors.map(vendor => [
      `"${vendor.name || ''}"`,
      `"${vendor.category || ''}"`,
      `"${vendor.phone || ''}"`,
      `"${vendor.location || ''}"`,
      vendor.rating || 0
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'BPS_Vendors.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>Vendor Management</h1>
          <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>Manage external partners, caterers, and decorators.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
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
            <Plus size={18} /> Add Vendor
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--admin-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search vendors by name or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px 12px 48px', backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--admin-border)', borderRadius: '12px', color: 'var(--admin-text-main)',
              fontSize: '15px', outline: 'none'
            }}
          />
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px',
          backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--admin-border)',
          borderRadius: '12px', color: 'var(--admin-text-main)', cursor: 'pointer', fontWeight: '500'
        }}>
          <Filter size={18} /> Category Filter
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {loading ? (
          <div style={{ color: 'var(--admin-text-muted)', padding: '24px' }}>Loading vendors...</div>
        ) : vendors.filter(v => (v.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (v.category || '').toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
          <div style={{ color: 'var(--admin-text-muted)', padding: '24px' }}>No vendors found.</div>
        ) : vendors.filter(v => (v.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (v.category || '').toLowerCase().includes(searchQuery.toLowerCase())).map(vendor => (
          <div key={vendor._id} style={{
            backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--admin-border)',
            borderRadius: '16px', padding: '24px', transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-primary)'
                }}>
                  <Truck size={24} />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600' }}>{vendor.name}</h3>
                  <span style={{ 
                    fontSize: '12px', padding: '2px 8px', borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--admin-text-muted)'
                  }}>
                    {vendor.category}
                  </span>
                </div>
              </div>
              <button onClick={() => handleDeleteVendor(vendor._id)} style={{
                background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer',
                padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--admin-danger)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--admin-text-muted)'}
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--admin-text-muted)', fontSize: '14px' }}>
                <Star size={16} color="var(--admin-primary)" /> {vendor.rating} / 5.0
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--admin-text-muted)', fontSize: '14px' }}>
                <Phone size={16} /> {vendor.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--admin-text-muted)', fontSize: '14px' }}>
                <MapPin size={16} /> {vendor.location}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={() => setSelectedVendor(vendor)}
                style={{
                flex: 1, padding: '10px 0', backgroundColor: 'transparent', border: '1px solid var(--admin-primary)',
                borderRadius: '8px', color: 'var(--admin-primary)', fontWeight: '500', cursor: 'pointer'
              }}>
                View Profile
              </button>
              <button 
                onClick={() => window.location.href = `tel:${vendor.phone}`}
                style={{
                flex: 1, padding: '10px 0', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border)',
                borderRadius: '8px', color: 'var(--admin-text-main)', fontWeight: '500', cursor: 'pointer'
              }}>
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>

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
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Add New Vendor</h2>
              <button onClick={() => setIsModalOpen(false)} style={{
                background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer'
              }}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddVendor} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--admin-text-muted)', fontSize: '14px' }}>Vendor Name</label>
                <input
                  type="text"
                  required
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                  style={{
                    width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-main)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--admin-text-muted)', fontSize: '14px' }}>Category</label>
                <input
                  type="text"
                  required
                  value={newVendor.category}
                  onChange={(e) => setNewVendor({...newVendor, category: e.target.value})}
                  style={{
                    width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-main)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--admin-text-muted)', fontSize: '14px' }}>Phone Number</label>
                <input
                  type="text"
                  required
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                  style={{
                    width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-main)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--admin-text-muted)', fontSize: '14px' }}>Location</label>
                <input
                  type="text"
                  required
                  value={newVendor.location}
                  onChange={(e) => setNewVendor({...newVendor, location: e.target.value})}
                  style={{
                    width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-main)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{
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
                  {isSubmitting ? 'Adding...' : 'Add Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedVendor && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#1E1E1E', border: '1px solid var(--admin-border)',
            borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-primary)'
                }}>
                  <Truck size={28} />
                </div>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 6px 0', color: 'var(--admin-text-main)' }}>
                    {selectedVendor.name}
                  </h2>
                  <span style={{ 
                    fontSize: '12px', padding: '4px 10px', borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--admin-text-muted)'
                  }}>
                    {selectedVendor.category}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedVendor(null)} style={{
                background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer'
              }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--admin-text-main)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={20} color="var(--admin-primary)" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-muted)', marginBottom: '4px' }}>Rating</p>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '500' }}>{selectedVendor.rating} / 5.0</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--admin-text-main)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={20} color="var(--admin-primary)" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-muted)', marginBottom: '4px' }}>Phone Number</p>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '500' }}>{selectedVendor.phone}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--admin-text-main)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} color="var(--admin-primary)" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-muted)', marginBottom: '4px' }}>Location</p>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '500' }}>{selectedVendor.location}</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button onClick={() => setSelectedVendor(null)} style={{
                flex: 1, padding: '12px', backgroundColor: 'transparent', border: '1px solid var(--admin-border)',
                borderRadius: '8px', color: 'var(--admin-text-main)', fontWeight: '600', cursor: 'pointer'
              }}>
                Close
              </button>
              <button onClick={() => window.location.href = `tel:${selectedVendor.phone}`} style={{
                flex: 1, padding: '12px', backgroundColor: 'var(--admin-primary)', border: 'none',
                borderRadius: '8px', color: '#000', fontWeight: '600', cursor: 'pointer'
              }}>
                Call Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManager;
