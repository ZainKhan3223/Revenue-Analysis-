import React from 'react';

interface HeaderProps {
    onRefresh?: () => void;
    refreshing?: boolean;
}

const Header = ({ onRefresh, refreshing }: HeaderProps) => {
    return (
        <header className="h-16 border-b border-white/5 flex items-center justify-end px-8 bg-background-dark/80 backdrop-blur-md relative z-10">

            <div className="flex items-center gap-6 text-white">
                <div className="relative group cursor-pointer">
                    <span className="material-icons text-slate-400 group-hover:text-primary transition-all duration-300">notifications</span>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent-orange rounded-full notification-dot"></span>
                </div>
                <button
                    onClick={onRefresh}
                    disabled={refreshing}
                    className={`btn-gradient text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105 active:scale-95 ${refreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    <span className={`material-icons text-sm ${refreshing ? 'animate-spin' : ''}`}>
                        {refreshing ? 'sync' : 'rocket_launch'}
                    </span>
                    {refreshing ? 'Optimizing...' : 'Optimize Now'}
                </button>
            </div>
        </header>
    );
};

export default Header;
