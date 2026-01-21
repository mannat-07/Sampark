import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Building({ position, height, color }: { position: [number, number, number]; height: number; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = height / 2 + Math.sin(state.clock.elapsedTime + position[0]) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[position[0], height / 2, position[2]]} castShadow receiveShadow>
      <boxGeometry args={[0.8, height, 0.8]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.3} 
        roughness={0.4}
        envMapIntensity={0.5}
      />
    </mesh>
  );
}

function GlassSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      sphereRef.current.position.y = 3.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={sphereRef} position={[0, 3.5, 0]}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          resolution={512}
          transmission={0.95}
          roughness={0.1}
          thickness={0.5}
          ior={1.5}
          chromaticAberration={0.06}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.1}
          color="#3b82f6"
        />
      </mesh>
    </Float>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <circleGeometry args={[12, 64]} />
      <meshStandardMaterial 
        color="#1e3a5f" 
        metalness={0.1} 
        roughness={0.8}
      />
    </mesh>
  );
}

function Grid() {
  return (
    <gridHelper 
      args={[24, 24, '#3b82f6', '#1e40af']} 
      position={[0, 0.01, 0]} 
    />
  );
}

function ConnectionLines() {
  const linesRef = useRef<THREE.Group>(null);
  
  const lines = useMemo(() => {
    const points: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    const buildingPositions = [
      [-3, 0, -2], [2, 0, -3], [-2, 0, 2], [3, 0, 1], [0, 0, -4],
      [-4, 0, 0], [4, 0, -2], [-1, 0, 3], [1, 0, -1], [3, 0, 3]
    ];
    
    for (let i = 0; i < buildingPositions.length - 1; i++) {
      const start = new THREE.Vector3(buildingPositions[i][0], 2, buildingPositions[i][2]);
      const end = new THREE.Vector3(buildingPositions[i + 1][0], 2, buildingPositions[i + 1][2]);
      points.push({ start, end });
    }
    return points;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((child, i) => {
        const material = (child as THREE.Line).material as THREE.LineBasicMaterial;
        material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.2;
      });
    }
  });

  return (
    <group ref={linesRef}>
      {lines.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                line.start.x, line.start.y, line.start.z,
                line.end.x, line.end.y, line.end.z
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#60a5fa" transparent opacity={0.4} />
        </line>
      ))}
    </group>
  );
}

function CityBuildings() {
  const buildingData = useMemo(() => [
    { pos: [-3, 0, -2] as [number, number, number], height: 2.5, color: '#1e40af' },
    { pos: [2, 0, -3] as [number, number, number], height: 3.2, color: '#2563eb' },
    { pos: [-2, 0, 2] as [number, number, number], height: 1.8, color: '#3b82f6' },
    { pos: [3, 0, 1] as [number, number, number], height: 2.8, color: '#1e40af' },
    { pos: [0, 0, -4] as [number, number, number], height: 3.5, color: '#1d4ed8' },
    { pos: [-4, 0, 0] as [number, number, number], height: 2.2, color: '#2563eb' },
    { pos: [4, 0, -2] as [number, number, number], height: 2.0, color: '#3b82f6' },
    { pos: [-1, 0, 3] as [number, number, number], height: 1.5, color: '#1e40af' },
    { pos: [1, 0, -1] as [number, number, number], height: 2.8, color: '#2563eb' },
    { pos: [3, 0, 3] as [number, number, number], height: 2.4, color: '#3b82f6' },
  ], []);

  return (
    <>
      {buildingData.map((building, i) => (
        <Building 
          key={i} 
          position={building.pos} 
          height={building.height} 
          color={building.color}
        />
      ))}
    </>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const [positions] = useMemo(() => {
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return [pos];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 200; i++) {
        positions[i * 3 + 1] += 0.01;
        if (positions[i * 3 + 1] > 8) {
          positions[i * 3 + 1] = 0;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#60a5fa"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function CityScene() {
  return (
    <div className="w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [8, 6, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#0a1628']} />
        <fog attach="fog" args={['#0a1628', 10, 30]} />
        
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#60a5fa" />
        
        <Ground />
        <Grid />
        <CityBuildings />
        <GlassSphere />
        <ConnectionLines />
        <Particles />
        
        <Environment preset="night" />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={5}
          maxDistance={20}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
