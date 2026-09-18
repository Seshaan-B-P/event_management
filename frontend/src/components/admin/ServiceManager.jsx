import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Sparkles, Search, Layers, Check, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import TiltCard3D from '../TiltCard3D';

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    iconName: 'Star',
    basePrice: 0,
    features: '',
    isActive: true,
    imageUrl: ''
  });

  const API_URL = `${API_BASE_URL}/api/services`;

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (err) {
      toast.error('Failed to fetch services', {
        style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-danger)', border: '1px solid var(--admin-danger)' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB', {
          style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-danger)', border: '1px solid var(--admin-danger)' }
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service._id);
    setFormData({
      title: service.title,
      description: service.description,
      iconName: service.iconName,
      basePrice: service.basePrice || 0,
      features: Array.isArray(service.features) ? service.features.join(', ') : '',
      isActive: service.isActive,
      imageUrl: service.imageUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      iconName: 'Star',
      basePrice: 0,
      features: '',
      isActive: true,
      imageUrl: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      basePrice: Number(formData.basePrice) || 0,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f)
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? 'Service updated successfully' : 'Service published successfully', {
          style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-success)', border: '1px solid var(--admin-success)' }
        });
        fetchServices();
        handleCancel();
      } else {
        toast.error(data.error || 'Failed to save service');
      }
    } catch (err) {
      toast.error('Server connection error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Service archived', {
          style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-text-main)', border: '1px solid var(--admin-border)' }
        });
        fetchServices();
      } else {
        toast.error('Failed to delete service');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const totalActive = services.filter(s => s.isActive).length;
  const totalInactive = services.length - totalActive;
  const totalFeatures = services.reduce((acc, s) => acc + (Array.isArray(s.features) ? s.features.length : 0), 0);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'ACTIVE') return matchesSearch && service.isActive;
    if (filterStatus === 'INACTIVE') return matchesSearch && !service.isActive;
    return matchesSearch;
  });

  return (
    <div style={styles.container} className="admin-animate-fade">
      {/* 3D Title Bar */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={styles.title}>Services & Offerings Hub</h2>
            <span style={styles.headerBadge}>
              <Sparkles size={13} style={{ color: 'var(--admin-primary)' }} /> 3D Portfolio
            </span>
          </div>
          <p style={styles.subtitle}>Dynamically deploy, customize, and price event experiences.</p>
        </div>
      </div>

      {/* 3D Metric Strip */}
      <div style={styles.metricGrid}>
        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>TOTAL CATALOG</div>
          <div style={styles.metricValue}>{services.length}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>Registered Services</div>
        </TiltCard3D>

        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>ACTIVE ON WEB</div>
          <div style={{ ...styles.metricValue, color: 'var(--admin-success)' }}>{totalActive}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>Live for client bookings</div>
        </TiltCard3D>

        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>OFFLINE / DRAFT</div>
          <div style={{ ...styles.metricValue, color: totalInactive > 0 ? 'var(--admin-warning)' : 'var(--admin-text-muted)' }}>{totalInactive}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>Hidden from showcase</div>
        </TiltCard3D>

        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>CURATED FEATURES</div>
          <div style={{ ...styles.metricValue, color: 'var(--admin-primary)' }}>{totalFeatures}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>Value deliverables listed</div>
        </TiltCard3D>
      </div>

      <div style={styles.content}>
        {/* Left: 3D Form Card */}
        <div className="admin-glass-panel" style={styles.formCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: 'var(--admin-text-main)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--admin-primary)" />
              {editingId ? 'Modify Service Blueprint' : 'Architect New Service'}
            </h3>
            {editingId && (
              <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px', backgroundColor: 'rgba(212,175,55,0.15)', color: 'var(--admin-primary)', fontWeight: '600' }}>
                EDITING
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Service Title *</label>
              <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="admin-input" placeholder="e.g. Royal Wedding Mandap & Decors" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description *</label>
              <textarea required name="description" value={formData.description} onChange={handleInputChange} className="admin-input" style={{ minHeight: '84px', resize: 'vertical' }} placeholder="Provide high-impact details about this service..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Icon Identifier</label>
                <input type="text" name="iconName" value={formData.iconName} onChange={handleInputChange} className="admin-input" placeholder="e.g. Camera, Music, Star" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Base Price (₹)</label>
                <input type="number" name="basePrice" value={formData.basePrice} onChange={handleInputChange} className="admin-input" placeholder="0" />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Deliverables / Features (comma-separated)</label>
              <input type="text" name="features" value={formData.features} onChange={handleInputChange} className="admin-input" placeholder="Drone Footage, 4K Master, Album" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Cover Imagery</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="admin-input" style={{ padding: '8px' }} />
              {formData.imageUrl && (
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                  <img src={formData.imageUrl} alt="Preview" style={{ width: '80px', height: '52px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: 'var(--admin-success)', fontWeight: '600' }}>Asset Attached</div>
                    <button type="button" onClick={() => setFormData({ ...formData, imageUrl: '' })} style={{ fontSize: '12px', color: 'var(--admin-danger)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '2px' }}>Remove File</button>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.checkboxGroup}>
              <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleInputChange} style={{ accentColor: 'var(--admin-primary)', width: '16px', height: '16px', cursor: 'pointer' }} />
              <label htmlFor="isActive" style={{ ...styles.label, marginBottom: 0, cursor: 'pointer' }}>Publish on Live Website</label>
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" className="admin-btn admin-btn-primary tactile-press" style={{ flex: 1, height: '42px' }}>
                {editingId ? 'Save Blueprint' : 'Deploy Service'}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancel} className="admin-btn admin-btn-secondary tactile-press" style={{ height: '42px' }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right: Service Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Controls Bar */}
          <div className="admin-glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--admin-text-muted)' }} />
              <input
                type="text"
                placeholder="Filter services..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '10px',
                  color: 'var(--admin-text-main)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {['ALL', 'ACTIVE', 'INACTIVE'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className="tactile-press"
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: filterStatus === status ? 'var(--admin-primary)' : 'rgba(255,255,255,0.05)',
                    color: filterStatus === status ? '#000' : 'var(--admin-text-muted)'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading services ecosystem...</div>
          ) : filteredServices.length === 0 ? (
            <div className="admin-glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              No services matched your query. Add a new service to launch.
            </div>
          ) : (
            <div style={styles.grid}>
              {filteredServices.map(service => (
                <TiltCard3D key={service._id} style={styles.serviceItem}>
                  {service.imageUrl && (
                    <div style={{ height: '120px', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <img src={service.imageUrl} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  <div style={styles.serviceHeader}>
                    <h4 style={styles.serviceTitle}>{service.title}</h4>
                    {service.isActive ? (
                      <span style={{ color: 'var(--admin-success)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                        <CheckCircle size={12} /> Active
                      </span>
                    ) : (
                      <span style={{ color: 'var(--admin-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                        <XCircle size={12} /> Inactive
                      </span>
                    )}
                  </div>

                  <p style={styles.serviceDesc}>{service.description}</p>

                  {/* Features Chips */}
                  {Array.isArray(service.features) && service.features.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {service.features.slice(0, 4).map((feat, idx) => (
                        <span key={idx} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(212, 175, 55, 0.08)', color: 'var(--admin-text-main)', border: '1px solid rgba(212, 175, 55, 0.15)' }}>
                          • {feat}
                        </span>
                      ))}
                      {service.features.length > 4 && (
                        <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)', alignSelf: 'center' }}>
                          +{service.features.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  <div style={styles.serviceFooter}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>FROM</span>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--admin-primary)' }}>
                        ₹{Number(service.basePrice || 0).toLocaleString()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(service)} style={styles.iconBtn} className="tactile-press" title="Edit Service">
                        <Edit2 size={15} color="var(--admin-primary)" />
                      </button>
                      <button onClick={() => handleDelete(service._id)} style={{ ...styles.iconBtn, color: 'var(--admin-danger)' }} className="tactile-press" title="Delete Service">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </TiltCard3D>
              ))}
            </div>
          )}
        </div>
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
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: 'var(--admin-text-main)',
    margin: 0,
    letterSpacing: '-0.5px'
  },
  subtitle: {
    color: 'var(--admin-text-muted)',
    margin: '4px 0 0 0',
    fontSize: '14px'
  },
  headerBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '12px',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    color: 'var(--admin-primary)',
    border: '1px solid rgba(212, 175, 55, 0.25)',
    letterSpacing: '0.5px'
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
    border: '1px solid var(--admin-border)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
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
    marginTop: '6px',
    letterSpacing: '-0.5px'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '380px 1fr',
    gap: '24px',
    alignItems: 'start'
  },
  formCard: {
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid rgba(212, 175, 55, 0.2)'
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
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '4px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '8px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px'
  },
  serviceItem: {
    padding: '20px',
    backgroundColor: 'var(--admin-bg-panel)',
    borderRadius: '14px',
    border: '1px solid var(--admin-border)',
    display: 'flex',
    flexDirection: 'column'
  },
  serviceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
    gap: '8px'
  },
  serviceTitle: {
    margin: 0,
    fontSize: '16px',
    color: 'var(--admin-text-main)',
    fontWeight: '700',
    flex: 1
  },
  serviceDesc: {
    fontSize: '13px',
    color: 'var(--admin-text-muted)',
    margin: '0 0 14px 0',
    lineHeight: '1.5',
    flex: 1
  },
  serviceFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '14px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    marginTop: 'auto'
  },
  iconBtn: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--admin-border)',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  }
};

export default ServiceManager;

