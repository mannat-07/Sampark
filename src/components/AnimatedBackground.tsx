import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Minimal Particle System - Theme Aware
function ParticleWave({ isDark }: { isDark: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 200; // Significantly reduced for minimal look

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const color = new THREE.Color();
      // Light bluish particles for dark theme to stand out, normal for light theme
      if (isDark) {
        // Light cyan/blue tones for dark theme
        color.setHSL(0.52 + Math.random() * 0.08, 0.7, 0.65);
      } else {
        // Regular blue tones for light theme
        color.setHSL(0.52 + Math.random() * 0.08, 0.6, 0.65);
      }
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    return { positions, colors };
  }, [isDark]);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;

      // Gentler movement, update every 3rd particle
      for (let i = 0; i < particleCount; i += 3) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];

        positions[i3] += Math.sin(time * 0.2 + y * 0.01) * 0.01;
        positions[i3 + 1] += Math.cos(time * 0.15 + x * 0.01) * 0.01;
        positions[i3 + 2] += Math.sin(time * 0.18 + x * 0.01 + y * 0.01) * 0.01;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y = time * 0.015; // Even slower rotation
      pointsRef.current.rotation.x = Math.sin(time * 0.08) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        vertexColors
        transparent
        opacity={isDark ? 0.6 : 0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Subtle Energy Orbs - Reduced count and intensity
function EnergyOrbs({ isDark }: { isDark: boolean }) {
  const orbs = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      position: [
        Math.cos((i / 4) * Math.PI * 2) * 18,
        Math.sin((i / 4) * Math.PI * 2) * 18,
        (Math.random() - 0.5) * 15,
      ] as [number, number, number],
      // Light cyan colors for dark theme, regular blue for light
      color: isDark ? ['#3dd9ff', '#00d9ff'][i % 2] : ['#00a8e8', '#007ea7'][i % 2],
      speed: 0.5 + Math.random() * 0.5,
    }));
  }, [isDark]);

  return (
    <>
      {orbs.map((orb, i) => (
        <EnergyOrb key={i} {...orb} index={i} isDark={isDark} />
      ))}
    </>
  );
}

interface EnergyOrbProps {
  position: [number, number, number];
  color: string;
  speed: number;
  index: number;
  isDark: boolean;
}

function EnergyOrb({ position, color, speed, index, isDark }: EnergyOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * speed + index) * 0.25;
      meshRef.current.scale.setScalar(scale);
      
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.8 + index) * 3;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed * 0.4 + index) * 2;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={isDark ? 0.5 : 0.5}
          emissive={color}
          emissiveIntensity={isDark ? 1.2 : 1.0}
        />
      </mesh>
      <pointLight 
        position={position} 
        color={color} 
        intensity={isDark ? 3 : 2.5} 
        distance={15} 
      />
    </>
  );
}

// Minimal Floating Shapes
function FloatingShapes({ isDark }: { isDark: boolean }) {
  const shapes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 35,
      ] as [number, number, number],
      baseScale: 0.6 + Math.random() * 1.5,
      speed: 0.2 + Math.random() * 0.4,
      pulseSpeed: 0.4 + Math.random() * 0.8,
      // Light cyan/blue for dark theme visibility
      color: isDark ? ['#3dd9ff', '#00d9ff', '#5ce1ff'][i % 3] : ['#00a8e8', '#007ea7', '#00c4ff'][i % 3],
    }));
  }, [isDark]);

  return (
    <>
      {shapes.map((shape, i) => (
        <FloatingShape key={i} {...shape} index={i} isDark={isDark} />
      ))}
    </>
  );
}

interface FloatingShapeProps {
  position: [number, number, number];
  baseScale: number;
  speed: number;
  pulseSpeed: number;
  color: string;
  index: number;
  isDark: boolean;
}

function FloatingShape({ position, baseScale, speed, pulseSpeed, color, index, isDark }: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Very gentle rotation
      meshRef.current.rotation.x += 0.003 * speed;
      meshRef.current.rotation.y += 0.005 * speed;
      
      // Subtle floating movement
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + index) * 2.5;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed * 0.5 + index) * 2;
      meshRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * speed * 0.3 + index * 0.5) * 1.5;
      
      // Gentle pulsing
      const pulse = Math.sin(state.clock.elapsedTime * pulseSpeed + index) * 0.3 + 1;
      meshRef.current.scale.setScalar(baseScale * pulse);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 28, 28]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={isDark ? 0.5 : 0.5}
        emissive={color}
        emissiveIntensity={isDark ? 0.8 : 0.7}
      />
    </mesh>
  );
}

export default function AnimatedBackground() {
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-white dark:bg-gradient-to-br dark:from-[#0a0e27] dark:via-[#1a0b2e] dark:to-[#0f0a1e]" />
      <Canvas
        camera={{ position: [0, 0, 40], fov: 60 }}
        gl={{ 
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        frameloop="always"
        performance={{ min: 0.5 }}
      >
        <fog attach="fog" args={[isDark ? '#0a0e27' : '#e0f7fa', 40, 90]} />
        
        <ambientLight intensity={isDark ? 1.0 : 1.2} />
        <pointLight position={[20, 20, 20]} intensity={isDark ? 3.5 : 4} color={isDark ? '#3dd9ff' : '#00d9ff'} />
        <pointLight position={[-20, -20, -20]} intensity={isDark ? 3.5 : 3.5} color={isDark ? '#5ce1ff' : '#00a8e8'} />
        
        <ParticleWave isDark={isDark} />
        <EnergyOrbs isDark={isDark} />
        <FloatingShapes isDark={isDark} />
      </Canvas>
    </div>
  );
}
