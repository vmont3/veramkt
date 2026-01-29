import { PrismaClient } from '@prisma/client';
import { mercadoPagoService } from './payment/MercadoPagoService';

const prisma = new PrismaClient();

export class CreditService {
    /**
     * Get current credit balance for a user
     */
    static async getBalance(userId: string): Promise<number> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true }
        });
        return user?.credits || 0;
    }

    /**
     * Deduct credits from a user
     * Throws error if insufficient funds
     */
    static async deductCredits(userId: string, amount: number, description: string, agentId?: string): Promise<number> {
        if (amount <= 0) throw new Error("Deduction amount must be positive");

        const user = await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } });
        if (!user || user.credits < amount) {
            throw new Error(`Insufficient credits. Required: ${amount}, Available: ${user?.credits || 0}`);
        }

        // Transaction to ensure atomic update
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create transaction record
            await tx.creditTransaction.create({
                data: {
                    userId,
                    amount: -amount,
                    type: 'USAGE',
                    description,
                    agentId
                }
            });

            // 2. Update user balance
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: { credits: { decrement: amount } },
                select: { credits: true }
            });

            return updatedUser.credits;
        });

        return result;
    }

    /**
     * Add credits to a user (Purchase or Bonus)
     */
    /**
     * Add credits to a user (Purchase or Bonus) - Immediately Completed
     */
    static async addCredits(userId: string, amount: number, description: string, type: 'PURCHASE' | 'BONUS' | 'REFUND' = 'PURCHASE'): Promise<number> {
        if (amount <= 0) throw new Error("Addition amount must be positive");

        const result = await prisma.$transaction(async (tx) => {
            await tx.creditTransaction.create({
                data: {
                    userId,
                    amount,
                    type,
                    description,
                    status: 'COMPLETED'
                }
            });

            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: { credits: { increment: amount } },
                select: { credits: true }
            });

            return updatedUser.credits;
        });

        return result;
    }

    /**
     * Create a PENDING transaction (Does not update user balance)
     */
    static async createPendingTransaction(userId: string, amount: number, description: string, type: 'PURCHASE' | 'BONUS' = 'PURCHASE') {
        return prisma.creditTransaction.create({
            data: {
                userId,
                amount,
                type,
                description,
                status: 'PENDING'
            }
        });
    }

    /**
     * Get transaction history
     */
    static async getHistory(userId: string) {
        return prisma.creditTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
    }

    /**
     * [NOVO] Gera link de pagamento para compra de créditos
     */
    static async createPurchaseOrder(userId: string, packId: string): Promise<string> {
        // Pacotes oficiais de Créditos (Tokens Avulsos)
        const creditPacks: any = {
            "boost": { title: "Pack Boost (500 Créditos)", credits: 500, price: 59.90 },
            "turbo": { title: "Pack Turbo (2.000 Créditos)", credits: 2000, price: 199.90 },
            "high_scale": { title: "Pack High-Scale (5.000 Créditos)", credits: 5000, price: 449.90 }
        };

        const pack = creditPacks[packId];
        if (!pack) throw new Error("Pacote de créditos inválido.");

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.email) throw new Error("Usuário inválido para compra.");

        // Chama o serviço de pagamento real
        try {
            const checkoutUrl = await mercadoPagoService.createCheckoutPreference({
                title: pack.title,
                quantity: 1,
                price: pack.price
            }, user.email);

            console.log(`[CreditService] Checkout criado para ${user.email} - ${pack.title}`);

            return checkoutUrl as string;
        } catch (e) {
            console.error(e);
            throw new Error("Erro ao gerar pagamento com Mercado Pago");
        }
    }
}
