import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Sparkles, Maximize2, X, PhoneCall, MapPin, Heart, Camera } from 'lucide-react';
import TiltCard3D from './TiltCard3D';

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModalItem, setActiveModalItem] = useState(null);

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
    const normalized = String(imagePath).replace(/\\/g, '/');
    if (normalized.startsWith('http://') || normalized.startsWith('https://') || normalized.startsWith('data:')) {
      return normalized;
    }
    const cleanPath = normalized.startsWith('/') ? normalized : `/${normalized}`;
    const baseUrl = (API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');
    return `${baseUrl}${cleanPath}`;
  };

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => (item.category || '').toLowerCase() === filter.toLowerCase());

  const categories = [
    { id: 'all', label: 'All Work', count: items.length },
    { id: 'wedding', label: 'Weddings & Receptions', count: items.filter(i => (i.category || '').toLowerCase() === 'wedding').length },
    { id: 'birthday', label: 'Theme Birthdays', count: items.filter(i => (i.category || '').toLowerCase() === 'birthday').length },
    { id: 'other', label: 'Sangeet & Corporate', count: items.filter(i => (i.category || '').toLowerCase() === 'other').length }
  ];

  return (
    <section
      id="gallery"
      className="section"
      style={{
        backgroundColor: 'var(--warm-bg-solid)',
        position: 'relative',
        overflow: 'hidden',
        padding: '100px 0 90px'
      }}
    >
      {/* 3D Ambient Lighting Glow */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(77, 51, 25, 0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />

      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '30px',
              backgroundColor: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: 'var(--dark-brown)',
              fontSize: '0.85rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '12px'
            }}
          >
            <Camera size={16} style={{ color: 'var(--gold)' }} />
            Visual Masterpieces
          </div>
          <h2 className="section-title" style={{ marginBottom: '12px' }}>
            Our Event Gallery
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Explore real wedding stages, thematic birthday wonderlands, and regal celebrations handcrafted by BPS Events in Karur.
          </p>
        </div>

        {/* 3D Filter Pills */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '45px',
            flexWrap: 'wrap'
          }}
        >
          {categories.map((cat) => {
            const isSelected = filter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  borderRadius: '30px',
                  fontWeight: isSelected ? '700' : '500',
                  fontSize: '0.9rem',
                  border: isSelected ? '1.5px solid var(--gold)' : '1px solid rgba(212, 175, 55, 0.25)',
                  backgroundColor: isSelected ? 'var(--dark-brown)' : 'var(--white)',
                  color: isSelected ? 'var(--gold)' : 'var(--text-dark)',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 8px 20px rgba(37, 22, 5, 0.25)' : '0 2px 8px rgba(37, 22, 5, 0.04)',
                  transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--gold)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span>{cat.label}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.2)' : 'rgba(37, 22, 5, 0.06)',
                    color: isSelected ? 'var(--gold-light)' : 'var(--text-muted)'
                  }}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery 3D Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            Loading portfolio images...
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            No gallery items found for this category.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '30px',
              marginBottom: '50px'
            }}
          >
            {filteredItems.map((item, index) => {
              const imageSrc = getImageUrl(item.image);
              const tagText = item.tag || (item.category ? item.category.toUpperCase() : 'DECOR');

              return (
                <TiltCard3D
                  key={`${item._id || item.title}-${index}-${filter}`}
                  maxTilt={12}
                  scale={1.04}
                  style={{
                    borderRadius: '22px',
                    overflow: 'hidden',
                    position: 'relative',
                    height: '360px',
                    boxShadow: '0 14px 35px rgba(37, 22, 5, 0.12)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    backgroundColor: 'var(--dark-brown)',
                    cursor: 'pointer'
                  }}
                  className="gallery-card"
                  onClick={() => setActiveModalItem(item)}
                >
                  {/* Photo Layer */}
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={`${item.title || 'BPS Events Stage Decoration'} - Wedding Decorators in Karur`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
                      }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--dark-brown)' }} />
                  )}

                  {/* 3D Floating Category Tag in Corner */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      backgroundColor: 'rgba(37, 22, 5, 0.85)',
                      backdropFilter: 'blur(10px)',
                      color: 'var(--gold-light)',
                      padding: '5px 14px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                      transform: 'translateZ(30px)',
                      zIndex: 5
                    }}
                  >
                    {tagText}
                  </div>

                  {/* Interactive 3D Hover Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(26, 15, 6, 0.88)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '30px',
                      opacity: 0,
                      transition: 'all 0.35s ease',
                      textAlign: 'center',
                      transform: 'translateZ(35px)'
                    }}
                    className="gallery-overlay"
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(212, 175, 55, 0.2)',
                        border: '2px solid var(--gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--gold)',
                        marginBottom: '15px'
                      }}
                    >
                      <Maximize2 size={20} />
                    </div>

                    <h3
                      style={{
                        color: 'var(--gold)',
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.45rem',
                        fontWeight: '700',
                        marginBottom: '6px',
                        lineHeight: 1.3,
                        letterSpacing: '0.3px'
                      }}
                    >
                      {item.title}
                    </h3>

                    <p style={{ color: 'var(--white)', fontSize: '0.92rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} style={{ color: 'var(--gold)' }} />
                      {item.location || 'Karur, Tamil Nadu'}
                    </p>

                    <span
                      style={{
                        marginTop: '16px',
                        fontSize: '0.8rem',
                        color: 'var(--gold-light)',
                        border: '1px solid var(--gold)',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(212, 175, 55, 0.15)',
                        fontWeight: '600'
                      }}
                    >
                      View Full Details &rarr;
                    </span>
                  </div>
                </TiltCard3D>
              );
            })}
          </div>
        )}

        {/* Bottom Booking Guarantee Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 32px',
            borderRadius: '24px',
            backgroundColor: 'var(--white)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            boxShadow: '0 12px 35px rgba(37, 22, 5, 0.06)',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--dark-brown)', marginBottom: '4px' }}>
              Want a customized theme for your upcoming celebration?
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              We design handcrafted 3D floor plans and stage mockups specifically for your wedding hall or venue.
            </p>
          </div>

          <a
            href="https://wa.me/918124931018?text=Hi%20BPS%20Events!%20I%20browsed%20your%20Event%20Gallery%20and%20would%20love%20to%20discuss%20a%20custom%20decoration%20theme%20for%20my%20event."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 26px',
              borderRadius: '30px',
              boxShadow: '0 8px 25px rgba(212, 175, 55, 0.35)'
            }}
          >
            <PhoneCall size={18} />
            Consult on WhatsApp
          </a>
        </div>
      </div>

      {/* 3D Lightbox Modal Preview */}
      {activeModalItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setActiveModalItem(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--white)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '750px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              border: '2px solid var(--gold)',
              animation: 'fadeInUp 0.35s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalItem(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'rgba(37, 22, 5, 0.8)',
                border: '1px solid var(--gold)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--white)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                zIndex: 10
              }}
            >
              <X size={20} />
            </button>

            {/* Modal Image Header */}
            <div style={{ height: '380px', position: 'relative', overflow: 'hidden' }}>
              <img
                src={getImageUrl(activeModalItem.image)}
                alt={activeModalItem.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(26, 15, 6, 0.9) 0%, transparent 50%)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '28px',
                  right: '28px'
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(212, 175, 55, 0.25)',
                    border: '1px solid var(--gold)',
                    color: 'var(--gold-light)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px'
                  }}
                >
                  {activeModalItem.tag || activeModalItem.category}
                </span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--white)', marginBottom: '4px' }}>
                  {activeModalItem.title}
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={15} style={{ color: 'var(--gold)' }} />
                  {activeModalItem.location || 'Karur, Tamil Nadu'}
                </p>
              </div>
            </div>

            {/* Modal Description & Action */}
            <div style={{ padding: '30px 28px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '25px' }}>
                {activeModalItem.description || 'Customized stage decoration setup with bespoke floral styling, crystal lighting, and complete stage architecture crafted by BPS Events.'}
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(212, 175, 55, 0.2)',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block' }}>Interested in this design?</span>
                  <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--dark-brown)' }}>Book This Stage Decor</span>
                </div>

                <a
                  href={`https://wa.me/918124931018?text=${encodeURIComponent(
                    `Hi BPS Events! I loved the gallery photo of "${activeModalItem.title}" at ${activeModalItem.location || 'Karur'}. Could you please give me a quotation and availability for a similar setup for my event?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '30px',
                    boxShadow: '0 8px 25px rgba(212, 175, 55, 0.35)'
                  }}
                >
                  <PhoneCall size={18} />
                  Book This Design via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hover Overrides */}
      <style>{`
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
