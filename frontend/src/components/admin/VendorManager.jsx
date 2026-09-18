import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { Truck, Search, Filter, Plus, Phone, MapPin, Star, X, Trash2, Download, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import TiltCard3D from '../TiltCard3D';

const VendorManager = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [newVendor, setNewVendor] = useState({
    name: '',
    category: 'Catering',
    phone: '',
    location: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/vendors`);
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

  const handleAddVendor = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/vendors`, {
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
        setNewVendor({ name: '', category: 'Catering', phone: '', location: '', rating: 5 });
        toast.success('Vendor partner registered');
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
    if (!window.confirm('Are you sure you want to remove this vendor partner?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/vendors/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setVendors(vendors.filter(v => v._id !== id));
        toast.success('Vendor partner removed');
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
    link.setAttribute('download', 'BPS_Vendors_Roster.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Vendor roster exported');
  };

  // Metrics
  const totalVendors = vendors.length;
  const topRatedCount = vendors.filter(v => Number(v.rating) >= 4.5).length;
  const uniqueCategories = Array.from(new Set(vendors.map(v => v.category).filter(Boolean)));

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = (v.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || v.category?.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ padding: '16px 0' }} className="admin-animate-fade">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>Vendor & Partner Ecosystem</h1>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700',
              padding: '4px 10px', borderRadius: '12px', backgroundColor: 'rgba(212, 175, 55, 0.1)',
              color: 'var(--admin-primary)', border: '1px solid rgba(212, 175, 55, 0.25)'
            }}>
              <Sparkles size={12} /> 3D Network
            </span>
          </div>
          <p style={{ color: 'var(--admin-text-muted)', margin: '4px 0 0 0', fontSize: '14px' }}>
            Manage strategic suppliers, caterers, stage artisans, and production partners.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={exportToCSV}
            className="tactile-press"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
              backgroundColor: 'rgba(255,255,255,0.03)', color: 'var(--admin-primary)', border: '1px solid rgba(212,175,55,0.4)',
              borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '13px'
            }}
          >
            <Download size={16} /> Export CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="tactile-press"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
              backgroundColor: 'var(--admin-primary)', color: '#000', border: 'none',
              borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px',
              boxShadow: '0 4px 16px rgba(212, 175, 55, 0.25)'
            }}
          >
            <Plus size={16} /> Register Partner
          </button>
        </div>
      </div>

      {/* 3D Metrics Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <TiltCard3D style={{ padding: '18px 20px', backgroundColor: 'var(--admin-bg-panel)', borderRadius: '14px', border: '1px solid var(--admin-border)' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--admin-text-muted)', letterSpacing: '0.8px' }}>ACTIVE NETWORK</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--admin-text-main)', marginTop: '4px' }}>{totalVendors}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Contracted vendors</div>
        </TiltCard3D>

        <TiltCard3D style={{ padding: '18px 20px', backgroundColor: 'var(--admin-bg-panel)', borderRadius: '14px', border: '1px solid var(--admin-border)' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--admin-text-muted)', letterSpacing: '0.8px' }}>ELITE TIER (4.5★+)</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--admin-primary)', marginTop: '4px' }}>{topRatedCount}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Top quality rating</div>
        </TiltCard3D>

        <TiltCard3D style={{ padding: '18px 20px', backgroundColor: 'var(--admin-bg-panel)', borderRadius: '14px', border: '1px solid var(--admin-border)' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--admin-text-muted)', letterSpacing: '0.8px' }}>SUPPLY SECTORS</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--admin-success)', marginTop: '4px' }}>{uniqueCategories.length}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Specialty departments</div>
        </TiltCard3D>

        <TiltCard3D style={{ padding: '18px 20px', backgroundColor: 'var(--admin-bg-panel)', borderRadius: '14px', border: '1px solid var(--admin-border)' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--admin-text-muted)', letterSpacing: '0.8px' }}>PARTNER SLA</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--admin-text-main)', marginTop: '4px' }}>100%</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-success)', marginTop: '2px' }}>Verified compliance</div>
        </TiltCard3D>
      </div>

      {/* Search & Category Filter */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--admin-text-muted)' }} />
          <input
            type="text"
            placeholder="Search vendor by brand, specialty, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px 12px 46px', backgroundColor: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--admin-border)', borderRadius: '12px', color: 'var(--admin-text-main)',
              fontSize: '14px', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['ALL', ...uniqueCategories.slice(0, 5)].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="tactile-press"
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: selectedCategory.toUpperCase() === cat.toUpperCase() ? 'var(--admin-primary)' : 'rgba(255,255,255,0.05)',
                color: selectedCategory.toUpperCase() === cat.toUpperCase() ? '#000' : 'var(--admin-text-muted)',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 3D Vendor Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {loading ? (
          <div style={{ color: 'var(--admin-text-muted)', padding: '36px', textAlign: 'center' }}>Loading vendor database...</div>
        ) : filteredVendors.length === 0 ? (
          <div className="admin-glass-panel" style={{ color: 'var(--admin-text-muted)', padding: '48px', textAlign: 'center', gridColumn: '1 / -1' }}>
            No vendors found matching your filter criteria.
          </div>
        ) : filteredVendors.map(vendor => (
          <TiltCard3D key={vendor._id} style={{
            backgroundColor: 'var(--admin-bg-panel)', border: '1px solid var(--admin-border)',
            borderRadius: '16px', padding: '22px', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '12px', backgroundColor: 'rgba(212, 175, 55, 0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-primary)',
                  border: '1px solid rgba(212, 175, 55, 0.25)', boxShadow: '0 0 16px rgba(212, 175, 55, 0.1)'
                }}>
                  <Truck size={22} />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '17px', fontWeight: '700', color: 'var(--admin-text-main)' }}>
                    {vendor.name}
                  </h3>
                  <span style={{
                    fontSize: '11px', padding: '2px 8px', borderRadius: '6px',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)', color: 'var(--admin-primary)',
                    border: '1px solid rgba(212, 175, 55, 0.2)', fontWeight: '600'
                  }}>
                    {vendor.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteVendor(vendor._id)}
                style={{
                  background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer',
                  padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px',
                  transition: 'color 0.2s'
                }}
                className="tactile-press"
                onMouseEnter={e => e.currentTarget.style.color = 'var(--admin-danger)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--admin-text-muted)'}
                title="Remove Vendor"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-main)', fontSize: '13px' }}>
                <Star size={15} color="var(--admin-primary)" fill="var(--admin-primary)" />
                <span style={{ fontWeight: '700' }}>{vendor.rating || 5}.0</span>
                <span style={{ color: 'var(--admin-text-muted)', fontSize: '11px' }}>/ 5.0 Rating</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                <Phone size={14} style={{ color: 'var(--admin-primary)' }} />
                <span>{vendor.phone || 'No phone provided'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                <MapPin size={14} style={{ color: 'var(--admin-primary)' }} />
                <span>{vendor.location || 'HQ City'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={() => setSelectedVendor(vendor)}
                className="tactile-press"
                style={{
                  flex: 1, padding: '9px 0', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--admin-border)',
                  borderRadius: '8px', color: 'var(--admin-text-main)', fontWeight: '600', cursor: 'pointer', fontSize: '12px'
                }}
              >
                Dossier
              </button>
              <button
                onClick={() => window.location.href = `tel:${vendor.phone}`}
                className="tactile-press"
                style={{
                  flex: 1, padding: '9px 0', backgroundColor: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)',
                  borderRadius: '8px', color: 'var(--admin-primary)', fontWeight: '700', cursor: 'pointer', fontSize: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                <Phone size={13} /> Call
              </button>
            </div>
          </TiltCard3D>
        ))}
      </div>

      {/* Modal: Add Vendor */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(8px)'
        }}>
          <div className="admin-glass-panel admin-animate-fade hologram-border" style={{
            padding: '32px', width: '100%', maxWidth: '480px', borderRadius: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '19px', fontWeight: '700', margin: 0, color: 'var(--admin-text-main)' }}>Enroll Partner Vendor</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddVendor} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600' }}>Vendor / Brand Name *</label>
                <input
                  type="text"
                  required
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  placeholder="e.g. Royal Sound & Acoustic"
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600' }}>Category / Specialization *</label>
                <input
                  type="text"
                  required
                  value={newVendor.category}
                  onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
                  placeholder="Catering, Floral, Sound, Lighting, etc."
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600' }}>Direct Phone *</label>
                <input
                  type="text"
                  required
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600' }}>Location / Base City *</label>
                <input
                  type="text"
                  required
                  value={newVendor.location}
                  onChange={(e) => setNewVendor({ ...newVendor, location: e.target.value })}
                  placeholder="Karur, Chennai, Coimbatore"
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600' }}>Initial Quality Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newVendor.rating}
                  onChange={(e) => setNewVendor({ ...newVendor, rating: Number(e.target.value) })}
                  className="admin-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-btn admin-btn-secondary tactile-press" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="admin-btn admin-btn-primary tactile-press" style={{ flex: 1 }}>
                  {isSubmitting ? 'Registering...' : 'Complete Enrollment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Vendor Dossier */}
      {selectedVendor && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(8px)'
        }}>
          <div className="admin-glass-panel admin-animate-fade" style={{
            padding: '32px', width: '100%', maxWidth: '440px', borderRadius: '20px', border: '1px solid rgba(212,175,55,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px', backgroundColor: 'rgba(212, 175, 55, 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-primary)',
                  boxShadow: '0 0 16px rgba(212,175,55,0.2)'
                }}>
                  <Truck size={26} />
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--admin-text-main)' }}>
                    {selectedVendor.name}
                  </h2>
                  <span style={{
                    fontSize: '11px', padding: '3px 10px', borderRadius: '10px',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)', color: 'var(--admin-primary)',
                    border: '1px solid rgba(212, 175, 55, 0.2)', fontWeight: '600'
                  }}>
                    {selectedVendor.category}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedVendor(null)} style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '24px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--admin-border)' }}>
                <Star size={18} color="var(--admin-primary)" fill="var(--admin-primary)" />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>Score & Reliability</div>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>{selectedVendor.rating} / 5.0 ★ Verified</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--admin-border)' }}>
                <Phone size={18} color="var(--admin-primary)" />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>Direct Contact</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedVendor.phone}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--admin-border)' }}>
                <MapPin size={18} color="var(--admin-primary)" />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>Operations Base</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedVendor.location}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setSelectedVendor(null)} className="admin-btn admin-btn-secondary tactile-press" style={{ flex: 1 }}>
                Dismiss
              </button>
              <button onClick={() => window.location.href = `tel:${selectedVendor.phone}`} className="admin-btn admin-btn-primary tactile-press" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Phone size={15} /> Call Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManager;

