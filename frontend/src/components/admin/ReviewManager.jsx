import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Star, User } from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [newReview, setNewReview] = useState({
    name: '',
    rating: '5',
    comment: '',
    source: 'Website Submission'
  });
  const [adding, setAdding] = useState(false);

  const REVIEWS_API = 'http://localhost:5000/api/reviews';

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(REVIEWS_API);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (err) {
      toast.error('Failed to load reviews', {
        style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-danger)', border: '1px solid var(--admin-danger)' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch(REVIEWS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newReview,
          rating: Number(newReview.rating),
          avatar: newReview.name ? newReview.name.charAt(0).toUpperCase() : 'U'
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Review added successfully', {
          style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-success)', border: '1px solid var(--admin-success)' }
        });
        setReviews([data.data, ...reviews]);
        setShowAddForm(false);
        setNewReview({ name: '', rating: '5', comment: '', source: 'Website Submission' });
      } else {
        toast.error(data.error || 'Failed to add review');
      }
    } catch (err) {
      toast.error('Server error');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const res = await fetch(`${REVIEWS_API}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Review deleted', {
          style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-text-main)', border: '1px solid var(--admin-border)' }
        });
        setReviews(reviews.filter(item => item._id !== id));
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
        <h2 style={styles.title}>Review Manager</h2>
        <button
          className="admin-btn admin-btn-primary"
          style={styles.addButton}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={20} />
          {showAddForm ? 'Cancel' : 'Add New Review'}
        </button>
      </div>

      {showAddForm && (
        <form className="admin-glass-panel admin-animate-fade" style={styles.formCard} onSubmit={handleAdd}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--admin-text-main)', fontSize: '18px' }}>Add New Review</h3>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Client Name</label>
              <input
                className="admin-input"
                required
                value={newReview.name}
                onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label style={styles.label}>Rating (1-5)</label>
              <select
                className="admin-input"
                value={newReview.rating}
                onChange={e => setNewReview({ ...newReview, rating: e.target.value })}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Terrible</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Source Platform</label>
              <input
                className="admin-input"
                value={newReview.source}
                onChange={e => setNewReview({ ...newReview, source: e.target.value })}
                placeholder="e.g. Google Review, Facebook"
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.label}>Review Comment</label>
              <textarea
                className="admin-input"
                required
                value={newReview.comment}
                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Write the client's feedback here..."
                style={{ minHeight: '80px', resize: 'vertical' }}
              />
            </div>
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" style={styles.submitButton} disabled={adding}>
            {adding ? 'Adding...' : 'Publish Review'}
          </button>
        </form>
      )}

      {loading ? (
        <div style={styles.emptyState}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div style={styles.emptyState}>No reviews found. Add some!</div>
      ) : (
        <div style={styles.grid}>
          {reviews.map(review => (
            <div key={review._id} className="admin-glass-panel" style={styles.card}>
              <button style={styles.deleteButton} onClick={() => handleDelete(review._id)}>
                <Trash2 size={16} />
              </button>

              <div style={styles.cardHeader}>
                <div style={styles.avatar}>{review.avatar || review.name.charAt(0)}</div>
                <div>
                  <h4 style={styles.clientName}>{review.name}</h4>
                  <div style={styles.sourceText}>{review.source}</div>
                </div>
              </div>

              <div style={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < review.rating ? "var(--admin-primary)" : "none"}
                    color={i < review.rating ? "var(--admin-primary)" : "rgba(255,255,255,0.1)"}
                  />
                ))}
              </div>

              <p style={styles.comment}>"{review.comment}"</p>
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
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px'
  },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--admin-text-muted)', marginBottom: '6px' },
  submitButton: {
    marginTop: '24px', width: '100%'
  },
  emptyState: { padding: '48px', textAlign: 'center', color: 'var(--admin-text-muted)' },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px'
  },
  card: {
    padding: '32px', position: 'relative',
  },
  deleteButton: {
    position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--admin-danger)',
    border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', width: '32px', height: '32px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s'
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' },
  avatar: {
    width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(212,175,55,0.1)', color: 'var(--admin-primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700',
    border: '1px solid rgba(212, 175, 55, 0.2)', boxShadow: '0 0 15px rgba(212, 175, 55, 0.1)'
  },
  clientName: { margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', color: 'var(--admin-text-main)' },
  sourceText: { fontSize: '13px', color: 'var(--admin-text-muted)' },
  stars: { display: 'flex', gap: '4px', marginBottom: '16px' },
  comment: { margin: 0, fontSize: '14px', color: 'var(--admin-text-muted)', lineHeight: '1.6', fontStyle: 'italic' }
};

export default ReviewManager;
