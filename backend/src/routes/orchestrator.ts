import { Router } from "express";
import { veraOrchestrator, VeraRequest } from "../services/agents/VeraOrchestrator";

const router = Router();

// Endpoint Principal para invocar a VERA
router.post("/process", async (req, res) => {
    try {
        const { type, payload, userBudget, files } = req.body;

        // Gera um ID de requisição único
        const requestId = `req_${Date.now()}`;

        const request: VeraRequest = {
            requestId,
            type,
            payload,
            userBudget,
            files: files || []
        };

        const response = await veraOrchestrator.processRequest(request);

        return res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
        return res.status(500).json({ error: "Erro interno no servidor VERA Core" });
    }
});

export const orchestratorRoutes = router;
