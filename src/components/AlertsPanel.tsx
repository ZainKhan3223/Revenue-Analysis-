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
    const defaultAlerts: Alert[] = [
        {
            type: 'Cash Flow',
            time: '2h ago',
            title: 'Gap Detected',
            description: "Incoming revenue won't cover payroll on Nov 1st. $12,400 deficit projected.",
            risk: 'high'
        },
        {
            type: 'Invoicing',
            time: '5h ago',
            title: 'Overdue Invoices',
            description: 'Client "Acme Corp" is 7 days late on payment #4452 ($2,500).',
            risk: 'low'
        }
    ];

    const displayAlerts = dynamicAlerts && dynamicAlerts.length > 0 ? dynamicAlerts : defaultAlerts;

    return (
        <aside className="w-full xl:w-80 space-y-6">
            <div className="bg-white/5 rounded-xl border border-white/10 p-6 neon-glow-orange overflow-hidden relative shadow-[0_0_15px_rgba(255,140,0,0.1)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-orange/10 blur-3xl -mr-16 -mt-16"></div>
                <div className="flex items-center gap-2 mb-6 text-white">
                    <span className="material-icons text-accent-orange">warning</span>
                    <h3 className="text-lg font-bold">High-Risk Alerts</h3>
                </div>

                <div className="space-y-4 text-white">
                    {displayAlerts.map((alert, index) => (
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
                                {alert.risk === 'high' ? 'View Mitigation Plan' : 'Send Reminder'}
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onDismiss}
                    className="w-full mt-6 py-3 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors text-white hover:scale-105 active:scale-95"
                >
                    Dismiss All
                </button>
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
