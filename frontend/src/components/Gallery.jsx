import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';



const INITIAL_SHOWCASE = [
  {
    _id: 'showcase_1',
    title: 'Royal Mandap Decoration',
    location: 'Karur Grand Palace',
    category: 'wedding',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'showcase_2',
    title: 'Floral Stage & Arch Setup',
    location: 'BPS Convention Hall, Karur',
    category: 'wedding',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'showcase_3',
    title: 'Grand Birthday Celebration',
    location: 'Resort Lawn, Karur',
    category: 'birthday',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'showcase_4',
    title: 'Corporate Event Lighting',
    location: 'City Hotel Auditorium',
    category: 'other',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'showcase_5',
    title: 'Reception Outdoor Canopy',
    location: 'Karur Garden Resort',
    category: 'wedding',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'showcase_6',
    title: 'Theme Party & Balloon Decor',
    location: 'Community Center, Karur',
    category: 'birthday',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80'
  }
];

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
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setItems(data.data);
        } else {
          setItems(INITIAL_SHOWCASE);
        }
      } catch (err) {
        console.error('Error fetching gallery, using showcase:', err);
        setItems(INITIAL_SHOWCASE);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const CATEGORY_FALLBACKS = {
    wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    birthday: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    corporate: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    other: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80'
  };

  const getFallbackForCategory = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('wedding')) return CATEGORY_FALLBACKS.wedding;
    if (cat.includes('birthday')) return CATEGORY_FALLBACKS.birthday;
    if (cat.includes('corporate')) return CATEGORY_FALLBACKS.corporate;
    return CATEGORY_FALLBACKS.other;
  };

  const getImageUrl = (imagePath, category) => {
    if (!imagePath) return getFallbackForCategory(category);
    const normalized = String(imagePath).replace(/\\/g, '/');
    if (normalized.startsWith('http://') || normalized.startsWith('https://') || normalized.startsWith('data:')) {
      return normalized;
    }
    const cleanPath = normalized.startsWith('/') ? normalized : `/${normalized}`;
    const baseUrl = (API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');
    const isDeployedBrowser = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    if (isDeployedBrowser && baseUrl.includes('localhost')) {
      return getFallbackForCategory(category);
    }
    return `${baseUrl}${cleanPath}`;
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
              const imageSrc = getImageUrl(item.image, item.category);

              return (
                <div
                  key={`${item._id || item.title}-${index}-${filter}`}
                  style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    height: '350px',
                    boxShadow: 'var(--shadow-md)',
                    backgroundColor: 'var(--dark-brown)',
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
                      e.currentTarget.src = getFallbackForCategory(item.category);
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

