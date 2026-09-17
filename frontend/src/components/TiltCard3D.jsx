import React, { useRef, useState } from 'react';

const TiltCard3D = ({
  children,
  className = '',
  style = {},
  maxTilt = 12,
  perspective = 1000,
  scale = 1.03,
  glare = true,
  onClick,
  ...props
}) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top; // y position within element

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransform({
      rotateX,
      rotateY,
      scale,
      glareX,
      glareY,
      glareOpacity: 0.35
    });
  };

  const handleMouseLeave = () => {
    setTransform({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0
    });
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card-3d ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        perspective: `${perspective}px`,
        transform: `perspective(${perspective}px) rotateX(${transform.rotateX.toFixed(2)}deg) rotateY(${transform.rotateY.toFixed(2)}deg) scale3d(${transform.scale}, ${transform.scale}, ${transform.scale})`,
        transition: transform.glareOpacity === 0 ? 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)' : 'transform 0.1s ease-out',
        willChange: 'transform',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
      {...props}
    >
      {/* Glare Sheen Overlay */}
      {glare && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: `radial-gradient(circle at ${transform.glareX}% ${transform.glareY}%, rgba(255, 235, 180, ${transform.glareOpacity}) 0%, transparent 65%)`,
            pointerEvents: 'none',
            zIndex: 10,
            mixBlendMode: 'screen',
            transition: transform.glareOpacity === 0 ? 'opacity 0.5s ease' : 'none'
          }}
        />
      )}

      {children}
    </div>
  );
};

export default TiltCard3D;
