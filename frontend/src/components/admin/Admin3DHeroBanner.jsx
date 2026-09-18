import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Shield, Clock, Calendar, Zap } from 'lucide-react';

const Admin3DHeroBanner = ({ adminName = 'Administrator', role = 'Super Admin' }) => {
  const mountRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 220;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.4);
    scene.add(ambientLight);

    const goldPoint = new THREE.PointLight(0xd4af37, 3, 20);
    goldPoint.position.set(5, 3, 5);
    scene.add(goldPoint);

    const bluePoint = new THREE.PointLight(0x3b82f6, 2.5, 20);
    bluePoint.position.set(-5, -2, 4);
    scene.add(bluePoint);

    // 4. Floating 3D Geometries (Golden Torus Knot & Orbiting Spheres)
    const group = new THREE.Group();
    scene.add(group);

    // Centerpiece: Gold Metallic Torus Knot
    const knotGeo = new THREE.TorusKnotGeometry(1.6, 0.38, 128, 32, 2, 3);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0xe5c35a,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x4a3205,
      emissiveIntensity: 0.25
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    group.add(knot);

    // Outer Orbit Ring
    const orbitGeo = new THREE.TorusGeometry(3.2, 0.05, 16, 100);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });
    const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
    orbitRing.rotation.x = Math.PI / 3;
    group.add(orbitRing);

    // Floating Stardust Particles
    const particleCount = 70;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      pPositions[i] = (Math.random() - 0.5) * 16;
      pPositions[i + 1] = (Math.random() - 0.5) * 8;
      pPositions[i + 2] = (Math.random() - 0.5) * 8;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xfde68a,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Position group to the right side of the banner
    group.position.set(4.5, 0, 0);

    // 5. Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 1.5;
      mouseY = y * 1.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 6. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate Knot & Orbit
      knot.rotation.x = elapsedTime * 0.4;
      knot.rotation.y = elapsedTime * 0.6;
      orbitRing.rotation.z = -elapsedTime * 0.25;

      // Gentle floating motion
      knot.position.y = Math.sin(elapsedTime * 1.5) * 0.15;

      // Mouse parallax smooth interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      group.rotation.y = targetX * 0.8;
      group.rotation.x = targetY * 0.8;

      // Particle subtle swirl
      particles.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };
    animate();

    // 7. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);

      // Adjust group position based on screen width
      if (newW < 900) {
        group.position.set(3, 0, 0);
        group.scale.set(0.75, 0.75, 0.75);
      } else {
        group.position.set(4.8, 0, 0);
        group.scale.set(1, 1, 1);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      knotGeo.dispose();
      knotMat.dispose();
      orbitGeo.dispose();
      orbitMat.dispose();
      pGeo.dispose();
      pMat.dispose();
    };
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '180px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(26, 26, 32, 0.95) 0%, rgba(15, 15, 20, 0.85) 60%, rgba(212, 175, 55, 0.08) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.25)',
        boxShadow: '0 20px 45px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '28px 36px',
        backdropFilter: 'blur(20px)'
      }}
    >
      {/* Three.js 3D Background Canvas */}
      <div
        ref={mountRef}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Decorative Radial Ambient Glow Behind 3D Knot */}
      <div
        style={{
          position: 'absolute',
          right: '5%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, rgba(59, 130, 246, 0.1) 45%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Banner Foreground Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '650px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
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
            <Shield size={13} />
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
            Live System
          </span>
        </div>

        <div>
          <h1
            style={{
              margin: '0 0 6px 0',
              fontSize: '28px',
              fontWeight: '800',
              letterSpacing: '-0.5px',
              background: 'linear-gradient(90deg, #ffffff 30%, #fde68a 70%, #d4af37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 20px rgba(212, 175, 55, 0.3)'
            }}
          >
            Welcome back, {adminName}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              color: 'var(--admin-text-muted)',
              lineHeight: '1.5'
            }}
          >
            Executive Operations & Real-Time Event Management Command Center.
          </p>
        </div>

        {/* Live Clock & Date Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px', marginTop: '4px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--admin-text-main)',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <Clock size={14} style={{ color: 'var(--admin-primary)' }} />
            <span>{formattedTime}</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--admin-text-muted)',
              fontSize: '13px'
            }}
          >
            <Calendar size={14} style={{ color: '#3b82f6' }} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin3DHeroBanner;
