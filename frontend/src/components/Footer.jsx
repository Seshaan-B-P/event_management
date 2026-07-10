import React from 'react';

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
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 style={{ color: 'var(--gold)', fontSize: '1rem', fontWeight: '600', marginBottom: '15px', textTransform: 'uppercase' }}>
              Our Services
            </h4>
            <ul style={{ display: 'grid', gap: '10px', color: 'var(--light-gray)' }}>
              <li>Premium Weddings</li>
              <li>Sangeet Decoration</li>
              <li>Theme Birthday Parties</li>
              <li>Surprise Proposals</li>
              <li>Corporate Meetings</li>
              <li>Lighting & DJ setup</li>
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
            <p style={{ color: 'var(--gold)', fontWeight: '600' }}>
              Ph: +91 81249-31018
            </p>
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
          <p>© {new Date().getFullYear()} BPS Events. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
