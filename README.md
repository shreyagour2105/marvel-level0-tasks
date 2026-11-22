# MARVEL Level 0 Tasks

A collection of my practical learning and project submissions for **MARVEL Level 0** at University Visvesvaraya College of Engineering (UVCE), Bengaluru.

## Task Index

| Task | Title | Work / Evidence |
| --- | --- | --- |
| **Task 2** | Dynamic Portfolio & Admin Dashboard | [Source files](task2-dynamic-portfolio/) |
| **Task 3** | Working with GitHub | [Original task repository](https://github.com/shreyagour2105/git-task) |
| **Task 4** | Hack the Hardware | [Linux, CPU architecture, and Hack assembly](task4-hack-the-hardware/) |
| **Task 5** | Operation Blackout | [NumPy decoding and Matplotlib visualizations](task5-operation-blackout/) |
| **Task 6** | Build Your Own Brain | [Linear regression project](linear_regression.py) |

## Task 2 — Dynamic Portfolio & Admin Dashboard

A public portfolio and admin dashboard project with separate frontend and backend code. The source files are included in [task2-dynamic-portfolio/](task2-dynamic-portfolio/), with separate frontend and backend directories.

**Files:** [task2-dynamic-portfolio/](task2-dynamic-portfolio/)

## Task 3 — Working with GitHub

Practised branching, issues, pull requests, GitHub Actions checks, and merge conflict resolution. The original [git-task repository](https://github.com/shreyagour2105/git-task) contains the Python exercises and workflow. Its issue/PR history cannot be transferred just by copying files into this repository.

## Task 4 — Hack the Hardware

Explored CPU architecture, Linux system information, kernel and process inspection, permissions, shell scripts, log processing, system calls, and Hack assembly using Nand2Tetris.

**Files:** [task4-hack-the-hardware/](task4-hack-the-hardware/)

The folder includes assembly source files, screenshots, CPU drawings, and Linux workspace files. The screenshots and drawings should be reviewed alongside the task analysis.

## Task 5 — Operation Blackout

Used NumPy to inspect and reshape an encoded array and Matplotlib to visualize candidate transformations, including transposition, reversal, and rotation.

**Files:** [task5-operation-blackout/](task5-operation-blackout/)

The folder includes the encoded NumPy array, a Python decoding script, and a transformations image.

## Task 6 — Build Your Own Brain

Implemented linear regression with NumPy and gradient descent on the California Housing dataset. The project investigates learning rates, feature standardization, loss curves, and comparison against scikit-learn's LinearRegression using MSE, MAE, and R².

**Files currently available at repository root:** [linear_regression.py](linear_regression.py), [requirements.txt](requirements.txt), and [results/](results/).

> **Repository organization note:** The `task6-linear-regression` path is currently recorded as a Git submodule rather than a regular project folder. The runnable Task 6 files currently live at the repository root.

### Run Task 6 on macOS

```bash
git clone https://github.com/shreyagour2105/marvel-level0-tasks.git
cd marvel-level0-tasks
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python linear_regression.py
```

The first run downloads the California Housing dataset and requires an internet connection and working Python SSL certificates.

### Expected Task 6 outputs

The script writes reports and visualizations under `results/`, including:

- `learning_rates.png`: different gradient-descent learning rates
- `scaling_effect.png`: scaled versus unscaled features
- `actual_vs_predicted.png`: held-out test predictions
- `task6_report.md`: metrics and analysis

## Source

Task descriptions: [UVCE MARVEL Level 0](https://github.com/UVCE-Marvel/CL-CY-001/blob/main/LEVEL0.md).

This repository documents my learning and experiments; not every task listed is necessarily an independently verified finished submission.
