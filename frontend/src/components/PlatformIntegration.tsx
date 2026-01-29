import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2 } from "lucide-react";

interface Platform {
    id: string;
    name: string;
    icon: string;
    connected: boolean;
}

export default function PlatformIntegration() {
    const [platforms, setPlatforms] = useState<Platform[]>([
        { id: "instagram", name: "Instagram", icon: "📸", connected: false },
        { id: "facebook", name: "Facebook", icon: "👍", connected: false },
        { id: "whatsapp", name: "WhatsApp", icon: "💬", connected: false },
        { id: "linkedin", name: "LinkedIn", icon: "💼", connected: false },
        { id: "tiktok", name: "TikTok", icon: "🎵", connected: false },
        { id: "youtube", name: "YouTube", icon: "▶️", connected: false },
        { id: "google", name: "Google Meu Negócio", icon: "🏢", connected: false },
        { id: "website", name: "Site/App", icon: "🌐", connected: false },
    ]);

    const [connecting, setConnecting] = useState<string | null>(null);

    const handleConnect = async (platformId: string) => {
        setConnecting(platformId);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setPlatforms((prev) =>
            prev.map((p) => (p.id === platformId ? { ...p, connected: true } : p))
        );
        setConnecting(null);
    };

    const connected = platforms.filter((p) => p.connected).length;
    const progress = (connected / platforms.length) * 100;

    return (
        <div className="space-y-6 py-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold">Conectar Plataformas</h2>
                <p className="text-lg text-muted-foreground">
                    Um clique para ativar seus agentes autônomos
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {connected} de {platforms.length} conectadas
                    </CardTitle>
                    <CardDescription>
                        {connected === platforms.length
                            ? "Todos os agentes estão ativos!"
                            : `Faltam ${platforms.length - connected} plataformas`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Progress value={progress} />
                    <p className="text-sm text-right text-muted-foreground">
                        {Math.round(progress)}% completo
                    </p>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {platforms.map((platform) => (
                    <Card
                        key={platform.id}
                        className={platform.connected ? "border-green-200 bg-green-50" : ""}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <span className="text-3xl">{platform.icon}</span>
                                {platform.connected && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                            </div>
                            <CardTitle className="text-base">{platform.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className="w-full"
                                variant={platform.connected ? "outline" : "default"}
                                disabled={connecting === platform.id}
                                onClick={() => handleConnect(platform.id)}
                            >
                                {connecting === platform.id ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Conectando...
                                    </>
                                ) : platform.connected ? (
                                    "Conectado"
                                ) : (
                                    "Conectar"
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
