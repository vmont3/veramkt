import React from 'react';
import { CreditHistory } from '@/components/credits/CreditHistory';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export default function CreditPage() {
    const navigate = useNavigate();
    // Get user from local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || "user_default_123";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
                        <ArrowLeft />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-600">
                            Vera Vault
                        </h1>
                        <p className="text-gray-400">Gerencie seus créditos e visualize o histórico de transações.</p>
                    </div>
                </div>
                <Button
                    onClick={() => navigate('/painel/finance?action=add_credits')}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold shadow-lg shadow-green-900/20"
                >
                    <span className="material-symbols-outlined mr-2">add</span>
                    Adicionar Créditos
                </Button>
            </div>

            <CreditHistory userId={userId} />
        </div>
    );
}
