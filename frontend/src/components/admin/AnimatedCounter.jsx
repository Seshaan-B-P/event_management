import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({ value, duration = 1200, prefix = '', suffix = '', decimals = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const num = typeof value === 'number' ? value : parseFloat(value) || 0;
    if (isNaN(num)) {
      setDisplayValue(value);
      return;
    }

    let startTimestamp = null;
    const startVal = 0;
    let animationFrame;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (num - startVal) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  const formatted = typeof displayValue === 'number' 
    ? displayValue.toFixed(decimals)
    : displayValue;

  return (
    <span>
      {prefix}{formatted}{suffix}
    </span>
  );
};

export default AnimatedCounter;
