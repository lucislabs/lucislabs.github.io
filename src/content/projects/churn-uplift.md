---
title: Uplift modelling for retention
summary: Causal forests that target retention offers at customers whose behaviour the offer actually changes.
stack: [Python, EconML, scikit-learn]
kind: ml
year: 2025
featured: true
---
Propensity to churn and responsiveness to an offer are different quantities. Ranking by churn risk sent offers to customers who would have stayed anyway.

A causal forest on a randomised holdout ranked customers by estimated treatment effect. Targeting the top 30% captured most of the incremental retention at a third of the cost.
