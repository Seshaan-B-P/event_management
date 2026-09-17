import React, { useState, useEffect, useRef } from 'react';
import { Award, Users, Heart, Sparkles, CheckCircle2, Star, ShieldCheck } from 'lucide-react';
import TiltCard3D from './TiltCard3D';

const About = () => {
  const [counts, setCounts] = useState({ years: 0, events: 0, satisfaction: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef(null);

  // Smooth Count-up animation when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          let startTimestamp = null;
          const duration = 1800; // ms

          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setCounts({
              years: Math.floor(easeOut * 2),
              events: Math.floor(easeOut * 50),
              satisfaction: Math.floor(easeOut * 100)
            });

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCounts({ years: 2, events: 50, satisfaction: 100 });
            }
          };

          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const features = [
    '🌸 Fresh Exotic Floral Imports',
    '🏛️ Bespoke Mandap Architecture',
    '💡 Dynamic LED Illumination & Acoustics',
    '👑 100% Stress-Free End-to-End Execution'
  ];

  return (
    <section
      id="about"
      className="section"
      style={{
        backgroundColor: 'var(--warm-bg)',
        position: 'relative',
        overflow: 'hidden',
        padding: '100px 0 90px'
      }}
    >
      {/* Background 3D Ambient Glow Spheres */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(77, 51, 25, 0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}
      />

      <div className="container">
        <p className="section-subtitle">Our Journey &amp; Passion</p>
        <h2 className="section-title">About BPS Events</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '60px',
            alignItems: 'center',
            marginTop: '30px'
          }}
        >
          {/* Left Text & Stats Column */}
          <div className="reveal active">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '30px',
                backgroundColor: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: 'var(--dark-brown)',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '15px'
              }}
            >
              <Sparkles size={16} style={{ color: 'var(--gold)' }} />
              Karur's Trusted Event Architects
            </div>

            <h3
              style={{
                fontSize: 'clamp(1.7rem, 2.5vw, 2.2rem)',
                color: 'var(--dark-brown)',
                marginBottom: '20px',
                fontWeight: '700',
                lineHeight: 1.3
              }}
            >
              Making Every Event a Visual Masterpiece Since 2024
            </h3>

            <p style={{ color: 'var(--text-muted)', marginBottom: '18px', fontSize: '1.05rem', lineHeight: '1.75' }}>
              Headquartered in Vengamedu, Karur, <strong>BPS Events</strong> stands as a benchmark for professional <strong>Event Management in Karur</strong> and surrounding regions in Tamil Nadu. Our creative team transforms ordinary venues into extraordinary spaces that captivate guests and leave lasting memories.
            </p>

            <p style={{ color: 'var(--text-muted)', marginBottom: '25px', fontSize: '1.05rem', lineHeight: '1.75' }}>
              As leading <strong>Wedding Decorators in Karur</strong>, we take pride in executing bespoke <strong>Marriage Stage Decoration</strong>, traditional Muhurtham mandaps, vibrant Sangeet dance floors, and regal wedding receptions. Beyond weddings, our expert team operates as premier <strong>Corporate Event Planners</strong> and <strong>Luxury Reception &amp; Party Organizers</strong>.
            </p>

            {/* Feature Pills */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
                marginBottom: '35px'
              }}
            >
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--dark-brown)',
                    boxShadow: '0 2px 8px rgba(37, 22, 5, 0.04)',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'var(--gold)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 175, 55, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 22, 5, 0.04)';
                  }}
                >
                  <CheckCircle2 size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Achievement indicators with 3D Tilt & Count-up */}
            <div ref={statsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              <TiltCard3D
                maxTilt={16}
                scale={1.05}
                style={{
                  backgroundColor: 'var(--white)',
                  padding: '24px 15px',
                  borderRadius: '18px',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(37, 22, 5, 0.08)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderTop: '4px solid var(--gold)'
                }}
              >
                <div style={{ transform: 'translateZ(25px)' }}>
                  <Award size={26} style={{ color: 'var(--gold)', margin: '0 auto 8px' }} />
                  <h4 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--dark-brown)' }}>
                    {counts.years}+
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '600' }}>
                    Years Experience
                  </p>
                </div>
              </TiltCard3D>

              <TiltCard3D
                maxTilt={16}
                scale={1.05}
                style={{
                  backgroundColor: 'var(--white)',
                  padding: '24px 15px',
                  borderRadius: '18px',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(37, 22, 5, 0.08)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderTop: '4px solid var(--gold)'
                }}
              >
                <div style={{ transform: 'translateZ(25px)' }}>
                  <Users size={26} style={{ color: 'var(--gold)', margin: '0 auto 8px' }} />
                  <h4 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--dark-brown)' }}>
                    {counts.events}+
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '600' }}>
                    Events Delivered
                  </p>
                </div>
              </TiltCard3D>

              <TiltCard3D
                maxTilt={16}
                scale={1.05}
                style={{
                  backgroundColor: 'var(--white)',
                  padding: '24px 15px',
                  borderRadius: '18px',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(37, 22, 5, 0.08)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderTop: '4px solid var(--gold)'
                }}
              >
                <div style={{ transform: 'translateZ(25px)' }}>
                  <Heart size={26} style={{ color: 'var(--gold)', margin: '0 auto 8px' }} />
                  <h4 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--dark-brown)' }}>
                    {counts.satisfaction}%
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '600' }}>
                    Satisfaction
                  </p>
                </div>
              </TiltCard3D>
            </div>
          </div>

          {/* Right Column: Layered 3D Tilt Image Showcase */}
          <div>
            <TiltCard3D
              maxTilt={10}
              scale={1.02}
              perspective={1000}
              style={{
                position: 'relative',
                borderRadius: '24px'
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                  position: 'relative'
                }}
              >
                {/* Photo 1 (Arched Stage Setup) */}
                <div
                  className="arched-frame"
                  style={{
                    height: '340px',
                    marginTop: '40px',
                    borderRadius: '140px 140px 16px 16px',
                    border: '3px solid var(--gold-light)',
                    boxShadow: '0 16px 36px rgba(37, 22, 5, 0.15)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--dark-brown)'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80"
                    alt="BPS Events luxury Marriage Stage Decoration by Wedding Decorators Karur"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                    onMouseEnter={(e) => (e.target.style.transform = 'scale(1.08)')}
                    onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                  />
                </div>

                {/* Photo 2 (Arched Reception Illumination) */}
                <div
                  className="arched-frame"
                  style={{
                    height: '340px',
                    borderRadius: '140px 140px 16px 16px',
                    border: '3px solid var(--gold-light)',
                    boxShadow: '0 16px 36px rgba(37, 22, 5, 0.15)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--dark-brown)'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80"
                    alt="Theme Birthday and Luxury Party Organizers setup in Karur"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                    onMouseEnter={(e) => (e.target.style.transform = 'scale(1.08)')}
                    onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                  />
                </div>

                {/* Central 3D Luxury Medallion Emblem */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--dark-brown)',
                    border: '3px solid var(--gold)',
                    color: 'var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
                    zIndex: 10
                  }}
                >
                  <Heart size={28} fill="var(--gold)" />
                </div>
              </div>
            </TiltCard3D>

            {/* Dedicated Trust Bar below the photos without any awkward overlap */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '18px',
                marginTop: '24px',
                padding: '12px 20px',
                borderRadius: '30px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                boxShadow: '0 4px 15px rgba(37, 22, 5, 0.06)',
                backdropFilter: 'blur(10px)',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: 'var(--dark-brown)' }}>
                <Star size={16} fill="var(--gold)" style={{ color: 'var(--gold)' }} />
                <span>5.0 Star Rated Decorators</span>
              </div>
              <span style={{ color: 'var(--gold)', opacity: 0.6 }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: 'var(--dark-brown)' }}>
                <ShieldCheck size={16} style={{ color: '#16a34a' }} />
                <span>100% On-Time Setup Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
