import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../database/prismaClient';
import { ReferralService } from '../services/ReferralService';
import { telegramNotification } from '../services/TelegramNotificationService';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'vera-secret-key-change-me';

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, cnpj, referralCode } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Usuário já existe use outro email' });
        }

        // If CNPJ provided, check if already used
        if (cnpj) {
            const existingCNPJ = await prisma.user.findUnique({
                where: { cnpj }
            });
            if (existingCNPJ) {
                return res.status(400).json({ error: 'CNPJ já cadastrado. Plano grátis limitado a 1 CNPJ.' });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                cnpj: cnpj || null,
                credits: 300, // Base credits (free plan)
                referredBy: referralCode || null
            }
        });

        // Generate referral code for new user
        await ReferralService.generateReferralCode(user.id);

        // Process referral if code provided
        if (referralCode && cnpj) {
            try {
                await ReferralService.processReferral(user.id, cnpj, referralCode);
            } catch (refError: any) {
                console.error('Referral processing error:', refError);
                // Don't fail signup, just log the error
            }
        }

        // Generate Token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        // Fetch updated user to get current credits (after potential referral bonus)
        const updatedUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { id: true, name: true, email: true, credits: true }
        });

        // Send Telegram notification for new signup (Safe Mode)
        try {
            await telegramNotification.notifySignup({
                email: user.email,
                name: user.name || undefined,
                cnpj: cnpj || undefined,
                referralCode: referralCode || undefined
            });
        } catch (tgError) {
            console.error('Failed to send telegram notification:', tgError);
            // Non-blocking error
        }

        res.status(201).json({
            message: 'Usuário criado com sucesso',
            token,
            user: updatedUser
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: `Falha ao registrar usuário: ${(error as any).message}` });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Generate Token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Login realizado com sucesso',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Erro ao conectar' });
    }
});

export default router;
