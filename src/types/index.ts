export interface Recommendation {
    type: string;
    title: string;
    description: string;
    confidence: number;
    action: string;
}

export interface Forecast {
    product: string;
    predictions: number[];
    historical: number[];
}

export interface Stats {
    total_products: number;
    alerts_count: number;
}

export interface DashboardData {
    recommendations: Recommendation[];
    revenue_forecast: Forecast[];
    stats: Stats;
}
