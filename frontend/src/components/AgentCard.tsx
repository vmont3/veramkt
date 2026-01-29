import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Info, Save, Brain, ShieldCheck } from 'lucide-react';

const AgentCard = ({ agent, isCore = false, isOn, onToggle, prompt, onPromptChange }: {
    agent: any,
    isCore?: boolean,
    isOn: boolean,
    onToggle: (id: string) => void,
    prompt: string,
    onPromptChange: (id: string, val: string) => void
}) => {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <div className={`relative border rounded-xl p-5 md:p-6 transition-all duration-300 flex flex-col h-full group ${isOn ? 'bg-[#1A1625] border-[#292348] hover:border-blue-500/50' : 'bg-[#000000] border-gray-800 opacity-60 grayscale'}`}>

            {/* Header: Avatar & Info */}
            <div className="flex justify-between items-start mb-5 relative z-20">
                <div className="flex items-center gap-4">
                    {/* Avatar Circle - Now with Image Support */}
                    <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-xl overflow-hidden bg-gray-900 shrink-0 shadow-lg ${isOn ? 'border-blue-500 shadow-blue-500/20' : 'border-gray-700'}`}>
                        {agent.image ? (
                            <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className={isOn ? 'text-white' : 'text-gray-600'}>{agent.name.charAt(0)}</span>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Name & Role */}
                        <h3 className={`font-bold text-sm leading-tight truncate pr-2 ${isOn ? 'text-white' : 'text-gray-500'}`}>{agent.name}</h3>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-mono mt-1 truncate">{agent.role}</p>

                        {/* Status Badge */}
                        <div className="flex items-center gap-1.5 mt-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${isOn ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-red-500'}`} />
                            <span className="text-[9px] font-bold text-gray-500 uppercase">{isOn ? 'Online' : 'Offline'}</span>
                        </div>
                    </div>
                </div>

                {/* Switch & Info Actions */}
                <div className="flex flex-col items-end gap-2">
                    {!isCore && (
                        <button
                            onClick={() => onToggle(agent.id)}
                            className={`transition-all active:scale-95 transform hover:scale-110 ${isOn ? 'text-green-400' : 'text-gray-600 hover:text-gray-400'}`}
                            title={isOn ? "Desligar Agente" : "Ligar Agente"}
                        >
                            {isOn ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                        </button>
                    )}

                    <div className="relative">
                        <button
                            className="bg-gray-800/50 hover:bg-blue-600 text-gray-400 hover:text-white p-1.5 rounded-full transition-colors backdrop-blur-sm"
                            onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }}
                        >
                            <Info size={14} />
                        </button>

                        {/* Info Tooltip Popup */}
                        {showInfo && (
                            <div className="absolute right-0 top-8 w-64 bg-[#0B0915] border border-gray-700 p-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] z-[50] text-xs text-gray-300 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex justify-between items-start border-b border-gray-800 pb-2 mb-2">
                                    <strong className="text-white text-sm">{agent.name}</strong>
                                    <button onClick={() => setShowInfo(false)} className="text-gray-500 hover:text-white">✕</button>
                                </div>
                                <p className="mb-3 italic text-gray-400 leading-relaxed">"{agent.desc}"</p>
                                {agent.focus && (
                                    <div className="mb-2">
                                        <strong className="block text-blue-400 mb-0.5 uppercase text-[9px] tracking-wider">Foco</strong>
                                        <span className="text-[10px]">{agent.focus}</span>
                                    </div>
                                )}
                                <div className="mt-2 pt-2 border-t border-gray-800 text-[9px] text-gray-600 uppercase text-center">
                                    Reporta a: {agent.reportsTo || "Maestra VERA"}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Knowledge Bar Visual */}
            <div className="mb-5 bg-black/20 p-2 rounded-lg border border-white/5">
                <div className="flex justify-between text-[9px] text-gray-500 uppercase font-bold mb-1.5">
                    <span>Performance Neural</span>
                    <span className={isOn ? 'text-blue-400' : ''}>{isOn ? '100%' : '0%'}</span>
                </div>
                <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ease-out ${isOn ? 'bg-gradient-to-r from-blue-600 to-purple-500 w-full shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-gray-800 w-0'}`} />
                </div>
            </div>

            {/* Prompt Area */}
            <div className="mt-auto">
                <label className="text-[9px] font-bold text-gray-500 uppercase mb-2 flex justify-between items-center px-1">
                    <span>Instrução de Personalidade</span>
                    {prompt && isOn && <span className="text-green-500 flex items-center gap-1"><Save size={10} /> Salvo</span>}
                </label>
                <div className="relative bg-black rounded-lg p-0.5 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all mb-3">
                    <textarea
                        disabled={!isOn}
                        value={prompt || ''}
                        onChange={(e) => onPromptChange(agent.id, e.target.value)}
                        placeholder={isOn ? `Ex: "Use tom mais formal e foco em ROI..."` : "Agente offline."}
                        className={`w-full bg-[#0B0915] rounded-md p-3 text-xs outline-none resize-none h-20 custom-scrollbar leading-relaxed ${isOn ? 'text-gray-200 placeholder-gray-700' : 'text-gray-600 bg-black cursor-not-allowed'}`}
                    />
                </div>

                {/* Advanced Controls */}
                {isOn && (
                    <div className="flex justify-between items-center gap-2 pt-2 border-t border-white/5">
                        <button
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] px-2 py-1.5 rounded flex items-center gap-1 transition-colors"
                            onClick={(e) => { e.stopPropagation(); if (confirm('Resetar memória deste agente?')) onToggle(agent.id + '_reset'); }}
                            title="Resetar memória (Esquecer conversas recentes)"
                        >
                            <ToggleLeft size={10} className="rotate-180" /> Resetar
                        </button>

                        <div className="flex gap-1">
                            <button
                                className="bg-green-500/10 hover:bg-green-500/20 text-green-500 p-1.5 rounded transition-colors"
                                title="Reforço Positivo (Dopamina)"
                                onClick={(e) => { e.stopPropagation(); onToggle(agent.id + '_train_dopamine'); }}
                            >
                                <Brain size={12} className="text-green-400" />
                            </button>
                            <button
                                className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 p-1.5 rounded transition-colors"
                                title="Correção (Ajuste)"
                                onClick={(e) => { e.stopPropagation(); onToggle(agent.id + '_train_pain'); }}
                            >
                                <ShieldCheck size={12} className="text-yellow-400" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Archive / Action Button Placeholder (Future) */}
            {/* <div className="mt-2 text-center">...</div> */}
        </div>
    );
};
export default AgentCard;
