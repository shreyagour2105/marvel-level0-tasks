"""MARVEL Task 6: Linear regression from scratch with NumPy.

Fetches the genuine California Housing dataset, trains NumPy gradient descent,
compares with sklearn LinearRegression, and saves charts and a report.
"""
from pathlib import Path

import matplotlib
matplotlib.use('Agg')  # Create PNGs without needing a GUI window
import matplotlib.pyplot as plt
import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

OUTPUT = Path(__file__).resolve().parent / 'results'
OUTPUT.mkdir(exist_ok=True)


class MyLinearRegression:
    """Full-batch gradient descent: no sklearn regression is used here."""

    def __init__(self, learning_rate=0.1, epochs=3500):
        self.learning_rate = learning_rate
        self.epochs = epochs
        self.weights = None
        self.bias = 0.0
        self.losses = []

    def fit(self, X, y):
        n_samples, n_features = X.shape
        self.weights = np.zeros(n_features)
        self.bias = 0.0
        self.losses = []
        for epoch in range(self.epochs):
            predicted = X @ self.weights + self.bias
            errors = predicted - y
            # The derivative of mean squared error w.r.t. weights/bias
            dw = (2.0 / n_samples) * (X.T @ errors)
            db = 2.0 * np.mean(errors)
            self.weights -= self.learning_rate * dw
            self.bias -= self.learning_rate * db
            # compute loss AFTER the gradient update
            if epoch == 0 or (epoch + 1) % 10 == 0 or epoch == self.epochs - 1:
                mse = np.mean((self.predict(X) - y) ** 2)
                self.losses.append((epoch + 1, float(mse)))
                if not np.isfinite(mse):
                    raise FloatingPointError(f'Diverged at epoch {epoch+1}; lower learning rate.')
        return self

    def predict(self, X):
        return X @ self.weights + self.bias


def metrics(y_true, y_pred):
    return {
        'MSE': mean_squared_error(y_true, y_pred),
        'MAE': mean_absolute_error(y_true, y_pred),
        'R2': r2_score(y_true, y_pred),
    }


def print_metrics(title, values):
    print(f'\n{title}')
    for name, value in values.items():
        print(f'  {name}: {value:.5f}')


