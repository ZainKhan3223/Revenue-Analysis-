'use client';
import React, { useState, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, ReferenceLine
} from 'recharts';

interface InventoryItem {
    product: string;
    stock_level: number;
    reorder_threshold: number;
    velocity: number;
    days_remaining: number;
    status: string;
    unit_price?: number;
    value?: number;
}

interface InventoryViewProps {
    data: InventoryItem[];
    onRestock?: (productName: string) => void;
}

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#0ea5e9', '#ec4899', '#84cc16'];

const InventoryView = ({ data, onRestock }: InventoryViewProps) => {
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [sortBy, setSortBy] = useState<keyof InventoryItem>('value');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Stats Calculation
    const stats = useMemo(() => {
        const totalValue = data.reduce((sum, item) => sum + (item.value || 0), 0);
        const lowStockCount = data.filter(item => item.status === 'Warning' || item.status === 'Critical').length;
        const avgDays = data.length > 0
            ? data.reduce((sum, item) => sum + item.days_remaining, 0) / data.length
            : 0;

        return { totalValue, lowStockCount, avgDays };
    }, [data]);

    // Derived Data for Charts
    const chartData = useMemo(() => {
        return data.map(item => ({
            name: item.product,
            stock: item.stock_level,
            reorder: item.reorder_threshold,
            value: item.value || 0
        })).sort((a, b) => b.value - a.value); // Sort by value for charts by default
    }, [data]);

    const pieData = useMemo(() => {
        return data.map(item => ({
            name: item.product,
            value: item.value || 0
        })).filter(item => item.value > 0);
    }, [data]);

    // Filtering and Sorting
    const filteredData = useMemo(() => {
        let res = data;
        if (filterStatus !== 'All') {
            res = res.filter(item => item.status === filterStatus);
        }

        return res.sort((a, b) => {
            const valA = a[sortBy] || 0;
            const valB = b[sortBy] || 0;
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, filterStatus, sortBy, sortOrder]);

    const handleSort = (key: keyof InventoryItem) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('desc');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight font-display">Inventory Logistics</h2>
                <p className="text-slate-400">Real-time stock monitoring, valuation, and replenishment forecasting</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500">
                            <span className="material-icons">paid</span>
                        </div>
                        <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest">Total Valuation</p>
                    </div>
                    <p className="text-3xl font-bold text-white">${stats.totalValue.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">across {data.length} product lines</p>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-rose-500/10 to-transparent">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-rose-500/20 text-rose-500">
                            <span className="material-icons">warning</span>
                        </div>
                        <p className="text-[10px] uppercase font-bold text-rose-400 tracking-widest">Low Stock Alerts</p>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.lowStockCount}</p>
                    <p className="text-xs text-slate-500 mt-1">items below reorder threshold</p>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-blue-500/10 to-transparent">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500">
                            <span className="material-icons">schedule</span>
                        </div>
                        <p className="text-[10px] uppercase font-bold text-blue-400 tracking-widest">Avg Days on Hand</p>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.avgDays.toFixed(0)} days</p>
                    <p className="text-xs text-slate-500 mt-1">estimated runway based on velocity</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stock vs Reorder Chart */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-1">Stock Levels vs Reorder Point</h3>
                    <p className="text-xs text-slate-500 mb-4">Identify products needing immediate attention</p>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
                                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                />
                                <Legend />
                                <Bar dataKey="stock" name="Current Stock" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="reorder" name="Reorder Point" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Valuation Distribution */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-1">Capital Distribution</h3>
                    <p className="text-xs text-slate-500 mb-4">Inventory value by product line</p>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.1)" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                                />
                                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Advanced Table */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                <div className="px-6 py-4 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
                    <div>
                        <h3 className="text-lg font-bold text-white">Inventory List</h3>
                        <p className="text-xs text-slate-500">Detailed stock and velocity metrics</p>
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Healthy', 'Warning'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${filterStatus === status
                                    ? 'bg-primary/20 text-primary border-primary/30'
                                    : 'bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10'}`}
                            >
                                {status === 'Warning' ? 'Low Stock' : status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-slate-400">
                                <th onClick={() => handleSort('product')} className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider cursor-pointer hover:text-white transition-colors">
                                    Product Line {sortBy === 'product' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('value')} className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider cursor-pointer hover:text-white transition-colors text-right">
                                    Total Value {sortBy === 'value' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('stock_level')} className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider cursor-pointer hover:text-white transition-colors text-center">
                                    Stock Level {sortBy === 'stock_level' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('velocity')} className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider cursor-pointer hover:text-white transition-colors text-center">
                                    Velocity {sortBy === 'velocity' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('days_remaining')} className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider cursor-pointer hover:text-white transition-colors text-center">
                                    Runway {sortBy === 'days_remaining' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 italic">No inventory data matches the selected filter</td>
                                </tr>
                            ) : (
                                filteredData.map((item, index) => {
                                    const stockCtx = (item.stock_level / (item.reorder_threshold * 3)) * 100; // Visual bar context

                                    return (
                                        <tr key={index} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 font-bold text-white">
                                                <div className="flex flex-col">
                                                    <span>{item.product}</span>
                                                    <span className="text-[10px] text-slate-500 font-normal">Unit Price: ${item.unit_price?.toFixed(2) || '0.00'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-emerald-400">
                                                ${item.value?.toLocaleString() || '0'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 max-w-[120px] mx-auto">
                                                    <div className="flex justify-between text-[10px]">
                                                        <span className="text-white font-bold">{item.stock_level}</span>
                                                        <span className="text-slate-500">/ {item.reorder_threshold} min</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${item.stock_level <= item.reorder_threshold ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                                            style={{ width: `${Math.min(stockCtx, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-xs">
                                                {item.velocity.toFixed(1)} / day
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`text-xs font-bold ${item.days_remaining < 14 ? 'text-rose-400' : 'text-slate-300'}`}>
                                                    {item.days_remaining} items
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm border ${item.status === 'Healthy'
                                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                    : 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse'
                                                    }`}>
                                                    {item.status === 'Warning' && <span className="material-icons text-[10px] mr-1">warning</span>}
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => onRestock ? onRestock(item.product) : null}
                                                    className="text-primary hover:text-white text-xs font-bold transition-all hover:bg-primary/20 hover:shadow-[0_0_10px_rgba(13,127,242,0.2)] px-3 py-1.5 rounded-lg active:scale-95 border border-primary/20"
                                                >
                                                    RESTOCK
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryView;
