import React from 'react';
import Image from 'next/image';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
    const menuItems = [
        { icon: 'dashboard', label: 'Dashboard', id: 'dashboard' },
        { icon: 'analytics', label: 'Forecasting', id: 'forecasting' },
        { icon: 'inventory_2', label: 'Inventory', id: 'inventory' },
        { icon: 'payments', label: 'Cash Flow', id: 'cashflow' },
        { icon: 'settings', label: 'Settings', id: 'settings' },
    ];

    return (
        <aside className="w-20 lg:w-72 border-r border-white/5 bg-background-deeper/90 backdrop-blur-3xl flex flex-col transition-all duration-500 h-screen sticky top-0 z-50">
            <div className="p-8 flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 via-primary to-emerald-400 rounded-2xl flex items-center justify-center neon-glow-blue shadow-2xl shadow-primary/40 rotate-3">
                    <span className="material-icons text-white text-2xl">insights</span>
                </div>
                <div className="hidden lg:block">
                    <h1 className="font-black text-2xl tracking-tighter text-white font-display leading-none">BUSINESS</h1>
                    <p className="text-[10px] font-bold text-primary tracking-[0.2em] mt-1 ml-0.5">MANAGER AI</p>
                </div>
            </div>

            <nav className="flex-1 px-6 space-y-3 mt-4">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 group ${activeTab === item.id
                            ? 'bg-primary/10 text-white border border-primary/20 shadow-lg shadow-primary/5'
                            : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <span className={`material-icons text-xl transition-all duration-300 ${activeTab === item.id ? 'text-primary scale-110' : 'text-slate-600 group-hover:text-slate-300 group-hover:scale-110'}`}>{item.icon}</span>
                        <span className="hidden lg:block font-semibold text-sm tracking-tight">{item.label}</span>
                        {activeTab === item.id && (
                            <div className="ml-auto w-1 h-5 bg-primary rounded-full hidden lg:block"></div>
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5 bg-black/20">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                    <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtqkGKn5zVh3saQhDPy6RM3UKaDjNK75Fb2GkAwI2AO6Njs-yCAxIFe8b-Ohv2DOJ0yA-w9MJKluTeXcSVwsAqQwPRuWywueIWnaHrgfoarJgxgE6rSbxv8XP96ErLmkLtck9nUA11v-9CNmcbCmIuKT2GM4S-aP01iqFna68X8H85Er0nA-jDlYtEviDnt5t8dNkjBn7nqNilEg9ZjOEx0tUKYYoJqWPGjI9lsDYDss_D2F9dRbYkwtWyzOn5JjBviukJWDCBXkQ"
                        alt="User"
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-primary/20"
                    />
                    <div className="hidden lg:block overflow-hidden">
                        <p className="text-sm font-semibold truncate text-white">Alex Chen</p>
                        <p className="text-xs text-slate-400 truncate">Admin Account</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
