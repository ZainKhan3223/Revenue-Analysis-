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
        <aside className="w-20 lg:w-64 border-r border-white/5 bg-background-dark/80 backdrop-blur-xl flex flex-col transition-all duration-300 h-screen sticky top-0 z-50">
            <div className="p-6 flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center neon-glow-blue shadow-lg shadow-primary/20">
                    <span className="material-icons text-white">layers</span>
                </div>
                <span className="font-bold text-xl hidden lg:block tracking-tight text-white font-display">Project</span>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-200 group ${activeTab === item.id
                            ? 'bg-primary/10 text-white border border-primary/20 shadow-[0_0_15px_rgba(13,127,242,0.1)]'
                            : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <span className={`material-icons transition-colors ${activeTab === item.id ? 'text-primary' : 'text-slate-500 group-hover:text-white'}`}>{item.icon}</span>
                        <span className="hidden lg:block font-medium text-sm tracking-wide">{item.label}</span>
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
