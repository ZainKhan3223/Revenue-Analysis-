class DecisionEngine:
    def generate_recommendations(self, product_line: str, predictions: list, history: list, total_sales: float, avg_order_value: float):
        """
        Generates actionable recommendations based on sales forecasts and historical data.
        """
        try:
            recommendations = []
            
            last_val = history[-1] if history else 0
            next_val = predictions[0] if predictions else 0
            
            # 1. Inventory / Stock Logic
            if last_val > 0 and next_val > last_val * 1.1:
                growth_pct = int(((next_val / last_val) - 1) * 100)
                recommendations.append({
                    "type": "inventory",
                    "title": f"Increase {product_line} Stock",
                    "description": f"Projected sales growth of {growth_pct}%. Current momentum suggests restocking within 2 weeks.",
                    "confidence": 0.89,
                    "action": "Review Inventory"
                })
                
            # 2. Pricing Logic
            if avg_order_value > 3000:
                recommendations.append({
                    "type": "pricing",
                    "title": f"Premium {product_line} Strategy",
                    "description": f"High-value transactions detected (${int(avg_order_value)} avg). Consider bundling or premium tier pricing.",
                    "confidence": 0.85,
                    "action": "Adjust Pricing"
                })
                
            # 3. Marketing Logic
            if total_sales > 50000:
                recommendations.append({
                    "type": "marketing",
                    "title": f"Expand {product_line} Market",
                    "description": f"Strong sales performance. Allocate 15% more budget to digital campaigns.",
                    "confidence": 0.78,
                    "action": "Launch Campaign"
                })
                
            return recommendations
        except Exception as e:
            print(f"Error generating recommendations for {product_line}: {e}")
            return []
