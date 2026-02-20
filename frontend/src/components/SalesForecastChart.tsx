"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
    name: string;
    value: number;
}

interface ForecastChartProps {
    data: ChartData[];
    timeframe: string;
    onTimeframeChange: (tf: string) => void;
    color?: string;
}

const SalesForecastChart = ({ data, timeframe, onTimeframeChange, color = '#3b82f6' }: ForecastChartProps) => {
    const timeframes = ['1M', '3M', '6M'];

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Revenue Forecast</h2>
                    <p className="text-slate-400 text-sm mt-1">Projected performance based on AI velocity</p>
                </div>
                <div className="flex gap-2 bg-black/30 p-1.5 rounded-xl border border-white/10">
                    {timeframes.map((tf) => (
                        <button
                            key={tf}
                            onClick={() => onTimeframeChange(tf)}
                            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${timeframe === tf
                                ? 'text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            style={timeframe === tf ? { backgroundColor: color, boxShadow: `0 4px 14px ${color}40` } : {}}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[350px] w-full min-h-[350px] relative">
                {!data || data.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm font-medium tracking-wide">
                        No forecast data available for this selection
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-display)' }}
                                dy={15}
                            />
                            <YAxis hide />
                            <Tooltip
                                cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                                    borderWidth: '1px',
                                    backdropFilter: 'blur(12px)'
                                }}
                                itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}
                                labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: '700' }}
                                formatter={(value: number | string | undefined) => {
                                    const numValue = typeof value === 'string' ? parseFloat(value) : (typeof value === 'number' ? value : 0);
                                    return [`$${numValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, 'Projected Revenue'];
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={color}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                                animationDuration={1500}
                                filter="url(#glow)"
                                dot={{ fill: '#0f172a', strokeWidth: 2, r: 4, stroke: color }}
                                activeDot={{ r: 8, strokeWidth: 0, fill: '#fff', stroke: color }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default SalesForecastChart;
