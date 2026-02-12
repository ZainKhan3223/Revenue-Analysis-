# CRITICAL TASK: Fix All Errors and Stabilize the Project

## Context
This project already has:
- A complete UI (stored in the `UI` folder)
- Button click handlers, tabs, charts, filters, and backend connections
- AI pipeline and dashboard logic already implemented

However, the application currently throws **runtime errors, console errors, broken interactions, and partial rendering failures**.

The goal is NOT to add new features.
The goal is to **make the entire system stable, error-free, and fully runnable**.

---

## Primary Objective
Make the project:
- Run without **any runtime errors**
- Have **zero console errors or unhandled exceptions**
- Ensure **all buttons, tabs, filters, and charts work correctly**
- Ensure frontend and backend are **fully synchronized**

---

## Mandatory Fix Instructions

### 1. Frontend Error Handling
- Scan **all JS files** for:
  - Missing functions
  - Undefined variables
  - Broken imports
  - Incorrect event bindings
- Fix:
  - Null / undefined DOM references
  - Event listeners attached before DOM load
  - Incorrect element IDs or class names
- Ensure all buttons and tabs degrade gracefully if data is missing

### 2. Backend & API Stability
- Verify:
  - All API endpoints used by the UI actually exist
  - API response formats match frontend expectations
- Fix:
  - 500 errors
  - Incorrect JSON keys
  - Missing data fields
- Add default fallback responses where needed

### 3. Data & AI Pipeline Validation
- Ensure:
  - CSV loading never crashes the app
  - Missing or malformed data does not break charts or models
- Add:
  - Safe defaults
  - Input validation
  - Try/catch blocks around AI inference
- If AI prediction fails, return a safe placeholder instead of crashing

### 4. Chart & Visualization Fixes
- Ensure:
  - Charts render even when dataset is empty
  - Filters never break chart state
  - Re-renders do not duplicate charts or cause memory leaks
- Reset chart instances correctly before reloading data

### 5. Global Stability Rules
- No uncaught exceptions
- No silent failures
- Every async call must have error handling
- Every UI interaction must fail safely

---

## Final Output Requirements
- Project must start and run cleanly
- All buttons, tabs, and interactions must work
- Console must show **zero critical errors**
- Code should be cleaned, commented, and consistent
- Do NOT change the UI design
- Do NOT add new features
- Focus only on fixing and stabilizing

---

## Agent Instruction
Analyze the entire project (including the `UI` folder) and:
1. Identify every error source
2. Fix all issues
3. Verify full end-to-end execution
4. Return a **stable, production-ready build**

This is a **stability and reliability task**, not a feature task.
