import React, { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const GalleryManager = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [newImage, setNewImage] = useState({
    title: '',
    location: '',
    category: 'wedding',
    imageFile: null
  });
  const [adding, setAdding] = useState(false);

  const GALLERY_API = 'http://localhost:5000/api/gallery';

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

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const formData = new FormData();
      formData.append('title', newImage.title);
      formData.append('location', newImage.location);
      formData.append('category', newImage.category);
      if (newImage.imageFile) {
        formData.append('imageFile', newImage.imageFile);
      }

      const res = await fetch(GALLERY_API, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Image added successfully', {
          style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-success)', border: '1px solid var(--admin-success)' }
        });
        setGallery([data.data, ...gallery]);
        setShowAddForm(false);
        setNewImage({ title: '', location: '', category: 'wedding', imageFile: null });
      } else {
        toast.error(data.error || 'Failed to add image');
      }
    } catch (err) {
      toast.error('Server error');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const res = await fetch(`${GALLERY_API}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Image deleted', {
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Gallery Manager</h2>
        <button
          className="admin-btn admin-btn-primary"
          style={styles.addButton}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={20} />
          {showAddForm ? 'Cancel' : 'Add New Image'}
        </button>
      </div>

      {showAddForm && (
        <form className="admin-glass-panel admin-animate-fade" style={styles.formCard} onSubmit={handleAdd}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--admin-text-main)', fontSize: '18px' }}>Add New Portfolio Image</h3>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Title / Description</label>
              <input
                className="admin-input"
                required
                value={newImage.title}
                onChange={e => setNewImage({ ...newImage, title: e.target.value })}
                placeholder="e.g. Royal Wedding Mandap"
              />
            </div>
            <div>
              <label style={styles.label}>Location / Venue</label>
              <input
                className="admin-input"
                required
                value={newImage.location}
                onChange={e => setNewImage({ ...newImage, location: e.target.value })}
                placeholder="e.g. Karur Grand Palace"
              />
            </div>
            <div>
              <label style={styles.label}>Category</label>
              <select
                className="admin-input"
                value={newImage.category}
                onChange={e => setNewImage({ ...newImage, category: e.target.value })}
              >
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate</option>
                <option value="birthday">Birthday</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Image File</label>
              <input
                className="admin-input"
                required
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={e => setNewImage({ ...newImage, imageFile: e.target.files[0] })}
              />
            </div>
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" style={styles.submitButton} disabled={adding}>
            {adding ? 'Adding...' : 'Save to Gallery'}
          </button>
        </form>
      )}

      {loading ? (
        <div style={styles.emptyState}>Loading gallery...</div>
      ) : gallery.length === 0 ? (
        <div style={styles.emptyState}>Your gallery is empty. Add some images!</div>
      ) : (
        <div style={styles.grid}>
          {gallery.map(item => (
            <div key={item._id} className="admin-glass-panel" style={styles.card}>
              <div style={styles.imageWrapper}>
                <img src={item.image} alt={item.title} style={styles.image} />
                <button style={styles.deleteButton} onClick={() => handleDelete(item._id)}>
                  <Trash2 size={16} />
                </button>
                <div style={styles.categoryBadge}>{item.category}</div>
              </div>
              <div style={styles.cardBody}>
                <h4 style={styles.cardTitle}>{item.title}</h4>
                <div style={styles.cardMeta}>
                  <MapPin size={14} style={{ color: 'var(--admin-primary)' }} /> {item.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  title: { fontSize: '24px', fontWeight: '700', color: 'var(--admin-text-main)', margin: 0 },
  addButton: {
    display: 'flex', alignItems: 'center', gap: '8px'
  },
  formCard: {
    padding: '32px', marginBottom: '8px'
  },
  formGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px'
  },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--admin-text-muted)', marginBottom: '6px' },
  submitButton: {
    marginTop: '24px', width: '100%'
  },
  emptyState: { padding: '48px', textAlign: 'center', color: 'var(--admin-text-muted)' },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px'
  },
  card: {
    padding: '12px', overflow: 'hidden',
    transition: 'transform 0.2s',
  },
  imageWrapper: { position: 'relative', height: '200px', borderRadius: '12px', overflow: 'hidden' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  deleteButton: {
    position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(239, 68, 68, 0.9)', color: '#fff',
    border: 'none', borderRadius: '8px', width: '32px', height: '32px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    backdropFilter: 'blur(4px)'
  },
  categoryBadge: {
    position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'var(--admin-primary)',
    padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize',
    backdropFilter: 'blur(4px)', border: '1px solid rgba(212, 175, 55, 0.2)'
  },
  cardBody: { padding: '20px 8px 8px 8px' },
  cardTitle: { margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700', color: 'var(--admin-text-main)' },
  cardMeta: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--admin-text-muted)' }
};

export default GalleryManager;
