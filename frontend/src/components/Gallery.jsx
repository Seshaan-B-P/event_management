import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';



const Gallery = () => {
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `${API_BASE_URL}/api/gallery`;

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setItems(data.data);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => (item.category || '').toLowerCase() === filter.toLowerCase());

  return (
    <section id="gallery" className="section" style={{ backgroundColor: 'var(--light-gray)' }}>
      <div className="container">
        <p className="section-subtitle">Engagement to Baby shower</p>
        <p className="section-subtitle">Visual Delights</p>
        <h2 className="section-title">Our Event Gallery</h2>

        {/* Filter Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}
        >
          {[
            { id: 'all', label: 'All Work' },
            { id: 'wedding', label: 'Weddings' },
            { id: 'birthday', label: 'Birthdays' },
            { id: 'other', label: 'Others' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              style={{
                padding: '10px 26px',
                borderRadius: '30px',
                fontWeight: '600',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                border: filter === cat.id ? '2px solid var(--gold)' : '2px solid transparent',
                backgroundColor: filter === cat.id ? 'var(--dark-brown)' : 'var(--white)',
                color: filter === cat.id ? 'var(--gold)' : 'var(--text-dark)',
                cursor: 'pointer',
                boxShadow: filter === cat.id ? '0 4px 15px rgba(212, 175, 55, 0.3)' : 'var(--shadow-sm)',
                transition: 'var(--transition-normal)'
              }}
              onMouseEnter={(e) => {
                if (filter !== cat.id) {
                  e.currentTarget.style.borderColor = 'var(--gold-light)';
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== cat.id) {
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            Loading portfolio images...
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            No gallery items found for this category.
          </div>
        ) : (
          /* Image Grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '30px'
            }}
          >
            {filteredItems.map((item, index) => {
              const imageSrc = getImageUrl(item.image);

              return (
                <div
                  key={`${item._id || item.title}-${index}-${filter}`}
                  style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    height: '350px',
                    boxShadow: 'var(--shadow-md)',
                    backgroundColor: 'var(--white)',
                    cursor: 'pointer',
                    animationDelay: `${index * 0.1}s`
                  }}
                  className="gallery-card animate-item"
                >
                  <img
                    src={imageSrc}
                    alt={`${item.title || 'BPS Events Stage Decoration'} - Wedding Decorators in Karur`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'var(--transition-slow)'
                    }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Overlay with info revealed on hover */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(37, 22, 5, 0.85)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '30px',
                      opacity: 0,
                      transition: 'var(--transition-normal)',
                      textAlign: 'center'
                    }}
                    className="gallery-overlay"
                  >
                    <h3
                      style={{
                        color: 'var(--gold)',
                        fontFamily: 'var(--font-cursive)',
                        fontSize: '2rem',
                        marginBottom: '8px'
                      }}
                    >
                      {item.title}
                    </h3>
                    <p style={{ color: 'var(--white)', fontSize: '0.95rem', fontWeight: '500' }}>
                      {item.location}
                    </p>
                    <span
                      style={{
                        marginTop: '15px',
                        fontSize: '0.8rem',
                        color: 'var(--light-gray)',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        border: '1px solid var(--gold)',
                        padding: '4px 12px',
                        borderRadius: '20px'
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Hover and entrance animations */}
      <style>{`
        @keyframes fadeInSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-item {
          animation: fadeInSlideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0;
        }
        .gallery-card:hover .gallery-overlay {
          opacity: 1 !important;
        }
        .gallery-card:hover img {
          transform: scale(1.08);
        }
      `}</style>
    </section>
  );
};

export default Gallery;

