/**
 * CANVA SERVICE
 * Serviço para integração com Canva API
 * Usado para: Carrosséis, Posts visuais, Designs
 */

import axios from 'axios';

export interface CanvaDesignRequest {
    type: 'instagram_post' | 'instagram_carousel' | 'linkedin_post' | 'facebook_post';
    title: string;
    content?: string;
    brandColors?: string[];
    logo?: string;
}

export interface CanvaDesignResponse {
    designId: string;
    editUrl: string;
    publishUrl: string;
    thumbnailUrl?: string;
}

export class CanvaService {
    private clientId: string;
    private apiKey: string;
    private baseURL = 'https://api.canva.com/rest/v1';

    constructor() {
        this.clientId = process.env.CANVA_CLIENT_ID || '';
        this.apiKey = process.env.CANVA_API_KEY || '';

        if (!this.clientId || !this.apiKey) {
            throw new Error('CANVA_CLIENT_ID e CANVA_API_KEY devem estar configurados no .env');
        }

        console.log('[CanvaService] ✅ Inicializado com sucesso');
    }

    /**
     * Criar design a partir de template
     */
    public async createDesign(request: CanvaDesignRequest): Promise<CanvaDesignResponse> {
        const { type, title, content, brandColors } = request;

        try {
            console.log(`[CanvaService] 🎨 Criando design ${type}...`);

            // Mapear tipo para dimensões Canva
            const dimensions = this.getCanvaDimensions(type);

            const response = await axios.post(
                `${this.baseURL}/designs`,
                {
                    asset_type: 'Design',
                    name: title,
                    width: dimensions.width,
                    height: dimensions.height,
                    // TODO: Adicionar elementos de design
                    pages: [
                        {
                            elements: [
                                {
                                    type: 'TEXT',
                                    text: content || title,
                                    font_size: 48,
                                    color: brandColors?.[0] || '#000000'
                                }
                            ]
                        }
                    ]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log(`[CanvaService] ✅ Design criado: ${response.data.design.id}`);

            return {
                designId: response.data.design.id,
                editUrl: response.data.design.urls.edit_url,
                publishUrl: response.data.design.urls.publish_url,
                thumbnailUrl: response.data.design.thumbnail?.url
            };

        } catch (error: any) {
            console.error('[CanvaService] ❌ Erro ao criar design:', error.response?.data || error.message);
            throw new Error(`Canva API Error: ${error.message}`);
        }
    }

    /**
     * Obter dimensões por tipo de design
     */
    private getCanvaDimensions(type: string): { width: number; height: number } {
        const dimensions: Record<string, { width: number; height: number }> = {
            'instagram_post': { width: 1080, height: 1080 },
            'instagram_carousel': { width: 1080, height: 1080 },
            'linkedin_post': { width: 1200, height: 627 },
            'facebook_post': { width: 1200, height: 630 }
        };

        return dimensions[type] || { width: 1080, height: 1080 };
    }

    /**
     * Testar conexão
     */
    public async testConnection(): Promise<boolean> {
        try {
            console.log('[CanvaService] 🧪 Testando conexão...');

            // Test endpoint: List designs
            const response = await axios.get(`${this.baseURL}/designs`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                },
                params: {
                    limit: 1
                }
            });

            console.log('[CanvaService] ✅ Conexão OK!');
            return true;

        } catch (error: any) {
            console.error('[CanvaService] ❌ Falha na conexão:', error.response?.data || error.message);
            return false;
        }
    }
}

// Singleton instance
export const canvaService = new CanvaService();

export default CanvaService;
