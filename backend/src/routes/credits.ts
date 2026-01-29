import express from 'express';
import { CreditService } from '../services/CreditService';
import { authenticateToken, requireSuperAdmin } from '../middleware/auth';
import { telegramNotification } from '../services/TelegramNotificationService';
import { prisma } from '../database/prismaClient';

const router = express.Router();

// Get Balance
router.get('/balance', async (req, res) => {
    try {
        const userId = req.query.userId as string;
        if (!userId) return res.status(400).json({ error: 'ID do usuário é obrigatório' });

        const balance = await CreditService.getBalance(userId);
        res.json({ credits: balance });
    } catch (error) {
        console.error('Error fetching balance:', error);
        res.status(500).json({ error: 'Falha ao buscar saldo de créditos' });
    }
});

// Get History
router.get('/history', async (req, res) => {
    try {
        const userId = req.query.userId as string;
        if (!userId) return res.status(400).json({ error: 'ID do usuário é obrigatório' });

        const history = await CreditService.getHistory(userId);
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Falha ao buscar histórico de créditos' });
    }
});



// Checkout (Initiates a pending transaction)
router.post('/checkout', async (req, res) => {
    try {
        const { userId, amount, description, type, plan } = req.body;
        if (!userId || !amount) return res.status(400).json({ error: 'Parâmetros ausentes' });

        const transaction = await CreditService.createPendingTransaction(
            userId,
            amount,
            description || 'Compra Iniciada',
            type || 'PURCHASE'
        );

        // Get user data for notification
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, name: true }
        });

        if (user) {
            // Send Telegram notification for purchase intent
            await telegramNotification.notifyPurchaseIntent({
                email: user.email,
                name: user.name || undefined,
                plan: plan || description,
                amount
            });
        }

        res.json({
            success: true,
            status: 'PENDING',
            transactionId: transaction.id,
            message: 'Pagamento iniciado. Aguardando confirmação.'
        });
    } catch (error) {
        console.error('Error initiating checkout:', error);
        res.status(500).json({ error: 'Falha ao iniciar pagamento' });
    }
});

// Purchase/Add Credits (Immediate - Admin or Test)
router.post('/add', async (req, res) => {
    try {
        const { userId, amount, description, type } = req.body;
        if (!userId || !amount) return res.status(400).json({ error: 'Parâmetros ausentes' });

        const newBalance = await CreditService.addCredits(userId, amount, description || 'Compra', type || 'PURCHASE');
        res.json({ success: true, newBalance, message: 'Créditos adicionados com sucesso' });
    } catch (error) {
        console.error('Error adding credits:', error);
        res.status(500).json({ error: 'Falha ao adicionar créditos' });
    }
});

// Deduct (Used by agents internally, but exposed for testing/manual actions)
router.post('/deduct', async (req, res) => {
    try {
        const { userId, amount, description, agentId } = req.body;
        if (!userId || !amount) return res.status(400).json({ error: 'Parâmetros ausentes' });

        const newBalance = await CreditService.deductCredits(userId, amount, description || 'Uso manual', agentId);
        res.json({ success: true, newBalance, message: 'Créditos deduzidos com sucesso' });
    } catch (error: any) {
        console.error('Error deducting credits:', error);
        res.status(400).json({ error: error.message || 'Falha ao deduzir créditos' });
    }
});

// [NOVO] Admin Gift (Cortesia) - Secured with RBAC
router.post('/admin-gift', authenticateToken, requireSuperAdmin, async (req: any, res) => {
    try {
        const { userId, amount, description } = req.body;

        if (!userId || !amount) return res.status(400).json({ error: 'Parâmetros userId e amount obrigatórios.' });

        const newBalance = await CreditService.addCredits(
            userId,
            Number(amount),
            description || 'Cortesia Administrativa (Bonus)',
            'BONUS'
        );

        res.json({ success: true, newBalance, message: 'Créditos de cortesia enviados com sucesso!' });
    } catch (error) {
        console.error('Erro ao dar cortesia:', error);
        res.status(500).json({ error: 'Falha ao processar cortesia.' });
    }
});

export default router;
