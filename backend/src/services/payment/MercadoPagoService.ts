
import MercadoPagoConfig, { Preference, Payment } from 'mercadopago';

export class MercadoPagoService {
    private client: MercadoPagoConfig | null = null;
    private preference: Preference | null = null;
    private payment: Payment | null = null;

    constructor() {
        this.initialize();
    }

    public initialize() { // Public para poder ser chamado no reload
        if (process.env.MERCADO_PAGO_ACCESS_TOKEN) {
            this.client = new MercadoPagoConfig({
                accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
            });
            this.preference = new Preference(this.client);
            this.payment = new Payment(this.client);
            console.log("✅ [MercadoPago] Módulo de Pagamentos Ativo.");
        } else {
            console.warn("⚠️ [MercadoPago] Token não encontrado. Pagamentos desativados.");
        }
    }

    /**
     * Cria um link de pagamento (Checkout Pro) para um Plano ou Créditos.
     */
    async createCheckoutPreference(item: {
        title: string;
        quantity: number;
        price: number;
        currency_id?: string;
    }, payerEmail: string) {
        if (!this.preference) throw new Error("Mercado Pago não configurado.");

        try {
            const response = await this.preference.create({
                body: {
                    items: [
                        {
                            id: "item_" + Date.now(),
                            title: item.title,
                            quantity: item.quantity,
                            unit_price: item.price,
                            currency_id: item.currency_id || 'BRL',
                        }
                    ],
                    payer: {
                        email: payerEmail
                    },
                    back_urls: {
                        success: `${process.env.FRONTEND_URL}/payment/success`,
                        failure: `${process.env.FRONTEND_URL}/payment/failure`,
                        pending: `${process.env.FRONTEND_URL}/payment/pending`
                    },
                    auto_return: "approved",
                }
            });

            return response.init_point; // URL de pagamento
        } catch (error) {
            console.error("❌ [MercadoPago] Erro ao criar preferência:", error);
            throw error;
        }
    }

    /**
     * Verifica status de um pagamento (Polling)
     * Webhook é preferível, mas isso serve para verificações manuais.
     */
    async getPaymentStatus(paymentId: string) {
        if (!this.payment) throw new Error("Mercado Pago não configurado.");
        try {
            const response = await this.payment.get({ id: paymentId });
            return response.status;
        } catch (error) {
            console.error("❌ [MercadoPago] Erro ao consultar pagamento:", error);
            return null;
        }
    }
}

export const mercadoPagoService = new MercadoPagoService();
