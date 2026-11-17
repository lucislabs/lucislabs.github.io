---
title: Why I bin points into hexagons
summary: Hexagons have equidistant neighbours and less edge bias than squares.
date: 2026-08-14
tags: [gis, visualisation]
---
Every neighbour of a hexagon is the same distance from its centre. Squares have 4 close neighbours and 4 farther diagonal ones, which distorts smoothing and gradients.

The [atlas](/atlas/) bins stations into hexagons, takes the mean, and shows counts in the tooltip. Always show `n`: a cell mean from 1 point and from 40 points look identical on a colour scale.
