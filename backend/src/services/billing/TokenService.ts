
import { dynamicPricingService } from './DynamicPricingService';

export class TokenService {
    async calculateCost(agent: string, provider: string, model: string, tokens: number): Promise<number> {
        // Redireciona para a lógica centralizada de preços
        return dynamicPricingService.calculateVCCost(provider, model, tokens);
    }
}

export const tokenService = new TokenService();
