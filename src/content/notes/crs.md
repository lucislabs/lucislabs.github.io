---
title: Three CRS mistakes that ship to production
summary: Degrees treated as metres, area in Web Mercator, and silently mixed datums.
date: 2026-06-21
tags: [gis, python]
---
1. **Buffering in EPSG:4326.** A 500 buffer is 500 degrees. Project first.
2. **Area in EPSG:3857.** Greenland looks the size of Africa. Use an equal-area CRS.
3. **Assuming the CRS.** Files without a `.prj` default to whatever you guessed. Check, then assert.

```python
assert gdf.crs is not None, "missing CRS"
gdf = gdf.to_crs(5070)  # equal-area for CONUS
```
