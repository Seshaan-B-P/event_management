import React from 'react';
import { Award, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import AnimatedCounter from '../admin/AnimatedCounter';

const Worker3DProgressRing = ({
  totalTasks = 0,
  completedTasks = 0,
  workerName = 'Worker',
  role = 'Field Specialist'
}) => {
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  // SVG circular calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(22, 22, 28, 0.95) 0%, rgba(14, 14, 18, 0.85) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        overflow: 'hidden'
      }}
    >
      {/* Background Soft Glow */}
      <div
        style={{
          position: 'absolute',
          left: '15%',
          top: '-30%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '5%',
          bottom: '-30%',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Left Info: Worker Title & Badges */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            className="worker-holo-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--admin-primary)',
              letterSpacing: '0.5px'
            }}
          >
            <Award size={13} />
            {role.toUpperCase()}
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontSize: '12px',
              color: 'var(--admin-success)',
              fontWeight: '500'
            }}
          >
            <span className="neon-pulse-dot" />
            Active Shift
          </span>
        </div>

        <div>
          <h2
            style={{
              margin: '0 0 4px 0',
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--admin-text-main)',
              letterSpacing: '-0.3px'
            }}
          >
            Hello, {workerName}
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-muted)' }}>
            {completedTasks} of {totalTasks} assigned tasks completed today.
          </p>
        </div>
      </div>

      {/* Right: 3D Holographic Circular Progress Meter */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Animated Glow Progress Arc */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#progressGrad)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))'
              }}
            />
            <defs>
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="60%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Percentage Display */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span
              style={{
                fontSize: '20px',
                fontWeight: '800',
                color: '#fff',
                letterSpacing: '-0.5px'
              }}
            >
              <AnimatedCounter value={percentage} suffix="%" />
            </span>
            <span style={{ fontSize: '10px', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Done
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Worker3DProgressRing;
