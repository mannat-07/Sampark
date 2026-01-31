import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Enhanced Particle Wave System - Optimized
function ParticleWave() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 3000; // Reduced from 5000 for better performance

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
      color.setHSL(0.52 + Math.random() * 0.08, 1, 0.65);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;

      // Update every other particle for better performance
      for (let i = 0; i < particleCount; i += 2) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];

        positions[i3] += Math.sin(time * 0.3 + y * 0.02) * 0.015;
        positions[i3 + 1] += Math.cos(time * 0.2 + x * 0.02) * 0.015;
        positions[i3 + 2] += Math.sin(time * 0.25 + x * 0.02 + y * 0.02) * 0.015;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y = time * 0.02; // Slower rotation
      pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.08;
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
        size={0.3}
        vertexColors
        transparent
        opacity={0.95}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Energy Orbs - Optimized
function EnergyOrbs() {
  const orbs = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        Math.cos((i / 8) * Math.PI * 2) * 20,
        Math.sin((i / 8) * Math.PI * 2) * 20,
        (Math.random() - 0.5) * 18,
      ] as [number, number, number],
      color: ['#00a8e8', '#007ea7', '#00d9ff', '#06b6d4'][i % 4],
      speed: 0.8 + Math.random() * 1.2,
    }));
  }, []);

  return (
    <>
      {orbs.map((orb, i) => (
        <EnergyOrb key={i} {...orb} index={i} />
      ))}
    </>
  );
}

interface EnergyOrbProps {
  position: [number, number, number];
  color: string;
  speed: number;
  index: number;
}

function EnergyOrb({ position, color, speed, index }: EnergyOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * speed * 2 + index) * 0.4;
      meshRef.current.scale.setScalar(scale);
      
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + index) * 5;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed * 0.5 + index) * 3;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.85}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>
      <pointLight position={position} color={color} intensity={4} distance={20} />
    </>
  );
}

// Floating Shapes - Optimized
function FloatingShapes() {
  const shapes = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 40,
      ] as [number, number, number],
      baseScale: 0.8 + Math.random() * 2.5,
      speed: 0.3 + Math.random() * 0.8,
      pulseSpeed: 0.5 + Math.random() * 1.5,
      color: ['#00a8e8', '#007ea7', '#00d9ff', '#00c4ff', '#0096d4', '#06b6d4'][i % 6],
    }));
  }, []);

  return (
    <>
      {shapes.map((shape, i) => (
        <FloatingShape key={i} {...shape} index={i} />
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
}

function FloatingShape({ position, baseScale, speed, pulseSpeed, color, index }: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.x += 0.005 * speed;
      meshRef.current.rotation.y += 0.008 * speed;
      
      // Floating movement
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + index) * 4;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed * 0.6 + index) * 3;
      meshRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * speed * 0.4 + index * 0.5) * 2;
      
      // Pulsing size animation
      const pulse = Math.sin(state.clock.elapsedTime * pulseSpeed + index) * 0.4 + 1;
      meshRef.current.scale.setScalar(baseScale * pulse);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.7}
        emissive={color}
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}

export default function AnimatedBackground() {
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
        <fog attach="fog" args={['#e0f7fa', 40, 90]} />
        
        <ambientLight intensity={1.5} />
        <pointLight position={[20, 20, 20]} intensity={5} color="#00d9ff" />
        <pointLight position={[-20, -20, -20]} intensity={4.5} color="#00a8e8" />
        
        <ParticleWave />
        <EnergyOrbs />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}
