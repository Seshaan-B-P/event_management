import React from 'react';
import { Calendar, ArrowRight, Sparkles, Star, Award } from 'lucide-react';
import ThreeHeroBackground from './ThreeHeroBackground';

const Hero = () => {
  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '130px 0 90px',
        backgroundColor: '#140c04',
        backgroundImage: 'radial-gradient(circle at center, rgba(60, 40, 20, 0.4) 0%, rgba(20, 12, 4, 0.96) 100%)',
        overflow: 'hidden',
        color: 'var(--white)',
        textAlign: 'center'
      }}
    >
      {/* 1. Real-time Three.js 3D WebGL Canvas (Intertwined Golden Rings & Stardust) */}
      <ThreeHeroBackground />

      {/* 2. Soft Ambient Radial Light Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '960px' }}>
        {/* Floating 3D Luxury Pill Badge */}
        <div
          className="float-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 22px',
            borderRadius: '40px',
            backgroundColor: 'rgba(212, 175, 55, 0.12)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            backdropFilter: 'blur(12px)',
            color: 'var(--gold-light)',
            fontSize: '0.88rem',
            fontWeight: '600',
            letterSpacing: '0.8px',
            marginBottom: '18px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            animation: 'fadeInUp 0.6s ease-out forwards'
          }}
        >
          <Sparkles size={16} style={{ color: 'var(--gold)' }} />
          <span>Karur's Premier Luxury Event &amp; Wedding Designers</span>
        </div>

        {/* Floating Subtitle */}
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: '600',
            fontSize: 'clamp(1.5rem, 3.2vw, 2.3rem)',
            color: 'var(--gold)',
            marginBottom: '8px',
            letterSpacing: '0.5px',
            animation: 'fadeInUp 0.8s ease-out forwards',
            textShadow: '0 2px 14px rgba(212, 175, 55, 0.35)'
          }}
        >
          Crafting Your Dream Celebration
        </p>

        {/* Main Brand Title with 3D Shimmer */}
        <h1
          className="gold-shimmer-text"
          style={{
            fontFamily: 'var(--font-royal)',
            fontSize: 'calc(2.2rem + 1.8vw)',
            fontWeight: '800',
            letterSpacing: '2.5px',
            lineHeight: 1.25,
            textTransform: 'uppercase',
            marginBottom: '20px',
            animation: 'fadeInUp 1s ease-out forwards',
            textShadow: '0 4px 30px rgba(0,0,0,0.6)'
          }}
        >
          BPS EVENTS | Best Event Decorators in Karur
        </h1>

        {/* Secondary Title & Copy */}
        <p
          style={{
            fontSize: '1.18rem',
            fontWeight: '300',
            maxWidth: '780px',
            margin: '0 auto 35px',
            color: 'rgba(245, 236, 200, 0.9)',
            lineHeight: 1.75,
            letterSpacing: '0.3px',
            animation: 'fadeInUp 1.2s ease-out forwards'
          }}
        >
          Top-rated <strong>Event Management in Karur</strong> and specialized <strong>Wedding Decorators in Karur</strong>. We turn your dream celebrations into magical realities with handcrafted <strong>Marriage Stage Decoration</strong>, thematic sangeet setups, and full-scale corporate galas.
        </p>

        {/* CTA Button Row */}
        <div
          style={{
            display: 'flex',
            gap: '18px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '40px',
            animation: 'fadeInUp 1.4s ease-out forwards'
          }}
        >
          <a
            href="#contact"
            className="btn"
            style={{
              display: 'inline-flex',
              gap: '10px',
              alignItems: 'center',
              backgroundColor: 'var(--gold)',
              color: 'var(--dark-brown)',
              fontWeight: '700',
              padding: '14px 28px',
              borderRadius: '30px',
              boxShadow: '0 10px 30px rgba(212, 175, 55, 0.45)',
              border: 'none',
              fontSize: '1rem'
            }}
          >
            <Calendar size={18} />
            Book Your Event
          </a>

          <a
            href="#services"
            className="btn"
            style={{
              display: 'inline-flex',
              gap: '8px',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              backdropFilter: 'blur(8px)',
              color: 'var(--white)',
              fontWeight: '600',
              padding: '14px 26px',
              borderRadius: '30px',
              fontSize: '1rem'
            }}
          >
            <span>Our Services</span>
            <ArrowRight size={18} />
          </a>
        </div>

        {/* 3D Floating Feature Highlights */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            animation: 'fadeInUp 1.6s ease-out forwards'
          }}
        >
          {[
            { icon: <Award size={18} />, label: 'Award-Winning Decorators' },
            { icon: <Star size={18} />, label: '500+ Luxury Celebrations' },
            { icon: <Sparkles size={18} />, label: 'Bespoke Theme Decoration' }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                color: 'var(--gold-light)',
                fontSize: '0.85rem'
              }}
            >
              <span style={{ color: 'var(--gold)' }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Elegant Curved Wave Divider at the bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          overflow: 'hidden',
          lineHeight: 0,
          zIndex: 1
        }}
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '50px' }}
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,88.43,26.85,152.06,44.25,225.86,64.12,321.39,56.44Z"
            fill="var(--warm-bg-solid)"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;

