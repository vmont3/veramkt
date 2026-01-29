import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, useCursor, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// --- ERROR BOUNDARY (CRITICAL FOR STABILITY) ---
class ErrorBoundary extends React.Component<{ children: React.ReactNode, onSafeMode: () => void }, { hasError: boolean, error: string }> {
    constructor(props: { children: React.ReactNode, onSafeMode: () => void }) {
        super(props);
        this.state = { hasError: false, error: "" };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true, error: error.toString() };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error("3D Error:", error, errorInfo);
    }

    handleRetry = () => {
        window.location.reload();
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-6 pointer-events-auto">
                    <div className="flex flex-col items-center gap-4 bg-gray-900 border border-red-500/50 rounded-xl p-8 shadow-2xl max-w-sm w-full">
                        <div className="text-red-500 font-bold text-xl tracking-widest animate-pulse">⚠ SYSTEM FAILURE</div>
                        <p className="text-gray-400 text-center text-sm">
                            Graphic Engine (WebGL) crashed.<br />
                            <span className="opacity-50 text-xs">Usually caused by GPU memory overload.</span>
                        </p>
                        <div className="flex flex-col gap-3 w-full mt-2">
                            <button onClick={this.handleRetry} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded font-bold uppercase text-sm tracking-wider cursor-pointer shadow-lg">
                                Reboot System (Reload)
                            </button>
                            {/* Safe Mode button hidden to force 3D attempt */}
                        </div>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// ==========================================
// ENGINE B: WEBGL 3D (OPTIMIZED CYBERTRONIAN RIG V10)
// ==========================================

// --- MATERIALS (SHARED) ---
const armorMaterial = new THREE.MeshStandardMaterial({
    color: "#1a1a1a", roughness: 0.2, metalness: 0.9, envMapIntensity: 1.5,
});
const detailMaterial = new THREE.MeshStandardMaterial({
    color: "#4a4a4a", roughness: 0.3, metalness: 0.8,
});
const glowBlue = new THREE.MeshBasicMaterial({ color: "#00f0ff", toneMapped: false });
const glowRed = new THREE.MeshBasicMaterial({ color: "#ff003c", toneMapped: false });
const whiteMat = new THREE.MeshBasicMaterial({ color: "white" });

// --- GEOMETRIES (SHARED / CACHED) ---
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const cylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 16);
const ringGeo = new THREE.RingGeometry(0.03, 0.05, 32);
const circleGeo = new THREE.CircleGeometry(0.02, 32);
const octaGeo = new THREE.OctahedronGeometry(0.12);

// --- UTILS ---
const robotLerp = (current: number, target: number, speed: number, delta: number) => {
    return THREE.MathUtils.damp(current, target, speed, delta);
};

// --- COMPONENT: ARMOR PLATE ---
function ArmorPlate({
    position, rotation, scale, color = "dark", activeShift = [0, 0, 0], activeRot = [0, 0, 0], state
}: any) {
    const mesh = useRef<THREE.Mesh>(null);
    const basePos = useMemo(() => new THREE.Vector3(...position), []);
    const baseRot = useMemo(() => new THREE.Euler(...rotation), []);

    useFrame((_, delta) => {
        if (!mesh.current) return;
        const isActive = state === 'analyzing' || state === 'talking';

        const tx = basePos.x + (isActive ? activeShift[0] : 0);
        const ty = basePos.y + (isActive ? activeShift[1] : 0);
        const tz = basePos.z + (isActive ? activeShift[2] : 0);

        const rx = baseRot.x + (isActive ? activeRot[0] : 0);
        const ry = baseRot.y + (isActive ? activeRot[1] : 0);
        const rz = baseRot.z + (isActive ? activeRot[2] : 0);

        // Fast robotic snap
        mesh.current.position.x = robotLerp(mesh.current.position.x, tx, 8, delta);
        mesh.current.position.y = robotLerp(mesh.current.position.y, ty, 8, delta);
        mesh.current.position.z = robotLerp(mesh.current.position.z, tz, 8, delta);

        mesh.current.rotation.x = robotLerp(mesh.current.rotation.x, rx, 8, delta);
        mesh.current.rotation.y = robotLerp(mesh.current.rotation.y, ry, 8, delta);
        mesh.current.rotation.z = robotLerp(mesh.current.rotation.z, rz, 8, delta);
    });

    return (
        <mesh
            ref={mesh}
            geometry={boxGeo} // Shared Geometry
            material={color === "dark" ? armorMaterial : detailMaterial}
            scale={scale}
        />
    );
}

