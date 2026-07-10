import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setServices(data.data.filter(s => s.isActive));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load services:', err);
        setLoading(false);
      });
  }, []);

  const renderIcon = (name, size = 28, isDark = false) => {
    const Icon = Icons[name] || Icons.Star;
    return <Icon size={size} style={{ color: isDark ? 'var(--dark-brown)' : 'var(--gold)' }} />;
  };

  const defaultImages = [
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
  ];

  return (
    <section id="services" className="section" style={{ backgroundColor: 'var(--light-gray)' }}>
      <div className="container">
        <p className="section-subtitle">What We Do Best</p>
        <h2 className="section-title">Our Event Services</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading services...</div>
        ) : services.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>No services available at the moment.</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '40px',
              marginBottom: '60px'
            }}
          >
            {services.map((service, index) => (
              <div
                key={service._id}
                style={{
                  backgroundColor: 'var(--white)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'var(--transition-normal)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                {/* Image Frame */}
                <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={service.imageUrl || defaultImages[index % defaultImages.length]}
                    alt={service.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-slow)' }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      width: '55px',
                      height: '55px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--dark-brown)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid var(--gold)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {renderIcon(service.iconName, 28, false)}
                  </div>
                </div>

                {/* Text Body */}
                <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--dark-brown)', marginBottom: '15px' }}>
                    {service.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '25px', flexGrow: 1 }}>
                    {service.description}
                  </p>

                  {/* Features List */}
                  {service.features && service.features.length > 0 && (
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {service.features.map((item, key) => (
                        <li key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                          <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>✓</span>
                          <span style={{ color: 'var(--text-dark)' }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
