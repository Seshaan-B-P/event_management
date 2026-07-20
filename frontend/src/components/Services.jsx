import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

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
                  <p style={{ color: 'var(--text-muted)', marginBottom: '15px', flexGrow: 1 }}>
                    {service.description && service.description.length > 120 
                        ? `${service.description.substring(0, 120)}...` 
                        : service.description}
                  </p>

                  <button 
                    onClick={() => setSelectedService(service)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--gold)',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      padding: '0',
                      marginBottom: '10px',
                      textAlign: 'left',
                      alignSelf: 'flex-start',
                      fontSize: '0.95rem',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--dark-brown)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--gold)'}
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {selectedService && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
              borderRadius: '16px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={() => setSelectedService(null)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(255,255,255,0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--dark-brown)',
                boxShadow: 'var(--shadow-sm)',
                zIndex: 10
              }}
            >
              <Icons.X size={20} />
            </button>

            {/* Modal Content */}
            <div style={{ height: '280px', position: 'relative' }}>
              <img 
                src={selectedService.imageUrl || defaultImages[services.findIndex(s => s._id === selectedService._id) % defaultImages.length]} 
                alt={selectedService.title} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: '30px',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--dark-brown)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '4px solid var(--white)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                {renderIcon(selectedService.iconName, 32, false)}
              </div>
            </div>

            <div style={{ padding: '40px 30px 30px 30px' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--dark-brown)', marginBottom: '15px' }}>
                {selectedService.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '25px', lineHeight: '1.6' }}>
                {selectedService.description}
              </p>

              {selectedService.features && selectedService.features.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--dark-brown)', marginBottom: '15px' }}>Key Features</h4>
                  <ul style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '12px 20px',
                    margin: 0,
                    padding: 0,
                    listStyle: 'none'
                  }}>
                    {selectedService.features.map((item, key) => (
                      <li key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.95rem' }}>
                        <span style={{ color: 'var(--gold)', fontWeight: 'bold', marginTop: '2px' }}></span>
                        <span style={{ color: 'var(--text-dark)' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;
