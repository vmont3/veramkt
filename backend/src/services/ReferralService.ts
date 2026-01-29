import { prisma } from '../database/prismaClient';

export class ReferralService {

    // Gerar código único do usuário (usando primeiros 8 chars do UUID)
    static async generateReferralCode(userId: string): Promise<string> {
        const code = userId.substring(0, 8).toUpperCase();
        await prisma.user.update({
            where: { id: userId },
            data: { referralCode: code }
        });
        return code;
    }

    // Processar indicação no signup
    static async processReferral(
        newUserId: string,
        newUserCNPJ: string,
        referralCode?: string
    ): Promise<void> {
        if (!referralCode) return;

        // 1. Buscar quem indicou
        const referrer = await prisma.user.findUnique({
            where: { referralCode }
        });

        if (!referrer) {
            throw new Error("Código de indicação inválido");
        }

        // 2. Verificar se CNPJ já foi usado (anti-fraude)
        const existingReferral = await prisma.referral.findFirst({
            where: { referredCNPJ: newUserCNPJ }
        });

        if (existingReferral) {
            throw new Error("CNPJ já foi indicado anteriormente");
        }

        // 3. Criar registro de referral
        const referral = await prisma.referral.create({
            data: {
                referrerId: referrer.id,
                referredId: newUserId,
                referredCNPJ: newUserCNPJ,
                status: 'confirmed'
            }
        });

        // 4. Dar bônus de 200 VC para novo usuário
        await this.addCredits(
            newUserId,
            200,
            "Bônus de Boas-Vindas (Indicação)"
        );

        // 5. Dar 100 VC para quem indicou
        await this.addCredits(
            referrer.id,
            100,
            `Bônus de Indicação - ${newUserCNPJ}`
        );

        // 6. Marcar bônus como concedido
        await prisma.referral.update({
            where: { id: referral.id },
            data: { bonusGranted: true, confirmedAt: new Date() }
        });
    }

    // Método auxiliar para adicionar créditos
    private static async addCredits(
        userId: string,
        amount: number,
        description: string
    ): Promise<void> {
        // Adicionar créditos ao usuário
        await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: amount } }
        });

        // Registrar transação
        await prisma.creditTransaction.create({
            data: {
                userId,
                amount,
                type: 'BONUS',
                description,
                status: 'COMPLETED'
            }
        });
    }

    // Obter estatísticas de indicações
    static async getReferralStats(userId: string) {
        const referrals = await prisma.referral.findMany({
            where: { referrerId: userId },
            include: {
                referred: {
                    select: {
                        email: true,
                        createdAt: true
                    }
                }
            }
        });

        return {
            totalReferrals: referrals.length,
            confirmedReferrals: referrals.filter((r) => r.bonusGranted).length,
            totalCreditsEarned: referrals.filter((r) => r.bonusGranted).length * 100,
            referrals: referrals.map((r) => ({
                email: r.referred.email,
                confirmedAt: r.confirmedAt,
                bonusGranted: r.bonusGranted
            }))
        };
    }
}
