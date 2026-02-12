import React from 'react';

interface Recommendation {
    type: string;
    title: string;
    description: string;
    confidence: number;
    action: string;
}

interface RecommendationCardProps {
    recommendation: Recommendation;
    onAction?: (title: string, action: string) => void;
}

const RecommendationCard = ({ recommendation, onAction }: RecommendationCardProps) => {
    const { type, title, description, confidence, action } = recommendation;

    const iconMap: Record<string, string> = {
        inventory: 'inventory',
        pricing: 'sell',
        marketing: 'ads_click'
    };

    const confidenceColor = confidence > 0.85 ? 'text-emerald-500' : 'text-amber-500';
    const confidenceBg = confidence > 0.85 ? 'bg-emerald-500/10' : 'bg-amber-500/10';

    return (
        <div className="bg-surface dark:bg-surface-light p-5 rounded-xl border border-primary/10 hover:border-primary/40 transition-all group flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/20 rounded-lg text-primary shadow-lg shadow-primary/10">
                    <span className="material-icons text-xl">{iconMap[type] || 'auto_fix_high'}</span>
                </div>
                <span className={`text-[10px] font-bold ${confidenceColor} px-2 py-1 ${confidenceBg} rounded uppercase tracking-wider`}>
                    {Math.round(confidence * 100)}% Conf.
                </span>
            </div>

            <div className="flex-1">
                <h4 className="font-bold text-white mb-1 group-hover:text-primary transition-colors">{title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{description}</p>
            </div>

            <div className="mt-auto space-y-4">
                <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="bg-primary h-full rounded-full shadow-[0_0_8px_rgba(13,127,242,0.6)] transition-all duration-1000"
                        style={{ width: `${confidence * 100}%` }}
                    ></div>
                </div>

                <button
                    onClick={() => onAction ? onAction(title, action) : console.log(`Action: ${action} for ${title}`)}
                    className="w-full py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all font-bold text-xs uppercase tracking-widest active:scale-95 border border-primary/20"
                >
                    {action}
                </button>
            </div>
        </div>
    );
};

export default RecommendationCard;
