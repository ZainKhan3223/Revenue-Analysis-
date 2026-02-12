from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import pandas as pd
import numpy as np
import traceback
from utils.data_handler import load_and_preprocess_data, get_product_insights
from models.forecaster import SalesForecaster
from services.decision_engine import DecisionEngine

app = FastAPI(title="Project Revenue Engine API")

# Path to the actual sales data
DATA_PATH = os.path.join(os.path.dirname(__file__), "sales_data_sample.csv")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "detail": str(exc), "traceback": traceback.format_exc()},
    )

@app.get("/")
async def root():
    return {"message": "Project Revenue Engine API is running (Refactored)"}

@app.get("/dashboard")
async def get_dashboard_data(product: str = None):
    """
    Returns aggregated dashboard data: Forecasts, Recommendations, and Alerts.
    Supports optional product filtering.
    """
    try:
        if not os.path.exists(DATA_PATH):
            raise HTTPException(status_code=404, detail="Data source not found")
        
        # Load and process data using the new handler
        # This returns a DF with standardized columns: date, units_sold, sales, product_line, etc.
        df = load_and_preprocess_data(DATA_PATH)
        
        # Get unique product lines
        if product and product != "All Products":
            product_lines = [product]
        else:
            # Limit to top 4 for demo purposes, or based on volume
            product_lines = df['product_line'].unique()[:4]
        
        all_recommendations = []
        revenue_forecast = []
        forecaster = SalesForecaster()
        
        # Process each product line for insights
        for product_line in product_lines:
            # Use helper to get filtered data
            product_df = get_product_insights(df, product_line)
            
            if product_df.empty:
                continue
                
            # Aggregating by month for forecasting (using 'sales' as the target variable for revenue forecast)
            # Note: Frontend expects 'revenue_forecast', so we should forecast 'sales', not 'units_sold'
            # unless 'units_sold' is what is desired. The original code used 'SALES'.
            # Let's forecast SALES.
            
            # Resample to monthly sales
            # Ensure we have a datetime index
            temp_df = product_df.set_index('date')
            monthly_sales_series = temp_df['sales'].resample('ME').sum().fillna(0)
            
            # Forecast future sales
            # Using 4 weeks/periods? Original code did 4 predictions.
            # If we resample by Month ('M'), 4 steps = 4 months.
            # Original code used: product_df['ORDERDATE'].dt.to_period('M') and generated 4 predictions.
            # So it was monthly.
            
            predictions = forecaster.predict_next_weeks(monthly_sales_series, weeks=4)
            
            # Get historical data (last 4 months)
            recent_sales = monthly_sales_series.tail(4).values.tolist()
            # If not enough data, pad? Forecaster handles prediction, but history?
            if len(recent_sales) < 4:
                recent_sales = [0] * (4 - len(recent_sales)) + recent_sales

            revenue_forecast.append({
                "product": product_line,
                "predictions": predictions,
                "historical": recent_sales
            })
            
            # Generate intelligent recommendations using DecisionEngine
            total_sales = product_df['sales'].sum()
            avg_order_value = product_df['sales'].mean()
            
            engine = DecisionEngine()
            recs = engine.generate_recommendations(
                product_line=product_line,
                predictions=predictions,
                history=recent_sales,
                total_sales=total_sales,
                avg_order_value=avg_order_value
            )
            all_recommendations.extend(recs)

        # Sort recommendations by confidence
        all_recommendations = sorted(all_recommendations, key=lambda x: x['confidence'], reverse=True)[:9]

        # Generate inventory health data (Simulated based on sales velocity)
        inventory_health = []
        for pl in df['product_line'].unique()[:6]:
            pl_df = df[df['product_line'] == pl]
            velocity = pl_df['units_sold'].mean()
            stock = int(velocity * np.random.randint(10, 30)) # simulated stock
            days_remaining = int(stock / (velocity + 1))
            
            inventory_health.append({
                "product": pl,
                "stock_level": stock,
                "velocity": round(velocity, 2),
                "days_remaining": days_remaining,
                "status": "Healthy" if days_remaining > 15 else "Critical" if days_remaining < 7 else "Warning"
            })

        # Generate cash flow data (Simulated revenue vs expenses)
        # Resample total sales by month
        total_monthly_sales = df.set_index('date')['sales'].resample('ME').sum().tail(6)
        cash_flow = []
        for i, (date, revenue) in enumerate(total_monthly_sales.items()):
            # Simulate expenses as a percentage of revenue plus some fixed costs
            expenses = revenue * 0.7 + np.random.randint(5000, 15000)
            cash_flow.append({
                "month": date.strftime('%b %Y'),
                "revenue": round(revenue, 2),
                "expenses": round(expenses, 2),
                "net": round(revenue - expenses, 2)
            })

        return {
            "recommendations": all_recommendations,
            "revenue_forecast": revenue_forecast,
            "inventory_health": inventory_health,
            "cash_flow": cash_flow,
            "stats": {
                "total_products": len(df['product_line'].unique()),
                "alerts_count": len([r for r in all_recommendations if r['type'] == 'inventory']),
                "inventory_risk": len([i for i in inventory_health if i['status'] != 'Healthy'])
            }
        }
    except Exception as e:
        print(f"CRITICAL ERROR IN ENDPOINT: {e}")
        import traceback
        traceback.print_exc()
        raise e

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