def main():
    try:
        dataset = fetch_california_housing()
    except Exception as exc:
        raise SystemExit(
            'Could not download California Housing. Check your internet and rerun.\n'
            f'Details: {exc}'
        ) from exc

    X = dataset.data.astype(float)
    y = dataset.target.astype(float)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    # Fit ONLY to training set to prevent leakage.
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    print('Dataset: California Housing')
    print('Features:', ', '.join(dataset.feature_names))
    print('Samples:', X.shape[0], '| Features:', X.shape[1])
    print('Training:', len(X_train), '| Testing:', len(X_test))
    print('Target units: $100,000')

    # Experiment 1: Learning rates, with identical training data and epochs.
    rates = [0.001, 0.01, 0.1]
    models = {}
    rate_metrics = {}
    plt.figure(figsize=(9, 5))
    for rate in rates:
        model = MyLinearRegression(learning_rate=rate, epochs=3500)
        model.fit(X_train_s, y_train)
        models[rate] = model
        rate_metrics[rate] = metrics(y_test, model.predict(X_test_s))
        epochs, losses = zip(*model.losses)
        plt.plot(epochs, losses, label=f'Learning rate = {rate}')
        print(f'Learning rate {rate}: final train MSE = {losses[-1]:.5f}, '
              f'test MSE = {rate_metrics[rate]["MSE"]:.5f}')
    plt.xlabel('Epoch')
    plt.ylabel('Training mean squared error')
    plt.title('Training loss for different learning rates')
    plt.legend()
    plt.grid(alpha=0.25)
    plt.tight_layout()
    plt.savefig(OUTPUT / 'learning_rates.png', dpi=180)
    plt.close()

    # Experiment 2: Compare raw and standardized inputs.
    # The much smaller learning rate is necessary for raw features, which
    # are measured at radically different scales.
    unscaled = MyLinearRegression(learning_rate=1e-7, epochs=3500)
    unscaled.fit(X_train, y_train)
    scaled = models[0.1]
    plt.figure(figsize=(9, 5))
    a, b = zip(*unscaled.losses)
    c, d = zip(*scaled.losses)
    plt.plot(a, b, label='Raw features, learning rate 1e-7')
    plt.plot(c, d, label='Standardized, learning rate 0.1')
    plt.xlabel('Epoch')
    plt.ylabel('Training mean squared error')
    plt.title('Effect of feature scaling on gradient descent')
    plt.legend()
    plt.grid(alpha=0.25)
    plt.tight_layout()
    plt.savefig(OUTPUT / 'scaling_effect.png', dpi=180)
    plt.close()

    custom_predictions = scaled.predict(X_test_s)
    custom_results = metrics(y_test, custom_predictions)
    baseline = LinearRegression()
    baseline.fit(X_train_s, y_train)
    sklearn_predictions = baseline.predict(X_test_s)
    sklearn_results = metrics(y_test, sklearn_predictions)
    raw_results = metrics(y_test, unscaled.predict(X_test))
    print_metrics('Custom NumPy regression (scaled)', custom_results)
    print_metrics('scikit-learn LinearRegression (scaled)', sklearn_results)
    print_metrics('Custom NumPy regression (raw features, tiny learning rate)', raw_results)

    plt.figure(figsize=(7, 6))
    plt.scatter(y_test, custom_predictions, alpha=0.25, s=9, label='Predictions')
    lo = min(y_test.min(), custom_predictions.min())
    hi = max(y_test.max(), custom_predictions.max())
    plt.plot([lo, hi], [lo, hi], 'k--', label='Ideal: predicted = actual')
    plt.xlabel('Actual median house value ($100,000)')
    plt.ylabel('Predicted median house value ($100,000)')
    plt.title('Actual vs predicted: NumPy gradient descent')
    plt.legend()
    plt.tight_layout()
    plt.savefig(OUTPUT / 'actual_vs_predicted.png', dpi=180)
    plt.close()

    lines = [
        '# MARVEL Task 6: Linear Regression from Scratch',
        '',
        '## Objective',
        'Implement full-batch gradient descent using NumPy; examine learning rates and scaling; '
        'compare with scikit-learn on the same held-out test set.',
        '',
        '## Dataset',
        f'- California Housing: {X.shape[0]} samples, {X.shape[1]} features.',
        f'- Train: {len(X_train)}; test: {len(X_test)}; random_state=42.',
        '- Median house value is measured in $100,000 units.',
        '- StandardScaler was fit on training features only, then applied to test features.',
        '',
        '## Gradient descent (written with NumPy)',
        '- Prediction: y_hat = X @ w + b',
        '- MSE: mean((y_hat - y)**2)',
        '- Weight gradient: (2/n) * X.T @ (y_hat - y)',
        '- Bias gradient: 2 * mean(y_hat - y)',
        '- Update: w = w - learning_rate * gradient; likewise for b.',
        '',
        '## Learning-rate experiment (3500 epochs, standardized features)',
        '| Learning rate | Test MSE | Test MAE | Test R² |',
        '| --- | ---: | ---: | ---: |',
    ]
    for rate in rates:
        r = rate_metrics[rate]
        lines.append(f'| {rate} | {r["MSE"]:.5f} | {r["MAE"]:.5f} | {r["R2"]:.5f} |')
    lines += [
        '',
        '## Model comparison',
        '| Model | Test MSE | Test MAE | Test R² |',
        '| --- | ---: | ---: | ---: |',
    ]
    for name, r in [
        ('NumPy gradient descent, scaled, lr=0.1', custom_results),
        ('scikit-learn LinearRegression, scaled', sklearn_results),
        ('NumPy gradient descent, raw, lr=1e-7', raw_results),
    ]:
        lines.append(f'| {name} | {r["MSE"]:.5f} | {r["MAE"]:.5f} | {r["R2"]:.5f} |')
    lines += [
        '',
        '## Observations',
        '- With standardized features, larger tested learning rates generally converge more quickly, '
        'provided they remain stable.',
        '- Raw features require a much smaller learning rate because feature magnitudes differ.',
        '- scikit-learn LinearRegression uses a direct least-squares solver rather than this '
        'manually implemented gradient descent loop.',
        '- A lower MSE/MAE and higher R² mean better predictions on the same test set.',
        '- A linear model can still miss nonlinear patterns in housing prices.',
        '',
        '## Saved charts',
        '![Learning rate comparison](learning_rates.png)',
        '![Scaling experiment](scaling_effect.png)',
        '![Actual vs predicted](actual_vs_predicted.png)',
        '',
        '## My explanation for the presentation',
        '> Replace this with your own words after reviewing the code and graphs.',
        '',
    ]
    (OUTPUT / 'task6_report.md').write_text('\n'.join(lines), encoding='utf-8')
    print('\nSaved charts and report in:', OUTPUT)


if __name__ == '__main__':
    main()
