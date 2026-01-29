
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

export default function SuperAdminCreditsPage() {
    const [userId, setUserId] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('Recarga Manual via Admin (Pix/Transferência)');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleAddCredits = async () => {
        if (!userId || !amount) {
            setMessage({ type: 'error', text: 'Preencha o ID do Usuário e o Valor.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            // Em produção, isso usaria tokens de autenticação reais armazenados no localStorage
            const token = localStorage.getItem('token');

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/credits/admin-gift`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token || 'SUPER_ADMIN_DEBUG_TOKEN'}` // TODO: Ensure backend accepts this for debug or use real login
                },
                body: JSON.stringify({
                    userId,
                    amount: Number(amount),
                    description: reason
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: `Sucesso! Novo saldo de ${userId}: ${data.newBalance} créditos.` });
                setAmount('');
            } else {
                setMessage({ type: 'error', text: data.error || 'Erro ao adicionar créditos.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro de conexão com o servidor.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                        Gestão de Créditos
                    </h1>
                    <p className="text-gray-400 mt-2">Painel exclusivo Super Admin para injeção manual de recursos.</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    <span className="text-yellow-500 font-mono text-sm">NÍVEL DE ACESSO: MODO DEUS</span>
                </div>
            </div>

            <Card className="bg-[#1A1625] border-yellow-500/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <RefreshCw className="w-5 h-5 text-cyan-400" />
                        Injeção de Liquidez (Adicionar Créditos)
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        Adicione créditos manualmente à conta de um cliente após confirmação de pagamento.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="userId" className="text-gray-300">ID do Usuário (E-mail ou UUID)</Label>
                            <Input
                                id="userId"
                                placeholder="ex: user_default ou cliente@email.com"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="bg-black/40 border-white/10 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount" className="text-gray-300">Quantidade de Créditos</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="ex: 1000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-black/40 border-white/10 text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason" className="text-gray-300">Motivo / Descrição</Label>
                        <Input
                            id="reason"
                            placeholder="ex: Pgto via Pix ID #12345"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="bg-black/40 border-white/10 text-white"
                        />
                    </div>

                    {message && (
                        <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {message.text}
                        </div>
                    )}

                    <Button
                        onClick={handleAddCredits}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold h-12 text-lg"
                    >
                        {loading ? 'Processando...' : 'Confirmar Adição de Créditos'}
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-black/40 border-white/5 p-6 text-center hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="text-4xl font-bold text-white mb-2">Básico</div>
                    <div className="text-yellow-500 text-sm mb-4">500 Créditos</div>
                    <Button variant="outline" className="w-full border-white/10 hover:bg-white/10" onClick={() => setAmount('500')}>Selecionar</Button>
                </Card>
                <Card className="bg-black/40 border-yellow-500/20 p-6 text-center hover:bg-yellow-500/5 transition-colors cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5">POPULAR</div>
                    <div className="text-4xl font-bold text-white mb-2">Profissional</div>
                    <div className="text-yellow-500 text-sm mb-4">2.500 Créditos</div>
                    <Button variant="outline" className="w-full border-yellow-500/50 hover:bg-yellow-500/20 text-yellow-500" onClick={() => setAmount('2500')}>Selecionar</Button>
                </Card>
                <Card className="bg-black/40 border-white/5 p-6 text-center hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="text-4xl font-bold text-white mb-2">Agência</div>
                    <div className="text-yellow-500 text-sm mb-4">10.000 Créditos</div>
                    <Button variant="outline" className="w-full border-white/10 hover:bg-white/10" onClick={() => setAmount('10000')}>Selecionar</Button>
                </Card>
            </div>
        </div>
    );
}
