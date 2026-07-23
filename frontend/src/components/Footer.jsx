import React from 'react';

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const WhatsAppIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.67-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.887-9.885 9.887m0-18.232C6.545 3.553 2.117 7.98 2.114 13.434c0 1.942.506 3.84 1.467 5.51L2 22.583l3.745-.982a11.536 11.536 0 005.516 1.415h.005c5.879 0 10.665-4.786 10.667-10.67 0-2.85-1.11-5.53-3.125-7.546A10.606 10.606 0 0012.051 3.553z" />
  </svg>
);

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--dark-brown)',
        color: 'var(--white)',
        padding: '60px 0 20px',
        borderTop: '3px solid var(--gold)',
        fontSize: '0.9rem'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
              <img
                src="/logo.png"
                alt="BPS Events Logo"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1.5px solid var(--gold)',
                  objectFit: 'cover'
                }}
              />
              <span style={{ fontSize: '1.1rem', fontWeight: '700', letterSpacing: '1px' }}>
                BPS <span style={{ fontFamily: 'var(--font-cursive)', color: 'var(--gold)', fontSize: '1.25rem', textTransform: 'none', marginLeft: '4px' }}>Events</span>
              </span>
            </div>
            <p style={{ color: 'var(--light-gray)', lineHeight: '1.6', marginBottom: '10px' }}>
              Turning your event concepts into visual masterworks. Karur&apos;s highly recommended decorators.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--gold)', fontSize: '1rem', fontWeight: '600', marginBottom: '15px', textTransform: 'uppercase' }}>
              Quick Links
            </h4>
            <ul style={{ display: 'grid', gap: '10px' }}>
              {['Home', 'About', 'Services', 'Timeline', 'Gallery', 'Reviews', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    style={{ color: 'var(--light-gray)', transition: 'var(--transition-fast)' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--gold)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--light-gray)'}
                  >
                    {item}
                  </a>
                </li>
              ))}
              <li style={{ marginTop: '5px', paddingTop: '8px', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <a
                  href="/login"
                  style={{
                    color: 'var(--gold)',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.9rem',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--white)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--gold)'}
                >
                  Staff / Admin Login
                </a>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 style={{ color: 'var(--gold)', fontSize: '1rem', fontWeight: '600', marginBottom: '15px', textTransform: 'uppercase' }}>
              Specializations
            </h4>
            <ul style={{ display: 'grid', gap: '10px', color: 'var(--light-gray)' }}>
              <li>Marriage Stage Decoration</li>
              <li>Wedding Decorators Karur</li>
              <li>Corporate Event Planners</li>
              <li>Sangeet & Party Organizers</li>
              <li>Theme Birthday Celebrations</li>
              <li>Lighting & Line Array Sound</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: 'var(--gold)', fontSize: '1rem', fontWeight: '600', marginBottom: '15px', textTransform: 'uppercase' }}>
              Reach Us
            </h4>
            <p style={{ color: 'var(--light-gray)', lineHeight: '1.6', marginBottom: '10px' }}>
              25, S.P.Colony, Vengamedu,<br />
              Karur, Tamil Nadu 639006
            </p>
            <p style={{ color: 'var(--gold)', fontWeight: '600', marginBottom: '15px' }}>
              Ph: +91 81249-31018
            </p>
            {/* External Social Links */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--gold)',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--white)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gold)'}
              >
                <InstagramIcon size={18} />

              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--gold)',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--white)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gold)'}
              >
                <FacebookIcon size={18} />

              </a>
              <a
                href="https://wa.me/918124931018"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--gold)',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--white)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gold)'}
              >
                <WhatsAppIcon size={18} />

              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '20px',
            textAlign: 'center',
            color: 'var(--light-gray)',
            fontSize: '0.8rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <p>© {new Date().getFullYear()} BPS Events Karur. All Rights Reserved. Top Choice for Event Management in Karur.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
