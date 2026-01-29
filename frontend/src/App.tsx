import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FuncionalidadesPage from './pages/FuncionalidadesPage';
import AgentesPage from './pages/AgentesPage';
import PrecosPage from './pages/PrecosPage';
import ContatoPage from './pages/ContatoPage';
import SobrePage from './pages/SobrePage';
import BlogPage from './pages/BlogPage';
import TermosPage from './pages/TermosPage';
import PrivacidadePage from './pages/PrivacidadePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminMasterPanel from './pages/AdminMasterPanel';
import TestRobotsPage from './pages/TestRobotsPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import { Navigate } from 'react-router-dom';
import UserAgentsPage from './pages/UserAgentsPage';
import FinancePage from './pages/FinancePage';
import ContentPage from './pages/ContentPage';
import SettingsPage from './pages/SettingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LiveOperationsPage from './pages/LiveOperationsPage';
import VeraShowcase from './pages/VeraShowcase';
import CreditPage from './pages/CreditPage';
import SuperAdminCreditsPage from './pages/SuperAdminCreditsPage';
import LeadsPage from './pages/LeadsPage';
import FAQPage from './pages/FAQPage';
import SupportChatPage from './pages/SupportChatPage';
import GuiaIntegracoes from './pages/GuiaIntegracoes';
import HotLeadsPage from './pages/HotLeadsPage';
import OnboardingPage from './pages/OnboardingPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/funcionalidades" element={<FuncionalidadesPage />} />
                <Route path="/agentes" element={<AgentesPage />} />
                <Route path="/precos" element={<PrecosPage />} />
                <Route path="/contato" element={<ContatoPage />} />
                <Route path="/sobre" element={<SobrePage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/termos" element={<TermosPage />} />
                <Route path="/privacidade" element={<PrivacidadePage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/guia-integracoes" element={<GuiaIntegracoes />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/admin" element={<Navigate to="/painel/admin" replace />} />

                {/* Unified Dashboard Routes */}
                <Route path="/painel" element={<DashboardLayout isAdmin={false} />}>
                    <Route index element={<Navigate to="/painel/overview" replace />} />
                    <Route path="overview" element={<DashboardOverview />} />
                    <Route path="live" element={<LiveOperationsPage />} />
                    <Route path="robots" element={<UserAgentsPage />} />
                    <Route path="content" element={<ContentPage />} />
                    <Route path="finance" element={<FinancePage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="leads" element={<LeadsPage />} />
                    <Route path="hot-leads" element={<HotLeadsPage />} />
                    <Route path="onboarding" element={<OnboardingPage />} />
                    <Route path="suporte" element={<SupportChatPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="credits/history" element={<CreditPage />} />
                </Route>

                {/* Admin Routes within Dashboard Layout */}
                <Route path="/painel/admin" element={<DashboardLayout isAdmin={true} />}>
                    <Route index element={<AdminMasterPanel />} />
                    <Route path="users" element={<div className="text-white p-10">Usuários (Em breve)</div>} />
                    <Route path="finance" element={<div className="text-white p-10">Financeiro (Em breve)</div>} />
                    <Route path="credits" element={<SuperAdminCreditsPage />} />
                    <Route path="settings" element={<div className="text-white p-10">Configurações (Em breve)</div>} />
                </Route>

                {/* Legacy Direct Routes (optional, kept for now) */}
                <Route path="/teste-robos" element={<TestRobotsPage />} />
                <Route path="/vera-avatar" element={<VeraShowcase />} />
                {/* Fallback for unknown routes */}
                <Route path="*" element={<HomePage />} />
            </Routes>
        </Router>
    );
}

export default App;
