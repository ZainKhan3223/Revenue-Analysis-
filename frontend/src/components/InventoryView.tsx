import React from 'react';

interface InventoryItem {
    product: string;
    stock_level: number;
    velocity: number;
    days_remaining: number;
    status: string;
}

interface InventoryViewProps {
    data: InventoryItem[];
}

const InventoryView = ({ data }: InventoryViewProps) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight font-display">Inventory Logistics</h2>
                <p className="text-slate-400">Real-time stock monitoring and replenishment forecasting</p>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-white">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Product Line</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Current Stock</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Daily Velocity</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Est. Runway</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                        {data.map((item, index) => (
                            <tr key={index} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-bold text-white">{item.product}</td>
                                <td className="px-6 py-4">{item.stock_level} units</td>
                                <td className="px-6 py-4">{item.velocity} / day</td>
                                <td className="px-6 py-4">{item.days_remaining} days</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm ${item.status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-500' :
                                        item.status === 'Warning' ? 'bg-amber-500/20 text-amber-500' :
                                            'bg-red-500/20 text-red-500'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-primary hover:text-white text-xs font-bold transition-colors">RESTOCK</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryView;
