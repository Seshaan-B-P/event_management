import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeHeroBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    // 2. WebGL Renderer
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

    // 3. Lighting (Rich Luxury Gold Ambiance)
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);

    const goldPointLight1 = new THREE.PointLight(0xffd700, 3.5, 50);
    goldPointLight1.position.set(10, 10, 10);
    scene.add(goldPointLight1);

    const warmPointLight2 = new THREE.PointLight(0xff8c00, 2.5, 40);
    warmPointLight2.position.set(-10, -8, 8);
    scene.add(warmPointLight2);

    const royalBlueRimLight = new THREE.PointLight(0x7b52ff, 1.5, 30);
    royalBlueRimLight.position.set(0, 12, -8);
    scene.add(royalBlueRimLight);

    // 4. Intertwined 3D Golden Wedding Rings
    const ringGroup = new THREE.Group();

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xe6b432,
      metalness: 0.92,
      roughness: 0.18,
      emissive: 0x4a3205,
      emissiveIntensity: 0.2
    });

    // Ring 1 (Groom / Bride Band)
    const ringGeo1 = new THREE.TorusGeometry(3.2, 0.28, 32, 100);
    const ring1 = new THREE.Mesh(ringGeo1, ringMat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    ringGroup.add(ring1);

    // Ring 2 (Intertwined Partner Band)
    const ringGeo2 = new THREE.TorusGeometry(3.2, 0.28, 32, 100);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat);
    ring2.position.set(1.4, 0.2, 0);
    ring2.rotation.x = Math.PI / 2.5;
    ring2.rotation.y = -Math.PI / 4;
    ringGroup.add(ring2);

    // 3D Diamond / Crystal Gem on Ring
    const diamondGeo = new THREE.OctahedronGeometry(0.55, 0);
    const diamondMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 0.8,
      emissive: 0xfff0aa,
      emissiveIntensity: 0.4
    });
    const diamond = new THREE.Mesh(diamondGeo, diamondMat);
    diamond.position.set(0, 3.25, 0);
    ring1.add(diamond);

    ringGroup.position.set(4.5, 0, -2);
    scene.add(ringGroup);

    // 5. Floating 3D Golden Stardust & Bokeh Particles
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      scales[i] = Math.random() * 0.18 + 0.04;
      speeds[i] = Math.random() * 0.02 + 0.005;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle texture generator (golden soft circular glow)
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 235, 170, 1)');
    grad.addColorStop(0.3, 'rgba(212, 175, 55, 0.8)');
    grad.addColorStop(0.7, 'rgba(212, 175, 55, 0.2)');
    grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.45,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Floating 3D Geometric Luxury Stars
    const starGroup = new THREE.Group();
    const starGeo = new THREE.IcosahedronGeometry(0.35, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xffe484,
      metalness: 0.8,
      roughness: 0.3,
      emissive: 0x553e05,
      emissiveIntensity: 0.3
    });

    const floatingStars = [];
    for (let i = 0; i < 16; i++) {
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.set(
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 16
      );
      const rotSpeed = {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02
      };
      starGroup.add(star);
      floatingStars.push({ mesh: star, rotSpeed, baseY: star.position.y, seed: Math.random() * 10 });
    }
    scene.add(starGroup);

    // 7. Interactive Mouse Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const onMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // 8. Resize Handler
    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;

      // Adapt ring group position for mobile vs desktop
      if (newW < 768) {
        ringGroup.position.set(0, 1.5, -4);
        ringGroup.scale.set(0.7, 0.7, 0.7);
      } else {
        ringGroup.position.set(4.5, 0, -2);
        ringGroup.scale.set(1, 1, 1);
      }

      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', onResize);
    onResize();

    // 9. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Rotate Intertwined Rings
      ringGroup.rotation.y = elapsedTime * 0.35 + currentMouseX * 0.6;
      ringGroup.rotation.x = Math.sin(elapsedTime * 0.25) * 0.2 + currentMouseY * 0.4;
      ringGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.4;

      // Orbit Lights
      goldPointLight1.position.x = Math.sin(elapsedTime * 0.7) * 12;
      goldPointLight1.position.z = Math.cos(elapsedTime * 0.7) * 12;
      warmPointLight2.position.x = Math.cos(elapsedTime * 0.5) * -12;
      warmPointLight2.position.z = Math.sin(elapsedTime * 0.5) * 12;

      // Animate Particles
      const posArr = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += speeds[i];
        if (posArr[i * 3 + 1] > 15) {
          posArr[i * 3 + 1] = -15;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsedTime * 0.02 + currentMouseX * 0.1;

      // Animate Floating Stars
      floatingStars.forEach(({ mesh, rotSpeed, baseY, seed }) => {
        mesh.rotation.x += rotSpeed.x;
        mesh.rotation.y += rotSpeed.y;
        mesh.position.y = baseY + Math.sin(elapsedTime * 1.2 + seed) * 0.3;
      });

      // Subtle Camera Tilt
      camera.position.x = currentMouseX * 1.5;
      camera.position.y = -currentMouseY * 1.2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 10. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      ringMat.dispose();
      diamondGeo.dispose();
      diamondMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      starGeo.dispose();
      starMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}
    />
  );
};

export default ThreeHeroBackground;
