from fastapi import FastAPI, HTTPException, Request, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import pandas as pd
import numpy as np
import traceback
from datetime import datetime
from typing import Optional, List

app = FastAPI(title="Revenue Analysis AI Platform API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA LOADER ---

def get_csv_path(filename: str):
    return os.path.join(os.path.dirname(__file__), filename)

def load_financials():
    path = get_csv_path("monthly_financials.csv")
    if not os.path.exists(path): return pd.DataFrame()
    df = pd.read_csv(path)
    df['date'] = pd.to_datetime(df['date'])
    return df.sort_values('date')

def load_products():
    path = get_csv_path("product_sales.csv")
    if not os.path.exists(path): return pd.DataFrame()
    return pd.read_csv(path)

def load_inventory():
    path = get_csv_path("inventory.csv")
    if not os.path.exists(path): return pd.DataFrame()
    return pd.read_csv(path)

# --- AI & SIMULATION ENGINE ---

class AnalyticsEngine:
    @staticmethod
    def forecast_trend(series: pd.Series, periods: int = 4):
        if len(series) < 2:
            last = series.iloc[-1] if not series.empty else 0
            return [float(last)] * periods, 0.0, 1.0
        
        y = series.values
        x = np.arange(len(y))
        
        # Linear Regression
        coeffs = np.polyfit(x, y, 1)
        slope, intercept = coeffs
        
        # Predictions
        future_x = np.arange(len(y), len(y) + periods)
        predictions = slope * future_x + intercept
        predictions = [max(0.0, float(round(p, 2))) for p in predictions]
        
        # Velocity (Rate of Change)
        velocity = float(round(slope / (y.mean() if y.mean() != 0 else 1), 4))
        
        # Confidence (Simple R-squared approach)
        y_pred = slope * x + intercept
        ss_res = np.sum((y - y_pred) ** 2)
        ss_tot = np.sum((y - np.mean(y)) ** 2)
        r_squared = 1 - (ss_res / ss_tot) if ss_tot != 0 else 1.0
        confidence = float(round(max(0.0, min(1.0, r_squared)), 2))
        
        return predictions, velocity, confidence

    @staticmethod
    def generate_recommendations(financials, products, inventory):
        recs = []
        
        # Rule 1: Risk alert if expenses trending higher than revenue
        rev_trend = financials['revenue'].tail(3).mean()
        exp_trend = financials['expenses'].tail(3).mean()
        if exp_trend > rev_trend * 0.9:
            recs.append({
                "type": "risk",
                "title": "Liquidity Alert",
                "description": f"Expenses are approaching {int(exp_trend/rev_trend*100)}% of revenue. Optimization recommended.",
                "confidence": 0.92,
                "action": "View Mitigation"
            })
            
        # Rule 2: Inventory optimization
        for _, row in inventory.iterrows():
            if row['stock'] < row['reorder_threshold']:
                recs.append({
                    "type": "inventory",
                    "title": f"Restock {row['product_name']}",
                    "description": f"Stock ({row['stock']}) is below threshold ({row['reorder_threshold']}). Reorder now.",
                    "confidence": 0.95,
                    "action": "Optimize Inventory"
                })
                
        # Rule 3: Growth Opportunity
        top_growth = products.sort_values('growth_rate', ascending=False).iloc[0]
        recs.append({
            "type": "marketing",
            "title": f"Scale {top_growth['product_name']}",
            "description": f"High growth rate detected ({int(top_growth['growth_rate']*100)}%). Scaling campaigns could yield 15%+ ROI.",
            "confidence": 0.88,
            "action": "Apply Campaign"
        })
        
        return recs

# --- ENDPOINTS ---

@app.get("/api/health")
async def health():
    return {"status": "ok", "app": "Revenue Analysis AI Platform"}

@app.get("/api/overview")
async def get_overview():
    financials = load_financials()
    if financials.empty:
        return {"total_revenue": 0, "net_cash": 0, "risk_level": "Low", "recommendations": [], "alerts": []}
    
    last_month = financials.iloc[-1]
    total_revenue = float(financials['revenue'].sum())
    net_cash = float(last_month['net_cash'])
    
    # Risk calculation
    risk = "Low"
    if last_month['expenses'] > last_month['revenue']:
        risk = "High"
    elif last_month['expenses'] > last_month['revenue'] * 0.8:
        risk = "Medium"

    recommendations = AnalyticsEngine.generate_recommendations(financials, load_products(), load_inventory())

    # Build alerts from recommendations and financial data
    alerts = []
    if risk in ["High", "Medium"]:
        deficit = float(last_month['expenses'] - last_month['revenue'])
        alerts.append({
            "type": "Cash Flow",
            "time": "Just now",
            "title": "Liquidity Risk Detected" if risk == "High" else "Expense Warning",
            "description": f"Expenses exceed revenue by ${abs(deficit):,.0f}. Immediate action recommended." if deficit > 0 else f"Expenses at {int(last_month['expenses']/last_month['revenue']*100)}% of revenue. Monitor closely.",
            "risk": "high" if risk == "High" else "low"
        })
    # Inventory alerts
    inventory = load_inventory()
    for _, row in inventory.iterrows():
        if row['stock'] < row['reorder_threshold']:
            alerts.append({
                "type": "Inventory",
                "time": "Now",
                "title": f"{row['product_name']} Low Stock",
                "description": f"Stock ({row['stock']} units) is below reorder threshold ({row['reorder_threshold']}). Restock immediately.",
                "risk": "high"
            })
    # Revenue momentum alert
    rev_recent = financials['revenue'].tail(3)
    if len(rev_recent) >= 3 and float(rev_recent.iloc[-1]) > float(rev_recent.iloc[0]) * 1.1:
        alerts.append({
            "type": "Revenue",
            "time": "1h ago",
            "title": "Growth Momentum",
            "description": f"Revenue increased {int((float(rev_recent.iloc[-1])/float(rev_recent.iloc[0])-1)*100)}% over the last 3 months. Consider scaling campaigns.",
            "risk": "low"
        })

    return {
        "total_revenue": total_revenue,
        "net_cash": net_cash,
        "risk_level": risk,
        "recommendations": recommendations,
        "alerts": alerts
    }

@app.get("/api/financial-trends")
async def get_trends():
    financials = load_financials()
    if financials.empty: return []
    
    data = []
    for _, row in financials.iterrows():
        data.append({
            "month": row['date'].strftime('%b %Y'),
            "revenue": float(row['revenue']),
            "expenses": float(row['expenses']),
            "net": float(row['net_cash'])
        })
    return data

@app.get("/api/forecast")
async def get_forecast(product: Optional[str] = None):
    financials = load_financials()
    products = load_products()
    
    if product and product != "All Products":
        # Simulate product-specific forecast using growth_rate
        p_data = products[products['product_name'] == product]
        if p_data.empty: return []
        
        base_rev = float(p_data.iloc[0]['revenue'] / 12) # Approximate monthly
        growth = float(p_data.iloc[0]['growth_rate'])
        
        predictions = [round(base_rev * (1 + growth)**(i+1), 2) for i in range(4)]
        return [{
            "product": product,
            "predictions": predictions,
            "velocity": growth,
            "confidence": 0.85,
            "historical": [round(base_rev * 0.9, 2), round(base_rev * 0.95, 2), round(base_rev, 2)]
        }]
    else:
        # Full dashboard forecast
        predictions, velocity, confidence = AnalyticsEngine.forecast_trend(financials['revenue'])
        history = financials['revenue'].tail(4).tolist()
        
        # Detailed forecast for each product (for the table)
        results = []
        for _, row in products.iterrows():
            # Apply trend based on growth_rate
            base = row['revenue'] / 12
            p_preds = [round(base * (1 + row['growth_rate'])**(i+1), 2) for i in range(4)]
            results.append({
                "product": row['product_name'],
                "predictions": p_preds,
                "velocity": float(row['growth_rate']),
                "confidence": 0.9,
                "historical": [round(base * 0.9, 2), round(base, 2)]
            })
        return results

@app.get("/api/products")
async def get_products():
    products = load_products()
    if products.empty: return []
    
    mix = []
    colors = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#0ea5e9', '#ec4899']
    for i, (_, row) in enumerate(products.iterrows()):
        mix.append({
            "name": row['product_name'],
            "value": float(row['revenue']),
            "growth": float(row['growth_rate']),
            "color": colors[i % len(colors)]
        })
    return sorted(mix, key=lambda x: x['value'], reverse=True)

@app.get("/api/inventory")
async def get_inventory():
    inventory = load_inventory()
    if inventory.empty: return []
    
    results = []
    for _, row in inventory.iterrows():
        # Simulate velocity and days remaining
        velocity = float(np.random.uniform(2.0, 5.0))
        days_remaining = int(row['stock'] / (velocity + 0.1))
        results.append({
            "product": row['product_name'],
            "stock_level": int(row['stock']),
            "velocity": round(velocity, 2),
            "days_remaining": days_remaining,
            "status": "Healthy" if row['stock'] > row['reorder_threshold'] else "Warning"
        })
    return results

@app.get("/api/deal-sizes")
async def get_deal_sizes():
    products = load_products()
    if products.empty:
        return []
    # Classify products into deal-size tiers based on average order value
    tiers = {"Small (<$50k)": 0, "Medium ($50k-$200k)": 0, "Large (>$200k)": 0}
    for _, row in products.iterrows():
        rev = float(row['revenue'])
        if rev < 50000:
            tiers["Small (<$50k)"] += int(row['units_sold'])
        elif rev < 200000:
            tiers["Medium ($50k-$200k)"] += int(row['units_sold'])
        else:
            tiers["Large (>$200k)"] += int(row['units_sold'])
    return [{"name": k, "value": v} for k, v in tiers.items() if v > 0]

@app.get("/api/stats")
async def get_stats():
    financials = load_financials()
    products = load_products()
    if financials.empty:
        return {"avg_deal_value": 0, "profit_margin": 0, "total_revenue": 0, "outstanding_ar": 0, "projected_runway_months": 0}
    
    total_rev = float(financials['revenue'].sum())
    total_exp = float(financials['expenses'].sum())
    total_units = int(products['units_sold'].sum()) if not products.empty else 1
    avg_deal = total_rev / total_units if total_units > 0 else 0
    margin = ((total_rev - total_exp) / total_rev * 100) if total_rev > 0 else 0
    
    # Projected runway = net_cash / avg monthly burn
    avg_burn = total_exp / len(financials) if len(financials) > 0 else 1
    last_cash = float(financials.iloc[-1]['net_cash'])
    runway = last_cash / avg_burn if avg_burn > 0 else 0
    
    # Outstanding AR is simulated as ~5% of total revenue
    outstanding_ar = round(total_rev * 0.05, 2)
    
    return {
        "avg_deal_value": round(avg_deal, 2),
        "profit_margin": round(margin, 1),
        "total_revenue": round(total_rev, 2),
        "outstanding_ar": round(outstanding_ar, 2),
        "projected_runway_months": round(runway, 1)
    }

@app.post("/api/campaign/apply")
async def apply_campaign(data: dict = Body(...)):
    product = data.get("product", "General")
    # Simulate a 15% boost in forecasts
    return {
        "status": "success",
        "message": f"Campaign applied to {product}. Projections updated by +15.4%.",
        "impact": {
            "rev_increase": 0.154,
            "confidence_boost": 0.05
        }
    }

@app.post("/api/inventory/optimize")
async def optimize_inventory(data: dict = Body(...)):
    product = data.get("product")
    # Simulate optimization
    return {
        "status": "success",
        "message": f"Inventory for {product} optimized. Reorder point adjusted to prevent stockout.",
        "suggestion": "Increase stock by 25 units immediately."
    }

# Legacy endpoint for compatibility during migration
@app.get("/api/dashboard")
async def get_legacy_dashboard(product: str = None):
    # This just aggregates everything like it was before
    overview = await get_overview()
    trends = await get_trends()
    forecast = await get_forecast(product)
    products = await get_products()
    inventory_data = load_inventory()
    
    inv_health = []
    for _, row in inventory_data.iterrows():
        inv_health.append({
            "product": row['product_name'],
            "stock_level": int(row['stock']),
            "velocity": 4.5, # Dummy for now
            "days_remaining": int(row['stock'] / 5),
            "status": "Healthy" if row['stock'] > row['reorder_threshold'] else "Warning"
        })

    return {
        "recommendations": overview["recommendations"],
        "revenue_forecast": forecast,
        "inventory_health": inv_health,
        "cash_flow": trends,
        "deal_size_distribution": [{"name": "Small", "value": 45}, {"name": "Medium", "value": 82}, {"name": "Large", "value": 12}],
        "stats": {
            "total_products": len(products),
            "alerts_count": len(overview["recommendations"]),
            "inventory_risk": 1 if any(i['status'] == "Warning" for i in inv_health) else 0
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
