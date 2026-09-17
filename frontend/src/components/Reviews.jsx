import { API_BASE_URL } from '../config';
import React, { useState, useEffect, useRef } from 'react';
import { Star, MessageSquare, ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import TiltCard3D from './TiltCard3D';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const autoPlayRef = useRef(null);
  const API_URL = `${API_BASE_URL}/api/reviews`;

  // Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setReviews(data.data);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error('Fetch reviews error:', err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Set up autoplay with pause on hover
  useEffect(() => {
    if (reviews.length <= 1) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 6000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [reviews.length]);

  const handlePrev = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const handleSelectReview = (idx) => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setCurrentIndex(idx);
  };

  const currentReview = reviews[currentIndex];

  return (
    <section
      id="reviews"
      className="section"
      style={{
        backgroundColor: 'var(--warm-bg-solid)',
        position: 'relative',
        overflow: 'hidden',
        padding: '100px 0 90px'
      }}
    >
      {/* 3D Soft Ambient Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '650px',
          height: '650px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.09) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
            Client Love &amp; Trust
          </div>
          <h2 className="section-title" style={{ marginBottom: '12px' }}>
            What Our Clients Say
          </h2>

          {/* Google Review Rating Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 20px',
              borderRadius: '30px',
              backgroundColor: 'var(--white)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              boxShadow: '0 4px 15px rgba(37, 22, 5, 0.05)',
              marginTop: '5px'
            }}
          >
            <div style={{ display: 'flex', gap: '3px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="var(--gold)" stroke="var(--gold)" />
              ))}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--dark-brown)' }}>
              5.0 Star Rating on Google Reviews
            </span>
            <span style={{ color: 'var(--gold)' }}>•</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              100% Satisfaction in Karur
            </span>
          </div>
        </div>

        {/* 3D Carousel Showcase Window */}
        <div style={{ position: 'relative', margin: '0 auto', maxWidth: '820px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              Loading testimonials...
            </div>
          ) : reviews.length === 0 ? (
            <div
              style={{
                backgroundColor: 'var(--white)',
                padding: '50px 30px',
                borderRadius: '24px',
                textAlign: 'center',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                boxShadow: '0 10px 30px rgba(37, 22, 5, 0.05)'
              }}
            >
              <MessageSquare size={40} style={{ color: 'var(--gold)', margin: '0 auto 15px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '20px' }}>
                No reviews yet. Be the first happy client to share your experience!
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  borderRadius: '25px'
                }}
              >
                <PlusCircle size={16} />
                Write the First Review
              </button>
            </div>
          ) : (
            <TiltCard3D
              key={currentReview?._id || currentIndex}
              maxTilt={8}
              scale={1.02}
              perspective={1000}
              style={{
                backgroundColor: 'var(--white)',
                padding: '45px 50px',
                borderRadius: '26px',
                boxShadow: '0 20px 50px rgba(37, 22, 5, 0.09)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderTop: '5px solid var(--gold)',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              {/* Floating 3D Quote Icon */}
              <div
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(212, 175, 55, 0.12)',
                  border: '2px solid var(--gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold)',
                  margin: '0 auto 22px',
                  boxShadow: '0 8px 20px rgba(212, 175, 55, 0.25)',
                  transform: 'translateZ(35px)'
                }}
              >
                <MessageSquare size={26} />
              </div>

              {/* Review Testimonial Text with 3D Depth */}
              <p
                style={{
                  fontSize: '1.15rem',
                  fontStyle: 'italic',
                  lineHeight: '1.85',
                  color: 'var(--text-dark)',
                  marginBottom: '25px',
                  maxWidth: '680px',
                  margin: '0 auto 25px',
                  transform: 'translateZ(20px)'
                }}
              >
                "{currentReview?.comment}"
              </p>

              {/* Star Ratings with 3D Depth */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '5px',
                  marginBottom: '18px',
                  transform: 'translateZ(25px)'
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={i < (currentReview?.rating || 5) ? 'var(--gold)' : 'none'}
                    stroke="var(--gold)"
                  />
                ))}
              </div>

              {/* Reviewer Details with 3D Depth */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '10px 22px',
                  borderRadius: '30px',
                  backgroundColor: 'rgba(250, 247, 242, 0.9)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  transform: 'translateZ(30px)'
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--dark-brown)',
                    color: 'var(--gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '1.15rem',
                    border: '2px solid var(--gold)',
                    boxShadow: '0 4px 12px rgba(37, 22, 5, 0.25)'
                  }}
                >
                  {currentReview?.avatar || currentReview?.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ fontWeight: '700', color: 'var(--dark-brown)', fontSize: '1.05rem', margin: 0 }}>
                    {currentReview?.name}
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                    <CheckCircle2 size={13} />
                    {currentReview?.source || 'Google Verified Client'}
                  </span>
                </div>
              </div>
            </TiltCard3D>
          )}

          {/* Navigation Arrows */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                title="Previous Review"
                style={{
                  position: 'absolute',
                  left: '-22px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--white)',
                  border: '1.5px solid rgba(212, 175, 55, 0.35)',
                  boxShadow: '0 6px 20px rgba(37, 22, 5, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--dark-brown)',
                  zIndex: 10,
                  transition: 'all 0.25s ease'
                }}
                className="carousel-btn"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                title="Next Review"
                style={{
                  position: 'absolute',
                  right: '-22px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--white)',
                  border: '1.5px solid rgba(212, 175, 55, 0.35)',
                  boxShadow: '0 6px 20px rgba(37, 22, 5, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--dark-brown)',
                  zIndex: 10,
                  transition: 'all 0.25s ease'
                }}
                className="carousel-btn"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* Simple Minimal Carousel Indicator Dots */}
        {reviews.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '28px' }}>
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectReview(idx)}
                style={{
                  width: currentIndex === idx ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '10px',
                  backgroundColor: currentIndex === idx ? 'var(--gold)' : 'rgba(212, 175, 55, 0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease'
                }}
                title={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Button Hover Style */}
      <style>{`
        .carousel-btn:hover {
          background-color: var(--gold) !important;
          color: var(--dark-brown) !important;
          border-color: var(--gold) !important;
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4) !important;
        }
      `}</style>
    </section>
  );
};

export default Reviews;
