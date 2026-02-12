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
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm italic">
                        No data available
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                                animationDuration={1500}
                                stroke="#101720"
                                strokeWidth={2}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(10, 15, 22, 0.95)',
                                    borderColor: '#ffffff10',
                                    borderRadius: '12px',
                                    padding: '10px',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                                    borderWidth: '1px',
                                    fontSize: '12px',
                                    border: 'none'
                                }}
                                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', fontWeight: '800' }}
                                formatter={(value: number | string | undefined) => [
                                    `$${(Number(value) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                                    'Revenue'
                                ]}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Top Performer</p>
                    <p className="text-sm font-bold text-white truncate">
                        {data.length > 0 ? data.reduce((prev, current) => (prev.value > current.value) ? prev : current).name : 'N/A'}
                    </p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Total Streams</p>
                    <p className="text-sm font-bold text-white">{data.length} Products</p>
                </div>
            </div>
        </div>
    );
};

export default RevenueMixChart;
