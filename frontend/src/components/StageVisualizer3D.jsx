import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Check, PhoneCall, RefreshCw } from 'lucide-react';

const THEMES = [
  {
    id: 'royal-gold',
    name: 'Royal Gold & Amber',
    accent: '#d4af37',
    carpet: 0x8b1e1e, // Royal crimson carpet
    pillar: 0xe6b432, // Polished gold
    light1: 0xffd27d,
    light2: 0xff9900,
    ambient: 0xfff0dd,
    desc: 'Traditional royal wedding mandap with gold pillars and warm amber halos.'
  },
  {
    id: 'rose-garden',
    name: 'Romantic Rose Blush',
    accent: '#f472b6',
    carpet: 0x831843, // Deep blush wine
    pillar: 0xfbcfe8, // Rose gold ivory
    light1: 0xff80bf,
    light2: 0xffd1dc,
    ambient: 0xffedf4,
    desc: 'Pastel romantic celebration with soft pink illumination and fairy flower arches.'
  },
  {
    id: 'midnight-star',
    name: 'Midnight Celestial',
    accent: '#818cf8',
    carpet: 0x1e1b4b, // Deep royal indigo
    pillar: 0xc7d2fe, // Silver platinum
    light1: 0x6366f1,
    light2: 0xa855f7,
    ambient: 0xede9fe,
    desc: 'Modern gala reception with sapphire beams, violet undertones, and starry crystals.'
  },
  {
    id: 'emerald-palace',
    name: 'Emerald Grandeur',
    accent: '#34d399',
    carpet: 0x064e3b, // Deep emerald carpet
    pillar: 0xf5ecc8, // Gold-flecked ivory
    light1: 0x10b981,
    light2: 0xfbbf24,
    ambient: 0xecfdf5,
    desc: 'Grand heritage setup blending rich emerald greens with handcrafted gold arches.'
  }
];