// --- TRANSFORMER HEAD ---
function TransformerHead({ state }: { state: string }) {
    const group = useRef<THREE.Group>(null);
    const { mouse, viewport } = useThree();
    const lookTarget = useRef(new THREE.Vector3(0, 0, 5));

    useFrame((stateO, delta) => {
        if (!group.current) return;

        // Mechanical Look Tracking
        const targetX = (mouse.x * viewport.width) / 2.5;
        const targetY = (mouse.y * viewport.height) / 2.5;

        // Stiffer tracking
        lookTarget.current.x = robotLerp(lookTarget.current.x, targetX, 5, delta);
        lookTarget.current.y = robotLerp(lookTarget.current.y, targetY, 5, delta);

        const dummy = new THREE.Object3D();
        dummy.position.copy(group.current.position);
        dummy.lookAt(lookTarget.current.x, lookTarget.current.y, 10);
        group.current.quaternion.slerp(dummy.quaternion, 0.1);

        if (state === 'analyzing') {
            // Constrained jitter instead of random walk (prevent spinning loop)
            const targetRotZ = (Math.random() - 0.5) * 0.1;
            group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetRotZ, 0.1);
        } else {
            group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.1);
        }
    });

    const isAlert = state === 'analyzing';

    return (
        <group ref={group}>
            {/* Core */}
            <mesh position={[0, 0.1, -0.1]} geometry={boxGeo} material={detailMaterial} scale={[0.5, 0.6, 0.5]} />

            {/* Plating */}
            <ArmorPlate state={state} position={[0, 0.45, 0.25]} rotation={[0, 0, 0]} scale={[0.5, 0.2, 0.1]} activeShift={[0, 0.1, 0]} />
            <ArmorPlate state={state} position={[-0.3, 0.1, 0.2]} rotation={[0, 0.2, 0]} scale={[0.15, 0.4, 0.1]} activeShift={[-0.1, 0, 0]} />
            <ArmorPlate state={state} position={[0.3, 0.1, 0.2]} rotation={[0, -0.2, 0]} scale={[0.15, 0.4, 0.1]} activeShift={[0.1, 0, 0]} />
            <ArmorPlate state={state} position={[0, -0.25, 0.25]} rotation={[0, 0, 0]} scale={[0.4, 0.15, 0.15]} activeShift={[0, -0.1, 0]} activeRot={[0.2, 0, 0]} />
            <ArmorPlate state={state} position={[-0.2, 0.5, -0.1]} rotation={[0, 0, 0.2]} scale={[0.3, 0.1, 0.6]} activeShift={[-0.05, 0.05, 0]} />
            <ArmorPlate state={state} position={[0.2, 0.5, -0.1]} rotation={[0, 0, -0.2]} scale={[0.3, 0.1, 0.6]} activeShift={[0.05, 0.05, 0]} />

            {/* Eyes */}
            <group position={[0, 0.1, 0.25]}>
                <mesh position={[-0.15, 0, 0]} geometry={ringGeo} material={isAlert ? glowRed : glowBlue} />
                <mesh position={[0.15, 0, 0]} geometry={ringGeo} material={isAlert ? glowRed : glowBlue} />
                <mesh position={[-0.15, 0, -0.01]} geometry={circleGeo} material={whiteMat} />
                <mesh position={[0.15, 0, -0.01]} geometry={circleGeo} material={whiteMat} />
            </group>

            {/* Antennas */}
            <ArmorPlate state={state} position={[0.4, 0.2, -0.1]} rotation={[0, 0, -0.1]} scale={[0.1, 0.6, 0.4]} activeRot={[0, 0, -0.2]} />
            <ArmorPlate state={state} position={[-0.4, 0.2, -0.1]} rotation={[0, 0, 0.1]} scale={[0.1, 0.6, 0.4]} activeRot={[0, 0, 0.2]} />
        </group>
    );
}

