import { API_BASE_URL } from '../config';
import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Sparkles, 
  MessageCircle, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';
import TiltCard3D from './TiltCard3D';

const Contact = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState('Wedding & Reception');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const API_URL = `${API_BASE_URL}/api/contacts`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // Package eventType seamlessly into the message for backend compatibility
      const fullMessage = `[Event Type: ${eventType}]\n${message}`;

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          firstName: firstName.trim(), 
          lastName: lastName.trim(), 
          email: email.trim(), 
          phone: phone.trim(), 
          message: fullMessage 
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setMessage('');
        setEventType('Wedding & Reception');
      } else {
        alert(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      alert('Could not connect to the server. Please check your network or reach out via WhatsApp directly.');
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: <Phone size={22} />,
      title: 'Call / WhatsApp',
      value: '+91 81249-31018',
      link: 'tel:+918124931018',
      badge: 'Direct Line'
    },
    {
      icon: <Mail size={22} />,
      title: 'Email Desk',
      value: 'bpsevents@gmail.com',
      link: 'mailto:bpsevents21@gmail.com',
      badge: 'Quick Reply'
    },
    {
      icon: <MapPin size={22} />,
      title: 'Studio Office',
      value: '25, S.P.Colony, Vengamedu, Karur - 639006',
      link: 'https://maps.google.com/?q=10.981691,78.078331',
      badge: 'Karur Town'
    },
    {
      icon: <Clock size={22} />,
      title: 'Consultation Hours',
      value: 'Mon - Sun: 9:00 AM - 9:00 PM',
      link: null,
      badge: 'Open 7 Days',
      isLive: true
    }
  ];

  return (
    <section 
      id="contact" 
      className="section" 
      style={{ 
        backgroundColor: 'var(--warm-bg-solid)', 
        position: 'relative',
        overflow: 'hidden',
        padding: '100px 0 90px'
      }}
    >
      {/* 3D Ambient Lighting Glow */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.09) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '5%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
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
              marginBottom: '14px'
            }}
          >
            <Sparkles size={16} style={{ color: 'var(--gold)' }} />
            Let's Connect &amp; Celebrate
          </div>
          <h2 className="section-title" style={{ marginBottom: '12px' }}>
            Contact BPS Events
          </h2>
          <p 
            style={{ 
              color: 'var(--text-muted)', 
              maxWidth: '620px', 
              margin: '0 auto', 
              fontSize: '1.05rem',
              lineHeight: '1.6'
            }}
          >
            Karur's Premier Event &amp; Stage Designers. Get in touch with our creative team to craft your bespoke wedding, birthday, or royal celebration.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '40px',
            alignItems: 'start'
          }}
        >
          {/* Left Column: 3D Interactive Contact Hub */}
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h3 
                style={{ 
                  fontSize: '1.6rem', 
                  color: 'var(--dark-brown)', 
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '8px'
                }}
              >
                <span>BPS Events Studio</span>
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Visit our Karur creative office or contact us for on-site venue consultations across Tamil Nadu.
              </p>
            </div>

            {/* 4 Contact Channels */}
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                gap: '16px', 
                marginBottom: '24px' 
              }}
            >
              {contactMethods.map((item, idx) => (
                <div
                  key={idx}
                  className="contact-info-card"
                  style={{
                    backgroundColor: 'var(--white)',
                    borderRadius: '16px',
                    padding: '18px 20px',
                    border: '1.5px solid rgba(212, 175, 55, 0.22)',
                    boxShadow: '0 6px 20px rgba(37, 22, 5, 0.04)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(212, 175, 55, 0.12)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--gold-dark)'
                      }}
                    >
                      {item.icon}
                    </div>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        padding: '3px 9px',
                        borderRadius: '12px',
                        backgroundColor: item.isLive ? 'rgba(34, 197, 94, 0.12)' : 'rgba(212, 175, 55, 0.1)',
                        color: item.isLive ? '#16a34a' : 'var(--dark-brown)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      {item.isLive && (
                        <span 
                          style={{ 
                            width: '6px', 
                            height: '6px', 
                            borderRadius: '50%', 
                            backgroundColor: '#16a34a',
                            animation: 'pulseGlow 1.8s infinite'
                          }} 
                        />
                      )}
                      {item.badge}
                    </span>
                  </div>

                  <h4 
                    style={{ 
                      fontSize: '0.82rem', 
                      color: 'var(--text-muted)', 
                      fontWeight: '600', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.5px',
                      marginBottom: '4px' 
                    }}
                  >
                    {item.title}
                  </h4>

                  {item.link ? (
                    <a
                      href={item.link}
                      target={item.link.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.96rem',
                        fontWeight: '700',
                        color: 'var(--dark-brown)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'color 0.2s ease'
                      }}
                      className="contact-link"
                    >
                      {item.value}
                      <ArrowUpRight size={14} style={{ opacity: 0.6 }} />
                    </a>
                  ) : (
                    <p style={{ fontSize: '0.96rem', fontWeight: '700', color: 'var(--dark-brown)', margin: 0 }}>
                      {item.value}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Quick WhatsApp Instant Chat Banner */}
            <a
              href="https://wa.me/918124931018?text=Hello%20BPS%20Events,%20I%20would%20like%20to%20inquire%20about%20event%20management%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-quick-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 22px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: '#ffffff',
                boxShadow: '0 8px 25px rgba(37, 211, 102, 0.28)',
                marginBottom: '24px',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div 
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <MessageCircle size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1rem', letterSpacing: '0.2px' }}>
                    Instant WhatsApp Consultation
                  </div>
                  <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>
                    Chat directly with our creative head • Quick Response
                  </div>
                </div>
              </div>
              <ArrowUpRight size={20} />
            </a>

            {/* 3D Google Map Showcase Frame */}
            <div
              style={{
                borderRadius: '18px',
                overflow: 'hidden',
                backgroundColor: 'var(--white)',
                border: '1.5px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 10px 30px rgba(37, 22, 5, 0.08)',
                position: 'relative'
              }}
            >
              <div 
                style={{ 
                  padding: '12px 18px', 
                  borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(250, 247, 242, 0.6)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--dark-brown)' }}>
                  <MapPin size={15} style={{ color: 'var(--gold)' }} />
                  Karur Location Map
                </div>
                <a
                  href="https://maps.google.com/?q=10.981691,78.078331"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    color: 'var(--gold-dark)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Open in Google Maps <ArrowUpRight size={13} />
                </a>
              </div>
              <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                <iframe
                  title="BPS Events Map Location"
                  src="https://maps.google.com/maps?q=10.981691,78.078331&z=15&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Right Column: 3D Physics Inquiry Card */}
          <TiltCard3D
            maxTilt={4}
            glareOpacity={0.08}
            scale={1.01}
            style={{
              backgroundColor: 'var(--white)',
              borderRadius: '24px',
              padding: '40px 36px',
              boxShadow: '0 16px 45px rgba(37, 22, 5, 0.08)',
              border: '1.5px solid rgba(212, 175, 55, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top Gold Shimmer Bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '5px',
                background: 'linear-gradient(90deg, var(--gold), #fff0b3, var(--gold))'
              }}
            />

            {success ? (
              /* Celebratory Animated Success State */
              <div 
                style={{ 
                  textAlign: 'center', 
                  padding: '40px 10px',
                  animation: 'fadeInUp 0.5s ease-out'
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(34, 197, 94, 0.12)',
                    border: '2px solid rgba(34, 197, 94, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    color: '#16a34a'
                  }}
                >
                  <CheckCircle2 size={44} />
                </div>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--dark-brown)', fontWeight: '700', marginBottom: '12px' }}>
                  Inquiry Received!
                </h3>
                <p 
                  style={{ 
                    color: 'var(--text-muted)', 
                    fontSize: '1rem', 
                    lineHeight: '1.6', 
                    maxWidth: '400px', 
                    margin: '0 auto 30px' 
                  }}
                >
                  Thank you for reaching out to BPS Events. Our Karur wedding &amp; event coordinator will review your requirements and call you shortly.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px', margin: '0 auto' }}>
                  <a
                    href="https://wa.me/918124931018?text=Hello%20BPS%20Events,%20I%20just%20submitted%20an%20inquiry%20on%20your%20website"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      borderRadius: '12px'
                    }}
                  >
                    <MessageCircle size={18} />
                    Chat with Us Now
                  </a>
                  <button
                    onClick={() => setSuccess(false)}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      padding: '10px 18px',
                      borderRadius: '12px',
                      color: 'var(--dark-brown)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              /* Contact Form */
              <div>
                <div style={{ marginBottom: '28px' }}>
                  <h3 
                    style={{ 
                      fontSize: '1.5rem', 
                      color: 'var(--dark-brown)', 
                      fontWeight: '700', 
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Sparkles size={20} style={{ color: 'var(--gold)' }} />
                    Send an Event Inquiry
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Share your celebration dates &amp; vision. We'll reply within 2 hours with customized theme ideas.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '18px' }}>
                  {/* Name Fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={labelStyle}>First Name *</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder="e.g. Anand"
                        className="luxury-input"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Last Name *</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder="e.g. Kumar"
                        className="luxury-input"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Phone & Email Fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={labelStyle}>Phone Number *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="e.g. +91 93454 45953"
                        className="luxury-input"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="e.g. anand@gmail.com"
                        className="luxury-input"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Event Type Selector */}
                  <div>
                    <label style={labelStyle}>Celebration Type</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="luxury-input"
                      style={{
                        ...inputStyle,
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Wedding & Reception">Wedding &amp; Grand Reception</option>
                      <option value="Birthday & Milestone">Birthday &amp; Milestone Party</option>
                      <option value="Stage Decor & Lighting">3D Stage Decor &amp; Ambiance Lighting</option>
                      <option value="Corporate & Cultural">Corporate Gala / College Fest</option>
                      <option value="Engagement & Sangeet">Engagement / Sangeet Ceremony</option>
                      <option value="Other Custom Event">Other Royal Celebration</option>
                    </select>
                  </div>

                  {/* Requirements Textarea */}
                  <div>
                    <label style={labelStyle}>Your Event Details &amp; Date *</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={4}
                      placeholder="Tell us your tentative event date, venue in Karur or nearby cities, guest count, and decorative styles you prefer..."
                      className="luxury-input"
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>

                  {/* 3D Action Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary contact-submit-btn"
                    style={{
                      width: '100%',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '14px 24px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '1rem',
                      letterSpacing: '0.5px',
                      boxShadow: '0 8px 24px rgba(212, 175, 55, 0.35)',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      marginTop: '6px'
                    }}
                  >
                    <Send size={18} />
                    {loading ? 'Submitting Details...' : 'Send Event Inquiry'}
                  </button>
                </form>
              </div>
            )}
          </TiltCard3D>
        </div>
      </div>

      {/* Embedded Component Styles */}
      <style>{`
        .contact-info-card:hover {
          transform: translateY(-4px);
          border-color: var(--gold) !important;
          box-shadow: 0 10px 25px rgba(212, 175, 55, 0.16) !important;
        }
        .contact-link:hover {
          color: var(--gold-dark) !important;
        }
        .whatsapp-quick-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(37, 211, 102, 0.4) !important;
          filter: brightness(1.05);
        }
        .luxury-input:focus {
          border-color: var(--gold) !important;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2) !important;
          background-color: #ffffff !important;
        }
        .contact-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(212, 175, 55, 0.5) !important;
        }
      `}</style>
    </section>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: '700',
  color: 'var(--dark-brown)',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1.5px solid rgba(212, 175, 55, 0.25)',
  backgroundColor: 'rgba(250, 247, 242, 0.65)',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.92rem',
  color: 'var(--text-dark)',
  transition: 'all 0.25s ease'
};

export default Contact;
