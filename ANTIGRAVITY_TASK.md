You are analyzing an existing deployed project:
Revenue Analysis AI Platform (Next.js / React on Vercel).

Live URL:
https://revenue-analysis-m6m8.vercel.app/

Current state:
- UI and navigation are implemented
- Multiple sections show “No data available”
- Forecasting, Revenue Mix, Top Performers, Campaign actions are placeholders
- Some buttons work visually but have no backend logic
- No real data pipeline or AI forecasting layer is connected

Your task is to convert this UI-first prototype into a fully working end-to-end system,
WITHOUT redesigning the UI.

==============================
GOALS
==============================

1. Make every major section functional using real data (even if demo data).
2. Implement a real backend API.
3. Implement forecasting logic (predictive, not static).
4. Connect frontend to backend.
5. Ensure all buttons trigger meaningful simulated actions.
6. Keep everything stable for hackathon judging.

==============================
STEP 1: DATA LAYER
==============================

Create a data layer using CSV or JSON (no external paid APIs).

Required datasets:
- monthly_financials.csv
  Columns:
    date (YYYY-MM)
    revenue
    expenses
    net_cash

- product_sales.csv
  Columns:
    product_name
    units_sold
    revenue
    growth_rate

- inventory.csv
  Columns:
    product_name
    stock
    reorder_threshold

Seed realistic demo data so charts and KPIs render properly.

==============================
STEP 2: BACKEND API
==============================

Implement backend APIs using either:
- Node.js (Next.js API routes), OR
- Python (FastAPI)

Required endpoints:

GET /api/overview
→ returns KPIs (total revenue, net cash, risk level)

GET /api/financial-trends
→ returns time-series data for charts

GET /api/forecast
→ returns P1, P2, P3, P4 forecasts with confidence + velocity

GET /api/products
→ returns revenue mix + top performers

POST /api/campaign/apply
→ simulates campaign impact and returns updated projections

POST /api/inventory/optimize
→ simulates inventory decision and returns suggestion

All APIs must return structured JSON.

==============================
STEP 3: FORECASTING (AI LOGIC)
==============================

Implement a real predictive model.

Minimum acceptable approach:
- Linear regression / moving average / trend-based forecasting

Required outputs:
- Forecast values for P1–P4
- Velocity (rate of change)
- Confidence score

Forecast must be derived from historical data, not hardcoded.

==============================
STEP 4: SIMULATED DECISION ENGINE
==============================

Implement a decision-intelligence layer.

Rules example:
- If forecasted expenses > revenue → generate risk alert
- If product growth_rate > threshold → recommend inventory increase
- If revenue momentum is high → allow campaign simulation

Campaign and optimize buttons:
- Do NOT execute real-world actions
- Apply simulated impact to forecast and KPIs
- Update dashboard state after action

==============================
STEP 5: FRONTEND INTEGRATION
==============================

Update frontend to:
- Fetch data from backend APIs
- Replace all “No data available” placeholders
- Render charts only when data exists
- Show loading + error states gracefully

Every interactive button must:
- Call an API
- Update UI based on response
- Show confirmation feedback

==============================
STEP 6: ERROR HANDLING & STABILITY
==============================

- No silent failures
- No empty UI states
- If data missing → show fallback message
- Ensure production build works on Vercel

==============================
STEP 7: JUDGE-SAFE EXPLANATION
==============================

Ensure the system supports this statement truthfully:

“This is a decision-intelligence platform.
AI forecasting and simulations drive recommendations.
Execution-heavy actions are intentionally simulated.”

==============================
CONSTRAINTS
==============================

- Do NOT redesign UI
- Do NOT add unnecessary libraries
- Do NOT convert this into a chatbot
- Keep architecture simple and explainable

==============================
FINAL OUTPUT EXPECTED
==============================

- Fully working dashboard
- Real data displayed everywhere
- Forecasting tab functional
- Campaign & optimize buttons meaningful
- Stable Vercel deployment
- Clear separation of frontend, backend, and AI logic
