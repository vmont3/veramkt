export interface AIResponse {
    content: string;
    tokens: number;
    model: string;
    provider: string;
    success: boolean;
    error?: string;
}
