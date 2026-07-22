import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

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
        padding: '120px 0 80px',
        backgroundColor: '#1b0f04',
        backgroundImage: 'radial-gradient(circle at center, rgba(74, 53, 37, 0.4) 0%, rgba(37, 22, 5, 0.95) 100%)',
        overflow: 'hidden',
        color: 'var(--white)',
        textAlign: 'center'
      }}
    >
      {/* Decorative Gold Sparkles or Lights Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.15,
          pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, var(--gold) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
        {/* Floating Subtitle */}
        <p
          style={{
            fontFamily: 'var(--font-cursive)',
            fontSize: '3rem',
            color: 'var(--gold)',
            marginBottom: '10px',
            animation: 'fadeInUp 0.8s ease-out forwards',
            textShadow: '0 2px 10px rgba(212, 175, 55, 0.2)'
          }}
        >
          Crafting Your Dream Celebration
        </p>

        {/* Main Brand Title */}
        <h1
          style={{
            fontSize: 'calc(2.2rem + 1.8vw)',
            fontWeight: '800',
            letterSpacing: '2px',
            lineHeight: 1.25,
            textTransform: 'uppercase',
            marginBottom: '20px',
            animation: 'fadeInUp 1s ease-out forwards',
            background: 'linear-gradient(to right, #ffffff 30%, var(--gold-light) 70%, var(--gold) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}
        >
          BPS EVENTS | Premier Event Management &amp; Wedding Decorators in Karur
        </h1>

        {/* Secondary Title & Copy */}
        <p
          style={{
            fontSize: '1.2rem',
            fontWeight: '300',
            maxWidth: '780px',
            margin: '0 auto 40px',
            color: 'var(--light-gray)',
            lineHeight: 1.7,
            letterSpacing: '0.5px',
            animation: 'fadeInUp 1.2s ease-out forwards'
          }}
        >
          Top-rated <strong>Event Management in Karur</strong> and specialized <strong>Wedding Decorators in Karur</strong>. We turn your dream celebrations into magical realities with handcrafted <strong>Marriage Stage Decoration</strong>, thematic sangeet setups, and full-scale corporate galas.
        </p>

        {/* CTA Button Row */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: 'fadeInUp 1.4s ease-out forwards'
          }}
        >
          <a href="#contact" className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Calendar size={18} />
            Book Your Event
          </a>
          <a href="#services" className="btn btn-secondary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            Our Services
            <ArrowRight size={18} />
          </a>
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
          lineHeight: 0
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
