# Small Business Revenue Optimization Engine - Project Prompt

## Project Overview
This project is an **AI-powered finance web application** designed to help small businesses **predict product sales, optimize inventory, and receive actionable recommendations** for promotions and stock management. The project is end-to-end, integrating **AI pipeline, backend logic, and a premium UI**.

## Problem Statement
Small business owners struggle to:
- Forecast product demand accurately
- Optimize inventory to avoid overstock or stock-outs
- Decide which products to promote for maximum revenue

The AI system should **analyze historical sales, inventory, and promotions** to provide **actionable recommendations** with confidence scores. The project must be fully working and demonstrate **real-world business impact**.

## UI Integration
- A **working UI folder** exists in the project directory, containing all frontend assets:
  - Login / Signup page (dark mode, premium, smooth transitions)
  - Dashboard page (charts, AI recommendations, alerts, filters)
- The agent should **use this UI folder** as the frontend interface while integrating the AI and backend logic.

## AI & Backend Components
1. **Input Data**: CSV / POS / inventory data uploaded via dashboard
2. **Preprocessing**: Handle missing values, feature engineering
3. **Predictive Model**: Forecast product sales per week (e.g., Prophet, LSTM, XGBoost)
4. **Decision Engine**: Multi-step reasoning combining predictions, inventory, and business rules to output actionable recommendations
5. **Explainability Layer**: Each recommendation includes reasoning + confidence score
6. **Alerts**: Low-stock or high-risk products flagged in dashboard
7. **Data Flow**:



## Reliability
- Handle invalid/missing input gracefully
- Provide confidence scoring for predictions
- Minimize hallucinations in recommendations

## Instructions for Antigravity Agent
- Analyze this prompt **in combination with the UI folder**
- Generate a **fully working backend** integrating AI predictions + decision engine
- Map AI outputs to UI dashboard components (charts, recommendations, alerts)
- Provide **end-to-end functional system** ready for testing
- Explain AI components and their role in the project
- Maintain **premium dark-mode UI** as provided

---

> **Note:** The UI folder is already in the working directory. Use it as the frontend. Build AI, backend, and data pipelines to make the system fully functional.
