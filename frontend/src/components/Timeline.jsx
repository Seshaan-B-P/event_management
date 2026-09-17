import React, { useState } from 'react';
import { Heart, Calendar, Music, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import TiltCard3D from './TiltCard3D';

const Timeline = () => {
  const [activeStep, setActiveStep] = useState(null);

  const steps = [
    {
      stepNumber: '01',
      title: 'Engagement & Ring Ceremony',
      timeSlot: 'Pre-Wedding Celebration',
      description: 'Romantic ring exchange setting featuring delicate pastel floral loops, satin drapes, floral chandeliers, and a personalized monogram stage.',
      icon: <Heart size={22} />,
      highlights: ['Pastel Draped Canopy', 'Ring Tray Floral Pedestal', 'Monogram Backdrop', 'Fairy Light Tunnel'],
      bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80'
    },
    {
      stepNumber: '02',
      title: 'Sangeet, Haldi & DJ Night',
      timeSlot: 'High-Energy Musical Gala',
      description: 'Vibrant celebration with dynamic LED video walls, concert-grade acoustic line arrays, moving beam spotlights, and a high-impact dance floor.',
      icon: <Music size={22} />,
      highlights: ['Concert Line-Array Audio', 'RGB Moving Head Beams', 'Custom DJ Console', 'Cold Firework Sparks'],
      bgImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=500&q=80'
    },
    {
      stepNumber: '03',
      title: 'Traditional Sacred Muhurtham',
      timeSlot: 'Auspicious Morning Rituals',
      description: 'Divine South Indian temple mandap crafted with fresh marigolds, carved teak pillars, traditional banana trees, and brass ceremonial lamps.',
      icon: <Calendar size={22} />,
      highlights: ['Fresh Marigold & Jasmine Strings', 'Carved Heritage Wooden Pillars', 'Brass Urli & Temple Diyas', 'Sacred Homa Kunda Decor'],
      bgImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=500&q=80'
    },
    {
      stepNumber: '04',
      title: 'Grand Royal Reception',
      timeSlot: 'Regal Evening Banquet',
      description: 'A breathtaking climax designed with cascading crystal chandeliers, monumental floral arches, haze ambiance, and royal couple throne seating.',
      icon: <Sparkles size={22} />,
      highlights: ['Crystal Chandelier Installations', 'Exotic Orchid & Rose Cascades', 'Grand Red Carpet Pathway', 'Cinematic Spotlight Halos'],
      bgImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=500&q=80'
    }
  ];

  return (
    <section
      id="timeline"
      className="section"
      style={{
        backgroundColor: 'var(--warm-bg)',
        position: 'relative',
        overflow: 'hidden',
        padding: '100px 0 90px'
      }}
    >
      {/* 3D Soft Ambient Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />

      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
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
            How We Build Magic
          </div>
          <h2 className="section-title" style={{ marginBottom: '12px' }}>
            The Wedding Sequence
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
            From the romantic first promise to the royal reception, explore our step-by-step master plan that turns every ceremony into a visual masterpiece.
          </p>
        </div>

        {/* Timeline Sequence Container */}
        <div style={{ position: 'relative', maxWidth: '960px', margin: '40px auto 0' }}>
          {/* Vertical Illuminated Golden Connecting Line */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '20px',
              bottom: '40px',
              width: '4px',
              background: 'linear-gradient(to bottom, var(--gold) 0%, var(--gold-light) 50%, var(--gold) 100%)',
              transform: 'translateX(-50%)',
              borderRadius: '4px',
              boxShadow: '0 0 12px rgba(212, 175, 55, 0.5)',
              zIndex: 1
            }}
            className="timeline-line"
          />

          {/* Steps Map */}
          {steps.map((step, index) => {
            const isLeft = index % 2 === 0;
            const isHovered = activeStep === index;

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: isLeft ? 'flex-start' : 'flex-end',
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: '65px',
                  position: 'relative'
                }}
                className={`timeline-item ${isLeft ? 'left' : 'right'}`}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
              >
                {/* 3D Glowing Timeline Node */}
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    transform: `translateX(-50%) scale(${isHovered ? 1.15 : 1})`,
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--dark-brown)',
                    border: '3px solid var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold)',
                    zIndex: 10,
                    boxShadow: isHovered
                      ? '0 0 25px rgba(212, 175, 55, 0.7), inset 0 0 15px rgba(212, 175, 55, 0.3)'
                      : '0 6px 18px rgba(37, 22, 5, 0.35)',
                    transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                  }}
                >
                  {step.icon}
                </div>

                {/* 3D Physics Tilt Card */}
                <div
                  style={{
                    width: '45%'
                  }}
                  className="timeline-card-wrapper"
                >
                  <TiltCard3D
                    maxTilt={12}
                    scale={1.03}
                    style={{
                      backgroundColor: 'var(--white)',
                      padding: '28px',
                      borderRadius: '22px',
                      boxShadow: isHovered
                        ? '0 18px 45px rgba(37, 22, 5, 0.14), 0 0 20px rgba(212, 175, 55, 0.2)'
                        : '0 10px 30px rgba(37, 22, 5, 0.07)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderLeft: isLeft ? 'none' : '4px solid var(--gold)',
                      borderRight: isLeft ? '4px solid var(--gold)' : 'none',
                      position: 'relative',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {/* Header Row: Step Pill + TimeSlot */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px',
                        transform: 'translateZ(25px)'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: '800',
                          color: 'var(--gold)',
                          textTransform: 'uppercase',
                          letterSpacing: '1.2px',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          backgroundColor: 'rgba(212, 175, 55, 0.12)',
                          border: '1px solid rgba(212, 175, 55, 0.25)'
                        }}
                      >
                        STEP {step.stepNumber}
                      </span>

                      <span
                        style={{
                          fontSize: '0.82rem',
                          color: 'var(--text-muted)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontWeight: '500'
                        }}
                      >
                        <Clock size={13} style={{ color: 'var(--gold)' }} />
                        {step.timeSlot}
                      </span>
                    </div>

                    {/* Step Title with 3D Depth */}
                    <h3
                      style={{
                        fontSize: '1.35rem',
                        fontWeight: '700',
                        color: 'var(--dark-brown)',
                        marginBottom: '12px',
                        lineHeight: 1.3,
                        transform: 'translateZ(20px)'
                      }}
                    >
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.95rem',
                        lineHeight: '1.65',
                        marginBottom: '18px',
                        transform: 'translateZ(15px)'
                      }}
                    >
                      {step.description}
                    </p>

                    {/* Highlights Pills */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        transform: 'translateZ(20px)'
                      }}
                    >
                      {step.highlights.map((h, hIdx) => (
                        <span
                          key={hIdx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(37, 22, 5, 0.04)',
                            border: '1px solid rgba(212, 175, 55, 0.2)',
                            color: 'var(--dark-brown)',
                            fontSize: '0.78rem',
                            fontWeight: '600'
                          }}
                        >
                          <CheckCircle2 size={12} style={{ color: 'var(--gold)' }} />
                          {h}
                        </span>
                      ))}
                    </div>
                  </TiltCard3D>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Responsive Layout Styles */}
      <style>{`
        @media (max-width: 820px) {
          .timeline-line {
            left: 28px !important;
            transform: none !important;
          }
          .timeline-item {
            justify-content: flex-start !important;
            padding-left: 65px !important;
            margin-bottom: 45px !important;
          }
          .timeline-item > div:first-child {
            left: 28px !important;
            transform: translateX(-50%) !important;
          }
          .timeline-card-wrapper {
            width: 100% !important;
          }
          .timeline-card-wrapper .tilt-card-3d {
            border-left: 4px solid var(--gold) !important;
            border-right: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Timeline;
