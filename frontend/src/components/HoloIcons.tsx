import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, Torus, Sphere, Octahedron, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// --- Shared Canvas Wrapper ---
const HoloCanvas = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full h-full relative">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }} gl={{ alpha: true }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0047ab" />
            {children}
        </Canvas>
    </div>
);

// --- 1. STRATEGY ICON (Gyroscope / Tesseract feel) ---
const StrategyMesh = () => {
    const groupRef = useRef<THREE.Group>(null);
    const innerRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (groupRef.current) groupRef.current.rotation.y += 0.005;
        if (innerRef.current) {
            innerRef.current.rotation.x += 0.01;
            innerRef.current.rotation.z += 0.01;
        }
        if (ringRef.current) {
            ringRef.current.rotation.x -= 0.02;
            ringRef.current.rotation.y -= 0.005;
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Core */}
                <Icosahedron args={[1, 0]} ref={innerRef}>
                    <meshBasicMaterial wireframe color="#00f3ff" transparent opacity={0.6} />
                </Icosahedron>
                {/* Glow Core */}
                <mesh>
                    <sphereGeometry args={[0.6, 16, 16]} />
                    <meshBasicMaterial color="#00f3ff" transparent opacity={0.1} />
                </mesh>
                {/* Outer Ring */}
                <Torus args={[1.5, 0.02, 16, 100]} ref={ringRef}>
                    <meshStandardMaterial emissive="#00f3ff" emissiveIntensity={2} color="#000" />
                </Torus>
            </Float>
        </group>
    );
};

export const IconStrategy = () => <HoloCanvas><StrategyMesh /></HoloCanvas>;


// --- 2. INTELLIGENCE ICON (Neural Network / Brain Particles) ---
const IntelligenceMesh = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
            // Pulse effect handled by DiscortMaterial
        }
    });

    return (
        <Float speed={4} rotationIntensity={1} floatIntensity={1}>
            <Sphere args={[1.2, 32, 32]} ref={meshRef}>
                <MeshDistortMaterial
                    color="#00f3ff"
                    attach="material"
                    distort={0.4} // Strength, 0 disables the effect (default=1)
                    speed={2} // Speed (default=1)
                    wireframe
                    transparent
                    opacity={0.3}
                />
            </Sphere>
            {/* Inner "Brain" dots */}
            <points>
                <sphereGeometry args={[1, 32, 32]} />
                <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.6} />
            </points>
        </Float>
    );
};

export const IconIntelligence = () => <HoloCanvas><IntelligenceMesh /></HoloCanvas>;


// --- 3. OPERATION/SCALE ICON (Connected Nodes / Orbital) ---
const OperationMesh = () => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y -= 0.01;
            groupRef.current.rotation.z += 0.005;
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                {/* Central Hub */}
                <Octahedron args={[0.8, 0]}>
                    <meshStandardMaterial wireframe color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.5} />
                </Octahedron>

                {/* Satellites */}
                {[...Array(4)].map((_, i) => (
                    <group key={i} rotation={[i, i * 2, 0]}>
                        <mesh position={[1.6, 0, 0]}>
                            <sphereGeometry args={[0.15, 8, 8]} />
                            <meshBasicMaterial color="#ffffff" />
                        </mesh>
                        {/* Orbit Line */}
                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <ringGeometry args={[1.58, 1.6, 32]} />
                            <meshBasicMaterial color="#00f3ff" transparent opacity={0.1} side={THREE.DoubleSide} />
                        </mesh>
                    </group>
                ))}
            </Float>
        </group>
    );
};

export const IconOperation = () => <HoloCanvas><OperationMesh /></HoloCanvas>;
