---
title: Sensor anomaly detection
summary: Seasonal-trend decomposition plus robust z-scores for flagging faulty IoT streams.
stack: [Python, statsmodels, Polars]
kind: data
year: 2024
featured: false
---
STL decomposition removes daily and weekly cycles. Residuals are scored with a median-absolute-deviation z-score, which resists the outliers it is meant to detect.
