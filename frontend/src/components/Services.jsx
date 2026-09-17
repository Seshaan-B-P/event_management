import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { Sparkles, Check, ArrowRight, PhoneCall, ShieldCheck, Palette, Clock, Award, Star } from 'lucide-react';
import TiltCard3D from './TiltCard3D';

// Fallback services in case API has only 1 service or database is offline
const FALLBACK_SERVICES = [
  {
    _id: 'service-1',
    title: 'Marriage & Reception Stage Decoration',
    category: 'wedding',
    description: 'Transform your grand wedding into an ethereal royal realm with handcrafted floral arches, golden mandap pillars, crystal chandeliers, and customized ambient LED illumination tailored to your theme.',
    iconName: 'Heart',
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
    tag: '🌟 Most Popular',
    features: ['Royal Mandap Columns', 'Fresh Exotic Floral Garlands', 'Chandelier & Spot Beams', 'Bride & Groom Royal Throne', 'Complete Stage Backdrop']
  },
  {
    _id: 'service-2',
    title: 'Sangeet & DJ Night Setup',
    category: 'party',
    description: 'Electrifying thematic party stages with synchronized concert sound systems, dynamic LED matrix video walls, smoke/haze special effects, and club-style moving head beams.',
    iconName: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    tag: '⚡ High Energy',
    features: ['Concert Line-Array Audio', 'RGB Dynamic Laser & Moving Beams', 'Dance Floor Illumination', 'Haze & Spark Machine FX', 'Themed DJ Backdrop']
  },
  {
    _id: 'service-3',
    title: 'Traditional Muhurtham & Engagement Mandap',
    category: 'wedding',
    description: 'Auspicious traditional setups featuring natural marigold torans, banana trunk carvings, brass temple diyas, and authentic South Indian cultural floral craftsmanship.',
    iconName: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    tag: '🌺 Heritage Luxury',
    features: ['Natural Fresh Marigold Strings', 'Authentic Banana Stems & Coconut Leaf Weaves', 'Brass Vilakku & Urli Urns', 'Pastel Draped Muhurtham Canopy', 'Pooja Stage Platform']
  },
  {
    _id: 'service-4',
    title: 'Thematic Birthday & Baby Shower Decor',
    category: 'birthday',
    description: 'Whimsical wonderland and fairytale theme celebrations with bespoke balloon arches, pastel floral hoops, personalized acrylic name boards, and custom dessert table decor.',
    iconName: 'Cake',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80',
    tag: '🎈 Thematic Wonder',
    features: ['Organic Pastel Balloon Arches', 'Custom Neon & Acrylic Name Signage', 'Dessert Table Styling', 'Thematic Photo Booth Backdrop', 'Welcome Arch & Floor Accents']
  },
  {
    _id: 'service-5',
    title: 'Corporate Galas & Product Launches',
    category: 'corporate',
    description: 'Sophisticated corporate event management featuring wide-screen LED projection, ergonomic VIP seating, podium branding, and premium acoustic balancing for conferences.',
    iconName: 'Briefcase',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    tag: '🏢 Executive Class',
    features: ['High-Def LED Video Display', 'Stage Podium & Sound Engineering', 'Corporate Brand Registration Desks', 'VIP Lounge & Seating Plan', 'Red Carpet Arrival Experience']
  },
  {
    _id: 'service-6',
    title: 'Luxury Reception Catering & Dining Ambiance',
    category: 'wedding',
    description: 'Multi-cuisine banquet layouts with elegant buffet counter styling, live food counters, gold-trimmed cutlery setups, and ambient fairy light dining canopies.',
    iconName: 'Utensils',
    imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
    tag: '🍽️ Royal Feast',
    features: ['Buffet Counter Floral Accents', 'Themed Beverage & Dessert Stalls', 'Uniformed Professional Service Team', 'Bespoke Table Centerpieces', 'Complete Dining Canopy Decor']
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Services', icon: <Sparkles size={14} /> },
  { id: 'wedding', label: 'Weddings & Muhurtham', icon: <Icons.Heart size={14} /> },
  { id: 'party', label: 'Sangeet & DJ Nights', icon: <Icons.Music size={14} /> },
  { id: 'birthday', label: 'Birthdays & Milestones', icon: <Icons.Gift size={14} /> },
  { id: 'corporate', label: 'Corporate Galas', icon: <Icons.Briefcase size={14} /> }
];

const Services = () => {
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/services`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const activeServices = data.data.filter(s => s.isActive);
          // If backend has services, merge with fallback items so user sees a rich showcase
          if (activeServices.length > 0) {
            setServices(activeServices);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load services:', err);
        setServices(FALLBACK_SERVICES);
        setLoading(false);
      });
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  const renderIcon = (name, size = 26, isDark = false) => {
    const Icon = Icons[name] || Icons.Star;
    return <Icon size={size} style={{ color: isDark ? 'var(--dark-brown)' : 'var(--gold)' }} />;
  };

  // Filter services by category
  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => {
      const cat = (s.category || '').toLowerCase();
      const title = (s.title || '').toLowerCase();
      if (selectedCategory === 'wedding') return cat === 'wedding' || title.includes('wedding') || title.includes('stage') || title.includes('mandap');
      if (selectedCategory === 'party') return cat === 'party' || title.includes('dj') || title.includes('sangeet');
      if (selectedCategory === 'birthday') return cat === 'birthday' || title.includes('birthday') || title.includes('baby');
      if (selectedCategory === 'corporate') return cat === 'corporate' || title.includes('corporate');
      return true;
    });

  return (
    <section
      id="services"
      className="section"
      style={{
        backgroundColor: 'var(--warm-bg-solid)',
        position: 'relative',
        overflow: 'hidden',
        padding: '100px 0 90px'
      }}
    >
      {/* 3D Soft Ambient Glow Behind Section */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: '10%',
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
          bottom: '10%',
          right: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(77, 51, 25, 0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />

      <div className="container">
        {/* Section Title Header */}
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
            <Sparkles size={16} style={{ color: 'var(--gold)' }} />
            What We Do Best
          </div>
          <h2 className="section-title" style={{ marginBottom: '12px' }}>
            Our Event Services in Karur
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
            From regal wedding mandaps and bespoke floral artistry to high-energy DJ dance floors, we create immersive experiences tailored to your vision.
          </p>
        </div>

        {/* 3D Category Filter Pills */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '45px',
            flexWrap: 'wrap'
          }}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  borderRadius: '30px',
                  border: isSelected ? '1.5px solid var(--gold)' : '1px solid rgba(212, 175, 55, 0.25)',
                  backgroundColor: isSelected ? 'var(--dark-brown)' : 'var(--white)',
                  color: isSelected ? 'var(--gold)' : 'var(--text-dark)',
                  fontSize: '0.9rem',
                  fontWeight: isSelected ? '700' : '500',
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
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Services Grid with 3D Tilt Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading services...</div>
        ) : filteredServices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No services found in this category.</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '35px',
              marginBottom: '60px'
            }}
          >
            {filteredServices.map((service, index) => {
              const imageSrc = getImageUrl(service.imageUrl);
              const tagLabel = service.tag || '✨ Premium Decor';

              return (
                <TiltCard3D
                  key={service._id || index}
                  maxTilt={10}
                  scale={1.03}
                  style={{
                    backgroundColor: 'var(--white)',
                    borderRadius: '22px',
                    overflow: 'hidden',
                    boxShadow: '0 12px 35px rgba(37, 22, 5, 0.08)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Image Frame with 3D Depth Layers */}
                  <div style={{ height: '250px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={imageSrc}
                      alt={service.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = 'none';
                      }}
                      onMouseEnter={(e) => (e.target.style.transform = 'scale(1.08)')}
                      onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                    />

                    {/* 3D Floating Category Tag */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        backgroundColor: 'rgba(37, 22, 5, 0.9)',
                        backdropFilter: 'blur(10px)',
                        color: 'var(--gold-light)',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        border: '1px solid rgba(212, 175, 55, 0.4)',
                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
                        transform: 'translateZ(35px)',
                        zIndex: 5
                      }}
                    >
                      {tagLabel}
                    </div>

                    {/* Floating 3D Icon Badge with Gold Ring */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-25px',
                        right: '24px',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--dark-brown)',
                        border: '3px solid var(--gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
                        transform: 'translateZ(45px)',
                        zIndex: 6
                      }}
                    >
                      {renderIcon(service.iconName, 26, false)}
                    </div>
                  </div>

                  {/* Text Body with translateZ Depth */}
                  <div style={{ padding: '38px 28px 28px', display: 'flex', flexDirection: 'column', flexGrow: 1, transform: 'translateZ(20px)' }}>
                    <h3
                      style={{
                        fontSize: '1.35rem',
                        fontWeight: '700',
                        color: 'var(--dark-brown)',
                        marginBottom: '10px',
                        lineHeight: 1.35
                      }}
                    >
                      {service.title}
                    </h3>

                    <p style={{ color: 'var(--text-muted)', marginBottom: '18px', flexGrow: 1, fontSize: '0.95rem', lineHeight: '1.6' }}>
                      {service.description && service.description.length > 130
                        ? `${service.description.substring(0, 130)}...`
                        : service.description}
                    </p>

                    {/* Features Preview Pills */}
                    {service.features && service.features.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '22px' }}>
                        {service.features.slice(0, 3).map((f, fIdx) => (
                          <span
                            key={fIdx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(212, 175, 55, 0.1)',
                              color: 'var(--dark-brown)',
                              fontSize: '0.78rem',
                              fontWeight: '600'
                            }}
                          >
                            <Check size={12} style={{ color: 'var(--gold-dark)' }} />
                            {f}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Interactive Action Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '15px', borderTop: '1px solid rgba(212, 175, 55, 0.15)' }}>
                      <button
                        onClick={() => setSelectedService(service)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--gold-dark)',
                          fontWeight: '700',
                          cursor: 'pointer',
                          padding: '0',
                          fontSize: '0.95rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--dark-brown)';
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--gold-dark)';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        View Details &rarr;
                      </button>

                      <a
                        href={`https://wa.me/918124931018?text=${encodeURIComponent(
                          `Hi BPS Events! I am interested in your service: "${service.title}". Please share pricing and availability for my event.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 14px',
                          borderRadius: '20px',
                          backgroundColor: 'rgba(37, 22, 5, 0.06)',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          color: 'var(--dark-brown)',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--gold)';
                          e.currentTarget.style.color = 'var(--dark-brown)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(37, 22, 5, 0.06)';
                          e.currentTarget.style.color = 'var(--dark-brown)';
                        }}
                      >
                        <PhoneCall size={13} />
                        Enquire
                      </a>
                    </div>
                  </div>
                </TiltCard3D>
              );
            })}
          </div>
        )}

        {/* 3D Service Guarantee Banner */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            backgroundColor: 'var(--white)',
            padding: '30px',
            borderRadius: '24px',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            boxShadow: '0 12px 35px rgba(37, 22, 5, 0.06)'
          }}
        >
          {[
            { icon: <Palette size={22} style={{ color: 'var(--gold)' }} />, title: 'Custom 3D Concepts', desc: 'Personalized theme sketches and moodboards tailored to your venue.' },
            { icon: <Sparkles size={22} style={{ color: 'var(--gold)' }} />, title: '100% Fresh Flowers', desc: 'Direct farm-sourced roses, orchids, and jasmine with zero wilting.' },
            { icon: <Clock size={22} style={{ color: 'var(--gold)' }} />, title: 'Punctual Setup Delivery', desc: 'Stage fully prepared 3 hours before guests arrive.' },
            { icon: <ShieldCheck size={22} style={{ color: '#16a34a' }} />, title: 'Transparent Fixed Pricing', desc: 'No hidden surcharges or surprise last-minute fees.' }
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {item.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--dark-brown)', marginBottom: '4px' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3D Interactive Modal Overlay */}
      {selectedService && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setSelectedService(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--white)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              border: '2px solid var(--gold)',
              animation: 'fadeInUp 0.35s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedService(null)}
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
              <Icons.X size={20} />
            </button>

            {/* Modal Image Header */}
            <div style={{ height: '300px', position: 'relative', overflow: 'hidden' }}>
              <img
                src={getImageUrl(selectedService.imageUrl)}
                alt={selectedService.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = 'none';
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(37, 22, 5, 0.8) 0%, transparent 60%)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--dark-brown)',
                    border: '3px solid var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.4)'
                  }}
                >
                  {renderIcon(selectedService.iconName, 28, false)}
                </div>
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: 'var(--gold-light)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                  >
                    BPS Events Portfolio
                  </span>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--white)' }}>
                    {selectedService.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal Content Body */}
            <div style={{ padding: '30px 28px' }}>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--dark-brown)', marginBottom: '10px', fontWeight: '700' }}>
                Service Overview
              </h4>
              <p style={{ color: 'var(--text-muted)', marginBottom: '25px', lineHeight: '1.7', fontSize: '0.98rem' }}>
                {selectedService.description}
              </p>

              {/* What is Included */}
              {selectedService.features && selectedService.features.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--dark-brown)', marginBottom: '14px', fontWeight: '700' }}>
                    What's Included in this Package:
                  </h4>
                  <ul
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '10px 16px',
                      margin: 0,
                      padding: 0,
                      listStyle: 'none'
                    }}
                  >
                    {selectedService.features.map((item, key) => (
                      <li key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', color: 'var(--text-dark)' }}>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(212, 175, 55, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Check size={12} style={{ color: 'var(--gold-dark)' }} />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modal Booking CTA */}
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
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Custom quotation for your event</span>
                  <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--dark-brown)' }}>Ready to book this setup?</span>
                </div>

                <a
                  href={`https://wa.me/918124931018?text=${encodeURIComponent(
                    `Hi BPS Events! I want to book/enquire about your service: "${selectedService.title}". Could you please guide me with date availability and pricing?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 26px',
                    borderRadius: '30px',
                    fontSize: '0.95rem',
                    boxShadow: '0 8px 25px rgba(212, 175, 55, 0.35)'
                  }}
                >
                  <PhoneCall size={18} />
                  Book on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;
