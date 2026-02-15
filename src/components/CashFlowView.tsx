import React from 'react';

interface CashFlowItem {
    month: string;
    revenue: number;
    expenses: number;
    net: number;
}

interface CashFlowStats {
    total_revenue: number;
    profit_margin: number;
    outstanding_ar: number;
    projected_runway_months: number;
}

interface CashFlowViewProps {
    data: CashFlowItem[];
    stats?: CashFlowStats;
}

const CashFlowView = ({ data, stats }: CashFlowViewProps) => {
    const totalRev = stats?.total_revenue || data.reduce((sum, d) => sum + d.revenue, 0);
    const margin = stats?.profit_margin || 0;
    const ar = stats?.outstanding_ar || 0;
    const runway = stats?.projected_runway_months || 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight font-display">Liquidity Analysis</h2>
                <p className="text-slate-400">Monthly revenue vs expenses and treasury monitoring</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-6">Financial Trends</h3>
                    <div className="space-y-6">
                        {data.map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                                    <span>{item.month}</span>
                                    <span className={item.net >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                                        Net: ${item.net.toLocaleString()}
                                    </span>
                                </div>
                                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)] border border-white/5 p-[1px]">
                                    <div
                                        className="bg-primary h-full rounded-l-full shadow-[0_0_12px_rgba(13,127,242,0.6)] relative z-10"
                                        style={{ width: `${(item.revenue / (item.revenue + item.expenses)) * 100}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                                    </div>
                                    <div
                                        className="bg-red-500 h-full rounded-r-full shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                                        style={{ width: `${(item.expenses / (item.revenue + item.expenses)) * 100}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-30" />
                                    </div>
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-500">
                                    <span>Rev: ${item.revenue.toLocaleString()}</span>
                                    <span>Exp: ${item.expenses.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-primary/20 bg-primary/5">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Projected Runway</h4>
                        <p className="text-4xl font-bold text-white">{runway.toFixed(1)} Mo</p>
                        <p className="text-xs text-slate-400 mt-2">Based on avg monthly burn rate</p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-white/5">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Stats</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-400">Total Revenue</span>
                                <span className="text-sm font-bold text-white">${totalRev >= 1000000 ? `${(totalRev / 1000000).toFixed(1)}M` : `${(totalRev / 1000).toFixed(0)}k`}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-400">Profit Margin</span>
                                <span className={`text-sm font-bold ${margin >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{margin.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-400">Outstanding AR</span>
                                <span className="text-sm font-bold text-amber-500">${ar >= 1000 ? `${(ar / 1000).toFixed(1)}k` : ar.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CashFlowView;
