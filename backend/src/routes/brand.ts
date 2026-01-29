
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { uploadBrandAsset, BrandAnalysisService } from '../services/BrandAnalysisService';

const router = express.Router();
const prisma = new PrismaClient();

// Upload Brand Asset
router.post('/assets', authenticateToken, uploadBrandAsset, async (req: any, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        }

        const userId = req.user.id;
        const { type } = req.body; // 'LOGO', 'MANUAL', 'OTHER'

        // Ensure Brand exists
        let brand = await prisma.brand.findFirst({ where: { userId } });
        if (!brand) {
            // Should usually exist if they are in settings, but create if safe
            brand = await prisma.brand.create({
                data: { userId, name: 'Minha Marca' }
            });
        }

        const fileUrl = `/uploads/brand_assets/${req.file.filename}`;

        // Save Asset Record
        const asset = await prisma.brandAsset.create({
            data: {
                brandId: brand.id,
                type: type || 'OTHER',
                url: fileUrl,
                name: req.file.originalname,
                mimeType: req.file.mimetype,
                fileSize: req.file.size
            }
        });

        // Trigger Analysis immediately (async)
        analyzeAsset(asset.id, req.file.path).catch(err => console.error("Async analysis failed", err));

        res.json({ success: true, asset });

    } catch (error) {
        console.error('Error uploading brand asset:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// Analyze Asset (Internal Helper)
async function analyzeAsset(assetId: string, filePath: string) {
    try {
        const asset = await prisma.brandAsset.findUnique({ where: { id: assetId }, include: { brand: true } });
        if (!asset) return;

        let analysisResult: any = {};

        if (asset.type === 'LOGO') {
            const colors = await BrandAnalysisService.extractColorsFromLogo(filePath);
            analysisResult = { palette: colors };

            // Update Brand Guidelines with colors if empty
            // ... (Logic to merge palette into BrandGuidelines)
            const guidelines = await prisma.brandGuidelines.findUnique({ where: { brandId: asset.brandId } });
            if (guidelines && guidelines.colorPalette === '{}') {
                await prisma.brandGuidelines.update({
                    where: { brandId: asset.brandId },
                    data: { colorPalette: JSON.stringify(colors) }
                });
            }

            // Update Brand Logo URL
            await prisma.brand.update({
                where: { id: asset.brandId },
                data: { logoUrl: asset.url }
            });

        } else if (asset.type === 'MANUAL' || asset.mimeType === 'application/pdf') {
            const analysis = await BrandAnalysisService.analyzeBrandManual(filePath);
            analysisResult = analysis;

            // Update generic summary
            await prisma.brandAsset.update({
                where: { id: assetId },
                data: { summary: analysis.summary }
            });

            // Update Memory fields if empty
            const guidelines = await prisma.brandGuidelines.findUnique({ where: { brandId: asset.brandId } });
            if (guidelines) {
                const currentTone = guidelines.tone;
                // Only overwrite if generic default
                if (!currentTone || currentTone === 'Professional') {
                    await prisma.brandGuidelines.update({
                        where: { brandId: asset.brandId },
                        data: { tone: analysis.tone }
                    });
                }
            }
        }

    } catch (error) {
        console.error(`Analysis failed for asset ${assetId}:`, error);
    }
}

// Get Brand Assets
router.get('/assets', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const brand = await prisma.brand.findFirst({ where: { userId } });

        if (!brand) return res.json([]);

        const assets = await prisma.brandAsset.findMany({
            where: { brandId: brand.id },
            orderBy: { createdAt: 'desc' }
        });

        res.json(assets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch assets' });
    }
});

export default router;
