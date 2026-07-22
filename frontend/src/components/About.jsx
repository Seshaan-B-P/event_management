import React from 'react';
import { Award, Users, Heart } from 'lucide-react';

const About = () => {
  // Let's create an elegant presentation with card layouts for key features
  return (
    <section id="about" className="section" style={{ backgroundColor: 'var(--warm-bg)' }}>
      <div className="container">
        <p className="section-subtitle">Our Journey & Passion</p>
        <h2 className="section-title">About BPS Events</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '50px',
            alignItems: 'center',
            marginTop: '30px'
          }}
        >
          {/* Text block */}
          <div className="reveal active">
            <h3
              style={{
                fontSize: '1.8rem',
                color: 'var(--dark-brown)',
                marginBottom: '20px',
                fontWeight: '600'
              }}
            >
              Making Every Event a Visual Masterpiece Since 2024
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '18px', fontSize: '1.05rem', lineHeight: '1.7' }}>
              Headquartered in Vengamedu, Karur, <strong>BPS Events</strong> stands as a benchmark for professional <strong>Event Management in Karur</strong> and surrounding regions in Tamil Nadu. Our creative team of designers, artisans, and event strategists transform ordinary venues into extraordinary spaces that captivate guests and leave lasting memories.
            </p>
            <p style={{ color: 'var(--text-muted)', marginBottom: '18px', fontSize: '1.05rem', lineHeight: '1.7' }}>
              As leading <strong>Wedding Decorators in Karur</strong>, we take pride in executing bespoke <strong>Marriage Stage Decoration</strong>, traditional Muhurtham mandaps, vibrant Sangeet dance floors, and regal wedding receptions. Beyond weddings, our expert team operates as premier <strong>Corporate Event Planners</strong> and <strong>Luxury Reception &amp; Party Organizers</strong> for product launches, milestone anniversaries, and thematic birthdays.
            </p>
            <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '1.05rem', lineHeight: '1.7' }}>
              From initial floor plan conceptualization and floral selections to high-end acoustic sound management, ambient LED illumination, and premium catering, BPS Events manages every intricacy so you can savor your special day stress-free.
            </p>

            {/* Achievement indicators */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              <div
                style={{
                  backgroundColor: 'var(--white)',
                  padding: '20px 15px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  borderTop: '3px solid var(--gold)'
                }}
              >
                <Award size={24} style={{ color: 'var(--gold)', margin: '0 auto 8px' }} />
                <h4 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--dark-brown)' }}>2+</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Years Experience</p>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--white)',
                  padding: '20px 15px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  borderTop: '3px solid var(--gold)'
                }}
              >
                <Users size={24} style={{ color: 'var(--gold)', margin: '0 auto 8px' }} />
                <h4 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--dark-brown)' }}>50+</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Events Delivered</p>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--white)',
                  padding: '20px 15px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  borderTop: '3px solid var(--gold)'
                }}
              >
                <Heart size={24} style={{ color: 'var(--gold)', margin: '0 auto 8px' }} />
                <h4 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--dark-brown)' }}>100%</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Client Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Arched image collage */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              position: 'relative'
            }}
          >
            <div className="arched-frame" style={{ height: '320px', marginTop: '40px' }}>
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80"
                alt="BPS Events luxury Marriage Stage Decoration by Wedding Decorators Karur"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="arched-frame" style={{ height: '320px' }}>
              <img
                src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80"
                alt="Theme Birthday and Luxury Party Organizers setup in Karur"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Decorative Gold Leaf Emblem absolute-positioned */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'var(--dark-brown)',
                border: '3px solid var(--gold)',
                color: 'var(--gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
                zIndex: 10
              }}
            >
              <Heart size={30} fill="var(--gold)" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
