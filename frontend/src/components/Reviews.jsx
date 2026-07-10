import React, { useState, useEffect, useRef } from 'react';
import { Star, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const autoPlayRef = useRef(null);

  const API_URL = 'http://localhost:5000/api/reviews';

  // Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      } else {
        throw new Error(data.error || 'Failed to load reviews');
      }
    } catch (err) {
      console.error('Fetch reviews error:', err);
      setError('Could not connect to the backend server. Showing offline default testimonials.');
      // Fallback fallback reviews if server is not running
      setReviews([
        {
          name: "Prabhu Jin",
          rating: 5,
          comment: "Excellent decoration and management. They organized my cousin's wedding in Karur. The stage setup was wonderful and flower arrangements were outstanding. Highly professional!",
          avatar: "P",
          source: "Google Review"
        },
        {
          name: "Nirmal Raj",
          rating: 5,
          comment: "Very professional team. They handled a theme-based birthday party for my kid. The balloon decorations and special cake were amazing! Everyone in the family loved it.",
          avatar: "N",
          source: "Google Review"
        },
        {
          name: "Gowri Shankar",
          rating: 5,
          comment: "Best event planner in Karur! The wedding timeline was perfectly executed. Lighting, DJ, and stage decorations were top tier. Very budget friendly. Highly recommend!",
          avatar: "G",
          source: "Google Review"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Set up autoplay
  useEffect(() => {
    if (reviews.length === 0) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [reviews]);

  const handlePrev = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };



  return (
    <section id="reviews" className="section" style={{ backgroundColor: 'var(--warm-bg)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <p className="section-subtitle">What Our Clients Say</p>
        <h2 className="section-title">Our Client Reviews</h2>

        {/* Carousel Window */}
        <div style={{ position: 'relative', minHeight: '280px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>Loading testimonials...</div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>No reviews yet. Be the first to add one!</div>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--white)',
                padding: '40px 60px',
                borderRadius: '20px',
                boxShadow: 'var(--shadow-md)',
                borderTop: '5px solid var(--gold)',
                textAlign: 'center',
                animation: 'scaleUp 0.4s ease-out'
              }}
            >
              {/* Quote Icon */}
              <MessageSquare
                size={40}
                style={{ color: 'var(--gold-light)', opacity: 0.8, margin: '0 auto 20px' }}
              />

              <p
                style={{
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  lineHeight: '1.8',
                  color: 'var(--text-dark)',
                  marginBottom: '25px'
                }}
              >
                "{reviews[currentIndex]?.comment}"
              </p>

              {/* Star Ratings */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '15px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < (reviews[currentIndex]?.rating || 5) ? 'var(--gold)' : 'none'}
                    stroke="var(--gold)"
                  />
                ))}
              </div>

              {/* Reviewer Details */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--dark-brown)',
                    color: 'var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    border: '1.5px solid var(--gold)'
                  }}
                >
                  {reviews[currentIndex]?.avatar || reviews[currentIndex]?.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ fontWeight: '700', color: 'var(--dark-brown)', fontSize: '1rem' }}>
                    {reviews[currentIndex]?.name}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {reviews[currentIndex]?.source || 'Google Review'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Arrows */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                style={{
                  position: 'absolute',
                  left: '-20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--white)',
                  border: '1px solid var(--light-gray)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-dark)',
                  zIndex: 2,
                  transition: 'var(--transition-normal)'
                }}
                className="carousel-btn"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                style={{
                  position: 'absolute',
                  right: '-20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--white)',
                  border: '1px solid var(--light-gray)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-dark)',
                  zIndex: 2,
                  transition: 'var(--transition-normal)'
                }}
                className="carousel-btn"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>


      </div>

      <style>{`
        .carousel-btn:hover {
          background-color: var(--gold) !important;
          color: var(--dark-brown) !important;
          border-color: var(--gold) !important;
        }
      `}</style>
    </section>
  );
};

export default Reviews;
