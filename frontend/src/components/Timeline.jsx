import React from 'react';
import { Heart, Calendar, Music, Sparkles } from 'lucide-react';

const Timeline = () => {
  const steps = [
    {
      title: "Engagement Ceremony",
      description: "Warm ring exchange layout with romantic floral loops and pastel drapes. We set the stage for your elegant first promise.",
      icon: <Heart size={20} />,
      time: "Step 01"
    },
    {
      title: "Sangeet & DJ Night",
      description: "Energetic stage backdrop with dynamic LED walls, premium sound systems, and custom club lighting to set the dance floor on fire.",
      icon: <Music size={20} />,
      time: "Step 02"
    },
    {
      title: "Traditional Muhurtham",
      description: "Auspicious traditional settings with marigold strings, banana trees, and handcrafted wooden frames for a divine atmosphere.",
      icon: <Calendar size={20} />,
      time: "Step 03"
    },
    {
      title: "Grand Reception",
      description: "Breathtaking modern backdrop using crystal chandeliers, floral cascades, and ambient haze effects for a regal conclusion.",
      icon: <Sparkles size={20} />,
      time: "Step 04"
    }
  ];

  return (
    <section id="timeline" className="section" style={{ backgroundColor: 'var(--warm-bg)', overflow: 'hidden' }}>
      <div className="container">
        <p className="section-subtitle">How We Build Magic</p>
        <h2 className="section-title">The Wedding Sequence</h2>

        <div style={{ position: 'relative', maxWidth: '800px', margin: '40px auto 0' }}>
          {/* Vertical Connecting Line */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '4px',
              backgroundColor: 'var(--gold-light)',
              transform: 'translateX(-50%)',
              zIndex: 1
            }}
            className="timeline-line"
          />

          {/* Steps */}
          {steps.map((step, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: isLeft ? 'flex-start' : 'flex-end',
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: '50px',
                  position: 'relative'
                }}
                className={`timeline-item ${isLeft ? 'left' : 'right'}`}
              >
                {/* Timeline Circle Node */}
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--dark-brown)',
                    border: '3px solid var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold)',
                    zIndex: 10,
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {step.icon}
                </div>

                {/* Timeline Card */}
                <div
                  style={{
                    width: '44%',
                    backgroundColor: 'var(--white)',
                    padding: '25px',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-sm)',
                    borderLeft: isLeft ? 'none' : '4px solid var(--gold)',
                    borderRight: isLeft ? '4px solid var(--gold)' : 'none',
                    position: 'relative'
                  }}
                  className="timeline-card"
                >
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: 'var(--gold)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      display: 'block',
                      marginBottom: '5px'
                    }}
                  >
                    {step.time}
                  </span>
                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      color: 'var(--dark-brown)',
                      marginBottom: '10px'
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Timeline overrides using style block */}
      <style>{`
        @media (max-width: 768px) {
          .timeline-line {
            left: 25px !important;
            transform: none !important;
          }
          .timeline-item {
            justify-content: flex-start !important;
            padding-left: 60px !important;
            margin-bottom: 40px !important;
          }
          .timeline-item > div:first-child {
            left: 25px !important;
            transform: translateX(-50%) !important;
          }
          .timeline-card {
            width: 100% !important;
            border-left: 4px solid var(--gold) !important;
            border-right: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Timeline;
