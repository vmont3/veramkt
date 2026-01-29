import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2 } from "lucide-react";

interface Transaction {
    id: string;
    amount: number;
    type: 'PURCHASE' | 'USAGE' | 'BONUS' | 'REFUND';
    description: string;
    agentId?: string;
    createdAt: string;
}

interface CreditHistoryProps {
    userId: string;
}

export function CreditHistory({ userId }: CreditHistoryProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/credits/history?userId=${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setTransactions(data);
                }
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchHistory();
    }, [userId]);

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>;
    }

    return (
        <Card className="bg-[#1A1625] border-white/5 text-white">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Histórico de Transações</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="text-gray-400">Data</TableHead>
                            <TableHead className="text-gray-400">Descrição</TableHead>
                            <TableHead className="text-gray-400">Tipo</TableHead>
                            <TableHead className="text-right text-gray-400">Valor</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    Nenhuma transação encontrada.
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((tx) => (
                                <TableRow key={tx.id} className="border-white/5 hover:bg-white/5">
                                    <TableCell className="font-mono text-sm text-gray-300">
                                        {format(new Date(tx.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                    </TableCell>
                                    <TableCell>{tx.description}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                                            ${tx.type === 'USAGE' ? 'border-red-500/30 text-red-400' : ''}
                                            ${tx.type === 'PURCHASE' ? 'border-green-500/30 text-green-400' : ''}
                                            ${tx.type === 'BONUS' ? 'border-blue-500/30 text-blue-400' : ''}
                                        `}>
                                            {tx.type === 'USAGE' ? 'Uso' :
                                                tx.type === 'PURCHASE' ? 'Compra' :
                                                    tx.type === 'BONUS' ? 'Bônus' : tx.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className={`text-right font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
