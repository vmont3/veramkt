import React, { useState, useEffect } from 'react';
import { Wallet, ShieldCheck, TrendingUp, DollarSign, AlertTriangle, CreditCard, History, Plus, ArrowUpRight, ArrowDownLeft, X, Lock, Zap, Info, CheckCircle, XCircle } from 'lucide-react';

export default function FinancePage() {
    const [showAddCredits, setShowAddCredits] = useState(false);
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
    const [showGuardianInfo, setShowGuardianInfo] = useState(false);

    // Custom Amount State
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
    const [isLoading, setIsLoading] = useState(false);

    // Real Data State
    const [metrics, setMetrics] = useState<any>(null);

    const [rechargeType, setRechargeType] = useState<'ADS' | 'CREDITS'>('ADS');

    React.useEffect(() => {
        const fetchFinance = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/finance`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setMetrics(data);
                }
            } catch (error) {
                console.error("Failed to fetch finance data", error);
            }
        };
        fetchFinance();

        // Check for auto-open action
        const params = new URLSearchParams(window.location.search);
        if (params.get('action') === 'add_credits') {
            setRechargeType('CREDITS');
            setShowAddCredits(true);
        }
    }, [showPaymentSuccess]); // Refresh when payment succeeds

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            if (rechargeType === 'CREDITS') {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/credits/checkout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        userId: user.id || 'user_default',
                        amount: Number(amount),
                        description: `Compra de Créditos VERA (${paymentMethod === 'pix' ? 'PIX' : 'Cartão'})`,
                        type: 'PURCHASE'
                    })
                });

                if (!response.ok) throw new Error("Falha no checkout");

            } else {
                // ADS RECHARGE (Simulation)
                await new Promise(r => setTimeout(r, 1000));
            }

            setShowAddCredits(false);
            setShowPaymentSuccess(true);
        } catch (e) {
            console.error(e);
            alert("Erro ao processar pagamento. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }

    // --- MODALS ---

    const GuardianModal = () => (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
            <div className="bg-[#1A1625] border border-blue-500/30 w-full max-w-2xl rounded-2xl p-0 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0B0915]">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-500/20 p-3 rounded-full">
                            <ShieldCheck className="text-blue-400" size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">O Guardião do Dinheiro</h2>
                            <p className="text-blue-400 text-sm font-mono uppercase tracking-wider">Protocolo de Proteção de Capital</p>
                        </div>
                    </div>
                    <button onClick={() => setShowGuardianInfo(false)} className="text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto space-y-8 text-gray-300 leading-relaxed custom-scrollbar">
                    <section>
                        <h3 className="text-white font-bold text-lg mb-2">O que ele é</h3>
                        <p>
                            Responsável por proteger o seu investimento em mídia paga. Ele garante que nenhum valor seja desperdiçado em campanhas que não entregam o resultado combinado.
                            É um controle financeiro inteligente que toma decisões técnicas baseadas em dados (CPA, ROAS), não em suposições.
                        </p>
                    </section>

                    <section className="grid md:grid-cols-2 gap-6">
                        <div className="bg-green-500/5 border border-green-500/10 p-4 rounded-xl">
                            <h4 className="text-green-400 font-bold mb-2 flex items-center gap-2"><CheckCircle size={16} /> O que ele faz</h4>
                            <ul className="space-y-2 text-sm">
                                <li>• Monitora campanhas 24h por dia.</li>
                                <li>• Avalia resultados vs Metas.</li>
                                <li>• Interrompe anúncios ruins automaticamente.</li>
                                <li>• Refaz planos antes do prejuízo.</li>
                            </ul>
                        </div>
                        <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl">
                            <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2"><XCircle size={16} /> O que ele NÃO faz</h4>
                            <ul className="space-y-2 text-sm">
                                <li>• Não gasta sem critério.</li>
                                <li>• Não mantém campanhas por teimosia.</li>
                                <li>• Não toma decisões criativas (isso é com você).</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-white font-bold text-lg mb-2">Como ele decide (Critérios)</h3>
                        <p className="mb-4">Antes de qualquer campanha, definimos limites claros:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-bold text-center text-white">
                            <div className="bg-white/5 p-2 rounded border border-white/10">Custo Máximo</div>
                            <div className="bg-white/5 p-2 rounded border border-white/10">ROAS Mínimo</div>
                            <div className="bg-white/5 p-2 rounded border border-white/10">Alcance Meta</div>
                            <div className="bg-white/5 p-2 rounded border border-white/10">Limites ($)</div>
                        </div>
                    </section>

                    <div className="bg-blue-600/10 border border-blue-500/30 p-4 rounded-xl text-center">
                        <p className="text-blue-200 font-bold text-lg">"Você manda. A VERA executa. O Guardião protege."</p>
                    </div>
                </div>

                <div className="p-6 border-t border-white/10 bg-[#0B0915]">
                    <button onClick={() => setShowGuardianInfo(false)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors">
                        Entendi o papel do Guardião
                    </button>
                </div>
            </div>
        </div>
    );

    const [paymentStep, setPaymentStep] = useState<'input' | 'pix_code' | 'card_input' | 'processing' | 'success'>('input');
    const [copySuccess, setCopySuccess] = useState(false);

    const AddCreditsModal = () => {
        const numAmount = parseFloat(amount) || 0;
        const isAds = rechargeType === 'ADS';

        // Card State
        const [cardNumber, setCardNumber] = useState('');
        const [cardName, setCardName] = useState('');
        const [cardExpiry, setCardExpiry] = useState('');
        const [cardCvv, setCardCvv] = useState('');

        const isCardValid = cardNumber.length >= 13 && cardName.length > 3 && cardExpiry.length >= 4 && cardCvv.length >= 3;

        // Fee Calculation
        const feePercentage = paymentMethod === 'pix' ? 0.08 : 0.12;
        const feeAmount = numAmount * feePercentage;

        // Display Logic
        const title = isAds ? "Recarregar Saldo de Anúncios" : "Comprar Créditos VERA";
        const icon = isAds ? <Wallet className="text-blue-500" /> : <Zap className="text-yellow-500" />;
        const description = isAds
            ? <span>Este valor será usado <span className="text-white font-bold">exclusivamente</span> para pagar as plataformas de anúncios.</span>
            : "Adicione créditos para utilizar os agentes de IA e gerar conteúdo.";

        const handlePixCopy = () => {
            navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540410.005802BR5913VERA MARKETING6009SAO PAULO62070503***6304E2CA");
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);

            // Validate after copy simulation
            setTimeout(() => {
                setPaymentStep('processing');
                setTimeout(() => {
                    setPaymentStep('success');
                    setIsLoading(false);
                    setTimeout(() => {
                        setShowAddCredits(false);
                        setShowPaymentSuccess(true);
                        setPaymentStep('input');
                    }, 1000);
                }, 2000);
            }, 5000);
        };

        if (paymentStep === 'pix_code') {
            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-[#1A1625] border border-[#292348] w-full max-w-md rounded-2xl p-8 shadow-2xl text-center relative">
                        <button
                            onClick={() => { setShowAddCredits(false); setPaymentStep('input'); }}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-2">Pagamento via PIX</h3>
                        <p className="text-gray-400 text-xs mb-6">Escaneie o QR Code ou copie o código abaixo.</p>

                        <div className="bg-white p-4 rounded-xl mx-auto w-48 h-48 mb-6 flex items-center justify-center">
                            <div className="w-full h-full bg-black/10 flex flex-wrap content-start">
                                {[...Array(64)].map((_, i) => (
                                    <div key={i} className={`w-1/8 h-1/8 ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'} w-[12.5%] h-[12.5%]`} />
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#0B0915] border border-gray-700 rounded-lg p-3 mb-4 flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-500 truncate font-mono">00020126580014BR.GOV.BCB.PIX...</span>
                            <button onClick={handlePixCopy} className="text-blue-400 font-bold text-xs hover:text-white transition-colors">
                                {copySuccess ? 'Copiado!' : 'Copiar'}
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-xs text-yellow-500 animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            Aguardando confirmação do banco...
                        </div>
                    </div>
                </div>
            );
        }

        if (paymentStep === 'card_input') {
            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-[#1A1625] border border-[#292348] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
                        <button
                            onClick={() => setPaymentStep('input')} // Go back
                            className="absolute top-4 left-4 text-gray-500 hover:text-white flex items-center gap-1 text-xs"
                        >
                            <ArrowDownLeft className="rotate-45" size={12} /> Voltar
                        </button>
                        <button
                            onClick={() => setShowAddCredits(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                            <CreditCard size={20} className="text-blue-400" />
                            Dados do Cartão
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Número do Cartão</label>
                                <input
                                    type="text"
                                    placeholder="0000 0000 0000 0000"
                                    value={cardNumber}
                                    onChange={e => setCardNumber(e.target.value)}
                                    maxLength={16}
                                    className="w-full bg-[#0B0915] border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Validade</label>
                                    <input
                                        type="text"
                                        placeholder="MM/AA"
                                        value={cardExpiry}
                                        onChange={e => setCardExpiry(e.target.value)}
                                        maxLength={5}
                                        className="w-full bg-[#0B0915] border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:border-blue-500 outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">CVV</label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        value={cardCvv}
                                        onChange={e => setCardCvv(e.target.value)}
                                        maxLength={4}
                                        className="w-full bg-[#0B0915] border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:border-blue-500 outline-none transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Nome no Cartão</label>
                                <input
                                    type="text"
                                    placeholder="COMO NO CARTAO"
                                    value={cardName}
                                    onChange={e => setCardName(e.target.value)}
                                    className="w-full bg-[#0B0915] border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={() => handlePayment()}
                                disabled={!isCardValid || isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            >
                                Confirmar Pagamento
                            </button>
                            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-500">
                                <ShieldCheck size={12} />
                                Ambiente Seguro. Seus dados são criptografados.
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                <div className="bg-[#1A1625] border border-[#292348] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
                    <button
                        onClick={() => setShowAddCredits(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white"
                    >
                        <X size={24} />
                    </button>

                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        {icon}
                        {title}
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">
                        {description}
                    </p>

                    <div className="space-y-6 mb-6">
                        <div className={`bg-[#0B0915] border ${isAds ? 'border-blue-500/30' : 'border-yellow-500/30'} p-4 rounded-xl`}>
                            <label className={`text-xs ${isAds ? 'text-blue-400' : 'text-yellow-400'} font-bold uppercase mb-2 block`}>
                                {isAds ? "Valor da Recarga (R$)" : "Quantidade de Créditos"}
                            </label>
                            <div className="flex items-center gap-2">
                                {isAds && <span className="text-2xl font-bold text-gray-500">R$</span>}
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder={isAds ? "0,00" : "Ex: 500"}
                                    className="bg-transparent text-4xl font-bold text-white outline-none w-full placeholder-gray-700"
                                    autoFocus
                                />
                                {!isAds && <span className="text-sm font-bold text-gray-500 uppercase">Créditos</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setPaymentMethod('pix')}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'pix' ? 'bg-green-500/10 border-green-500 text-white' : 'bg-[#0B0915] border-[#292348] text-gray-400 hover:border-gray-600'}`}
                            >
                                <div className="flex items-center gap-2 font-bold"><Zap size={16} /> PIX</div>
                                <span className="text-[10px] uppercase font-bold text-green-400">Taxa Reduzida (8%)</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'bg-blue-500/10 border-blue-500 text-white' : 'bg-[#0B0915] border-[#292348] text-gray-400 hover:border-gray-600'}`}
                            >
                                <div className="flex items-center gap-2 font-bold"><CreditCard size={16} /> Cartão</div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">Taxa Admin (12%)</span>
                            </button>
                        </div>

                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-2">
                            {isAds ? (
                                <>
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>Recarga Bruta</span>
                                        <span>R$ {numAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-400 items-center">
                                        <div className="flex items-center gap-1 group relative cursor-help">
                                            <span>Taxas (Vera + Transação)</span>
                                            <Info size={12} />
                                        </div>
                                        <span className="text-red-400">- R$ {(numAmount * (paymentMethod === 'pix' ? 0.08 : 0.12)).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                                        <span>Crédito Líquido</span>
                                        <span className="text-green-400">R$ {(numAmount * (paymentMethod === 'pix' ? 0.92 : 0.88)).toFixed(2)}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>Quantidade</span>
                                        <span>{numAmount} tokens</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>Preço Unitário</span>
                                        <span>R$ 0,10</span>
                                    </div>
                                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                                        <span>Total a Pagar</span>
                                        <span className="text-yellow-400">R$ {(numAmount * 0.10).toFixed(2)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            if (paymentMethod === 'pix') {
                                setPaymentStep('pix_code');
                            } else if (paymentMethod === 'card') {
                                setPaymentStep('card_input');
                            } else {
                                handlePayment();
                            }
                        }}
                        disabled={numAmount <= 0 || isLoading}
                        className={`w-full font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${isAds ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20' : 'bg-yellow-600 hover:bg-yellow-500 shadow-yellow-900/20'} text-white disabled:bg-gray-700 disabled:text-gray-500`}
                    >
                        {isLoading ? 'Processando...' : `Pagar R$ ${(isAds ? numAmount : numAmount * 0.10).toFixed(2)}`}
                    </button>
                </div>
            </div>
        );
    }




    const SuccessModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
            <div className="bg-[#1A1625] border border-green-500/30 w-full max-w-sm rounded-2xl p-8 text-center shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-green-500" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Pagamento Iniciado!</h2>
                <p className="text-gray-400 text-sm mb-6">
                    Você foi redirecionado. Assim que confirmado, o saldo cairá automaticamente.
                </p>
                <button
                    onClick={() => setShowPaymentSuccess(false)}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors"
                >
                    Concluir
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {showAddCredits && <AddCreditsModal />}
            {showPaymentSuccess && <SuccessModal />}
            {showGuardianInfo && <GuardianModal />}

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Carteira & Mídia Paga</h1>
                <p className="text-gray-400">
                    Gerencie o orçamento para <span className="text-white font-bold">Meta, Google, TikTok, LinkedIn, X, YouTube</span>.
                </p>
            </div>

            {/* Balance Card */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-[#1A1625] border border-[#292348] rounded-2xl p-8 relative overflow-hidden group flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                        <Wallet size={150} className="text-white" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <h2 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Saldo Disponível para Anúncios
                            </h2>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                                    {metrics ? `R$ ${metrics.balance?.toFixed(2)}` : 'R$ ...'}
                                </span>
                                <span className="text-gray-500 font-medium text-xl">BRL</span>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 border border-white/10 min-w-[150px]">
                            <h3 className="text-gray-400 text-xs font-bold uppercase mb-1 flex items-center gap-2">
                                <Zap size={12} className="text-blue-400" /> Créditos de IA
                            </h3>
                            <div className="text-2xl font-bold text-blue-400">
                                {metrics ? metrics.credits : '...'}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 relative z-10">
                        <button
                            onClick={() => {
                                setRechargeType('ADS');
                                setShowAddCredits(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center gap-3 hover:-translate-y-1"
                        >
                            <Plus size={24} />
                            Nova Recarga
                        </button>
                        <button className="bg-[#292348] hover:bg-[#352F4F] text-white px-6 py-4 rounded-xl font-bold transition-all border border-white/5 flex items-center gap-2">
                            <History size={20} />
                            Extrato
                        </button>
                    </div>
                </div>

                {/* Guardian Status Card - NEW */}
                <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-900/30 rounded-2xl p-6 relative flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />

                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center border-2 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg leading-tight">O Guardião do Dinheiro</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <p className="text-[10px] text-green-400 font-mono uppercase tracking-wider">Proteção Ativa</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-400 text-xs leading-relaxed mb-4">
                            Responsável por proteger seu investimento. Ele monitora métricas em tempo real e trava campanhas ruins antes do prejuízo.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                            <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-bold uppercase">
                                <span>Risco Operacional</span>
                                <span className="text-green-400">0% (Seguro)</span>
                            </div>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-green-500 w-full h-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            </div>
                        </div>

                        <button
                            onClick={() => setShowGuardianInfo(true)}
                            className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold py-3 rounded-lg border border-blue-500/30 transition-all flex items-center justify-center gap-2"
                        >
                            <Info size={14} />
                            Entender Metodologia
                        </button>
                    </div>
                </div>
            </div>

            {/* Transaction History Mock */}
            <div className="bg-[#1A1625] border border-[#292348] rounded-2xl p-6">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                    <History size={20} className="text-gray-400" />
                    Últimas Movimentações
                </h3>
                {metrics?.transactions && metrics.transactions.length > 0 ? (
                    <div className="space-y-2">
                        {metrics.transactions.map((tx: any) => (
                            <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-[#0B0915] border border-white/5 hover:border-blue-500/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm">{tx.desc}</h4>
                                        <p className="text-gray-500 text-xs">{new Date(tx.date).toLocaleDateString('pt-BR')} {new Date(tx.date).toLocaleTimeString('pt-BR')}</p>
                                    </div>
                                </div>
                                <span className={`font-bold ${tx.type === 'credit' ? 'text-green-400' : 'text-white'}`}>
                                    {tx.amount > 0 ? '+' : ''} R$ {tx.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        Nenhuma transação registrada.
                    </div>
                )}
            </div>
            {/* Fees Info */}
            <div className="bg-[#1A1625] border border-[#292348] rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <AlertTriangle className="text-yellow-500" size={20} />
                    Entenda nossas Taxas
                </h3>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-900/40 text-blue-400 flex items-center justify-center font-bold shrink-0 border border-blue-500/30">
                                <CreditCard size={20} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Recarga com Cartão (12%)</h4>
                                <p className="text-sm text-gray-400">
                                    Taxa composta: <span className="text-white">Taxa VERA</span> + Custos de Gateway e Antifraude.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-green-900/40 text-green-400 flex items-center justify-center font-bold shrink-0 border border-green-500/30">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Recarga com PIX (8%)</h4>
                                <p className="text-sm text-gray-400">
                                    <span className="text-green-400">Desconto aplicado.</span> Mantemos a <span className="text-white">Taxa de Gestão VERA</span>, removendo apenas custos de cartão.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-900/40 text-purple-400 flex items-center justify-center font-bold shrink-0 border border-purple-500/30">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Taxa de Performance (Success Fee)</h4>
                                <p className="text-sm text-gray-400">
                                    Cobramos <span className="text-white font-bold">10% apenas sobre o Lucro</span> gerado.
                                    Isso incentiva a VERA a buscar resultados reais.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
