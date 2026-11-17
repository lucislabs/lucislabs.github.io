---
title: Your cross-validation is leaking
summary: Random folds on spatial data reward memorising neighbours. Use blocks.
date: 2026-10-02
tags: [ml, spatial, validation]
---
Nearby locations share unmeasured drivers. A random split puts a test point's twin in the training set, so the model scores well by interpolating, not by generalising.

```python
from sklearn.model_selection import GroupKFold
blocks = (gdf.geometry.x // 10_000).astype(int).astype(str) + "_" + (gdf.geometry.y // 10_000).astype(int).astype(str)
cv = GroupKFold(n_splits=5).split(X, y, groups=blocks)
```

If the deployment target is a new region, hold out whole regions. Report both numbers.
