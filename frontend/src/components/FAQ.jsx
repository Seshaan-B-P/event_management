import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall } from 'lucide-react';

const faqItems = [
  {
    question: "What makes BPS Events the top choice for Event Management in Karur?",
    answer: "BPS Events brings over two years of hands-on expertise in delivering end-to-end Event Management in Karur. From initial floor plan design and floral mandap creation to concert-grade line array sound, intelligent truss lighting, and gourmet catering, our dedicated team handles every operational detail with absolute perfection."
  },
  {
    question: "How do BPS Wedding Decorators in Karur customize Marriage Stage Decoration?",
    answer: "As experienced Wedding Decorators in Karur, we begin every project with a detailed design consultation. We create bespoke Marriage Stage Decoration themes tailored to your vision—whether you desire traditional South Indian marigold mandaps, modern pastel floral arches, or opulent crystal chandelier backdrops."
  },
  {
    question: "Do you offer specialized services as Corporate Event Planners?",
    answer: "Yes! Our team acts as full-service Corporate Event Planners for businesses in Karur and across Tamil Nadu. We manage product launches, executive conferences, annual galas, and trade expos with high-definition LED screens, professional podium sound, backdrop branding, and delegate hospitality."
  },
  {
    question: "What all-inclusive packages do your Luxury Reception & Party Organizers provide?",
    answer: "Our Luxury Reception & Party Organizers curate complete packages encompassing stage backdrops, interactive Sangeet dance floors, ambient lighting rigs, custom photo booths, DJ sound setups, and live food counters for weddings, milestone birthday bashes, and anniversary galas."
  },
  {
    question: "How far in advance should we book BPS Events for our celebration in Karur?",
    answer: "We recommend booking at least 4 to 8 weeks prior to your event date during peak wedding seasons. However, we also accommodate quick-turnaround celebrations based on calendar availability. Contact our Vengamedu office at +91 81249-31018 to reserve your date."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section" style={{ backgroundColor: 'var(--warm-bg)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <p className="section-subtitle">Got Questions? We Have Answers</p>
        <h2 className="section-title">Frequently Asked Questions (FAQ)</h2>

        <div style={{ marginTop: '40px', display: 'grid', gap: '16px' }}>
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                style={{
                  backgroundColor: 'var(--white)',
                  borderRadius: '12px',
                  borderLeft: isOpen ? '4px solid var(--gold)' : '4px solid transparent',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'var(--dark-brown)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <HelpCircle size={20} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
                      {item.question}
                    </h3>
                  </div>
                  <ChevronDown
                    size={20}
                    style={{
                      color: 'var(--gold)',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0
                    }}
                  />
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 24px 22px 56px',
                      color: 'var(--text-muted)',
                      fontSize: '0.98rem',
                      lineHeight: '1.7',
                      borderTop: '1px solid rgba(0,0,0,0.05)'
                    }}
                  >
                    <p style={{ marginTop: '12px' }}>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick CTA inside FAQ */}
        <div
          style={{
            marginTop: '40px',
            textAlign: 'center',
            backgroundColor: 'var(--white)',
            padding: '25px',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid rgba(212,175,55,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '15px'
          }}
        >
          <div>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--dark-brown)', fontWeight: '700', marginBottom: '4px' }}>
              Have more questions about your upcoming event?
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              Speak directly with our chief event coordinator in Karur today.
            </p>
          </div>
          <a
            href="#contact"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
          >
            <PhoneCall size={16} />
            Contact Us Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
