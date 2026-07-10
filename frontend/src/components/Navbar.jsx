import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Timeline', href: '#timeline' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: isScrolled ? 'rgba(37, 22, 5, 0.95)' : 'rgba(37, 22, 5, 0.85)',
        backdropFilter: 'blur(10px)',
        borderBottom: isScrolled ? '1px solid var(--gold)' : '1px solid rgba(212, 175, 55, 0.2)',
        transition: 'var(--transition-normal)',
        padding: isScrolled ? '12px 0' : '20px 0',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Brand Logo / Name */}
        <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/logo.png"
            alt="BPS Events Logo"
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              border: '2px solid var(--gold)',
              objectFit: 'cover',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
          <div>
            <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--white)', letterSpacing: '1px' }}>
              BPS
            </span>
            <span style={{ fontSize: '1.3rem', fontWeight: '400', color: 'var(--gold)', fontFamily: 'var(--font-cursive)', marginLeft: '6px' }}>
              Events
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '30px' }} className="desktop-menu">
          <ul style={{ display: 'flex', gap: '25px' }}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  style={{
                    color: 'var(--white)',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--gold)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--white)'}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="tel:+918124931018"
            className="btn btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center' }}
          >
            <Phone size={14} />
            Call Now
          </a>
        </div>

        {/* Hamburger Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--white)',
            cursor: 'pointer',
            display: 'block'
          }}
          className="mobile-toggle"
        >
          {isOpen ? <X size={28} style={{ color: 'var(--gold)' }} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            backgroundColor: 'var(--dark-brown)',
            borderBottom: '2px solid var(--gold)',
            padding: '20px 24px',
            animation: 'fadeInUp 0.3s ease-out',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  style={{
                    color: 'var(--white)',
                    fontWeight: '500',
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    display: 'block',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--gold)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--white)'}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="tel:+918124931018"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
          >
            <Phone size={18} />
            Call Now (+91 81249-31018)
          </a>
        </div>
      )}

      {/* Responsive Inline Media Queries (using style elements) */}
      <style>{`
        @media (min-width: 992px) {
          .desktop-menu {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
