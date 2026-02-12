from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import pandas as pd
import numpy as np
import traceback
from datetime import datetime

app = FastAPI(title="Intelligence Engine API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ENGINE CORE LOGIC (Consolidated to fix Vercel imports) ---

class SalesForecaster:
    def predict_next_weeks(self, historical_data: pd.Series, weeks: int = 4):
        if len(historical_data) < 2:
            last_val = historical_data.iloc[-1] if not historical_data.empty else 0
            return [float(last_val)] * weeks
        x = np.arange(len(historical_data))
        y = historical_data.values
        coeffs = np.polyfit(x, y, 1)
        m, c = coeffs
        future_x = np.arange(len(historical_data), len(historical_data) + weeks)
        predictions = m * future_x + c
        return [max(0.0, float(round(p, 2))) for p in predictions]

class DecisionEngine:
    def generate_recommendations(self, product_line: str, predictions: list, history: list, total_sales: float, avg_order_value: float):
        recommendations = []
        last_val = history[-1] if history else 0
        next_val = predictions[0] if predictions else 0
        if last_val > 0 and next_val > last_val * 1.1:
            growth_pct = int(((next_val / last_val) - 1) * 100)
            recommendations.append({
                "type": "inventory", "title": f"Increase {product_line} Stock",
                "description": f"Projected sales growth of {growth_pct}%. Suggest restocking within 2 weeks.",
                "confidence": 0.89, "action": "Review Inventory"
            })
        if avg_order_value > 3000:
            recommendations.append({
                "type": "pricing", "title": f"Premium {product_line} Strategy",
                "description": f"High-value transactions detected (${int(avg_order_value)} avg). Consider premium tier pricing.",
                "confidence": 0.85, "action": "Adjust Pricing"
            })
        if total_sales > 50000:
            recommendations.append({
                "type": "marketing", "title": f"Expand {product_line} Market",
                "description": f"Strong performance. Allocate more budget to digital campaigns.",
                "confidence": 0.78, "action": "Launch Campaign"
            })
        return recommendations

def load_data():
    csv_path = os.path.join(os.path.dirname(__file__), "sales_data_sample.csv")
    if not os.path.exists(csv_path):
        return pd.DataFrame()
    for enc in ['utf-8', 'ISO-8859-1', 'cp1252']:
        try:
            df = pd.read_csv(csv_path, encoding=enc)
            rename_map = {'ORDERDATE': 'date', 'QUANTITYORDERED': 'units_sold', 'PRICEEACH': 'price', 'SALES': 'sales', 'PRODUCTLINE': 'product_line'}
            df = df.rename(columns=rename_map)
            df['date'] = pd.to_datetime(df['date'], errors='coerce')
            return df.dropna(subset=['date']).sort_values('date')
        except: continue
    return pd.DataFrame()

# --- ENDPOINTS ---

@app.get("/api/health")
@app.get("/health")
async def health():
    return {"status": "ok", "engine": "Project Revenue Engine"}

@app.get("/api/dashboard")
async def get_dashboard_data(product: str = None):
    try:
        df = load_data()
        if df.empty:
            return {"error": "Data Source Unavailable"}
        
        if product and product != "All Products":
            product_lines = [product]
        else:
            product_lines = df['product_line'].unique()[:4]
        
        all_recommendations = []
        revenue_forecast = []
        forecaster = SalesForecaster()
        engine = DecisionEngine()
        
        for pl in product_lines:
            pl_df = df[df['product_line'] == pl]
            if pl_df.empty: continue
            
            monthly = pl_df.set_index('date')['sales'].resample('M').sum().fillna(0)
            predictions = forecaster.predict_next_weeks(monthly, weeks=4)
            history = monthly.tail(4).values.tolist()
            if len(history) < 4: history = [0] * (4-len(history)) + history

            revenue_forecast.append({"product": pl, "predictions": predictions, "historical": history})
            all_recommendations.extend(engine.generate_recommendations(pl, predictions, history, pl_df['sales'].sum(), pl_df['sales'].mean()))

        # Inventory & Cashflow simulation
        inventory_health = []
        for pl in df['product_line'].unique()[:6]:
            vel = df[df['product_line'] == pl]['units_sold'].mean()
            stock = int(vel * 20)
            days = int(stock / (vel + 1))
            inventory_health.append({"product": pl, "stock_level": stock, "velocity": round(vel, 2), "days_remaining": days, "status": "Healthy" if days > 15 else "Warning"})

        total_monthly = df.set_index('date')['sales'].resample('M').sum().tail(6)
        cash_flow = [{"month": d.strftime('%b %Y'), "revenue": round(r, 2), "expenses": round(r*0.7, 2), "net": round(r*0.3, 2)} for d, r in total_monthly.items()]

        return {
            "recommendations": sorted(all_recommendations, key=lambda x: x['confidence'], reverse=True)[:9],
            "revenue_forecast": revenue_forecast,
            "inventory_health": inventory_health,
            "cash_flow": cash_flow,
            "stats": {"total_products": len(df['product_line'].unique()), "alerts_count": len(all_recommendations), "inventory_risk": 1}
        }
    except Exception as e:
        print(traceback.format_exc())
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
