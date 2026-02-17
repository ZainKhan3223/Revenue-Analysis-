'use client';
import React, { useMemo } from 'react';
import {
    ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';

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
    // Calculate derived stats
    const metrics = useMemo(() => {
        const totalRev = data.reduce((sum, item) => sum + item.revenue, 0);
        const totalExp = data.reduce((sum, item) => sum + item.expenses, 0);
        const totalNet = totalRev - totalExp;
        const avgBurn = totalExp / (data.length || 1);
        const currentRunway = stats?.projected_runway_months || (totalNet > 0 ? 'Inf' : 0);

        return { totalRev, totalExp, totalNet, avgBurn, currentRunway };
    }, [data, stats]);

    const chartData = useMemo(() => {
        return data.map(item => ({
            ...item,
            margin: item.revenue > 0 ? (item.net / item.revenue) * 100 : 0
        }));
    }, [data]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight font-display">Liquidity Analysis</h2>
                <p className="text-slate-400">Monthly revenue vs expenses and treasury monitoring</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-indigo-500/10 to-transparent">
                    <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest mb-1">Total Net Income</p>
                    <p className={`text-3xl font-bold ${metrics.totalNet >= 0 ? 'text-white' : 'text-rose-400'}`}>
                        {metrics.totalNet >= 0 ? '+' : '-'}${Math.abs(metrics.totalNet).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">last {data.length} months</p>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-rose-500/10 to-transparent">
                    <p className="text-[10px] uppercase font-bold text-rose-400 tracking-widest mb-1">Avg Monthly Burn</p>
                    <p className="text-3xl font-bold text-white">${Math.round(metrics.avgBurn).toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">operational expenses</p>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent">
                    <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest mb-1">Profit Margin</p>
                    <p className="text-3xl font-bold text-white">
                        {(metrics.totalNet / metrics.totalRev * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-slate-500 mt-1">blended average</p>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-cyan-500/10 to-transparent">
                    <p className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest mb-1">Est. Runway</p>
                    <p className="text-3xl font-bold text-white">
                        {typeof metrics.currentRunway === 'number' ? metrics.currentRunway.toFixed(1) : metrics.currentRunway} <span className="text-lg text-slate-400">Mo</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">based on current burn</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Financial Trends Composed Chart */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-1">Financial Trends</h3>
                    <p className="text-xs text-slate-500 mb-6">Revenue vs Expenses with Net Income overlay</p>

                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.2} />
                                    </linearGradient>
                                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.2} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    formatter={(value: number) => `$${value.toLocaleString()}`}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="url(#colorRev)" barSize={20} radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="left" dataKey="expenses" name="Expenses" fill="url(#colorExp)" barSize={20} radius={[4, 4, 0, 0]} />
                                <Line yAxisId="right" type="monotone" dataKey="net" name="Net Income" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#1e293b' }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Profit Margin Trend */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-1">Efficiency Trend</h3>
                    <p className="text-xs text-slate-500 mb-6">Net Profit Margin %</p>

                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMargin" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} interval={1} />
                                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    formatter={(value: number) => `${value.toFixed(1)}%`}
                                />
                                <Area type="monotone" dataKey="margin" stroke="#10b981" strokeWidth={2} fill="url(#colorMargin)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <h3 className="text-lg font-bold text-white">Monthly Statement</h3>
                    <p className="text-xs text-slate-500">Breakdown of financial performance</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-slate-400">
                                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider">Month</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider text-right">Revenue</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider text-right">Expenses</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider text-right">Net Income</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider text-right">Margin</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300">
                            {chartData.map((item, index) => (
                                <tr key={index} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-bold text-white">{item.month}</td>
                                    <td className="px-6 py-4 text-right">${item.revenue.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right text-rose-300">${item.expenses.toLocaleString()}</td>
                                    <td className={`px-6 py-4 text-right font-bold ${item.net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {item.net >= 0 ? '+' : '-'}${Math.abs(item.net).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.margin >= 20 ? 'bg-emerald-500/10 text-emerald-500' :
                                            item.margin >= 10 ? 'bg-amber-500/10 text-amber-500' :
                                                'bg-rose-500/10 text-rose-500'
                                            }`}>
                                            {item.margin.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {item.net > 0 ? (
                                            <span className="material-icons text-emerald-500 text-sm">trending_up</span>
                                        ) : (
                                            <span className="material-icons text-rose-500 text-sm">trending_down</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CashFlowView;
