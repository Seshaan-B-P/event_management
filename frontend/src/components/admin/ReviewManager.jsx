import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Star, Sparkles, MessageSquare, Quote, ThumbsUp } from 'lucide-react';
import toast from 'react-hot-toast';
import TiltCard3D from '../TiltCard3D';

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  // Form State
  const [newReview, setNewReview] = useState({
    name: '',
    rating: '5',
    comment: '',
    source: 'Website Submission'
  });
  const [adding, setAdding] = useState(false);

  const REVIEWS_API = `${API_BASE_URL}/api/reviews`;

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
        toast.success('Testimonial published successfully', {
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
    if (!window.confirm('Are you sure you want to remove this client review?')) return;

    try {
      const res = await fetch(`${REVIEWS_API}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Review removed', {
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

  // Metrics
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalReviews).toFixed(1)
    : '5.0';
  const fiveStarCount = reviews.filter(r => Number(r.rating) === 5).length;
  const satisfactionRate = totalReviews > 0 ? Math.round((fiveStarCount / totalReviews) * 100) : 100;

  const filteredReviews = reviews.filter(r => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === '5') return Number(r.rating) === 5;
    if (selectedFilter === '4') return Number(r.rating) === 4;
    return Number(r.rating) <= 3;
  });

  return (
    <div style={styles.container} className="admin-animate-fade">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={styles.title}>Client Testimonials & Feedback</h2>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700',
              padding: '4px 10px', borderRadius: '12px', backgroundColor: 'rgba(212, 175, 55, 0.1)',
              color: 'var(--admin-primary)', border: '1px solid rgba(212, 175, 55, 0.25)'
            }}>
              <Sparkles size={12} /> Social Proof
            </span>
          </div>
          <p style={styles.subtitle}>Curate authentic reviews, VIP client endorsements, and satisfaction metrics.</p>
        </div>

        <button
          className="admin-btn admin-btn-primary tactile-press"
          style={styles.addButton}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={18} />
          {showAddForm ? 'Close Entry' : 'Post Testimonial'}
        </button>
      </div>

      {/* 3D Metrics Strip */}
      <div style={styles.metricGrid}>
        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>TOTAL REVIEWS</div>
          <div style={styles.metricValue}>{totalReviews}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Verified clients</div>
        </TiltCard3D>

        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>AVERAGE SCORE</div>
          <div style={{ ...styles.metricValue, color: 'var(--admin-primary)' }}>{avgRating} ★</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Across all events</div>
        </TiltCard3D>

        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>5-STAR RATINGS</div>
          <div style={{ ...styles.metricValue, color: 'var(--admin-success)' }}>{fiveStarCount}</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>Flawless executions</div>
        </TiltCard3D>

        <TiltCard3D style={styles.metricCard}>
          <div style={styles.metricLabel}>SATISFACTION RATE</div>
          <div style={{ ...styles.metricValue, color: 'var(--admin-text-main)' }}>{satisfactionRate}%</div>
          <div style={{ fontSize: '11px', color: 'var(--admin-success)', marginTop: '2px' }}>Net promoter loyalty</div>
        </TiltCard3D>
      </div>

      {/* Form Drawer */}
      {showAddForm && (
        <form className="admin-glass-panel admin-animate-fade hologram-border" style={styles.formCard} onSubmit={handleAdd}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--admin-text-main)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="var(--admin-primary)" />
            Publish Client Endorsement
          </h3>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Client / Couple Name *</label>
              <input
                className="admin-input"
                required
                value={newReview.name}
                onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                placeholder="e.g. Priya & Rajesh Kumar"
              />
            </div>
            <div>
              <label style={styles.label}>Rating Experience *</label>
              <select
                className="admin-input"
                value={newReview.rating}
                onChange={e => setNewReview({ ...newReview, rating: e.target.value })}
              >
                <option value="5">★★★★★ 5 - Flawless & Spectacular</option>
                <option value="4">★★★★☆ 4 - Very Impressive</option>
                <option value="3">★★★☆☆ 3 - Met Expectations</option>
                <option value="2">★★☆☆☆ 2 - Below Average</option>
                <option value="1">★☆☆☆☆ 1 - Unacceptable</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Source / Platform</label>
              <input
                className="admin-input"
                value={newReview.source}
                onChange={e => setNewReview({ ...newReview, source: e.target.value })}
                placeholder="e.g. Google Verified, Instagram, Direct Guest"
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.label}>Client Testimonial Feedback *</label>
              <textarea
                className="admin-input"
                required
                value={newReview.comment}
                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Detail the client's heartfelt reaction, praise for decoration, catering, sound, etc."
                style={{ minHeight: '84px', resize: 'vertical' }}
              />
            </div>
          </div>
          <button type="submit" className="admin-btn admin-btn-primary tactile-press" style={styles.submitButton} disabled={adding}>
            {adding ? 'Publishing...' : 'Publish Testimonial'}
          </button>
        </form>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { label: 'All Reviews', key: 'ALL' },
          { label: '5-Star Platinum', key: '5' },
          { label: '4-Star Gold', key: '4' },
          { label: '3-Star & Below', key: 'OTHER' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedFilter(tab.key)}
            className="tactile-press"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: selectedFilter === tab.key ? 'var(--admin-primary)' : 'rgba(255,255,255,0.05)',
              color: selectedFilter === tab.key ? '#000' : 'var(--admin-text-muted)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3D Testimonial Cards */}
      {loading ? (
        <div style={styles.emptyState}>Loading client endorsements...</div>
      ) : filteredReviews.length === 0 ? (
        <div className="admin-glass-panel" style={styles.emptyState}>
          No reviews found in this filter category.
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredReviews.map(review => (
            <TiltCard3D key={review._id} style={styles.card}>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(review._id)}
                className="tactile-press"
                title="Remove Review"
              >
                <Trash2 size={15} />
              </button>

              <div style={styles.cardHeader}>
                <div style={styles.avatar}>
                  {review.avatar || (review.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={styles.clientName}>{review.name}</h4>
                  <div style={styles.sourceText}>{review.source || 'Website Submission'}</div>
                </div>
              </div>

              <div style={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < review.rating ? "var(--admin-primary)" : "none"}
                    color={i < review.rating ? "var(--admin-primary)" : "rgba(255,255,255,0.15)"}
                  />
                ))}
                <span style={{ fontSize: '11px', color: 'var(--admin-primary)', fontWeight: '700', marginLeft: '6px' }}>
                  {review.rating}.0
                </span>
              </div>

              <div style={{ position: 'relative', marginTop: '10px' }}>
                <Quote size={24} style={{ position: 'absolute', top: '-10px', left: '-6px', opacity: 0.15, color: 'var(--admin-primary)' }} />
                <p style={styles.comment}>"{review.comment}"</p>
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
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)', marginBottom: '6px' },
  submitButton: { marginTop: '20px', width: '100%', height: '42px', fontWeight: '700' },
  emptyState: { padding: '48px', textAlign: 'center', color: 'var(--admin-text-muted)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
  card: {
    padding: '24px', backgroundColor: 'var(--admin-bg-panel)', borderRadius: '16px',
    border: '1px solid var(--admin-border)', position: 'relative', display: 'flex', flexDirection: 'column'
  },
  deleteButton: {
    position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--admin-danger)',
    border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px', width: '30px', height: '30px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s'
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' },
  avatar: {
    width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'rgba(212,175,55,0.12)', color: 'var(--admin-primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800',
    border: '1px solid rgba(212, 175, 55, 0.3)', boxShadow: '0 0 16px rgba(212, 175, 55, 0.12)'
  },
  clientName: { margin: '0 0 2px 0', fontSize: '16px', fontWeight: '700', color: 'var(--admin-text-main)' },
  sourceText: { fontSize: '12px', color: 'var(--admin-text-muted)' },
  stars: { display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' },
  comment: { margin: 0, fontSize: '13px', color: 'var(--admin-text-muted)', lineHeight: '1.6', fontStyle: 'italic' }
};

export default ReviewManager;

