"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DealSizeItem {
    name: string;
    value: number;
}

interface DealSizeChartProps {
    data: DealSizeItem[];
}

const DealSizeChart = ({ data }: DealSizeChartProps) => {
    const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Deal Size Analysis</h2>
                    <p className="text-slate-400 text-xs mt-1">Volume distribution by order scale</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <span className="material-icons text-sm">bar_chart</span>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{
                                backgroundColor: 'rgba(10, 15, 22, 0.95)',
                                borderColor: '#ffffff10',
                                borderRadius: '12px',
                                padding: '10px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DealSizeChart;