const StageVisualizer3D = () => {
  const mountRef = useRef(null);
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);

  // References to dynamic Three.js objects
  const threeRefs = useRef({
    scene: null,
    camera: null,
    renderer: null,
    stageGroup: null,
    pillars: [],
    carpetMesh: null,
    lights: [],
    spotlightBeams: [],
    targetRotationY: 0,
    targetRotationX: 0.2,
    currentRotationY: 0,
    currentRotationX: 0.2,
    zoomDist: 17
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4, 17);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    threeRefs.current.scene = scene;
    threeRefs.current.camera = camera;
    threeRefs.current.renderer = renderer;

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(THEMES[0].ambient, 1.2);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(THEMES[0].light1, 8, 40, Math.PI / 4, 0.4, 1.2);
    mainSpot.position.set(0, 16, 8);
    mainSpot.castShadow = true;
    scene.add(mainSpot);

    const leftSpot = new THREE.PointLight(THEMES[0].light2, 3, 25);
    leftSpot.position.set(-8, 8, 4);
    scene.add(leftSpot);

    const rightSpot = new THREE.PointLight(THEMES[0].light1, 3, 25);
    rightSpot.position.set(8, 8, 4);
    scene.add(rightSpot);

    threeRefs.current.lights = [ambientLight, mainSpot, leftSpot, rightSpot];

    // 4. Stage Group
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);
    threeRefs.current.stageGroup = stageGroup;

    // A. Multi-Tier Stage Base
    const baseGeo = new THREE.BoxGeometry(14, 0.6, 9);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1f1811,
      metalness: 0.2,
      roughness: 0.8
    });
    const stageBase = new THREE.Mesh(baseGeo, baseMat);
    stageBase.position.y = -0.3;
    stageBase.receiveShadow = true;
    stageGroup.add(stageBase);

    // Top Platform Layer
    const topPlatformGeo = new THREE.BoxGeometry(12.5, 0.3, 7.5);
    const topPlatformMat = new THREE.MeshStandardMaterial({
      color: 0x2b2218,
      metalness: 0.3,
      roughness: 0.7
    });
    const topPlatform = new THREE.Mesh(topPlatformGeo, topPlatformMat);
    topPlatform.position.y = 0.15;
    topPlatform.receiveShadow = true;
    stageGroup.add(topPlatform);

    // B. Royal Stage Carpet
    const carpetGeo = new THREE.PlaneGeometry(11.8, 6.8);
    const carpetMat = new THREE.MeshStandardMaterial({
      color: THEMES[0].carpet,
      roughness: 0.9,
      metalness: 0.05
    });
    const carpetMesh = new THREE.Mesh(carpetGeo, carpetMat);
    carpetMesh.rotation.x = -Math.PI / 2;
    carpetMesh.position.y = 0.31;
    carpetMesh.receiveShadow = true;
    stageGroup.add(carpetMesh);
    threeRefs.current.carpetMesh = carpetMesh;

    // Carpet Gold Border Trim
    const carpetTrimGeo = new THREE.RingGeometry(5.9, 6.0, 4);
    // C. Mandap Pillars (4 Ornate Columns)
    const pillarMat = new THREE.MeshStandardMaterial({
      color: THEMES[0].pillar,
      metalness: 0.85,
      roughness: 0.22,
      emissive: 0x2d1f05,
      emissiveIntensity: 0.15
    });

    const pillarPositions = [
      [-4.5, -2],
      [4.5, -2],
      [-4.5, 2],
      [4.5, 2]
    ];

    const pillars = [];
    pillarPositions.forEach(([px, pz]) => {
      const pColGroup = new THREE.Group();

      // Column shaft
      const colGeo = new THREE.CylinderGeometry(0.24, 0.28, 5.2, 24);
      const colMesh = new THREE.Mesh(colGeo, pillarMat);
      colMesh.position.y = 2.9;
      colMesh.castShadow = true;
      pColGroup.add(colMesh);

      // Capital top
      const capGeo = new THREE.BoxGeometry(0.7, 0.3, 0.7);
      const capMesh = new THREE.Mesh(capGeo, pillarMat);
      capMesh.position.y = 5.6;
      pColGroup.add(capMesh);

      // Plinth base
      const baseColGeo = new THREE.BoxGeometry(0.8, 0.4, 0.8);
      const baseColMesh = new THREE.Mesh(baseColGeo, pillarMat);
      baseColMesh.position.y = 0.5;
      pColGroup.add(baseColMesh);

      pColGroup.position.set(px, 0, pz);
      stageGroup.add(pColGroup);
      pillars.push(pColGroup);
    });
    threeRefs.current.pillars = pillars;

    // D. Royal Mandap Arch Canopy
    const archGeo = new THREE.TorusGeometry(4.6, 0.25, 16, 60, Math.PI);
    const archMat = new THREE.MeshStandardMaterial({
      color: THEMES[0].pillar,
      metalness: 0.85,
      roughness: 0.25
    });
    const archMesh = new THREE.Mesh(archGeo, archMat);
    archMesh.position.set(0, 5.6, -2);
    stageGroup.add(archMesh);

    // Front Decorative Arch
    const frontArchGeo = new THREE.TorusGeometry(4.6, 0.2, 16, 60, Math.PI);
    const frontArchMesh = new THREE.Mesh(frontArchGeo, archMat);
    frontArchMesh.position.set(0, 5.6, 2);
    stageGroup.add(frontArchMesh);

    // Horizontal cross-beams
    const beamGeo = new THREE.BoxGeometry(0.22, 0.22, 4);
    const beamLeft = new THREE.Mesh(beamGeo, archMat);
    beamLeft.position.set(-4.5, 5.6, 0);
    stageGroup.add(beamLeft);

    const beamRight = new THREE.Mesh(beamGeo, archMat);
    beamRight.position.set(4.5, 5.6, 0);
    stageGroup.add(beamRight);

    // E. Grand Hanging Crystal Chandelier
    const chandelierGroup = new THREE.Group();
    chandelierGroup.position.set(0, 5.2, 0);

    const chanBaseGeo = new THREE.CylinderGeometry(0.8, 0.5, 0.2, 16);
    const chanBase = new THREE.Mesh(chanBaseGeo, archMat);
    chandelierGroup.add(chanBase);

    // Crystal droplets
    const crystalGeo = new THREE.OctahedronGeometry(0.18, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      roughness: 0.1,
      metalness: 0.1,
      emissive: 0xfff3c4,
      emissiveIntensity: 0.6
    });

    for (let r = 0; r < 8; r++) {
      const angle = (r / 8) * Math.PI * 2;
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.set(Math.cos(angle) * 0.6, -0.4, Math.sin(angle) * 0.6);
      chandelierGroup.add(crystal);
    }
    const centerCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), crystalMat);
    centerCrystal.position.set(0, -0.65, 0);
    chandelierGroup.add(centerCrystal);

    stageGroup.add(chandelierGroup);

    // F. Backdrop LED Panels / Frame
    const backdropGeo = new THREE.PlaneGeometry(10.5, 5);
    const backdropMat = new THREE.MeshStandardMaterial({
      color: 0x18130e,
      roughness: 0.4,
      metalness: 0.3
    });
    const backdropMesh = new THREE.Mesh(backdropGeo, backdropMat);
    backdropMesh.position.set(0, 3, -4.2);
    stageGroup.add(backdropMesh);

    // Backdrop Golden Lattice / Floral grid
    const latticeGeo = new THREE.BoxGeometry(10.2, 0.08, 0.05);
    for (let i = 0; i < 5; i++) {
      const latticeBar = new THREE.Mesh(latticeGeo, archMat);
      latticeBar.position.set(0, 1 + i * 1, -4.15);
      stageGroup.add(latticeBar);
    }

    // G. 2 Royal Bride & Groom Thrones / Sofas
    const sofaGroup = new THREE.Group();
    sofaGroup.position.set(0, 0.3, -0.5);

    const sofaSeatGeo = new THREE.BoxGeometry(3.6, 0.5, 1.4);
    const sofaMat = new THREE.MeshStandardMaterial({
      color: 0xf7f1e5,
      roughness: 0.7,
      metalness: 0.1
    });
    const sofaSeat = new THREE.Mesh(sofaSeatGeo, sofaMat);
    sofaSeat.position.y = 0.5;
    sofaSeat.castShadow = true;
    sofaGroup.add(sofaSeat);

    const sofaBackGeo = new THREE.BoxGeometry(3.8, 1.8, 0.4);
    const sofaBack = new THREE.Mesh(sofaBackGeo, sofaMat);
    sofaBack.position.set(0, 1.4, -0.6);
    sofaBack.castShadow = true;
    sofaGroup.add(sofaBack);

    // Gold trim on sofa back
    const sofaTrimGeo = new THREE.BoxGeometry(4.0, 0.15, 0.5);
    const sofaTrim = new THREE.Mesh(sofaTrimGeo, archMat);
    sofaTrim.position.set(0, 2.35, -0.6);
    sofaGroup.add(sofaTrim);

    stageGroup.add(sofaGroup);

    // H. Soft Floating Golden Confetti / Petals
    const petalCount = 80;
    const petalGeo = new THREE.BufferGeometry();
    const petalPositions = new Float32Array(petalCount * 3);
    const petalVelocities = [];

    for (let i = 0; i < petalCount; i++) {
      petalPositions[i * 3] = (Math.random() - 0.5) * 12;
      petalPositions[i * 3 + 1] = Math.random() * 6 + 1;
      petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      petalVelocities.push({
        y: Math.random() * 0.015 + 0.008,
        rot: Math.random() * 0.03
      });
    }

    petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));
    const petalMat = new THREE.PointsMaterial({
      size: 0.25,
      color: THEMES[0].accent,
      transparent: true,
      opacity: 0.8
    });
    const petalPoints = new THREE.Points(petalGeo, petalMat);
    stageGroup.add(petalPoints);

    // 5. Drag & Rotate Interaction
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const handlePointerDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      previousMouseX = clientX;
      previousMouseY = clientY;
    };

    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - previousMouseX;
      const deltaY = clientY - previousMouseY;

      threeRefs.current.targetRotationY += deltaX * 0.008;
      threeRefs.current.targetRotationX = Math.max(
        -0.1,
        Math.min(0.55, threeRefs.current.targetRotationX + deltaY * 0.006)
      );

      previousMouseX = clientX;
      previousMouseY = clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 2000);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handlePointerDown);
    domEl.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    domEl.addEventListener('touchstart', handlePointerDown, { passive: true });
    domEl.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 6. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 800;
      const newH = container.clientHeight || 550;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 7. Render Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Auto rotation if not manually dragging
      if (autoRotate && !isDragging) {
        threeRefs.current.targetRotationY += 0.003;
      }

      // Smooth interpolation for rotation
      threeRefs.current.currentRotationY += (threeRefs.current.targetRotationY - threeRefs.current.currentRotationY) * 0.08;
      threeRefs.current.currentRotationX += (threeRefs.current.targetRotationX - threeRefs.current.currentRotationX) * 0.08;

      // Update camera spherical orbit around stage center
      const dist = threeRefs.current.zoomDist;
      const rotY = threeRefs.current.currentRotationY;
      const rotX = threeRefs.current.currentRotationX;

      camera.position.x = dist * Math.sin(rotY) * Math.cos(rotX);
      camera.position.z = dist * Math.cos(rotY) * Math.cos(rotX);
      camera.position.y = dist * Math.sin(rotX) + 2.5;
      camera.lookAt(0, 2.5, 0);

      // Chandelier subtle oscillation
      chandelierGroup.rotation.y = Math.sin(elapsed * 1.5) * 0.08;

      // Floating petals movement
      const pArr = petalGeo.attributes.position.array;
      for (let i = 0; i < petalCount; i++) {
        pArr[i * 3 + 1] -= petalVelocities[i].y;
        if (pArr[i * 3 + 1] < 0.3) {
          pArr[i * 3 + 1] = 6;
        }
      }
      petalGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener('mousedown', handlePointerDown);
      domEl.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domEl.removeEventListener('touchstart', handlePointerDown);
      domEl.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Handle Theme Switching
  const handleSelectTheme = (theme) => {
    setActiveTheme(theme);
    const { lights, carpetMesh, pillars } = threeRefs.current;

    if (carpetMesh) {
      carpetMesh.material.color.setHex(theme.carpet);
    }

    if (pillars && pillars.length > 0) {
      pillars.forEach((pGroup) => {
        pGroup.children.forEach((mesh) => {
          if (mesh.material) {
            mesh.material.color.setHex(theme.pillar);
          }
        });
      });
    }

    if (lights && lights.length === 4) {
      const [ambient, mainSpot, leftSpot, rightSpot] = lights;
      ambient.color.setHex(theme.ambient);
      mainSpot.color.setHex(theme.light1);
      leftSpot.color.setHex(theme.light2);
      rightSpot.color.setHex(theme.light1);
    }
  };

  const handleZoom = (delta) => {
    threeRefs.current.zoomDist = Math.max(10, Math.min(26, threeRefs.current.zoomDist + delta));
  };

  const handleResetView = () => {
    threeRefs.current.targetRotationY = 0;
    threeRefs.current.targetRotationX = 0.2;
    threeRefs.current.zoomDist = 17;
  };

  return (
    <section
      id="stage-visualizer"
      className="section"
      style={{
        backgroundColor: '#160d05',
        position: 'relative',
        color: 'var(--white)',
        padding: '100px 0 90px',
        overflow: 'hidden'
      }}
    >
      {/* Background Ambience Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '500px',
          background: `radial-gradient(circle, ${activeTheme.accent}25 0%, transparent 70%)`,
          filter: 'blur(70px)',
          pointerEvents: 'none',
          transition: 'all 0.8s ease'
        }}
      />

      <div className="container">
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
              border: '1px solid rgba(212, 175, 55, 0.35)',
              color: 'var(--gold)',
              fontSize: '0.85rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '15px'
            }}
          >
            <Sparkles size={16} />
            360° Real-time 3D Preview
          </div>
          <h2
            className="section-title"
            style={{
              color: 'var(--white)',
              marginBottom: '15px',
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)'
            }}
          >
            Interactive 3D Stage &amp; Mandap Visualizer
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.75)',
              maxWidth: '680px',
              margin: '0 auto',
              fontSize: '1.05rem',
              lineHeight: 1.6
            }}
          >
            Click and drag to rotate the stage in 3D. Switch between custom lighting themes to visualize your wedding celebration before setting foot in the venue!
          </p>
        </div>

        {/* 3D Visualizer Card */}
        <div
          style={{
            position: 'relative',
            backgroundColor: 'rgba(28, 18, 9, 0.85)',
            borderRadius: '24px',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden'
          }}
        >
          {/* Top Control Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
              backgroundColor: 'rgba(15, 9, 3, 0.6)',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  boxShadow: '0 0 10px #22c55e'
                }}
              />
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--gold-light)' }}>
                Live 3D WebGL Engine • Drag to Rotate
              </span>
            </div>

            {/* Quick Control Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                title={autoRotate ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  backgroundColor: autoRotate ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: 'var(--white)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <RotateCw size={14} className={autoRotate ? 'spin-slow' : ''} />
                {autoRotate ? 'Rotating' : 'Paused'}
              </button>

              <button
                onClick={() => handleZoom(-2)}
                title="Zoom In"
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  color: 'var(--white)',
                  cursor: 'pointer'
                }}
              >
                <ZoomIn size={16} />
              </button>

              <button
                onClick={() => handleZoom(2)}
                title="Zoom Out"
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  color: 'var(--white)',
                  cursor: 'pointer'
                }}
              >
                <ZoomOut size={16} />
              </button>

              <button
                onClick={handleResetView}
                title="Reset View Angle"
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  color: 'var(--white)',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* 3D Canvas Viewport */}
          <div
            ref={mountRef}
            style={{
              width: '100%',
              height: '520px',
              position: 'relative',
              cursor: 'grab'
            }}
          />

          {/* Floating Instruction Hint */}
          <div
            style={{
              position: 'absolute',
              bottom: '120px',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              padding: '6px 16px',
              borderRadius: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(6px)',
              transition: 'opacity 0.3s ease',
              opacity: isInteracting ? 0 : 0.9
            }}
          >
            👆 Click &amp; Drag in any direction to explore 360°
          </div>

          {/* Bottom Theme Switcher Bar */}
          <div
            style={{
              padding: '22px 28px',
              backgroundColor: 'rgba(15, 9, 3, 0.8)',
              borderTop: '1px solid rgba(212, 175, 55, 0.2)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px'
            }}
          >
            <div>
              <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--gold)', letterSpacing: '1px', marginBottom: '6px' }}>
                Select Stage Theme
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {THEMES.map((theme) => {
                  const isSelected = activeTheme.id === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleSelectTheme(theme)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '24px',
                        backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: isSelected ? `2px solid ${theme.accent}` : '1px solid rgba(255, 255, 255, 0.12)',
                        color: isSelected ? 'var(--white)' : 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.88rem',
                        fontWeight: isSelected ? '600' : '400',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        boxShadow: isSelected ? `0 0 15px ${theme.accent}40` : 'none'
                      }}
                    >
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: theme.accent,
                          display: 'inline-block'
                        }}
                      />
                      {theme.name}
                      {isSelected && <Check size={14} style={{ color: theme.accent }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Book Theme Call To Action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--gold-light)' }}>
                  Ready to craft this design?
                </p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                  Customizable with flower varieties &amp; lighting
                </p>
              </div>

              <a
                href={`https://wa.me/918124931018?text=${encodeURIComponent(
                  `Hi BPS Events! I explored your 3D Stage Visualizer and I loved the "${activeTheme.name}" stage design. Can you share availability and quotation for my event?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '30px',
                  boxShadow: '0 8px 25px rgba(212, 175, 55, 0.35)'
                }}
              >
                <PhoneCall size={18} />
                Book This 3D Setup
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StageVisualizer3D;
