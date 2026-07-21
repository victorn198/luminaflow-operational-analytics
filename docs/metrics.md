# Metric dictionary

| Metric | Definition | Grain | Comparison |
|---|---|---|---|
| Net Revenue | Sum of revenue after line discounts | Sales line | Latest simulated period vs previous simulated period |
| Orders | Distinct cart count | Cart | Latest simulated period vs previous simulated period |
| Units Sold | Sum of line quantities | Sales line | Latest simulated period vs previous simulated period |
| Average Order Value | Net Revenue divided by Orders | Cart | Latest simulated period vs previous simulated period |
| Active Clients | Distinct clients with sales lines | Client | Latest simulated period vs previous simulated period |
| Weighted Discount Rate | Discount Value divided by Gross Revenue | Revenue-weighted line aggregation | Latest simulated period vs previous simulated period |
| Current Stock | Catalog stock for the current product | Product | Compared with Target Stock |
| Target Stock | Maximum of 10 or 125% of observed units sold | Product | Demonstration baseline |
| Reorder Qty | Positive difference between Target Stock and Current Stock | Product | Action quantity |
| Stock Status | Out of Stock, Low Stock, or Healthy | Product | Current Stock vs Target Stock |

## Reconciliation

```text
Discount Value = Gross Revenue - Net Revenue
Weighted Discount Rate = Discount Value / Gross Revenue
```

The dashboard uses explicit measures. Comparison labels and status colors are calculated from measures rather than entered as static text.
