/**
 * 📁 File Upload/Download Routes
 * Permite que usuários façam upload de arquivos (imagens, vídeos)
 * e baixem conteúdo gerado pelos agentes
 */

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middleware/auth';
import { prisma } from '../database/prismaClient';

const router = Router();

// Garantir que o diretório de uploads existe
const UPLOAD_DIR = path.join(__dirname, '../../uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configurar storage do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${uuidv4()}${ext}`;
        cb(null, uniqueName);
    }
});

// Filtro de tipos de arquivo permitidos
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/gif',
        'video/mp4',
        'video/quicktime', // .mov
        'video/webm',
        'audio/webm',
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/ogg'
    ];

    const isAllowed = allowedMimes.includes(file.mimetype) ||
        (file.mimetype.startsWith('audio/') && file.mimetype !== 'audio/unknown') ||
        file.mimetype.startsWith('video/');

    if (isAllowed) {
        cb(null, true);
    } else {
        console.warn(`⚠️ [Files] Upload rejeitado: MIME type não permitido: ${file.mimetype}`);
        cb(new Error(`Tipo de arquivo não permitido: ${file.mimetype}`));
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB máximo
    },
    fileFilter
});

/**
 * 📤 POST /api/files/upload
 * Upload de arquivo (imagem ou vídeo)
 */
router.post('/upload', authenticateToken, upload.single('file'), async (req: any, res) => {
    try {
        const userId = req.user?.id;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                error: 'Nenhum arquivo enviado'
            });
        }

        console.log(`📤 [Files] Upload recebido: ${file.originalname} (${file.size} bytes)`);

        // Determinar tipo do arquivo
        const isImage = file.mimetype.startsWith('image/');
        const isVideo = file.mimetype.startsWith('video/');
        const isAudio = file.mimetype.startsWith('audio/');
        const fileType = isImage ? 'image' : isVideo ? 'video' : isAudio ? 'audio' : 'other';

        // Salvar referência no banco de dados
        const fileRecord = await prisma.uploadedFile.create({
            data: {
                userId,
                filename: file.filename,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                type: fileType,
                path: file.path
            }
        });

        // Gerar URL de acesso
        const fileUrl = `/api/files/${fileRecord.id}`;

        res.json({
            success: true,
            data: {
                id: fileRecord.id,
                filename: file.filename,
                originalName: file.originalname,
                type: fileType,
                size: file.size,
                url: fileUrl
            }
        });

    } catch (error: any) {
        console.error('❌ [Files] Erro no upload:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erro ao fazer upload do arquivo'
        });
    }
});

/**
 * 📥 GET /api/files/:fileId
 * Download de arquivo pelo ID
 */
router.get('/:fileId', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user?.id;
        const { fileId } = req.params;

        // Buscar arquivo no banco
        const fileRecord = await prisma.uploadedFile.findFirst({
            where: {
                id: fileId,
                userId // Garantir que o arquivo pertence ao usuário
            }
        });

        if (!fileRecord) {
            return res.status(404).json({
                success: false,
                error: 'Arquivo não encontrado'
            });
        }

        // Verificar se o arquivo existe no disco
        const filePath = path.join(UPLOAD_DIR, fileRecord.filename);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                error: 'Arquivo não encontrado no servidor'
            });
        }

        // Enviar arquivo
        res.setHeader('Content-Type', fileRecord.mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${fileRecord.originalName}"`);

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

    } catch (error: any) {
        console.error('❌ [Files] Erro no download:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao baixar arquivo'
        });
    }
});

/**
 * 📥 GET /api/files/:fileId/download
 * Download forçado (attachment) de arquivo
 */
router.get('/:fileId/download', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user?.id;
        const { fileId } = req.params;

        const fileRecord = await prisma.uploadedFile.findFirst({
            where: {
                id: fileId,
                userId
            }
        });

        if (!fileRecord) {
            return res.status(404).json({
                success: false,
                error: 'Arquivo não encontrado'
            });
        }

        const filePath = path.join(UPLOAD_DIR, fileRecord.filename);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                error: 'Arquivo não encontrado no servidor'
            });
        }

        // Forçar download
        res.download(filePath, fileRecord.originalName);

    } catch (error: any) {
        console.error('❌ [Files] Erro no download:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao baixar arquivo'
        });
    }
});

/**
 * 📋 GET /api/files
 * Listar arquivos do usuário
 */
router.get('/', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user?.id;
        const { type, limit = 20, offset = 0 } = req.query;

        const where: any = { userId };
        if (type) {
            where.type = type;
        }

        const files = await prisma.uploadedFile.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit as string),
            skip: parseInt(offset as string),
            select: {
                id: true,
                filename: true,
                originalName: true,
                type: true,
                size: true,
                mimeType: true,
                createdAt: true
            }
        });

        // Adicionar URLs
        const filesWithUrls = files.map(file => ({
            ...file,
            url: `/api/files/${file.id}`,
            downloadUrl: `/api/files/${file.id}/download`
        }));

        res.json({
            success: true,
            data: filesWithUrls
        });

    } catch (error: any) {
        console.error('❌ [Files] Erro ao listar arquivos:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao listar arquivos'
        });
    }
});

/**
 * 🗑️ DELETE /api/files/:fileId
 * Deletar arquivo
 */
router.delete('/:fileId', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user?.id;
        const { fileId } = req.params;

        const fileRecord = await prisma.uploadedFile.findFirst({
            where: {
                id: fileId,
                userId
            }
        });

        if (!fileRecord) {
            return res.status(404).json({
                success: false,
                error: 'Arquivo não encontrado'
            });
        }

        // Deletar arquivo do disco
        const filePath = path.join(UPLOAD_DIR, fileRecord.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Deletar registro do banco
        await prisma.uploadedFile.delete({
            where: { id: fileId }
        });

        res.json({
            success: true,
            message: 'Arquivo deletado com sucesso'
        });

    } catch (error: any) {
        console.error('❌ [Files] Erro ao deletar arquivo:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao deletar arquivo'
        });
    }
});

export default router;
