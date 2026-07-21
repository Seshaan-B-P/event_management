import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Timeline from './components/Timeline';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AdminDashboard from './components/AdminDashboard';
import WorkerDashboard from './components/WorkerDashboard';

function LandingPage() {
  // Implement Scroll Reveal Animation Observer
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal, .timeline-card, .gallery-card');
    
    // Add default reveal style to elements dynamically to avoid blank page if JS fails
    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // Trigger animation once
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
      }
    );

    revealElements.forEach((el) => observer.observe(el));
    
    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Sections */}
      <Hero />
      <About />
      <Services />
      <Timeline />
      <Gallery />
      <Reviews />
      
      {/* Contact */}
      <Contact />

      {/* Footer */}
      <Footer />

      {/* Dynamic Overlay Floating Action buttons */}
      <WhatsAppButton />
    </div>
  );
}

function App() {
  const appMode = import.meta.env.VITE_APP_MODE || 'all';

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {(appMode === 'all' || appMode === 'website') && (
          <Route path="/" element={<LandingPage />} />
        )}
        {(appMode === 'all' || appMode === 'admin') && (
          <>
            <Route path="/admin/*" element={<AdminDashboard />} />
            {appMode === 'admin' && <Route path="/" element={<Navigate to="/admin" replace />} />}
          </>
        )}
        {(appMode === 'all' || appMode === 'worker') && (
          <>
            <Route path="/worker/*" element={<WorkerDashboard />} />
            {appMode === 'worker' && <Route path="/" element={<Navigate to="/worker" replace />} />}
          </>
        )}
      </Routes>
    </>
  );
}

export default App;

