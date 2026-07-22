import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    iconName: 'Star',
    basePrice: 0,
    features: '',
    isActive: true,
    imageUrl: ''
  });

  const API_URL = 'http://https://event-management-kvfo.onrender.com/api/services';

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
      basePrice: service.basePrice,
      features: service.features.join(', '),
      isActive: service.isActive,
      imageUrl: service.imageUrl || ''
    });
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
        toast.success(editingId ? 'Service updated' : 'Service added', {
          style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-success)', border: '1px solid var(--admin-success)' }
        });
        fetchServices();
        handleCancel();
      } else {
        toast.error(data.error || 'Failed to save');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Service deleted', {
          style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-text-main)', border: '1px solid var(--admin-border)' }
        });
        fetchServices();
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Services & Pricing Manager</h2>
        <p style={styles.subtitle}>Dynamically manage the services displayed on your website.</p>
      </div>

      <div style={styles.content}>
        <div className="admin-glass-panel" style={styles.formCard}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--admin-text-main)', fontSize: '18px' }}>
            {editingId ? 'Edit Service' : 'Add New Service'}
          </h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Service Title *</label>
              <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="admin-input" placeholder="e.g. Premium Photography" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description *</label>
              <textarea required name="description" value={formData.description} onChange={handleInputChange} className="admin-input" style={{ minHeight: '80px', resize: 'vertical' }} placeholder="Describe the service..." />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Icon Name (Lucide)</label>
              <input type="text" name="iconName" value={formData.iconName} onChange={handleInputChange} className="admin-input" placeholder="e.g. Camera, Music, Star" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Features (comma separated)</label>
              <input type="text" name="features" value={formData.features} onChange={handleInputChange} className="admin-input" placeholder="e.g. High-Res Photos, 4 Hour Coverage" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Service Image (Optional)</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="admin-input" style={{ padding: '8px' }} />
              {formData.imageUrl && (
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                  <img src={formData.imageUrl} alt="Preview" style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                  <button type="button" onClick={() => setFormData({ ...formData, imageUrl: '' })} style={{ marginLeft: '10px', fontSize: '12px', color: 'var(--admin-danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Remove</button>
                </div>
              )}
            </div>

            <div style={styles.checkboxGroup}>
              <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleInputChange} style={{ accentColor: 'var(--admin-primary)', width: '16px', height: '16px' }} />
              <label htmlFor="isActive" style={{ ...styles.label, marginBottom: 0 }}>Active (Show on website)</label>
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>{editingId ? 'Update Service' : 'Add Service'}</button>
              {editingId && <button type="button" onClick={handleCancel} className="admin-btn admin-btn-secondary">Cancel</button>}
            </div>
          </form>
        </div>

        <div className="admin-glass-panel" style={styles.listCard}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--admin-text-main)', fontSize: '18px' }}>Current Services</h3>
          {loading ? (
            <p style={{ color: 'var(--admin-text-muted)' }}>Loading...</p>
          ) : services.length === 0 ? (
            <p style={{ color: 'var(--admin-text-muted)' }}>No services found. Add one to get started.</p>
          ) : (
            <div style={styles.grid}>
              {services.map(service => (
                <div key={service._id} className="admin-glass-panel" style={styles.serviceItem}>
                  <div style={styles.serviceHeader}>
                    <h4 style={styles.serviceTitle}>{service.title}</h4>
                  </div>
                  <p style={styles.serviceDesc}>{service.description.substring(0, 80)}...</p>

                  <div style={styles.serviceStatus}>
                    {service.isActive ? <span style={{ color: 'var(--admin-success)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><CheckCircle size={14} /> Active</span> :
                      <span style={{ color: 'var(--admin-danger)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><XCircle size={14} /> Inactive</span>}
                  </div>

                  <div style={styles.serviceActions}>
                    <button onClick={() => handleEdit(service)} style={styles.iconBtn}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(service._id)} style={{ ...styles.iconBtn, color: 'var(--admin-danger)' }}><Trash2 size={16} /></button>
                  </div>
                </div>
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
    gap: '24px'
  },
  header: {
    marginBottom: '8px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--admin-text-main)',
    margin: '0 0 8px 0'
  },
  subtitle: {
    color: 'var(--admin-text-muted)',
    margin: 0
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '24px',
    alignItems: 'start'
  },
  formCard: {
    padding: '24px',
  },
  listCard: {
    padding: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--admin-text-muted)',
    marginBottom: '4px'
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '8px',
    marginBottom: '8px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  serviceItem: {
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    boxShadow: 'none',
  },
  serviceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  serviceTitle: {
    margin: 0,
    fontSize: '16px',
    color: 'var(--admin-primary)',
    fontWeight: '600'
  },
  serviceDesc: {
    fontSize: '13px',
    color: 'var(--admin-text-muted)',
    margin: '0 0 16px 0',
    lineHeight: '1.5'
  },
  serviceStatus: {
    marginBottom: '16px',
    padding: '8px 12px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    display: 'inline-block'
  },
  serviceActions: {
    display: 'flex',
    gap: '12px',
    borderTop: '1px solid var(--admin-border)',
    paddingTop: '16px'
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
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  }
};

export default ServiceManager;
