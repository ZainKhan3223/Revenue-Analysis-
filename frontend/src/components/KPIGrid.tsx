import React from 'react';

interface StatsData {
    avg_deal_value: number;
    profit_margin: number;
    total_revenue: number;
    outstanding_ar: number;
    projected_runway_months: number;
    revenue_trend?: number;
    margin_trend?: number;
    ar_trend?: number;
}

interface KPIGridProps {
    stats: StatsData;
}

const KPIGrid = ({ stats }: KPIGridProps) => {
    if (!stats) return null;

    const cards = [
        {
            title: 'Total Revenue',
            value: `$${(stats.total_revenue / 1000).toFixed(1)}k`,
            icon: 'attach_money',
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            trend: stats.revenue_trend !== undefined ? `${stats.revenue_trend >= 0 ? '+' : ''}${stats.revenue_trend}%` : '+0%',
            trendUp: stats.revenue_trend !== undefined ? stats.revenue_trend >= 0 : true
        },
        {
            title: 'Profit Margin',
            value: `${stats.profit_margin}%`,
            icon: 'trending_up',
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            trend: stats.margin_trend !== undefined ? `${stats.margin_trend >= 0 ? '+' : ''}${stats.margin_trend}%` : '+0%',
            trendUp: stats.margin_trend !== undefined ? stats.margin_trend >= 0 : true
        },
        {
            title: 'Outstanding AR',
            value: `$${(stats.outstanding_ar / 1000).toFixed(1)}k`,
            icon: 'pending',
            color: 'text-amber-400',
            bg: 'bg-amber-400/10',
            trend: stats.ar_trend !== undefined ? `${stats.ar_trend >= 0 ? '+' : ''}${stats.ar_trend}%` : '-0%',
            trendUp: stats.ar_trend !== undefined ? stats.ar_trend <= 0 : false // Lower AR is usually good
        },
        {
            title: 'Runway',
            value: `${stats.projected_runway_months} Mo`,
            icon: 'timelapse',
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
            trend: 'Stable',
            trendUp: null
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {cards.map((card, index) => (
                <div key={index} className="glass-panel p-6 rounded-3xl relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${card.bg.replace('/10', '/30')} to-transparent`}></div>

                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className={`p-3.5 rounded-2xl ${card.bg} ${card.color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
                            <span className="material-icons text-2xl">{card.icon}</span>
                        </div>
                        {card.trend && (
                            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border ${card.trendUp === true ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                card.trendUp === false ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                    'bg-slate-500/10 border-slate-500/20 text-slate-400'
                                }`}>
                                <span className="material-icons text-[10px] font-bold">
                                    {card.trendUp === true ? 'north_east' : card.trendUp === false ? 'south_east' : 'remove'}
                                </span>
                                <span className="text-xs font-bold">{card.trend}</span>
                            </div>
                        )}
                    </div>

                    <div className="relative z-10">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 opacity-80">{card.title}</p>
                        <h3 className="text-3xl font-black text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                            {card.value}
                        </h3>
                    </div>

                    <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-3xl group-hover:from-white/10 transition-all duration-500"></div>
                </div>
            ))}
        </div>
    );
};

export default KPIGrid;
