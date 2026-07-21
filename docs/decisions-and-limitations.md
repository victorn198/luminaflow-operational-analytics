# Decisions and limitations

## Design decisions

- Use one dense operational overview instead of multiple shallow pages.
- Keep global filters above the KPI band.
- Rank categories, states, and products by net revenue.
- Rank inventory exceptions by reorder quantity.
- Replace product rating with current stock, target stock, reorder quantity, and status.
- Restrict the reset bookmark to slicers. Sort order remains part of each visual to avoid unstable bookmark state.

## Data limitations

- Source records are synthetic.
- Dates are deterministic simulations.
- The source does not identify a currency.
- Product cost, margin, lead time, service level, returns, and demand forecasts are unavailable.
- Inventory targets are illustrative and require replacement by a validated production policy before operational use.

## Privacy and security

- No credentials or local paths are embedded in the report source.
- Synthetic names, email addresses, and phone fields are hidden and are not used in report visuals.
- Local Power BI caches, PBIX files, environment files, workflow backups, and editor settings are excluded from version control.
