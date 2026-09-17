import React, { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isTextInput, setIsTextInput] = useState(false);

  // Position references for smooth 60fps animation
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const animFrameId = useRef(null);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isPointerFine = window.matchMedia('(pointer: fine)').matches;
    if (!isPointerFine) return;

    setEnabled(true);

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      // Fast update for exact dot pointer
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check hovered element
      const target = e.target;
      if (!target) return;

      // Check if hovering an input/textarea
      const isInput = target.closest('input, textarea, select, [contenteditable="true"]');
      setIsTextInput(!!isInput);

      // Check explicit data-cursor-text
      const textElem = target.closest('[data-cursor-text]');
      if (textElem) {
        setCursorText(textElem.getAttribute('data-cursor-text'));
        setHovered(true);
        return;
      }

      // Context auto-detection based on sections and classes
      if (target.closest('#gallery, .gallery-card, .gallery-grid, [data-gallery-item]')) {
        setCursorText('VIEW');
        setHovered(true);
      } else if (target.closest('#reviews, .review-card, .testimonial-card')) {
        setCursorText('READ');
        setHovered(true);
      } else if (target.closest('#services, .service-card, .package-card')) {
        setCursorText('EXPLORE');
        setHovered(true);
      } else if (target.closest('#stage3d, .stage-container, canvas')) {
        setCursorText('DRAG');
        setHovered(true);
      } else if (target.closest('a[href^="#contact"], button.contact-btn, .book-btn')) {
        setCursorText('BOOK');
        setHovered(true);
      } else if (target.closest('button, a, [role="button"], input[type="submit"], .btn, .clickable')) {
        setCursorText('');
        setHovered(true);
      } else {
        setCursorText('');
        setHovered(false);
      }
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    // Smooth Lerp loop for the outer ring
    const renderLoop = () => {
      const lerpFactor = 0.18; // smooth follower responsiveness
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [visible]);

  if (!enabled) return null;

  // If hovering an input field, hide custom cursor to keep natural typing caret
  const showElements = visible && !isTextInput;

  return (
    <>
      {/* Central Sharp Gold Dot */}
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${showElements ? 'is-visible' : ''} ${
          cursorText ? 'is-text-active' : ''
        } ${hovered ? 'is-hovered' : ''}`}
      />

      {/* Smooth Trailing Ring with Context Text */}
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${showElements ? 'is-visible' : ''} ${
          hovered ? 'is-hovered' : ''
        } ${cursorText ? 'has-text' : ''} ${clicked ? 'is-clicked' : ''}`}
      >
        {cursorText && <span className="cursor-text-label">{cursorText}</span>}
      </div>
    </>
  );
};

export default CustomCursor;
