import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, BarChart, Settings, LogOut, Wallet, FileText, Activity, UserPlus, MessageCircle, Flame, Sparkles } from 'lucide-react'; // Added Flame, Sparkles
import Logo from '../Logo'; // Ensuring Logo is used

interface SidebarProps {
    isAdmin?: boolean;
    onCloseMobile?: () => void;
}

export default function Sidebar({ isAdmin = false, onCloseMobile }: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const userMenuItems = [
        { id: '/painel/overview', label: 'Dashboard', icon: Home },
        { id: '/painel/live', label: 'S.A.L.A. (Live Ops)', icon: Activity },
        { id: '/painel/onboarding', label: '🚀 Onboarding', icon: Sparkles },
        { id: '/painel/robots', label: 'Meus Agentes', icon: Users },
        { id: '/painel/content', label: 'Conteúdo', icon: FileText },
        { id: '/painel/finance', label: 'Financeiro', icon: Wallet },
        { id: '/painel/analytics', label: 'Relatórios', icon: BarChart },
        { id: '/painel/leads', label: 'Leads CRM', icon: UserPlus },
        { id: '/painel/hot-leads', label: '🔥 Hot Leads', icon: Flame },
        { id: '/painel/suporte', label: 'Suporte', icon: MessageCircle },
        { id: '/painel/settings', label: 'Configurações', icon: Settings },
    ];

    const adminMenuItems = [
        { id: '/painel/admin', label: 'Visão Geral', icon: Home },
        { id: '/painel/admin/users', label: 'Usuários', icon: Users },
        { id: '/painel/admin/finance', label: 'Financeiro Adm', icon: BarChart },
        { id: '/painel/admin/credits', label: 'Gestão de Créditos', icon: Wallet },
        { id: '/painel/admin/settings', label: 'Configurações', icon: Settings },
    ];

    const menuItems = isAdmin ? adminMenuItems : userMenuItems;

    const handleNavigation = (path: string) => {
        navigate(path);
        if (onCloseMobile) onCloseMobile();
    };

    const handleLogout = () => {
        if (window.confirm('Deseja sair da plataforma?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    return (
        <aside className={`w-64 flex-shrink-0 ${isAdmin ? 'bg-[#1a0505] border-red-900/40' : 'bg-[#0B0915] border-[#292348]'} border-r flex flex-col h-full z-20 transition-colors duration-300`}>
            <div className="flex h-full flex-col p-4 w-full">

                {/* Logo Area */}
                <div className="mb-8 pl-2">
                    <Logo variant="sidebar" className="h-10 w-auto" />
                </div>

                {/* Navigation */}
                <div className="flex flex-col gap-2 flex-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.id || (item.id !== '/painel/overview' && location.pathname.startsWith(item.id));
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' // High contrast active state
                                    : 'text-gray-400 hover:bg-[#1A1625] hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm">{item.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Bottom Card / User Info */}
                <div className="mt-auto pt-4 border-t border-[#292348]">
                    {isAdmin ? (
                        <div className="p-4 bg-red-900/10 border border-red-900/30 rounded-xl mb-4">
                            <p className="text-xs text-red-400 font-bold uppercase tracking-wider text-center">
                                Super Admin
                            </p>
                        </div>
                    ) : (
                        <div className="mb-4 px-2">
                            <h3 className="text-white text-sm font-bold truncate">
                                {(() => {
                                    try {
                                        const u = JSON.parse(localStorage.getItem('user') || '{}');
                                        return u.name || 'Usuário VERA';
                                    } catch { return 'Usuário VERA'; }
                                })()}
                            </h3>
                            <p className="text-gray-500 text-xs truncate">
                                {(() => {
                                    try {
                                        const u = JSON.parse(localStorage.getItem('user') || '{}');
                                        return u.email || 'Plano Basic';
                                    } catch { return 'Plano Basic'; }
                                })()}
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 w-full text-gray-500 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Sair
                    </button>
                </div>
            </div>
        </aside>
    );
}
