import pandas as pd
import numpy as np

class SalesForecaster:
    def __init__(self):
        # We don't need a formal model object if we use numpy functions directly
        pass

    def predict_next_weeks(self, historical_data: pd.Series, weeks: int = 4):
        """
        Uses a simple linear regression (via numpy) to forecast future values based on history.
        Args:
            historical_data: pd.Series of historical values (e.g. sales or units) sorted by time.
            weeks: Number of steps to forecast.
        Returns:
            list of predicted values (floats).
        """
        if len(historical_data) < 2:
            # Not enough data to forecast, return flat prediction based on last seen
            last_val = historical_data.iloc[-1] if not historical_data.empty else 0
            return [float(last_val)] * weeks

        # Prepare simple time features (ordinal index)
        x = np.arange(len(historical_data))
        y = historical_data.values

        # Perform linear regression: y = mx + c
        # polyfit(x, y, 1) returns [m, c]
        coeffs = np.polyfit(x, y, 1)
        m, c = coeffs

        # Predict future steps: x_future = len(history) to len(history) + weeks
        future_x = np.arange(len(historical_data), len(historical_data) + weeks)
        predictions = m * future_x + c
        
        # Ensure non-negative predictions
        return [max(0.0, float(round(p, 2))) for p in predictions]
