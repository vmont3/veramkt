import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Coins, CreditCard, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CreditBalanceProps {
    userId: string;
    className?: string;
    compact?: boolean; // For mobile or tight spaces
}

export function CreditBalance({ userId, className = '', compact = false }: CreditBalanceProps) {
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchBalance = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/credits/balance?userId=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setBalance(data.credits);
            }
        } catch (error) {
            console.error("Failed to fetch credits", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchBalance();

        // Refresh balance periodically or listen to an event? 
        // For now, simple poll every 30s to keep it fresh without websocket
        const interval = setInterval(fetchBalance, 30000);
        return () => clearInterval(interval);
    }, [userId]);

    const handleBuyCredits = () => {
        // Navigate to pricing or show modal. 
        // Assuming there's a route /plans based on previous orchestrator msg
        navigate('/plans');
    };

    if (compact) {
        return (
            <div className={`flex items-center gap-1 text-sm font-medium ${className}`}>
                <Coins className="w-4 h-4 text-yellow-500" />
                <span>{balance !== null ? balance : '...'}</span>
            </div>
        );
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`gap-2 border-yellow-500/20 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 hover:text-yellow-400 ${className}`}
                >
                    <Coins className="w-4 h-4" />
                    <span className="font-bold">{balance !== null ? balance.toLocaleString() : '...'}</span>
                    <span className="hidden sm:inline text-xs opacity-70">CRÉDITOS</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-[#1A1625] border-yellow-500/30 text-white" align="end">
                <div className="p-4 border-b border-white/10">
                    <h4 className="font-bold text-lg flex items-center gap-2">
                        <Coins className="w-5 h-5 text-yellow-500" />
                        Vera Vault
                    </h4>
                    <p className="text-xs text-gray-400">Seu saldo para inteligência artificial</p>
                </div>

                <div className="p-6 text-center">
                    <div className="text-4xl font-bold text-white mb-1">
                        {balance !== null ? balance.toLocaleString() : <span className="animate-pulse">...</span>}
                    </div>
                    <div className="text-xs text-brand-gold uppercase tracking-widest mb-6">Créditos Disponíveis</div>



                    <Button
                        className="w-full text-xs bg-green-600 hover:bg-green-500 text-white mb-2 font-bold"
                        onClick={() => navigate('/painel/finance?action=add_credits')}
                    >
                        <Plus size={16} className="mr-1" />
                        Adicionar Créditos
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full text-xs text-gray-400 hover:text-white"
                        onClick={() => navigate('/painel/credits/history')}
                    >
                        Ver Histórico de Uso
                    </Button>
                </div>

                <div className="bg-black/20 p-3 text-[10px] text-center text-gray-500">
                    1 Token ≈ R$ 0,10 | Profit-First Compliance
                </div>
            </PopoverContent>
        </Popover>
    );
}
