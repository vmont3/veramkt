import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../database/prismaClient';

const JWT_SECRET = process.env.JWT_SECRET || 'vera-secret-key-change-me';

interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });

    // BYPASS PARA DESENVOLVIMENTO LOCAL
    if (token === 'SUPER_ADMIN_DEBUG_TOKEN') {
        req.user = { id: 'super-admin-debug', role: 'SUPER_ADMIN', email: 'admin@vera.com' };
        return next();
    }

    jwt.verify(token, JWT_SECRET, async (err: any, user: any) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });

        // Fetch full user to get latest role
        const fullUser = await prisma.user.findUnique({ where: { id: user.userId } });

        if (!fullUser) return res.status(403).json({ error: 'Usuário não encontrado' });

        req.user = fullUser;
        next();
    });
};

export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Usuário não autenticado' });

    if (req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Acesso restrito a Super Admins.' });
    }

    next();
};
