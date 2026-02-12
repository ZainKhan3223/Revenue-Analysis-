import React from 'react';

const SettingsView = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight font-display">System Configuration</h2>
                <p className="text-slate-400">Manage API connections, model sensitivity, and preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4">Network & API</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Engine Base URL</label>
                            <input
                                type="text"
                                defaultValue="http://localhost:8000"
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                                readOnly
                            />
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-slate-300">Auto-Reconnect</span>
                            <div className="w-10 h-5 bg-primary/20 rounded-full relative border border-primary/50">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4">Model Sensitivity</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Confidence Threshold (80%)</label>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[80%]"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" defaultChecked className="accent-primary" />
                                <span className="text-sm text-slate-300">AI Marketing Proactive Mode</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" defaultChecked className="accent-primary" />
                                <span className="text-sm text-slate-300">Inventory Alert Push Notifications</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-full glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-white">System Logs</h4>
                        <p className="text-xs text-slate-500">Last database sync: 12 minutes ago</p>
                    </div>
                    <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all">
                        Download Debug Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
