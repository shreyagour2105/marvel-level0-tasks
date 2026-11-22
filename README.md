# MARVEL Task 6: Build Your Own Brain

Linear Regression from Scratch with NumPy using the California Housing dataset.

## Running on Mac

Open Terminal:

```bash
cd ~/Desktop/MARVEL-Task6
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python linear_regression.py
```

The first run requires an internet connection: `fetch_california_housing()` downloads the real dataset and then caches it.

## Outputs

The script saves these under `results/`:

- `learning_rates.png` — compares learning rates 0.001, 0.01, 0.1.
- `scaling_effect.png` — compares raw vs standardized training.
- `actual_vs_predicted.png` — test-set predictions vs ground truth.
- `task6_report.md` — auto-generated metrics table and discussion.

## How it works

Train/test split is fixed (80/20, random_state=42). StandardScaler fits **only on training features**, avoiding data leakage. `MyLinearRegression` computes predictions, MSE gradients, and weight updates itself in NumPy, without using scikit-learn's regression for the custom model. A separate scikit-learn `LinearRegression` is fit on the same training set and evaluated on the same test set. The target's unit is $100,000.

## Presentation questions to practise

1. What does a weight represent in linear regression?
2. Why is the bias term useful?
3. What is the derivative of MSE with respect to a weight?
4. What does changing learning rate do?
5. Why fit StandardScaler only on training data?
6. What is the difference between MSE, MAE, and R²?
7. Why might two linear regression implementations give slightly different scores?

This project is for learning; the auto-generated report includes a space for your own explanation.
