import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { prisma } from '../database/prismaClient';

const router = express.Router();

// Get all leads
router.get('/', authenticateToken, async (req: any, res) => {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
            take: 500
        });
        res.json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

// Get lead stats
router.get('/stats', authenticateToken, async (req: any, res) => {
    try {
        const total = await prisma.lead.count();
        const newLeads = await prisma.lead.count({ where: { status: 'new' } });
        const contacted = await prisma.lead.count({ where: { status: 'contacted' } });
        const converted = await prisma.lead.count({ where: { status: 'converted' } });

        res.json({
            total,
            new: newLeads,
            contacted,
            converted,
            conversionRate: total > 0 ? ((converted / total) * 100).toFixed(1) : 0
        });
    } catch (error) {
        console.error('Error fetching lead stats:', error);
        res.status(500).json({ error: 'Failed to fetch lead stats' });
    }
});

// Export leads as CSV
router.get('/export', authenticateToken, async (req: any, res) => {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Build CSV
        const headers = 'Nome,Email,Telefone,Origem,Status,Data de Criação\n';
        const rows = leads.map(lead =>
            `"${lead.name || ''}","${lead.email}","${lead.phone || ''}","${lead.source || ''}","${lead.status}","${new Date(lead.createdAt).toLocaleDateString('pt-BR')}"`
        ).join('\n');

        const csv = headers + rows;

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=leads_export.csv');
        res.send('\uFEFF' + csv); // BOM for Excel UTF-8
    } catch (error) {
        console.error('Error exporting leads:', error);
        res.status(500).json({ error: 'Failed to export leads' });
    }
});

// Create new lead
router.post('/', authenticateToken, async (req: any, res) => {
    try {
        const { name, email, phone, source } = req.body;
        console.log('[Leads API] Creating lead:', { name, email, phone, source });

        if (!email) {
            return res.status(400).json({ error: 'Email é obrigatório' });
        }

        // Check if email already exists
        const existing = await prisma.lead.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ error: 'Lead com este email já existe' });
        }

        const lead = await prisma.lead.create({
            data: {
                email,
                name: name || null,
                phone: phone || null,
                source: source || 'manual',
                status: 'new'
            }
        });

        console.log('[Leads API] Lead created:', lead.id);
        res.json(lead);
    } catch (error: any) {
        console.error('Error creating lead:', error);
        res.status(500).json({ error: 'Erro ao criar lead: ' + (error.message || 'Erro desconhecido') });
    }
});

// Update lead status
router.patch('/:id', authenticateToken, async (req: any, res) => {
    try {
        const { id } = req.params;
        const { status, name, phone, source } = req.body;

        const lead = await prisma.lead.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(name && { name }),
                ...(phone && { phone }),
                ...(source && { source })
            }
        });

        res.json(lead);
    } catch (error) {
        console.error('Error updating lead:', error);
        res.status(500).json({ error: 'Failed to update lead' });
    }
});

// Delete lead
router.delete('/:id', authenticateToken, async (req: any, res) => {
    try {
        const { id } = req.params;
        await prisma.lead.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting lead:', error);
        res.status(500).json({ error: 'Failed to delete lead' });
    }
});

export default router;

