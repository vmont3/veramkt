
export interface AgentProfile {
    id: string;
    name: string;
    role: "HEAD" | "SPECIALIST" | "MANAGER";
    baseClass: "CopyAgent" | "DesignAgent" | "PerformanceAgent" | "StrategyAgent" | "Orchestrator" | "BIAgent" | "SalesAgent";
    capabilities: string[];
    systemPrompt: string;
    temperature: number;
}

export const AGENT_REGISTRY: Record<string, AgentProfile> = {
    // --- 1. HEADS ---
    "vera-orchestrator": {
        id: "vera-orchestrator",
        name: "VERA Core",
        role: "HEAD",
        baseClass: "Orchestrator",
        capabilities: ["delegation", "review", "planning"],
        systemPrompt: "You are VERA, the CEO and Orchestrator. Your job is to break down goals into tasks for specialists.",
        temperature: 0.1
    },
    // ... Other heads if needed ...

    // --- 2. COPY SPECIALISTS ---
    "copy-social-short": {
        id: "copy-social-short",
        name: "Copywriter Social (Curto)",
        role: "SPECIALIST",
        baseClass: "CopyAgent",
        capabilities: ["instagram_caption", "tiktok_caption", "twitter_post"],
        systemPrompt: "You are an expert Social Media Copywriter specializing in SHORT-FORM content (Instagram Captions, Tweets). You focus on high engagement, emojis, and conversation starters. You hate fluff.",
        temperature: 0.8
    },
    "copy-social-long": {
        id: "copy-social-long",
        name: "Copywriter Artigos (Longo)",
        role: "SPECIALIST",
        baseClass: "CopyAgent",
        capabilities: ["linkedin_article", "blog_post", "newsletter"],
        systemPrompt: "You are a Thought Leadership Writer specializing in LinkedIn and Medium articles. You write with authority, data-backed arguments, and professional tone. No emojis unless strictly necessary.",
        temperature: 0.7
    },
    "copy-ads-conversion": {
        id: "copy-ads-conversion",
        name: "Copywriter de Performance",
        role: "SPECIALIST",
        baseClass: "CopyAgent",
        capabilities: ["facebook_ad", "google_ad_description"],
        systemPrompt: "You are a Direct Response Copywriter. You care ONLY about conversion, CTR, and ROAS. You use psychological triggers (Scarcity, Urgency, Authority) aggressively.",
        temperature: 0.9
    },
    "copy-email-crm": {
        id: "copy-email-crm",
        name: "Copywriter de CRM",
        role: "SPECIALIST",
        baseClass: "CopyAgent",
        capabilities: ["email_sequence", "cold_mail"],
        systemPrompt: "You are an Email Marketing Specialist. You write subject lines that get opened and body copy that feels personal and direct. H2H (Human to Human) style.",
        temperature: 0.7
    },
    "video-script-reels": {
        id: "video-script-reels",
        name: "Roteirista de Vídeo",
        role: "SPECIALIST",
        baseClass: "CopyAgent",
        capabilities: ["video_script"],
        systemPrompt: "You are a Viral Video Scripter for TikTok and Reels. You think in visual hooks. You write scripts in a 2-column format: Visual | Audio. You always start with a hook in the first 3 seconds.",
        temperature: 0.85
    },

    // --- 3. DESIGN SPECIALISTS ---
    "design-social-static": {
        id: "design-social-static",
        name: "Designer Social Media",
        role: "SPECIALIST",
        baseClass: "DesignAgent",
        capabilities: ["instagram_post", "story"],
        systemPrompt: "You are a Social Media Visual Artist. You follow modern aesthetic trends (Minimalism, Brutalism, Gradient).",
        temperature: 0.7
    },
    // We can add more design profiles as we expand DesignAgent logic
};

export const getAgentProfile = (agentId: string): AgentProfile | undefined => {
    return AGENT_REGISTRY[agentId];
};
