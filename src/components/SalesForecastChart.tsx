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

            <div className="h-[300px] w-full min-h-[300px] relative">
                {!data || data.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm italic">
                        No forecast data available for this selection
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                                dy={10}
                            />
                            <YAxis hide />
                            <Tooltip
                                cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '5 5' }}
                                contentStyle={{
                                    backgroundColor: 'rgba(10, 15, 22, 0.95)',
                                    borderColor: `${color}40`,
                                    borderRadius: '12px',
                                    padding: '12px',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                                    borderWidth: '1px',
                                    border: 'none'
                                }}
                                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', fontWeight: '800' }}
                                formatter={(value: number | string | undefined) => {
                                    const numValue = typeof value === 'string' ? parseFloat(value) : (typeof value === 'number' ? value : 0);
                                    return [`$${numValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Projected Revenue'];
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={color}
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                                animationDuration={1500}
                                filter="url(#glow)"
                                dot={{ fill: color, strokeWidth: 2, r: 4, stroke: '#101720' }}
                                activeDot={{ r: 7, strokeWidth: 0, fill: '#fff' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default SalesForecastChart;
