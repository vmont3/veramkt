import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import { Menu, X } from 'lucide-react';
import { CreditBalance } from './credits/CreditBalance';
import { PLANS } from '../config/plans';

interface DashboardLayoutProps {
    isAdmin?: boolean;
}

export default function DashboardLayout({ isAdmin = false }: DashboardLayoutProps) {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const location = useLocation();

    // Get User ID and Profile safely
    const [userId, setUserId] = useState<string>('');
    const [profilePic, setProfilePic] = useState<string>('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userStr = localStorage.getItem('user');
                const token = localStorage.getItem('token');

                if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user && user.id) setUserId(user.id);
                }

                if (token) {
                    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const userData = await res.json();
                        // Update localStorage with fresh data
                        localStorage.setItem('user', JSON.stringify(userData));
                        if (userData.profilePictureUrl) {
                            setProfilePic(userData.profilePictureUrl);
                        }
                    }
                }
            } catch (e) { console.error("Error fetching user data", e); }
        };
        fetchUserData();

        // Refresh profile pic every 30 seconds
        const interval = setInterval(fetchUserData, 30000);
        return () => clearInterval(interval);
    }, [location.pathname]); // Refresh on route change

    // Close sidebar on route change automatically
    useEffect(() => setIsSidebarOpen(false), [location]);

    const UpgradeModal = () => (
        // ... existing modal code ...
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
            {/* ... */}
        </div>
    );
    // ...

    return (
        <div className="flex h-screen bg-[#0B0915] overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#1A1625] border-r border-[#292348] transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <Sidebar isAdmin={isAdmin} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-[#1A1625]/80 backdrop-blur-md border-b border-[#292348] flex items-center justify-between px-4 md:px-8 z-30 sticky top-0">
                    <button
                        className="md:hidden text-gray-400 hover:text-white"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu />
                    </button>

                    {/* Spacer or Title */}
                    <div className="flex-1"></div>

                    {/* RIGHT SIDE HEADER */}
                    <div className="flex items-center gap-4">
                        {/* CREDIT SYSTEM INTEGATION */}
                        {userId && <CreditBalance userId={userId} />}

                        <button
                            onClick={() => setShowUpgradeModal(true)}
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-bold shadow-lg shadow-blue-900/20"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            Novo Plano
                        </button>

                        <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 overflow-hidden flex items-center justify-center">
                            {profilePic ? (
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}${profilePic}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-blue-400 font-bold text-xs">U</span>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-10 w-full relative">
                    <Outlet />
                </main>
            </div>

            {showUpgradeModal && <UpgradeModal />}
        </div>
    );
}
