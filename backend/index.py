from fastapi import FastAPI, HTTPException, Request, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import pandas as pd
import numpy as np
import traceback
from datetime import datetime
from typing import Optional, List
from models.forecaster import SalesForecaster

forecaster = SalesForecaster()

app = FastAPI(title="Business Manager API")

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
        predictions = forecaster.predict_next_weeks(series, weeks=periods)
        
        # Calculate velocity and confidence (keeping original logic for now)
        if len(series) < 2:
            return predictions, 0.0, 1.0
            
        y = series.values
        x = np.arange(len(y))
        coeffs = np.polyfit(x, y, 1)
        slope = coeffs[0]
        velocity = float(round(slope / (y.mean() if y.mean() != 0 else 1), 4))
        
        y_pred = slope * x + coeffs[1]
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
    # Generate Narrative Summary
    summary = f"Revenue is currently ${total_revenue:,.0f}."
    if risk == "Low":
        summary += " Financial health is strong with stable cash flow."
    elif risk == "Medium":
        summary += " Expense growth is outpacing revenue slightly; monitor burn rate."
    else:
        summary += " Immediate attention needed: Expenses exceed revenue."
        
    if len(recommendations) > 0:
        summary += f" {len(recommendations)} AI optimization opportunities identified."
    
    return {
        "total_revenue": total_revenue,
        "net_cash": net_cash,
        "risk_level": risk,
        "recommendations": recommendations,
        "alerts": alerts,
        "summary": summary
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
        
        row = p_data.iloc[0]
        base_rev = float(row['revenue'] / 12) # Approximate monthly
        growth = float(row['growth_rate'])
        
        # More realistic historical data for visualization
        history = [round(base_rev * (0.95 + 0.02 * i), 2) for i in range(4)]
        predictions = [round(base_rev * (1 + growth)**(i+1), 2) for i in range(4)]
        
        return [{
            "product": product,
            "predictions": predictions,
            "velocity": growth,
            "confidence": 0.92,
            "historical": history
        }]
    else:
        # Full dashboard forecast
        predictions, velocity, confidence = AnalyticsEngine.forecast_trend(financials['revenue'])
        
        # Detailed forecast for each product (for the table)
        results = []
        for _, row in products.iterrows():
            base = row['revenue'] / 12
            # Use growth rate for prediction
            p_preds = [round(base * (1 + row['growth_rate'])**(i+1), 2) for i in range(4)]
            # Use a slightly jittered history for visual appeal
            h_data = [round(base * (0.96 + 0.015 * i), 2) for i in range(3)]
            
            results.append({
                "product": row['product_name'],
                "predictions": p_preds,
                "velocity": float(row['growth_rate']),
                "confidence": 0.9,
                "historical": h_data
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
    sales = load_products()
    
    if inventory.empty: return []
    
    # Merge with sales data to get revenue/units for pricing
    # If sales data is missing, we'll default to some estimates
    if not sales.empty:
        merged = pd.merge(inventory, sales, on='product_name', how='left')
    else:
        merged = inventory
        merged['revenue'] = 0
        merged['units_sold'] = 1

    results = []
    for _, row in merged.iterrows():
        # Simulate velocity and days remaining
        velocity = float(np.random.uniform(2.0, 5.0))
        
        # Calculate unit price based on sales data (revenue / units_sold)
        # Handle cases where units_sold might be 0 or missing
        units_sold = row.get('units_sold', 1)
        revenue = row.get('revenue', 0)
        stock = int(row['stock'])
        
        unit_price = round(revenue / units_sold, 2) if units_sold > 0 else 0
        total_value = round(stock * unit_price, 2)
        
        days_remaining = int(stock / (velocity + 0.1))
        
        results.append({
            "product": row['product_name'],
            "stock_level": stock,
            "reorder_threshold": int(row['reorder_threshold']),
            "velocity": round(velocity, 2),
            "days_remaining": days_remaining,
            "unit_price": unit_price,
            "value": total_value,
            "status": "Healthy" if stock > row['reorder_threshold'] else "Warning"
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
        return {
            "avg_deal_value": 0, "profit_margin": 0, "total_revenue": 0, 
            "outstanding_ar": 0, "projected_runway_months": 0,
            "revenue_trend": 0, "margin_trend": 0, "ar_trend": 0
        }
    
    # Current Stats (last month)
    last_month = financials.iloc[-1]
    total_rev = float(last_month['revenue'])
    total_exp = float(last_month['expenses'])
    total_units = int(products['units_sold'].sum()) if not products.empty else 1
    avg_deal = total_rev / (total_units / 12) if total_units > 0 else 0 # Monthly avg
    margin = ((total_rev - total_exp) / total_rev * 100) if total_rev > 0 else 0
    
    # Trend calculation (compared to previous month)
    rev_trend = 0
    margin_trend = 0
    ar_trend = 0
    
    if len(financials) >= 2:
        prev_month = financials.iloc[-2]
        prev_rev = float(prev_month['revenue'])
        if prev_rev > 0:
            rev_trend = round(((total_rev / prev_rev) - 1) * 100, 1)
        
        prev_exp = float(prev_month['expenses'])
        prev_margin = ((prev_rev - prev_exp) / prev_rev * 100) if prev_rev > 0 else 0
        margin_trend = round(margin - prev_margin, 1)
        
        # AR is simulated as 5% of revenue, so trend follows revenue
        ar_trend = rev_trend

    # Projected runway = last_cash / current burn
    last_cash = float(last_month['net_cash'])
    runway = last_cash / total_exp if total_exp > 0 else 12.0
    
    outstanding_ar = round(total_rev * 0.05, 2)
    
    return {
        "avg_deal_value": round(avg_deal, 2),
        "profit_margin": round(margin, 1),
        "total_revenue": round(total_rev, 2),
        "outstanding_ar": round(outstanding_ar, 2),
        "projected_runway_months": round(runway, 1),
        "revenue_trend": rev_trend,
        "margin_trend": margin_trend,
        "ar_trend": ar_trend
    }

@app.post("/api/campaign/apply")
async def apply_campaign(data: dict = Body(...)):
    product_name = data.get("product", "General")
    
    # Load and update products database to persist growth boost
    products = load_products()
    if products.empty:
        return JSONResponse(status_code=404, content={"message": "Product database empty"})

    if product_name in products['product_name'].values:
        # Apply a permanent 5% boost to growth rate (e.g. 0.12 becomes 0.17)
        mask = products['product_name'] == product_name
        current_growth = products.loc[mask, 'growth_rate'].iloc[0]
        new_growth = round(current_growth + 0.05, 3)
        products.loc[mask, 'growth_rate'] = new_growth
        
        # Save back to CSV
        try:
            path = get_csv_path("product_sales.csv")
            products.to_csv(path, index=False)
            
            return {
                "status": "success",
                "message": f"Strategy applied to {product_name}. Multi-week growth adjusted from {int(current_growth*100)}% to {int(new_growth*100)}%.",
                "impact": {
                    "rev_increase": 0.05,
                    "confidence_boost": 0.03
                }
            }
        except Exception as e:
            return JSONResponse(status_code=500, content={"message": f"Failed to persist strategy: {str(e)}"})
    else:
        return JSONResponse(status_code=404, content={"message": f"Product '{product_name}' not found"})

@app.post("/api/inventory/optimize")
async def optimize_inventory(data: dict = Body(...)):
    product_name = data.get("product")
    if not product_name:
        return JSONResponse(status_code=400, content={"message": "Product name required"})

    inventory = load_inventory()
    if inventory.empty:
        return JSONResponse(status_code=404, content={"message": "Inventory database empty"})

    if product_name in inventory['product_name'].values:
        # Increase stock by 25 units
        inventory.loc[inventory['product_name'] == product_name, 'stock'] += 25
        
        # Save back to CSV
        try:
            path = get_csv_path("inventory.csv")
            inventory.to_csv(path, index=False)
            
            new_stock = int(inventory.loc[inventory['product_name'] == product_name, 'stock'].iloc[0])
            
            return {
                "status": "success",
                "message": f"Restocked {product_name}. New level: {new_stock} (+25 units).",
                "new_stock": new_stock
            }
        except Exception as e:
            return JSONResponse(status_code=500, content={"message": f"Failed to save inventory: {str(e)}"})
    else:
        # If product not found, we can't restock it
        return JSONResponse(status_code=404, content={"message": f"Product {product_name} not found in inventory"})

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
