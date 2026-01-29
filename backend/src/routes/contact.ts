import { Router } from 'express';
import { telegramNotification } from '../services/TelegramNotificationService';

const router = Router();

// Contact form submission
router.post('/submit', async (req, res) => {
    try {
        const { name, email, phone, company, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Nome, email e mensagem são obrigatórios' });
        }

        // Send Telegram notification
        await telegramNotification.notifyContactForm({
            name,
            email,
            phone,
            company,
            message
        });

        res.json({
            success: true,
            message: 'Mensagem enviada com sucesso! Retornaremos em breve.'
        });
    } catch (error: any) {
        console.error('[Contact] Error:', error);
        res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }
});

export default router;
