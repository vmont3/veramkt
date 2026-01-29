import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Plus, Mail, Phone, Building2, TrendingUp, ChevronDown, MoreVertical, Check, X, Download } from 'lucide-react';

interface Lead {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    source: string | null;
    status: string;
    createdAt: string;
}

interface LeadStats {
    total: number;
    new: number;
    contacted: number;
    converted: number;
    conversionRate: string | number;
}

const statusColors: Record<string, string> = {
    new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    contacted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    converted: 'bg-green-500/20 text-green-400 border-green-500/30'
};

const sourceLabels: Record<string, string> = {
    meta_ads: 'Meta Ads',
    google_ads: 'Google Ads',
    organic: 'Orgânico',
    referral: 'Indicação',
    landing_page: 'Landing Page',
    manual: 'Manual'
};

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [stats, setStats] = useState<LeadStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', source: 'manual' });

    useEffect(() => {
        fetchLeads();
        fetchStats();
    }, []);

    const fetchLeads = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/leads`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLeads(data);
            }
        } catch (e) {
            console.error('Failed to fetch leads', e);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/leads/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (e) {
            console.error('Failed to fetch stats', e);
        }
    };

    const createLead = async () => {
        if (!newLead.email) {
            alert('Email é obrigatório');
            return;
        }

        setIsCreating(true);
        console.log('[LeadsPage] Creating lead with data:', newLead);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newLead)
            });

            console.log('[LeadsPage] Response status:', res.status);
            const data = await res.json();
            console.log('[LeadsPage] Response data:', data);

            if (res.ok) {
                setShowAddModal(false);
                setNewLead({ name: '', email: '', phone: '', source: 'manual' });
                fetchLeads();
                fetchStats();
                alert('✅ Lead criado com sucesso!');
            } else {
                alert(data.error || 'Erro ao criar lead');
            }
        } catch (e) {
            console.error('Failed to create lead:', e);
            alert('Erro de conexão ao criar lead');
        } finally {
            setIsCreating(false);
        }
    };

    const exportLeads = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/leads/export`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao exportar leads');
            }

            // Get the CSV blob
            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error: any) {
            console.error('Export error:', error);
            alert('Erro ao exportar leads: ' + error.message);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/leads/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            fetchLeads();
            fetchStats();
        } catch (e) {
            console.error('Failed to update lead', e);
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = !searchTerm ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.name && lead.name.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (isLoading) return <div className="p-10 text-white text-center">Carregando Leads...</div>;

    return (
        <div className="space-y-6 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Users className="text-blue-400" /> Gestão de Leads
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Acompanhe e converta seus leads capturados.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={exportLeads}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2"
                        title="Exportar CSV"
                    >
                        <Download size={18} /> Exportar
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2"
                    >
                        <Plus size={18} /> Novo Lead
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl">
                        <p className="text-gray-500 text-xs uppercase font-bold mb-1">Total</p>
                        <p className="text-2xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl">
                        <p className="text-blue-400 text-xs uppercase font-bold mb-1">Novos</p>
                        <p className="text-2xl font-bold text-blue-400">{stats.new}</p>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-xl">
                        <p className="text-yellow-400 text-xs uppercase font-bold mb-1">Contactados</p>
                        <p className="text-2xl font-bold text-yellow-400">{stats.contacted}</p>
                    </div>
                    <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-xl">
                        <p className="text-green-400 text-xs uppercase font-bold mb-1">Convertidos</p>
                        <p className="text-2xl font-bold text-green-400">{stats.converted}</p>
                        <p className="text-xs text-gray-500 mt-1">Taxa: {stats.conversionRate}%</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl flex items-center px-3 py-2 flex-1 max-w-sm">
                    <Search size={16} className="text-gray-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent text-white outline-none w-full placeholder-gray-600 text-sm"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-gray-900/50 border border-gray-800 text-white px-4 py-2 rounded-xl text-sm focus:outline-none"
                >
                    <option value="all">Todos os Status</option>
                    <option value="new">Novos</option>
                    <option value="contacted">Contactados</option>
                    <option value="converted">Convertidos</option>
                </select>
            </div>

            {/* Leads Table */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-800 text-left text-xs text-gray-500 uppercase">
                            <th className="p-4">Lead</th>
                            <th className="p-4">Contato</th>
                            <th className="p-4">Origem</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Data</th>
                            <th className="p-4">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeads.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    Nenhum lead encontrado.
                                </td>
                            </tr>
                        ) : (
                            filteredLeads.map(lead => (
                                <tr key={lead.id} className="border-b border-gray-800/50 hover:bg-white/5">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center">
                                                <Users size={16} className="text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium text-sm">{lead.name || 'Sem nome'}</p>
                                                <p className="text-gray-500 text-xs">{lead.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            {lead.phone && (
                                                <span className="text-gray-400 text-xs flex items-center gap-1">
                                                    <Phone size={12} /> {lead.phone}
                                                </span>
                                            )}
                                            <span className="text-gray-400 text-xs flex items-center gap-1">
                                                <Mail size={12} /> {lead.email}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-gray-300 text-sm">{sourceLabels[lead.source || 'manual'] || lead.source}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[lead.status] || 'bg-gray-500/20 text-gray-400'}`}>
                                            {lead.status === 'new' ? 'Novo' : lead.status === 'contacted' ? 'Contactado' : 'Convertido'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400 text-xs">
                                        {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            {lead.status === 'new' && (
                                                <button
                                                    onClick={() => updateStatus(lead.id, 'contacted')}
                                                    className="p-1.5 rounded bg-yellow-900/30 hover:bg-yellow-900/50 text-yellow-400"
                                                    title="Marcar como Contactado"
                                                >
                                                    <Phone size={14} />
                                                </button>
                                            )}
                                            {lead.status !== 'converted' && (
                                                <button
                                                    onClick={() => updateStatus(lead.id, 'converted')}
                                                    className="p-1.5 rounded bg-green-900/30 hover:bg-green-900/50 text-green-400"
                                                    title="Marcar como Convertido"
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Lead Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-white mb-4">Novo Lead</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nome"
                                value={newLead.name}
                                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                            />
                            <input
                                type="email"
                                placeholder="Email *"
                                value={newLead.email}
                                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                            />
                            <input
                                type="tel"
                                placeholder="Telefone"
                                value={newLead.phone}
                                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                            />
                            <select
                                value={newLead.source}
                                onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                            >
                                <option value="manual">Manual</option>
                                <option value="meta_ads">Meta Ads</option>
                                <option value="google_ads">Google Ads</option>
                                <option value="organic">Orgânico</option>
                                <option value="referral">Indicação</option>
                                <option value="landing_page">Landing Page</option>
                            </select>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={createLead}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg"
                            >
                                Criar Lead
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
