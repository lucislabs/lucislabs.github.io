---
title: Transit isochrones
summary: Door-to-door travel-time maps from GTFS feeds, used to measure job access by neighbourhood.
stack: [Python, r5py, DuckDB, MapLibre]
kind: gis
year: 2025
featured: true
---
Builds 45-minute isochrones from every census block using schedule data and OSM walking networks, then joins them to employment counts.

The output is a single Parquet file queried by DuckDB, so the front end needs no server.
