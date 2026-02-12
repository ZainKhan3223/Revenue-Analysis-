import pandas as pd
import os
import traceback

def load_and_preprocess_data(csv_path: str):
    """
    Loads sales data with robust error handling and fallbacks.
    """
    try:
        if not os.path.exists(csv_path):
            print(f"File not found: {csv_path}. Using empty fallback.")
            return create_fallback_df()

        # Try various encodings if default fails
        df = None
        for enc in ['utf-8', 'ISO-8859-1', 'cp1252']:
            try:
                df = pd.read_csv(csv_path, encoding=enc)
                break
            except:
                continue
        
        if df is None:
            raise ValueError(f"Could not read CSV {csv_path} with any common encoding.")

        # Standardize matching
        rename_map = {
            'ORDERDATE': 'date',
            'QUANTITYORDERED': 'units_sold',
            'PRICEEACH': 'price',
            'SALES': 'sales',
            'PRODUCTLINE': 'product_line',
            'STATUS': 'status',
            'YEAR_ID': 'year',
            'MONTH_ID': 'month'
        }
        df = df.rename(columns=rename_map)

        # Basic Cleanup
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
        df = df.dropna(subset=['date'])
        df = df.sort_values('date')
        
        # Ensure fallback for missing columns
        required = ['sales', 'units_sold', 'product_line']
        for col in required:
            if col not in df.columns:
                df[col] = 0 if col != 'product_line' else 'Unknown'

        return df
    except Exception as e:
        print(f"Error in data_handler: {e}")
        traceback.print_exc()
        return create_fallback_df()

def create_fallback_df():
    """Returns a minimal empty DataFrame with correct columns"""
    return pd.DataFrame(columns=['date', 'units_sold', 'price', 'sales', 'product_line', 'status', 'year', 'month'])

def get_product_insights(df: pd.DataFrame, product_line: str):
    if product_line and product_line != "All Products":
        return df[df['product_line'] == product_line].copy()
    return df.copy()

def aggregate_by_period(df: pd.DataFrame, period: str = 'ME'):
    if df.empty:
        return pd.DataFrame(columns=['sales', 'units_sold'])
        
    df_indexed = df.set_index('date')
    numeric_cols = [c for c in ['sales', 'units_sold'] if c in df_indexed.columns]
    
    if not numeric_cols:
        return pd.DataFrame(columns=['sales', 'units_sold'])

    return df_indexed[numeric_cols].resample(period).sum().fillna(0)
