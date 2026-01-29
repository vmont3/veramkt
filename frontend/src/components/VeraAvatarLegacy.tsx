import React from 'react';
import { motion, Variants } from 'framer-motion';

/* 
 * VERA AVATAR 4.0 - ARTICULATED SKELETAL RIG
 * 
 * Strategy:
 * To achieve "life-like" movement without 3D models, we use a 2D SKELETAL RIG.
 * Each body part is a separate SVG group nested hierarchically (Shoulder -> Arm -> Hand).
 * 
 * Aesthetic:
 * - Complex "Mecha" shapes (pistons, vents, joints).
 * - Metallic gradients (Brushed Steel, Dark Chrome).
 * - Neon sub-surface scattering effects.
 */

interface VeraAvatarProps {
    className?: string;
    state?: 'idle' | 'talking' | 'analyzing' | 'walking';
    scale?: number;
}

export default function VeraAvatar({ className = "", state = 'idle', scale = 1 }: VeraAvatarProps) {

    // --- ANIMATION VARIANTS (The "Brain" of the movement) ---

    // 1. IDLE (Breathing, subtle shifting)
    // 2. TALKING (Gesticulating, head nodding)
    // 3. ANALYZING (Scanning, fast processing)

    const torsoVariants: Variants = {
        idle: { y: [0, -5, 0], rotate: [0, 1, 0, -1, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
        talking: { y: [0, -2, 0], transition: { duration: 2, repeat: Infinity } },
        walking: { y: [0, -10, 0], rotate: [0, 2, 0, -2, 0], transition: { duration: 1, repeat: Infinity } } // Bouncing walk
    };

    const headGroupVariants: Variants = {
        idle: { rotate: [0, 5, 0, -5, 0], y: [0, 2, 0], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } },
        talking: { rotate: [0, 5, 0, 5, 0], y: [0, 5, 0], transition: { duration: 1.5, repeat: Infinity } },
        analyzing: { rotate: [0, 10, 0, -10, 0], transition: { duration: 0.5, repeat: Infinity } }
    };

    // Arm Swings (Inverse kinematics simulated via forward rotation)
    const leftArmVariants: Variants = {
        idle: { rotate: [5, 10, 5], transition: { duration: 4, repeat: Infinity } },
        talking: { rotate: [10, 45, 10], transition: { duration: 2, repeat: Infinity } },
        walking: { rotate: [-20, 20, -20], transition: { duration: 1, repeat: Infinity, ease: "linear" } }
    };

    const rightArmVariants: Variants = {
        idle: { rotate: [-5, -10, -5], transition: { duration: 4, repeat: Infinity, delay: 0.5 } },
        talking: { rotate: [-10, -30, -10], transition: { duration: 2.5, repeat: Infinity } },
        walking: { rotate: [20, -20, 20], transition: { duration: 1, repeat: Infinity, ease: "linear" } }
    };

    // Hands (Micro movements)
    const handVariants: Variants = {
        idle: { rotate: [0, 5, 0], transition: { duration: 2, repeat: Infinity } },
        talking: { rotate: [0, 20, 0], transition: { duration: 0.5, repeat: Infinity } }
    };

    return (
        <div className={`relative ${className}`} style={{ width: 400 * scale, height: 800 * scale }}>
            <motion.svg
                width="100%"
                height="100%"
                viewBox="0 0 400 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                animate={state}
            >
                <defs>
                    {/* --- ADVANCED MATERIALS --- */}

                    {/* 1. DARK TITANIUM (Armor) */}
                    <linearGradient id="titanium-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#2a2a2a" />
                        <stop offset="40%" stopColor="#111" />
                        <stop offset="60%" stopColor="#333" />
                        <stop offset="100%" stopColor="#000" />
                    </linearGradient>

                    {/* 2. BRUSHED METAL (Joints/Accents) */}
                    <linearGradient id="silver-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e5e7eb" />
                        <stop offset="50%" stopColor="#9ca3af" />
                        <stop offset="51%" stopColor="#4b5563" />
                        <stop offset="100%" stopColor="#d1d5db" />
                    </linearGradient>

                    {/* 3. NEON CORE */}
                    <radialGradient id="neon-blue" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
                        <stop offset="80%" stopColor="#3b82f6" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
                    </radialGradient>

                    {/* 4. VISOR GLASS */}
                    <linearGradient id="visor-finish" x1="0" y1="0" x2="1" y2="0.5">
                        <stop offset="0%" stopColor="#000" />
                        <stop offset="30%" stopColor="#111" />
                        <stop offset="70%" stopColor="#333" />
                        <stop offset="100%" stopColor="#000" />
                    </linearGradient>

                    <filter id="metallic-shine">
                        <feSpecularLighting result="specOut" specularExponent="20" lightingColor="#fff">
                            <fePointLight x="200" y="200" z="200" />
                        </feSpecularLighting>
                        <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
                    </filter>

                    <filter id="bloom">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>


                {/* === MAIN RIG === */}
                <motion.g id="RIG_ROOT" variants={torsoVariants}>

                    {/* --- LEGS (Simplified mechanical) --- */}
                    {/* Left Leg */}
                    <g transform="translate(170, 450)">
                        {/* Thigh */}
                        <path d="M0 0 L-10 100 L30 100 L20 0 Z" fill="url(#titanium-grad)" stroke="#4b5563" strokeWidth="1" />
                        {/* Shin (Simulated knee joint) */}
                        <g transform="translate(10, 100)">
                            <circle cx="0" cy="0" r="15" fill="url(#silver-grad)" />
                            <path d="M-8 0 L-5 120 L5 120 L8 0 Z" fill="#333" />
                            {/* Foot */}
                            <path d="M-10 120 L30 120 L35 140 L-15 140 Z" fill="url(#titanium-grad)" />
                        </g>
                    </g>

                    {/* Right Leg */}
                    <g transform="translate(210, 450)">
                        <path d="M0 0 L-10 100 L30 100 L20 0 Z" fill="url(#titanium-grad)" stroke="#4b5563" strokeWidth="1" />
                        <g transform="translate(10, 100)">
                            <circle cx="0" cy="0" r="15" fill="url(#silver-grad)" />
                            <path d="M-8 0 L-5 120 L5 120 L8 0 Z" fill="#333" />
                            <path d="M-10 120 L30 120 L35 140 L-15 140 Z" fill="url(#titanium-grad)" />
                        </g>
                    </g>


                    {/* --- TORSO --- */}
                    <g transform="translate(200, 300)">
                        {/* ABS / Spine */}
                        <rect x="-20" y="50" width="40" height="60" rx="5" fill="#111" />
                        <path d="M-22 60 L22 60" stroke="#4b5563" strokeWidth="2" />
                        <path d="M-20 80 L20 80" stroke="#4b5563" strokeWidth="2" />
                        <path d="M-18 100 L18 100" stroke="#4b5563" strokeWidth="2" />

                        {/* UPPER CHEST ARMOR */}
                        <path d="M-60 -50 L60 -50 L50 60 L0 80 L-50 60 Z" fill="url(#titanium-grad)" stroke="url(#silver-grad)" strokeWidth="1" />

                        {/* VENTS / DETAILS */}
                        <path d="M-40 -20 L-20 -20 L-25 40 L-35 40 Z" fill="#1a1a1a" />
                        <path d="M40 -20 L20 -20 L25 40 L35 40 Z" fill="#1a1a1a" />

                        {/* CORE REACTOAR */}
                        <circle cx="0" cy="10" r="12" fill="#000" stroke="#333" strokeWidth="2" />
                        <motion.circle
                            cx="0" cy="10" r="6"
                            fill="url(#neon-blue)" filter="url(#bloom)"
                            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </g>


                    {/* --- NECK (Articulated Mult-Segment) --- */}
                    <g transform="translate(200, 250)">
                        {/* Base */}
                        <circle cx="0" cy="0" r="15" fill="url(#silver-grad)" />
                        {/* Piston Neck */}
                        <motion.g variants={headGroupVariants}>
                            <rect x="-8" y="-30" width="16" height="30" fill="#222" />
                            {/* Cables */}
                            <path d="M-12 0 Q-15 -15 -10 -30" stroke="cyan" strokeWidth="1" opacity="0.5" fill="none" />
                            <path d="M12 0 Q15 -15 10 -30" stroke="cyan" strokeWidth="1" opacity="0.5" fill="none" />

                            {/* --- HEAD --- */}
                            <g transform="translate(0, -30)">
                                {/* HELMET BACK */}
                                <path d="M-45 -60 C-50 -20 -45 20 -35 30 L35 30 C45 20 50 -20 45 -60 C25 -80 -25 -80 -45 -60 Z" fill="url(#titanium-grad)" />

                                {/* FACEPLATE MASK */}
                                <path d="M-35 -50 C-40 -20 -35 15 -30 20 L30 20 C35 15 40 -20 35 -50 Z" fill="#111" />

                                {/* VISOR (The Eyes) */}
                                <path d="M-30 -20 Q0 -5 30 -20 L30 0 Q0 10 -30 0 Z" fill="url(#visor-finish)" stroke="#444" strokeWidth="1" />

                                {/* EYES (Animated) */}
                                <g>
                                    <motion.rect
                                        x="-20" y="-12" width="12" height="4" rx="1"
                                        fill="#60a5fa" filter="url(#bloom)"
                                        animate={state === 'analyzing' ? { width: [12, 2, 12], fill: "#ef4444" } : { opacity: [0.8, 1, 0.8] }}
                                    />
                                    <motion.rect
                                        x="8" y="-12" width="12" height="4" rx="1"
                                        fill="#60a5fa" filter="url(#bloom)"
                                        animate={state === 'analyzing' ? { width: [12, 2, 12], fill: "#ef4444" } : { opacity: [0.8, 1, 0.8] }}
                                    />
                                </g>

                                {/* EAR ANTENNAS */}
                                <rect x="-50" y="-30" width="8" height="30" fill="url(#silver-grad)" />
                                <rect x="42" y="-30" width="8" height="30" fill="url(#silver-grad)" />

                                {/* HALO (3D Ring) */}
                                <motion.g
                                    className="opacity-80"
                                    animate={{ rotateX: [70, 65, 70], y: [-60, -65, -60] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    <ellipse cx="0" cy="0" rx="50" ry="50" stroke="#60a5fa" strokeWidth="2" fill="none" filter="url(#bloom)" />
                                </motion.g>
                            </g>
                        </motion.g>
                    </g>


                    {/* --- LEFT ARM (Shoulder -> Arm -> Hand) --- */}
                    <motion.g transform="translate(140, 260)" variants={leftArmVariants} style={{ originX: "10px", originY: "10px" }}>
                        {/* Shoulder Ball */}
                        <circle cx="0" cy="0" r="22" fill="url(#silver-grad)" />
                        <circle cx="0" cy="0" r="10" fill="#111" />

                        {/* Upper Arm */}
                        <path d="M-10 15 L-8 90 L8 90 L10 15 Z" fill="url(#titanium-grad)" />

                        {/* Elbow */}
                        <g transform="translate(0, 90)">
                            <circle cx="0" cy="0" r="12" fill="url(#silver-grad)" />

                            {/* Forearm */}
                            <motion.g
                                animate={state === 'walking' ? { rotate: -30 } : { rotate: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <path d="M-8 0 L-6 80 L6 80 L8 0 Z" fill="#333" />
                                <rect x="-10" y="20" width="20" height="40" fill="url(#titanium-grad)" rx="2" />

                                {/* Hand */}
                                <motion.g transform="translate(0, 85)" variants={handVariants}>
                                    <path d="M-10 0 L10 0 L8 20 L-8 20 Z" fill="#111" />
                                    {/* Fingers */}
                                    <path d="M-8 20 L-8 30" stroke="#666" strokeWidth="3" />
                                    <path d="M-3 20 L-3 35" stroke="#666" strokeWidth="3" />
                                    <path d="M3 20 L3 35" stroke="#666" strokeWidth="3" />
                                    <path d="M8 20 L8 30" stroke="#666" strokeWidth="3" />
                                </motion.g>
                            </motion.g>
                        </g>
                    </motion.g>


                    {/* --- RIGHT ARM --- */}
                    <motion.g transform="translate(260, 260)" variants={rightArmVariants} style={{ originX: "-10px", originY: "10px" }}>
                        <circle cx="0" cy="0" r="22" fill="url(#silver-grad)" />
                        <circle cx="0" cy="0" r="10" fill="#111" />

                        <path d="M-10 15 L-8 90 L8 90 L10 15 Z" fill="url(#titanium-grad)" />

                        <g transform="translate(0, 90)">
                            <circle cx="0" cy="0" r="12" fill="url(#silver-grad)" />

                            <motion.g
                                animate={state === 'walking' ? { rotate: -30 } : { rotate: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <path d="M-8 0 L-6 80 L6 80 L8 0 Z" fill="#333" />
                                <rect x="-10" y="20" width="20" height="40" fill="url(#titanium-grad)" rx="2" />

                                <motion.g transform="translate(0, 85)" variants={handVariants}>
                                    <path d="M-10 0 L10 0 L8 20 L-8 20 Z" fill="#111" />
                                    <path d="M-8 20 L-8 30" stroke="#666" strokeWidth="3" />
                                    <path d="M-3 20 L-3 35" stroke="#666" strokeWidth="3" />
                                    <path d="M3 20 L3 35" stroke="#666" strokeWidth="3" />
                                    <path d="M8 20 L8 30" stroke="#666" strokeWidth="3" />
                                </motion.g>
                            </motion.g>
                        </g>
                    </motion.g>

                </motion.g>

            </motion.svg>
        </div>
    );
}
