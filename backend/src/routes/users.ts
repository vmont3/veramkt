import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get Current User (for DashboardLayout)
router.get('/me', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                credits: true,
                profilePictureUrl: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});

// Update User Profile & Brand Settings
router.put('/profile', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const {
            name, surname, company, gender, email, phone, website, // Profile Data
            brandVoice, targetAudience, mission, forbiddenTerms, vision, coreValues // Memory Data
        } = req.body;

        // 1. Update User basic info
        await (prisma.user as any).update({
            where: { id: userId },
            data: {
                name: `${name} ${surname}`.trim(),
                gender: gender || 'masculino',
                phone: phone || null,
                website: website || null,
                // email: email, // Avoid updating email for now for security/auth consistency
            }
        });

        // 2. Ensure Brand exists (Create or Update)
        // We use the company name as brand name, or fallback to user name
        const brandName = company || `${name}'s Brand`;

        // Check if brand exists
        let brand = await prisma.brand.findFirst({ where: { userId } });

        if (!brand) {
            brand = await prisma.brand.create({
                data: {
                    userId,
                    name: brandName
                }
            });
        } else {
            // Update brand name if changed
            await prisma.brand.update({
                where: { id: brand.id },
                data: { name: brandName }
            });
        }

        // 3. Update Brand Guidelines (Memory)
        // Check if guidelines exist
        let guidelines = await prisma.brandGuidelines.findUnique({ where: { brandId: brand.id } });

        if (!guidelines) {
            await prisma.brandGuidelines.create({
                data: {
                    brandId: brand.id,
                    tone: brandVoice || 'Professional',
                    messaging: JSON.stringify({ mission, targetAudience, vision, coreValues }),
                    voiceCharacteristics: JSON.stringify(forbiddenTerms ? (typeof forbiddenTerms === 'string' ? forbiddenTerms.split(',') : forbiddenTerms) : []),
                    colorPalette: '{}',
                    typography: '{}',
                    visualStyle: 'Modern',
                    imagery: '[]'
                }
            });
        } else {
            await prisma.brandGuidelines.update({
                where: { brandId: brand.id },
                data: {
                    tone: brandVoice || guidelines.tone,
                    messaging: JSON.stringify({ mission, targetAudience, vision, coreValues }),
                    voiceCharacteristics: JSON.stringify(forbiddenTerms ? (typeof forbiddenTerms === 'string' ? forbiddenTerms.split(',') : forbiddenTerms) : [])
                }
            });
        }

        // 4. Also ensure a default ContentPlan exists (fixing the "No Plan" error)
        const plan = await prisma.contentPlan.findFirst({ where: { userId } });
        if (!plan) {
            await prisma.contentPlan.create({
                data: {
                    userId,
                    brandId: brand.id,
                    status: 'active',
                    period: new Date().toISOString().slice(0, 7),
                    platforms: '[]',
                    contentCount: 0,
                    themes: '[]'
                }
            });
        }

        res.json({ success: true, message: 'Perfil e Memória Neural atualizados com sucesso!' });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Falha ao atualizar perfil.' });
    }
});

// Get Profile Data
router.get('/profile', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        const brand = await prisma.brand.findFirst({ where: { userId } });
        const guidelines = brand ? await prisma.brandGuidelines.findUnique({ where: { brandId: brand.id } }) : null;

        // Parse memory data
        let memory = {
            brandVoice: '',
            targetAudience: '',
            mission: '',
            vision: '',
            coreValues: '',
            forbiddenTerms: ''
        };

        if (guidelines) {
            const messaging = JSON.parse(guidelines.messaging || '{}');
            const forbidden = JSON.parse(guidelines.voiceCharacteristics || '[]');

            memory = {
                brandVoice: guidelines.tone,
                targetAudience: messaging.targetAudience || '',
                mission: messaging.mission || '',
                vision: messaging.vision || '',
                coreValues: messaging.coreValues || '',
                forbiddenTerms: Array.isArray(forbidden) ? forbidden.join(', ') : (forbidden || '')
            };
        }

        res.json({
            profile: {
                name: user?.name?.split(' ')[0] || '',
                surname: user?.name?.split(' ').slice(1).join(' ') || '',
                email: user?.email,
                company: brand?.name || '',
                gender: (user as any)?.gender || 'masculino',
                phone: (user as any)?.phone || '',
                website: (user as any)?.website || '',
                profilePictureUrl: user?.profilePictureUrl || ''
            },
            memory
        });

    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Falha ao buscar perfil.' });
    }
});

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure Multer for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// Upload Profile Picture
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req: any, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        }

        const userId = req.user.id;
        // Construct public URL (assuming express serves 'uploads' at root or /uploads)
        // We will serve it at /uploads via static middleware in index.ts
        const fileUrl = `/uploads/${req.file.filename}`;

        await prisma.user.update({
            where: { id: userId },
            data: { profilePictureUrl: fileUrl }
        });

        res.json({ success: true, url: fileUrl, message: 'Foto de perfil atualizada!' });

    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ error: 'Falha ao fazer upload da imagem.' });
    }
});

export default router;
