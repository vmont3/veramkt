/**
 * Email Agent
 * Responsável por gerenciar leads e disparar comunicações (Newsletters, Boas-vindas)
 */

import { Resend } from 'resend';
import { prisma } from '../../database/prismaClient';

export class EmailAgent {
    private resend: Resend | null = null;
    private hasApiKey: boolean = false;

    constructor() {
        // Inicializa cliente Resend se houver chave
        const apiKey = process.env.RESEND_API_KEY;
        if (apiKey) {
            this.resend = new Resend(apiKey);
            this.hasApiKey = true;
            console.log("✅ [EmailAgent] Serviço de e-mail inicializado via Resend.");
        } else {
            console.error("❌ [EmailAgent] RESEND_API_KEY não encontrada. O serviço irá falhar se chamado.");
        }
    }

    /**
     * Capturar novo lead
     */
    async captureLead(leadData: { email: string; name: string; source: string; phone?: string }) {
        console.log(`[EmailAgent] Capturando lead: ${leadData.email}`);

        try {
            // 1. Salvar no banco REAL
            await prisma.lead.create({
                data: {
                    email: leadData.email,
                    name: leadData.name,
                    source: leadData.source || 'website',
                    phone: leadData.phone
                }
            });
            console.log("[EmailAgent] Lead salvo com sucesso no banco.");

            // 2. Disparar sequência de boas-vindas
            await this.sendWelcomeSequence(leadData.email, leadData.name);

            return true;
        } catch (error) {
            console.error("[EmailAgent] Erro ao capturar lead:", error);
            return false;
        }
    }

    /**
     * Enviar sequência de boas-vindas
     */
    async sendWelcomeSequence(email: string, name: string) {
        const subject = "Bem-vindo à VERA Marketing!";
        const htmlContent = `
            <h1>Olá, ${name}!</h1>
            <p>Obrigado por se cadastrar. A VERA é sua nova agência autônoma.</p>
            <p>Em breve você receberá novidades.</p>
        `;

        await this.sendEmail({
            to: email,
            subject,
            html: htmlContent
        });
    }

    /**
     * Enviar Newsletter (Geralmente conteúdo vindo do CopyAgent)
     */
    async sendNewsletter(subject: string, htmlContent: string, segment: string = 'all') {
        console.log(`[EmailAgent] Preparando envio de newsletter para segmento: ${segment}`);

        // Buscar leads reais do banco
        const leads = await prisma.lead.findMany({
            where: segment === 'all' ? {} : { status: segment } // Exemplo simples
        });

        if (leads.length === 0) {
            console.log("[EmailAgent] Nenhum lead encontrado para envio.");
            return { totalSent: 0, segment };
        }

        let successCount = 0;

        for (const recipient of leads) {
            const sent = await this.sendEmail({
                to: recipient.email,
                subject,
                html: htmlContent
            });
            if (sent) successCount++;
        }

        return {
            totalSent: successCount,
            segment
        };
    }

    /**
     * Método interno unificado de envio
     */
    private async sendEmail(params: { to: string; subject: string; html: string; from?: string }): Promise<boolean> {
        const from = params.from || "VERA <contato@veramkt.com>"; // Idealmente configurado no .env

        if (this.hasApiKey && this.resend) {
            try {
                await this.resend.emails.send({
                    from,
                    to: params.to,
                    subject: params.subject,
                    html: params.html
                });
                console.log(`[EmailAgent] E-mail enviado para ${params.to} via Resend.`);
                return true;
            } catch (error) {
                console.error(`[EmailAgent] Falha ao enviar e-mail via API:`, error);
                return false;
            }
        } else {
            console.error(`❌ [EmailAgent] Tentativa de envio falhou. Chave API ausente.`);
            throw new Error("RESEND_API_KEY is missing. Cannot send real email.");
        }
    }
}

export const emailAgent = new EmailAgent();
