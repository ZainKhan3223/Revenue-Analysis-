import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

class SalesForecaster:
    def __init__(self):
        self.model = LinearRegression()

    def predict_next_weeks(self, historical_data: pd.Series, weeks: int = 4):
        """
        Uses a simple linear regression to forecast future values based on history.
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
        X = np.array(range(len(historical_data))).reshape(-1, 1)
        y = historical_data.values

        self.model.fit(X, y)

        # Predict future steps
        future_X = np.array(range(len(historical_data), len(historical_data) + weeks)).reshape(-1, 1)
        predictions = self.model.predict(future_X)
        
        # Ensure non-negative predictions
        return [max(0, float(round(p, 2))) for p in predictions]
