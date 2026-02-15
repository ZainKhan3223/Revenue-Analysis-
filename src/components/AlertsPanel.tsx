import React from 'react';

interface Alert {
    type: string;
    time: string;
    title: string;
    description: string;
    risk: 'high' | 'low';
}

interface AlertsPanelProps {
    alerts?: Alert[];
    onDismiss?: () => void;
    onViewMitigation?: (title: string, description: string) => void;
}

const AlertsPanel = ({ alerts: dynamicAlerts, onDismiss, onViewMitigation }: AlertsPanelProps) => {
    const displayAlerts = dynamicAlerts && dynamicAlerts.length > 0 ? dynamicAlerts : [];

    return (
        <aside className="w-full xl:w-80 space-y-6">
            <div className="bg-white/5 rounded-xl border border-white/10 p-6 neon-glow-orange overflow-hidden relative shadow-[0_0_15px_rgba(255,140,0,0.1)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-orange/10 blur-3xl -mr-16 -mt-16"></div>
                <div className="flex items-center gap-2 mb-6 text-white">
                    <span className="material-icons text-accent-orange">warning</span>
                    <h3 className="text-lg font-bold">High-Risk Alerts</h3>
                    {displayAlerts.length > 0 && (
                        <span className="ml-auto bg-accent-orange/20 text-accent-orange text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {displayAlerts.length}
                        </span>
                    )}
                </div>

                <div className="space-y-4 text-white">
                    {displayAlerts.length === 0 ? (
                        <div className="p-4 bg-black/40 rounded-lg text-center">
                            <span className="material-icons text-emerald-500 text-2xl mb-2 block">verified</span>
                            <p className="text-sm text-slate-400">No active alerts</p>
                            <p className="text-[10px] text-slate-500 mt-1">All systems nominal</p>
                        </div>
                    ) : (
                        displayAlerts.map((alert, index) => (
                            <div
                                key={index}
                                className={`p-4 bg-black/40 border-l-4 rounded-r-lg ${alert.risk === 'high' ? 'border-accent-orange' : 'border-slate-700'
                                    }`}
                            >
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>{alert.type}</span>
                                    <span>{alert.time}</span>
                                </div>
                                <h5 className="text-sm font-bold mb-1 text-white">{alert.title}</h5>
                                <p className="text-xs text-slate-400">{alert.description}</p>
                                <button
                                    onClick={() => onViewMitigation ? onViewMitigation(alert.title, alert.description) : console.log(`Viewing mitigation for: ${alert.title}`)}
                                    className={`inline-block mt-3 text-xs font-bold hover:underline cursor-pointer ${alert.risk === 'high' ? 'text-accent-orange' : 'text-primary'
                                        }`}
                                >
                                    {alert.risk === 'high' ? 'View Mitigation Plan' : 'View Details'}
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {displayAlerts.length > 0 && (
                    <button
                        onClick={onDismiss}
                        className="w-full mt-6 py-3 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors text-white hover:scale-105 active:scale-95"
                    >
                        Dismiss All
                    </button>
                )}
            </div>

            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Market Outlook</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300">Industry Growth</span>
                        <span className="text-xs text-emerald-500 font-bold">+2.4%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300">Avg. CPC</span>
                        <span className="text-xs text-slate-300">$1.42</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300">Consumer Sentiment</span>
                        <span className="text-xs text-amber-500 font-bold">Neutral</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AlertsPanel;
