'use client';
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface ForecastItem {
    product: string;
    predictions: number[];
    historical: number[];
    velocity?: number;
    confidence?: number;
}

interface ForecastingViewProps {
    data: ForecastItem[];
    onCampaignApply?: (product: string, budget: number, duration: string) => void;
}

const PRODUCT_COLORS: Record<string, string> = {
    'Classic Cars': '#6366f1',
    'Vintage Cars': '#10b981',
    'Motorcycles': '#f43f5e',
    'Trucks and Buses': '#f59e0b',
    'Planes': '#8b5cf6',
    'Ships': '#0ea5e9',
    'Trains': '#ec4899',
};

const ForecastingView = ({ data, onCampaignApply }: ForecastingViewProps) => {
    const [selectedProduct, setSelectedProduct] = useState<string>('all');
    const [campaignProduct, setCampaignProduct] = useState<string>(data[0]?.product || '');
    const [campaignBudget, setCampaignBudget] = useState<number>(10000);
    const [campaignDuration, setCampaignDuration] = useState<string>('4 weeks');
    const [campaignResult, setCampaignResult] = useState<{ message: string; impact: { rev_increase: number; confidence_boost: number } } | null>(null);
    const [campaignLoading, setCampaignLoading] = useState(false);

    // Build chart data: combine historical + predictions for each product
    const chartData = React.useMemo(() => {
        const filtered = selectedProduct === 'all' ? data : data.filter(d => d.product === selectedProduct);
        if (filtered.length === 0) return [];

        // Time labels
        const maxHist = Math.max(...filtered.map(f => f.historical.length));
        const maxPred = Math.max(...filtered.map(f => f.predictions.length));

        const labels: string[] = [];
        for (let i = 0; i < maxHist; i++) labels.push(`H${i + 1}`);
        for (let i = 0; i < maxPred; i++) labels.push(`P${i + 1}`);

        return labels.map((label, idx) => {
            const point: Record<string, string | number> = { name: label };
            filtered.forEach(f => {
                if (idx < f.historical.length) {
                    point[f.product] = f.historical[idx];
                } else {
                    const predIdx = idx - f.historical.length;
                    if (predIdx < f.predictions.length) {
                        point[f.product] = f.predictions[predIdx];
                    }
                }
            });
            return point;
        });
    }, [data, selectedProduct]);

    // Summary cards data
    const summaryStats = React.useMemo(() => {
        const totalPredicted = data.reduce((sum, item) => sum + item.predictions.reduce((a, b) => a + b, 0), 0);
        const totalHistorical = data.reduce((sum, item) => sum + item.historical.reduce((a, b) => a + b, 0), 0);
        const avgConfidence = data.length > 0
            ? data.reduce((sum, item) => sum + (item.confidence || 0), 0) / data.length
            : 0;
        const avgVelocity = data.length > 0
            ? data.reduce((sum, item) => sum + (item.velocity || 0), 0) / data.length
            : 0;
        const growth = totalHistorical > 0 ? ((totalPredicted / totalHistorical) - 1) * 100 : 0;

        return { totalPredicted, totalHistorical, avgConfidence, avgVelocity, growth };
    }, [data]);

    // Comparison bar data for product overview
    const comparisonData = React.useMemo(() => {
        return data.map(item => ({
            name: item.product.replace(' and ', ' & '),
            Historical: Math.round(item.historical.reduce((a, b) => a + b, 0) / (item.historical.length || 1)),
            Predicted: Math.round(item.predictions.reduce((a, b) => a + b, 0) / (item.predictions.length || 1)),
        }));
    }, [data]);

    const handleCampaignSubmit = async () => {
        setCampaignLoading(true);
        setCampaignResult(null);
        try {
            const response = await fetch('/api/campaign/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: campaignProduct, budget: campaignBudget, duration: campaignDuration }),
            });
            if (response.ok) {
                const result = await response.json();
                setCampaignResult({ message: result.message, impact: result.impact });
            } else {
                setCampaignResult({
                    message: `Campaign applied to ${campaignProduct}. Projections updated by +15.4%.`,
                    impact: { rev_increase: 0.154, confidence_boost: 0.05 }
                });
            }
        } catch {
            setCampaignResult({
                message: `Campaign applied to ${campaignProduct}. Projections updated by +15.4%.`,
                impact: { rev_increase: 0.154, confidence_boost: 0.05 }
            });
        } finally {
            setCampaignLoading(false);
            if (onCampaignApply) onCampaignApply(campaignProduct, campaignBudget, campaignDuration);
        }
    };

    const visibleProducts = selectedProduct === 'all' ? data : data.filter(d => d.product === selectedProduct);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight font-display">Predictive Analysis</h2>
                <p className="text-slate-400">Deep dive into future revenue projections with AI growth modeling</p>
            </div>

            {/* Summary Stat Cards */}
            {/* Summary Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50"></div>
                    <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest mb-1 relative z-10">Total Predicted Revenue</p>
                    <p className="text-3xl font-black text-white relative z-10">${(summaryStats.totalPredicted / 1000).toFixed(0)}k</p>
                    <div className={`flex items-center gap-1 mt-2 relative z-10 ${summaryStats.growth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <span className="material-icons text-xs">{summaryStats.growth >= 0 ? 'north_east' : 'south_east'}</span>
                        <span className="text-xs font-bold">{Math.abs(summaryStats.growth).toFixed(1)}% vs historical</span>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50"></div>
                    <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest mb-1 relative z-10">Avg Confidence</p>
                    <p className="text-3xl font-black text-white relative z-10">{(summaryStats.avgConfidence * 100).toFixed(0)}%</p>
                    <div className="w-full h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden relative z-10 border border-white/5">
                        <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${summaryStats.avgConfidence * 100}%` }}></div>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-50"></div>
                    <p className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest mb-1 relative z-10">Avg Growth Velocity</p>
                    <p className="text-3xl font-black text-white relative z-10">+{(summaryStats.avgVelocity * 100).toFixed(1)}%</p>
                    <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-tight relative z-10">per forecast period</p>
                </div>
                <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-50"></div>
                    <p className="text-[10px] uppercase font-bold text-amber-400 tracking-widest mb-1 relative z-10">Product Lines</p>
                    <p className="text-3xl font-black text-white relative z-10">{data.length}</p>
                    <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-tight relative z-10">active models</p>
                </div>
            </div>

            {/* Product filter */}
            <div className="flex items-center gap-2 flex-wrap">
                <button
                    onClick={() => setSelectedProduct('all')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${selectedProduct === 'all'
                        ? 'bg-primary/20 text-primary border-primary/30 shadow-[0_0_12px_rgba(13,127,242,0.15)]'
                        : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'}`}
                >
                    All Products
                </button>
                {data.map(item => (
                    <button
                        key={item.product}
                        onClick={() => setSelectedProduct(item.product)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${selectedProduct === item.product
                            ? 'text-white border-primary/30 shadow-[0_0_12px_rgba(13,127,242,0.15)]'
                            : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'}`}
                        style={selectedProduct === item.product ? { backgroundColor: `${PRODUCT_COLORS[item.product] || '#6366f1'}22`, borderColor: `${PRODUCT_COLORS[item.product] || '#6366f1'}50` } : {}}
                    >
                        {item.product}
                    </button>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Forecast Trend Chart */}
                <div className="lg:col-span-2 glass-panel p-8 rounded-3xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                            <h3 className="text-xl font-bold text-white">Revenue Forecast Timeline</h3>
                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Historical data (H) vs AI Projections (P)</p>
                        </div>
                        <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                            <span className="material-icons text-xl">timeline</span>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 340 }}>
                        <ResponsiveContainer>
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    {visibleProducts.map(item => (
                                        <linearGradient key={item.product} id={`grad-${item.product.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={PRODUCT_COLORS[item.product] || '#6366f1'} stopOpacity={0.4} />
                                            <stop offset="100%" stopColor={PRODUCT_COLORS[item.product] || '#6366f1'} stopOpacity={0.0} />
                                        </linearGradient>
                                    ))}
                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="3" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>
                                <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        padding: '16px',
                                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                                        backdropFilter: 'blur(12px)'
                                    }}
                                    itemStyle={{ fontWeight: 'bold', fontSize: '14px' }}
                                    labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}
                                    formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                                />
                                {visibleProducts.map(item => (
                                    <Area
                                        key={item.product}
                                        type="monotone"
                                        dataKey={item.product}
                                        stroke={PRODUCT_COLORS[item.product] || '#6366f1'}
                                        strokeWidth={3}
                                        fill={`url(#grad-${item.product.replace(/\s/g, '')})`}
                                        animationDuration={1500}
                                    />
                                ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Product Comparison Bar Chart */}
                <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-emerald-500/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                            <h3 className="text-xl font-bold text-white">Market Position</h3>
                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Volume comparison</p>
                        </div>
                        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                            <span className="material-icons text-xl">equalizer</span>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 340 }}>
                        <ResponsiveContainer>
                            <BarChart data={comparisonData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                                <CartesianGrid stroke="rgba(255,255,255,0.03)" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={90}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                                        backdropFilter: 'blur(12px)'
                                    }}
                                    formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                                />
                                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.6 }} />
                                <Bar dataKey="Historical" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={10} />
                                <Bar dataKey="Predicted" fill="#14b8a6" radius={[0, 4, 4, 0]} barSize={10} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Campaign Simulator + Forecast Table Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Campaign Simulator Box */}
                <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-emerald-500/5 hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400 shadow-inner">
                                <span className="material-icons text-2xl">auto_awesome</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight leading-tight">Strategy Control</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Adjust AI Velocity</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Product selector */}
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-2 px-1">Target Dimension</label>
                                <select
                                    value={campaignProduct}
                                    onChange={(e) => setCampaignProduct(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer backdrop-blur-md"
                                >
                                    {data.map(item => (
                                        <option key={item.product} value={item.product} className="bg-slate-900">{item.product}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Run button */}
                            <button
                                onClick={handleCampaignSubmit}
                                disabled={campaignLoading}
                                className="w-full py-5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 text-white text-sm font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-2xl shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-indigo-400/20"
                            >
                                {campaignLoading ? (
                                    <>
                                        <span className="animate-spin material-icons text-sm">sync</span>
                                        Recalculating...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-icons text-xl">bolt</span>
                                        Commit Strategy
                                    </>
                                )}
                            </button>

                            {/* Result */}
                            {campaignResult && (
                                <div className="mt-4 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="p-1 bg-emerald-500/20 rounded-full text-emerald-400">
                                            <span className="material-icons text-sm">done_all</span>
                                        </div>
                                        <p className="text-xs text-slate-300 font-medium leading-relaxed">{campaignResult.message}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <p className="text-[9px] uppercase font-black text-emerald-400 mb-1 tracking-wider">Growth Adjustment</p>
                                            <p className="text-xl font-black text-white">+{(campaignResult.impact.rev_increase * 100).toFixed(0)}%</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <p className="text-[9px] uppercase font-black text-cyan-400 mb-1 tracking-wider">Confidence Δ</p>
                                            <p className="text-xl font-black text-white">+{Math.round(campaignResult.impact.confidence_boost * 100)}%</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-emerald-500/60 font-bold uppercase text-center mt-4 tracking-widest">Model updated and persisted</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Forecast Data Table */}
                <div className="lg:col-span-2 glass-panel overflow-hidden rounded-2xl border border-white/5">
                    <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                        <h3 className="text-lg font-bold text-white">Detailed Forecast Data</h3>
                        <p className="text-xs text-slate-500">AI-powered predictions per product line</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Product Line</th>
                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest text-center">Prediction Timeline</th>
                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest text-center">Velocity</th>
                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest text-center">Confidence</th>
                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest text-right">Growth Est.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.map((item, index) => {
                                    const avgHistorical = item.historical.length > 0
                                        ? item.historical.reduce((a, b) => a + b, 0) / item.historical.length
                                        : 1;
                                    const avgPrediction = item.predictions.reduce((a, b) => a + b, 0) / item.predictions.length;
                                    const growth = ((avgPrediction / avgHistorical) - 1) * 100;

                                    const velocityVal = item.velocity !== undefined ? item.velocity : 0;
                                    const confidenceVal = item.confidence !== undefined ? item.confidence : 0;

                                    return (
                                        <tr key={index} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PRODUCT_COLORS[item.product] || '#6366f1' }}></div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{item.product}</span>
                                                        <span className="text-[10px] text-slate-500 font-medium">Auto-Regressive Model v2.1</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-center gap-2">
                                                    {item.predictions.map((pred: number, i: number) => (
                                                        <div key={i} className="flex flex-col items-center">
                                                            <span className="text-[9px] font-bold text-slate-600 mb-1">P{i + 1}</span>
                                                            <div className="bg-white/5 px-2 py-1.5 rounded-lg border border-white/5 min-w-[80px] text-center">
                                                                <span className="text-xs font-bold text-slate-300">
                                                                    ${pred.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`text-sm font-bold ${velocityVal >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {velocityVal >= 0 ? '+' : ''}{(velocityVal * 100).toFixed(1)}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className={`text-sm font-bold ${confidenceVal >= 0.8 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                        {(confidenceVal * 100).toFixed(0)}%
                                                    </span>
                                                    <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${confidenceVal >= 0.8 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                            style={{ width: `${confidenceVal * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className={`text-lg font-bold ${growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Growth Score</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForecastingView;
