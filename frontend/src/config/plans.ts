// Shared plans configuration to match backend pricing logic conceptually
// Prices should ideally be fetched from backend or kept in sync
export const PLANS = {
    starter: {
        id: 'starter',
        name: 'Starter',
        price: 'R$ 0',
        period: '/mês',
        features: [
            { text: '1 Squad Básica', included: true },
            { text: '3 Agentes', included: true },
            { text: 'R$ 1k limite ads', included: true }
        ],
        badge: 'Plano Atual',
        buttonText: 'Plano Atual',
        action: 'current'
    },
    pro: {
        id: 'pro',
        name: 'Scale Pro',
        price: 'R$ 297',
        period: '/mês',
        features: [
            { text: 'Squad Completa (10 Agentes)', included: true },
            { text: 'Guardião Financeiro Ativo', included: true },
            { text: 'R$ 50k limite ads', included: true },
            { text: 'Otimização 24/7', included: true }
        ],
        badge: 'Recomendado',
        buttonText: 'Fazer Upgrade',
        action: 'upgrade'
    },
    business: {
        id: 'business',
        name: 'Business',
        price: 'Sob Consulta',
        period: '',
        features: [
            { text: 'Múltiplas Squads', included: true },
            { text: 'API Dedicada', included: true },
            { text: 'Gerente de Conta', included: true },
            { text: 'Treinamento Customizado', included: true }
        ],
        badge: '',
        buttonText: 'Falar com Consultor',
        action: 'contact'
    }
};
