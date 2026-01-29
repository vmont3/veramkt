import React, { useState } from 'react';
import Layout from '../components/Layout';
import VeraAvatar from '../components/VeraAvatar';

export default function VeraShowcase() {
    const [currentState, setCurrentState] = useState<'idle' | 'talking' | 'analyzing' | 'walking'>('idle');

    return (
        <Layout>
            <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center justify-center bg-[#050314]">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Vera Avatar Showcase</h1>
                    <p className="text-gray-400">Interactive preview of the animated SVG avatar</p>
                </div>

                <div className="flex gap-4 mb-12">
                    {(['idle', 'talking', 'analyzing', 'walking'] as const).map((state) => (
                        <button
                            key={state}
                            onClick={() => setCurrentState(state)}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${currentState === state
                                ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]'
                                : 'bg-[#131022] text-gray-400 border border-[#292348] hover:border-gray-500'
                                }`}
                        >
                            {state.charAt(0).toUpperCase() + state.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="relative w-[500px] h-[600px] bg-[#131022]/50 border border-[#292348] rounded-3xl flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-blue-900/5 pointer-events-none" />

                    {/* Grid Background */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />

                    <VeraAvatar
                        state={currentState}
                        scale={0.8}
                        className="filter drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                    />
                </div>
            </div>
        </Layout>
    );
}
