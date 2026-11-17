---
title: PM2.5 exposure surface
summary: Kriged air-quality surface from sparse low-cost sensors, with block cross-validation to avoid spatial leakage.
stack: [Python, GeoPandas, PyKrige, PostGIS]
kind: gis
year: 2026
featured: true
---
Low-cost sensors drift and cluster in wealthy neighbourhoods. This project calibrates them against reference monitors, then interpolates a continuous surface.

## Approach

1. Calibrate each sensor with a humidity-corrected linear model.
2. Fit an exponential variogram on calibrated residuals.
3. Krige to a 250 m grid and report prediction variance next to the mean.

## Validation

Random k-fold overstates skill because neighbouring stations are autocorrelated. Spatial block CV (10 km blocks) raised RMSE by roughly a third, which is the honest number.
