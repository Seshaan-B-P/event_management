import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin, Sparkles, Image as ImageIcon, Layers, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import TiltCard3D from '../TiltCard3D';

const GalleryManager = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Form State
  const [newImage, setNewImage] = useState({
    title: '',
    location: '',
    category: 'wedding',
    imageUrl: '',
    imageFile: null
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [adding, setAdding] = useState(false);

  const GALLERY_API = `${API_BASE_URL}/api/gallery`;

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch(GALLERY_API);
      const data = await res.json();
      if (data.success) {
        setGallery(data.data);
      }
    } catch (err) {
      toast.error('Failed to load gallery', {
        style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-danger)', border: '1px solid var(--admin-danger)' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    let imagePayload = newImage.imageUrl || previewUrl;
    if (!imagePayload && newImage.imageFile) {
      try {
        imagePayload = await fileToBase64(newImage.imageFile);
      } catch (err) {
        console.warn('Error converting file to base64:', err);
      }
    }

    if (!imagePayload && !newImage.imageFile) {
      toast.error('Please select an image file or provide an image URL');
      return;
    }

    setAdding(true);
    try {
      let res;
      let data;

      if (newImage.imageFile) {
        try {
          const formData = new FormData();
          formData.append('title', newImage.title);
          formData.append('location', newImage.location);
          formData.append('category', newImage.category);
          formData.append('imageFile', newImage.imageFile);
          if (imagePayload) formData.append('image', imagePayload);

          res = await fetch(GALLERY_API, {
            method: 'POST',
            body: formData
          });
          if (res.ok) data = await res.json();
        } catch (formDataErr) {
          console.warn('FormData upload warning, trying JSON fallback:', formDataErr);
        }
      }

      if (!data || !data.success) {
        res = await fetch(GALLERY_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newImage.title,
            location: newImage.location,
            category: newImage.category,
            image: imagePayload
          })
        });
        data = await res.json();
      }

      if (data && data.success) {
        toast.success('Visual asset published to portfolio', {
          style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-success)', border: '1px solid var(--admin-success)' }
        });
        fetchGallery();
        setShowAddForm(false);
        setNewImage({ title: '', location: '', category: 'wedding', imageUrl: '', imageFile: null });
        setPreviewUrl('');
      } else {
        toast.error((data && data.error) || 'Failed to add image');
      }
    } catch (err) {
      toast.error(err.message || 'Server error while adding image');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this gallery asset?')) return;

    try {
      const res = await fetch(`${GALLERY_API}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Asset removed from portfolio', {
          style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-text-main)', border: '1px solid var(--admin-border)' }
        });
        setGallery(gallery.filter(item => item._id !== id));
      } else {
        toast.error(data.error || 'Failed to delete');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    const normalized = String(imagePath).replace(/\\/g, '/');
    if (normalized.startsWith('http://') || normalized.startsWith('https://') || normalized.startsWith('data:')) {
      return normalized;
    }
    const cleanPath = normalized.startsWith('/') ? normalized : `/${normalized}`;
    const baseUrl = (API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');
    return `${baseUrl}${cleanPath}`;
  };

  // Metrics
  const totalAssets = gallery.length;
  const weddingsCount = gallery.filter(i => (i.category || '').toLowerCase() === 'wedding').length;
  const corporateCount = gallery.filter(i => (i.category || '').toLowerCase() === 'corporate').length;
  const otherCount = totalAssets - (weddingsCount + corporateCount);

  const filteredGallery = gallery.filter(item => {
    if (selectedCategory === 'ALL') return true;
    return (item.category || '').toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div style={styles.container} className="admin-animate-fade">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={styles.title}>Visual Showcase & Gallery</h2>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700',
              padding: '4px 10px', borderRadius: '12px', backgroundColor: 'rgba(212, 175, 55, 0.1)',
              color: 'var(--admin-primary)', border: '1px solid rgba(212, 175, 55, 0.25)'
            }}>
              <Sparkles size={12} /> 3D Perspective Grid
            </span>
          </div>
          <p style={styles.subtitle}>Curate high-definition photo deliverables and client showcase highlights.</p>
        </div>

        <button
          className="admin-btn admin-btn-primary tactile-press"
          style={styles.addButton}
          onClick={() => {
            setShowAddForm(!showAddForm);
            setPreviewUrl('');
          }}
        >
          <Plus size={18} />
          {showAddForm ? 'Close Studio' : 'Upload Asset'}
        </button>
      </div>

      {/* 3D Metrics Strip */}
      <div style={styles.metricGrid}>
        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>TOTAL PORTFOLIO</div>
          <div style={styles.metricValue}>{totalAssets}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Curated visual works</div>
        </TiltCard3D>

        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>ROYAL WEDDINGS</div>
          <div style={{ ...styles.metricValue, color: 'var(--admin-primary)' }}>{weddingsCount}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Grand ceremonies</div>
        </TiltCard3D>

        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>CORPORATE GALAS</div>
          <div style={{ ...styles.metricValue, color: 'var(--admin-success)' }}>{corporateCount}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Conferences & Summits</div>
        </TiltCard3D>

        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>OTHER EVENTS</div>
          <div style={{ ...styles.metricValue, color: 'var(--admin-text-main)' }}>{otherCount}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Birthdays & Parties</div>
        </TiltCard3D>
      </div>

      {/* Form Drawer */}
      {showAddForm && (
        <form className="admin-glass-panel admin-animate-fade hologram-border" style={styles.formCard} onSubmit={handleAdd}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--admin-text-main)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={18} color="var(--admin-primary)" />
            Add Master Asset to Exhibition
          </h3>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Title / Theme *</label>
              <input
                className="admin-input"
                required
                value={newImage.title}
                onChange={e => setNewImage({ ...newImage, title: e.target.value })}
                placeholder="e.g. Royal Wedding Mandap & Floral Arch"
              />
            </div>
            <div>
              <label style={styles.label}>Location / Venue *</label>
              <input
                className="admin-input"
                required
                value={newImage.location}
                onChange={e => setNewImage({ ...newImage, location: e.target.value })}
                placeholder="e.g. Karur Grand Palace Hall"
              />
            </div>
            <div>
              <label style={styles.label}>Category Genre *</label>
              <select
                className="admin-input"
                value={newImage.category}
                onChange={e => setNewImage({ ...newImage, category: e.target.value })}
              >
                <option value="wedding">Wedding Gala</option>
                <option value="corporate">Corporate Summit</option>
                <option value="birthday">Birthday & Jubilee</option>
                <option value="other">Other Signature Event</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Upload Direct Image File</label>
              <input
                className="admin-input"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.label}>Or Remote Image URL</label>
              <input
                className="admin-input"
                type="url"
                value={newImage.imageUrl}
                onChange={e => {
                  setNewImage({ ...newImage, imageUrl: e.target.value });
                  if (e.target.value) setPreviewUrl(e.target.value);
                }}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          {previewUrl && (
            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid var(--admin-border)' }}>
              <div style={{ width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--admin-border)' }}>
                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontSize: '13px', color: 'var(--admin-success)', fontWeight: '700' }}>✓ Visual file verified for upload</span>
            </div>
          )}

          <button type="submit" className="admin-btn admin-btn-primary tactile-press" style={styles.submitButton} disabled={adding}>
            {adding ? 'Processing Asset...' : 'Publish to Portfolio'}
          </button>
        </form>
      )}

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['ALL', 'wedding', 'corporate', 'birthday', 'other'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="tactile-press"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: selectedCategory.toLowerCase() === cat.toLowerCase() ? 'var(--admin-primary)' : 'rgba(255,255,255,0.05)',
              color: selectedCategory.toLowerCase() === cat.toLowerCase() ? '#000' : 'var(--admin-text-muted)',
              textTransform: 'capitalize'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3D Perspective Photo Grid */}
      {loading ? (
        <div style={styles.emptyState}>Loading visual portfolio assets...</div>
      ) : filteredGallery.length === 0 ? (
        <div className="admin-glass-panel" style={styles.emptyState}>
          No gallery assets found for this category. Click "Upload Asset" to expand your showcase.
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredGallery.map((item) => (
            <TiltCard3D key={item._id} style={styles.card}>
              <div style={styles.imageWrapper}>
                <img
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  style={styles.image}
                  loading="lazy"
                />
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(item._id)}
                  className="tactile-press"
                  title="Remove Asset"
                >
                  <Trash2 size={15} />
                </button>
                <div style={styles.categoryBadge}>{item.category}</div>
              </div>
              <div style={styles.cardBody}>
                <h4 style={styles.cardTitle}>{item.title}</h4>
                <div style={styles.cardMeta}>
                  <MapPin size={13} style={{ color: 'var(--admin-primary)' }} /> {item.location}
                </div>
              </div>
            </TiltCard3D>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px 0' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
  title: { fontSize: '26px', fontWeight: '800', color: 'var(--admin-text-main)', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { color: 'var(--admin-text-muted)', margin: '4px 0 0 0', fontSize: '14px' },
  addButton: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: '700' },
  metricGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
  metricCard: {
    padding: '18px 20px', backgroundColor: 'var(--admin-bg-panel)', borderRadius: '14px', border: '1px solid var(--admin-border)'
  },
  metricLabel: { fontSize: '11px', fontWeight: '700', color: 'var(--admin-text-muted)', letterSpacing: '0.8px' },
  metricValue: { fontSize: '28px', fontWeight: '800', color: 'var(--admin-text-main)', marginTop: '4px' },
  formCard: { padding: '28px', borderRadius: '16px', border: '1px solid rgba(212,175,55,0.3)' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)', marginBottom: '6px' },
  submitButton: { marginTop: '20px', width: '100%', height: '42px', fontWeight: '700' },
  emptyState: { padding: '48px', textAlign: 'center', color: 'var(--admin-text-muted)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  card: {
    padding: '12px', backgroundColor: 'var(--admin-bg-panel)', borderRadius: '16px',
    border: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column'
  },
  imageWrapper: { position: 'relative', height: '210px', borderRadius: '12px', overflow: 'hidden' },
  image: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' },
  deleteButton: {
    position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(239, 68, 68, 0.9)', color: '#fff',
    border: 'none', borderRadius: '8px', width: '32px', height: '32px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    backdropFilter: 'blur(4px)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
  },
  categoryBadge: {
    position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(0, 0, 0, 0.75)', color: 'var(--admin-primary)',
    padding: '4px 10px', borderRadius: '14px', fontSize: '11px', fontWeight: '700', textTransform: 'capitalize',
    backdropFilter: 'blur(6px)', border: '1px solid rgba(212, 175, 55, 0.3)'
  },
  cardBody: { padding: '14px 4px 4px 4px' },
  cardTitle: { margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700', color: 'var(--admin-text-main)' },
  cardMeta: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--admin-text-muted)' }
};

export default GalleryManager;

