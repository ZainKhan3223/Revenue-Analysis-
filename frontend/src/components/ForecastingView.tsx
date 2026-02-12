import React from 'react';

interface ForecastItem {
    product: string;
    predictions: number[];
    historical: number[];
}

interface ForecastingViewProps {
    data: ForecastItem[];
}

const ForecastingView = ({ data }: ForecastingViewProps) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight font-display">Predictive Analysis</h2>
                <p className="text-slate-400">Deep dive into future revenue projections with AI growth modeling</p>
            </div>

            <div className="glass-panel overflow-hidden rounded-2xl border border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Product Line</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest text-center">Prediction Timeline</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest text-right">Growth Est.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.map((item, index) => {
                                // Calculate dynamic growth
                                const avgHistorical = item.historical.length > 0
                                    ? item.historical.reduce((a, b) => a + b, 0) / item.historical.length
                                    : 1;
                                const avgPrediction = item.predictions.reduce((a, b) => a + b, 0) / item.predictions.length;
                                const growth = ((avgPrediction / avgHistorical) - 1) * 100;

                                return (
                                    <tr key={index} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-6 vertical-middle">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{item.product}</span>
                                                <span className="text-[10px] text-slate-500 font-medium">Auto-Regressive Model v2.1</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center justify-center gap-3">
                                                {item.predictions.map((pred: number, i: number) => (
                                                    <div key={i} className="flex flex-col items-center">
                                                        <span className="text-[9px] font-bold text-slate-600 mb-1">
                                                            P{i + 1}
                                                        </span>
                                                        <div className="bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 min-w-[90px] text-center">
                                                            <span className="text-xs font-bold text-slate-300">
                                                                ${pred.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right vertical-middle">
                                            <div className="flex flex-col items-end">
                                                <span className={`text-lg font-bold ${growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Velocity Score</span>
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
    );
};

export default ForecastingView;
