import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple Floating Particles
function SimpleParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 2000;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = (Math.random() - 0.5) * 50;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;

      const color = new THREE.Color();
      color.setHSL(0.55 + Math.random() * 0.1, 0.7, 0.6);
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

      for (let i = 0; i < particleCount; i += 3) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time * 0.5 + positions[i3]) * 0.01;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y = time * 0.03;
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
        size={0.15}
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Gentle Orbs
function GentleOrbs() {
  const orbs = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      position: [
        Math.cos((i / 4) * Math.PI * 2) * 15,
        Math.sin((i / 4) * Math.PI * 2) * 10,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      color: i % 2 === 0 ? '#00a8e8' : '#007ea7',
    }));
  }, []);

  return (
    <>
      {orbs.map((orb, i) => (
        <GentleOrb key={i} {...orb} index={i} />
      ))}
    </>
  );
}

function GentleOrb({ position, color, index }: { position: [number, number, number], color: string, index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5 + index) * 2;
      meshRef.current.position.x = position[0] + Math.cos(time * 0.3 + index) * 1.5;
      
      const scale = 1 + Math.sin(time * 0.8 + index) * 0.2;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[20, 20, 20]} intensity={1.5} color="#00a8e8" />
        <pointLight position={[-20, -20, -20]} intensity={1.5} color="#007ea7" />
        
        <SimpleParticles />
        <GentleOrbs />
      </Canvas>
    </div>
  );
}
