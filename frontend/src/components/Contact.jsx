import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const Contact = ({ onOpenAdmin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const API_URL = 'http://localhost:5000/api/contacts';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, email, phone, message })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        alert(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      alert('Inquiry Submission Error: Could not connect to the backend server. Make sure the Node server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section" style={{ backgroundColor: 'var(--light-gray)' }}>
      <div className="container">
        <p className="section-subtitle">Let's Connect</p>
        <h2 className="section-title">Contact Us</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '50px',
            alignItems: 'start',
            marginTop: '30px'
          }}
        >
          {/* Contact Details & Map */}
          <div>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--dark-brown)', marginBottom: '25px', fontWeight: '700' }}>
              BPS Events Karur
            </h3>

            <div style={{ display: 'grid', gap: '20px', marginBottom: '35px' }}>
              {/* Address */}
              <div style={{ display: 'flex', gap: '15px', alignItems: 'start' }}>
                <div style={{ color: 'var(--gold)', marginTop: '4px' }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', color: 'var(--dark-brown)', fontSize: '1rem', marginBottom: '4px' }}>Office Address</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    25, S.P.Colony, Vengamedu, Karur, Tamil Nadu 639006<br />
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', gap: '15px', alignItems: 'start' }}>
                <div style={{ color: 'var(--gold)', marginTop: '4px' }}>
                  <Phone size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', color: 'var(--dark-brown)', fontSize: '1rem', marginBottom: '4px' }}>Call / WhatsApp</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    <a href="tel:+918124931018" style={{ color: 'inherit' }}>+91 81249-31018</a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', gap: '15px', alignItems: 'start' }}>
                <div style={{ color: 'var(--gold)', marginTop: '4px' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', color: 'var(--dark-brown)', fontSize: '1rem', marginBottom: '4px' }}>Email</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    <a href="mailto:bpsevents21@gmail.com" style={{ color: 'inherit' }}>bpsevents@gmail.com</a>
                  </p>
                </div>
              </div>

              {/* Timing */}
              <div style={{ display: 'flex', gap: '15px', alignItems: 'start' }}>
                <div style={{ color: 'var(--gold)', marginTop: '4px' }}>
                  <Clock size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', color: 'var(--dark-brown)', fontSize: '1rem', marginBottom: '4px' }}>Working Hours</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Monday - Sunday: 9:00 AM - 9:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Google Map Iframe */}
            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                height: '240px',
                border: '1px solid rgba(212,175,55,0.2)'
              }}
            >
              <iframe
                title="BPS Events Map Location"
                src="https://maps.google.com/maps?q=10.981691,78.078331&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Form container */}
          <div
            style={{
              backgroundColor: 'var(--white)',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: 'var(--shadow-md)',
              borderTop: '5px solid var(--gold)'
            }}
          >
            <h3 style={{ fontSize: '1.4rem', color: 'var(--dark-brown)', fontWeight: '700', marginBottom: '25px' }}>
              Send us a Message
            </h3>

            {success && (
              <div
                style={{
                  backgroundColor: '#e6f4ea',
                  color: '#137333',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '0.95rem'
                }}
              >
                Your message has been sent successfully! Our Karur representative will contact you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="e.g. +91 93454 45953"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Your Requirements</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="Tell us about the event type, venue, date, and decoration styles you'd like..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
              >
                <Send size={18} />
                {loading ? 'Sending Details...' : 'Send Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '8px',
  border: '1px solid var(--light-gray)',
  backgroundColor: 'var(--warm-bg)',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.9rem',
  transition: 'border-color 0.2s ease'
};

export default Contact;
