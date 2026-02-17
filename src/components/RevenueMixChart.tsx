"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface RevenueMixData {
    name: string;
    value: number;
    color: string;
}

interface RevenueMixChartProps {
    data: RevenueMixData[];
}

const RevenueMixChart = ({ data }: RevenueMixChartProps) => {
    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Revenue Mix</h2>
                    <p className="text-slate-400 text-xs mt-1">Distribution across product lines</p>
                </div>
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <span className="material-icons text-sm">pie_chart</span>
                </div>
            </div>

            <div className="h-[280px] w-full relative">
                {!data || data.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm font-medium tracking-wide">
                        No data available
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={100}
                                paddingAngle={4}
                                cornerRadius={6}
                                dataKey="value"
                                animationDuration={1500}
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.2)" strokeWidth={1} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                    borderColor: 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                                    borderWidth: '1px',
                                    backdropFilter: 'blur(10px)'
                                }}
                                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', fontWeight: '700' }}
                                formatter={(value: number | string | undefined) => [
                                    `$${(Number(value) || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                                    'Revenue'
                                ]}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ fontSize: '11px', paddingTop: '20px', fontFamily: 'var(--font-display)', opacity: 0.8 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Top Performer</p>
                    <p className="text-sm font-bold text-white truncate text-glow">
                        {data.length > 0 ? data.reduce((prev, current) => (prev.value > current.value) ? prev : current).name : 'N/A'}
                    </p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Total Streams</p>
                    <p className="text-sm font-bold text-white text-glow">{data.length} Products</p>
                </div>
            </div>
        </div>
    );
};

export default RevenueMixChart;