// --- TRANSFORMER BODY ---
function TransformerBody({ state }: { state: string }) {
    const group = useRef<THREE.Group>(null);
    useFrame((stateO) => {
        if (!group.current) return;
        group.current.position.y = -0.7 + Math.sin(stateO.clock.elapsedTime * 2) * 0.02;
    });

    return (
        <group ref={group}>
            {/* Neck */}
            <mesh position={[0, 0.4, 0]} geometry={cylinderGeo} material={detailMaterial} scale={[0.1, 0.15, 0.3]} />

            {/* Core Reactor */}
            <mesh position={[0, 0.1, 0.15]} geometry={octaGeo}>
                <primitive object={state === 'analyzing' ? glowRed : glowBlue} />
            </mesh>
            <pointLight position={[0, 0.1, 0.3]} distance={0.5} intensity={2} color={state === 'analyzing' ? "#ff0000" : "#00bbff"} />

            {/* Chest Plates */}
            <ArmorPlate state={state} position={[-0.25, 0.15, 0.3]} rotation={[0, 0.2, 0]} scale={[0.4, 0.3, 0.1]} activeShift={[-0.15, 0, 0]} isActive={state === 'analyzing'} />
            <ArmorPlate state={state} position={[0.25, 0.15, 0.3]} rotation={[0, -0.2, 0]} scale={[0.4, 0.3, 0.1]} activeShift={[0.15, 0, 0]} isActive={state === 'analyzing'} />

            {/* Abs */}
            <ArmorPlate state={state} position={[0, -0.15, 0.25]} rotation={[0, 0, 0]} scale={[0.3, 0.4, 0.1]} />

            {/* Shoulders */}
            <ArmorPlate state={state} position={[-0.55, 0.3, 0]} rotation={[0, 0, 0.2]} scale={[0.4, 0.4, 0.5]} activeShift={[0, 0.1, 0]} />
            <ArmorPlate state={state} position={[0.55, 0.3, 0]} rotation={[0, 0, -0.2]} scale={[0.4, 0.4, 0.5]} activeShift={[0, 0.1, 0]} />

            {/* Spine */}
            <mesh position={[0, 0, -0.2]} geometry={boxGeo} material={armorMaterial} scale={[0.6, 0.8, 0.4]} />

            {/* --- ARMS (CROSSED FORCE POSE) --- */}
            {/* Right Arm */}
            <ArmorPlate state={state} position={[0.45, 0.05, 0.1]} rotation={[0, 0, 0.3]} scale={[0.18, 0.45, 0.18]} />
            <ArmorPlate state={state} position={[0.1, -0.18, 0.4]} rotation={[0, 0, 1.4]} scale={[0.15, 0.45, 0.15]} />
            <ArmorPlate state={state} position={[-0.15, -0.12, 0.38]} rotation={[0, 0, 0.5]} scale={[0.12, 0.15, 0.15]} />
            {/* Left Arm */}
            <ArmorPlate state={state} position={[-0.45, 0.05, 0.1]} rotation={[0, 0, -0.3]} scale={[0.18, 0.45, 0.18]} />
            <ArmorPlate state={state} position={[-0.1, -0.22, 0.45]} rotation={[0, 0, -1.4]} scale={[0.15, 0.45, 0.15]} />
            <ArmorPlate state={state} position={[0.15, -0.18, 0.42]} rotation={[0, 0, -0.5]} scale={[0.12, 0.15, 0.15]} />
        </group>
    );
}


// --- MAIN AVATAR COMPONENT ---

interface VeraAvatarProps {
    className?: string;
    state?: 'idle' | 'talking' | 'analyzing' | 'walking';
    scale?: number;
}

export default function VeraAvatar({ className = "", state = 'idle', scale = 1 }: VeraAvatarProps) {
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    return (
        <div
            className={`${className} relative`}
            style={{ width: 400 * scale, height: 800 * scale }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <ErrorBoundary onSafeMode={() => window.location.reload()}>
                <Canvas camera={{ position: [0, 0, 4.5], fov: 30 }} gl={{ toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}>
                    <Suspense fallback={null}>
                        <Environment preset="night" />

                        {/* Cinematic Lights */}
                        <spotLight position={[5, 10, 5]} angle={0.4} penumbra={0.5} intensity={10} color="#ffffff" castShadow />
                        <pointLight position={[-5, 0, -5]} intensity={5} color="#00aaff" />
                        <pointLight position={[5, -2, -5]} intensity={5} color="#ff0055" />

                        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                            <group scale={1.3}>
                                <TransformerHead state={state} />
                                <TransformerBody state={state} />
                            </group>
                        </Float>

                        <ContactShadows position={[0, -1.5, 0]} opacity={0.7} scale={10} blur={2} far={4} color="#000" />
                    </Suspense>
                </Canvas>
            </ErrorBoundary>
        </div>
    );
}
