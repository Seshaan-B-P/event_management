import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Timeline', id: 'timeline' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Reviews', id: 'reviews' },
    { name: 'Contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

      // 1. Calculate reading scroll progress
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
        setScrollProgress(progress);
      }

      // 2. Check header background scroll state
      setIsScrolled(currentScroll > 40);

      // 3. Active section detection (ScrollSpy)
      // Check if user is near the bottom of the page
      if (window.innerHeight + currentScroll >= document.documentElement.scrollHeight - 60) {
        setActiveSection('contact');
        return;
      }

      // Find current section based on scroll position
      let current = 'home';
      for (const link of navLinks) {
        const element = document.getElementById(link.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Element is active if its top is near top of viewport (allowing navbar height offset)
          if (rect.top <= 160) {
            current = link.id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run initially

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const navbarOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: isScrolled ? 'rgba(37, 22, 5, 0.95)' : 'rgba(37, 22, 5, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: isScrolled ? '1px solid var(--gold)' : '1px solid rgba(212, 175, 55, 0.25)',
        boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.4)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        padding: isScrolled ? '12px 0' : '18px 0',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Brand Logo / Name */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, 'home')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
        >
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
          <ul style={{ display: 'flex', gap: '22px', alignItems: 'center', margin: 0, padding: 0 }}>
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.id} style={{ position: 'relative' }}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                    style={{
                      color: isActive ? 'var(--gold)' : 'rgba(255, 255, 255, 0.85)',
                      fontWeight: isActive ? '700' : '500',
                      fontSize: '0.88rem',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      transition: 'all 0.25s ease',
                      display: 'inline-block',
                      padding: '6px 0',
                      position: 'relative',
                      textShadow: isActive ? '0 0 10px rgba(212, 175, 55, 0.5)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.target.style.color = 'var(--gold-light)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.target.style.color = 'rgba(255, 255, 255, 0.85)';
                    }}
                  >
                    {link.name}

                    {/* Active Underline Indicator with Glow */}
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: isActive ? '100%' : '0%',
                        height: '2.5px',
                        backgroundColor: 'var(--gold)',
                        borderRadius: '3px',
                        boxShadow: '0 0 8px var(--gold)',
                        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        opacity: isActive ? 1 : 0
                      }}
                    />
                  </a>
                </li>
              );
            })}
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
          aria-label="Toggle navigation menu"
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
            backgroundColor: 'rgba(37, 22, 5, 0.98)',
            backdropFilter: 'blur(16px)',
            borderBottom: '2px solid var(--gold)',
            padding: '20px 24px',
            animation: 'fadeInUp 0.3s ease-out',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: 0, padding: 0 }}>
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                    style={{
                      color: isActive ? 'var(--gold)' : 'var(--white)',
                      fontWeight: isActive ? '700' : '500',
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                      borderLeft: isActive ? '4px solid var(--gold)' : '4px solid transparent',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          backgroundColor: 'var(--gold)',
                          color: 'var(--dark-brown)',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontWeight: 'bold',
                          letterSpacing: '0.5px'
                        }}
                      >
                        Active
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
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

      {/* Dynamic Scroll Progress Bar at Bottom of Navbar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '3px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, var(--gold-dark), var(--gold), #ffffff)',
            boxShadow: '0 0 10px var(--gold)',
            transition: 'width 0.1s linear'
          }}
        />
      </div>

      {/* Responsive Inline Media Queries */}
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

