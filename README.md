# LuminaFlow Operational Analytics

[English](README.md) | [Português](README.pt-BR.md)

An operational Power BI portfolio case for commercial performance and inventory prioritization. The report turns synthetic public API data into a governed semantic model and a decision-oriented executive overview.

![Operational Overview](assets/screenshots/operational-overview.png)

## Business problem

Commercial and operations managers need one screen to understand revenue concentration, compare commercial segments, and identify products requiring replenishment. The page follows a decision path:

`Situation -> Exception -> Cause -> Detail -> Action`

## What the dashboard answers

- What is the latest simulated-period net revenue, order volume, units sold, active client count, average order value, and weighted discount rate?
- Which categories and client states concentrate net revenue?
- Which products lead revenue and volume?
- Which products are out of stock or below the documented replenishment target?

## Data and architecture

The model consumes the public synthetic endpoints `products`, `users`, and `carts` from [DummyJSON](https://dummyjson.com/). Power Query performs ingestion and shaping inside the PBIP project.

```text
DummyJSON APIs -> Power Query -> Star schema -> DAX measures -> PBIR report
```

- `SalesLines`: one row per product line inside a cart.
- `Products`: one row per product.
- `Clients`: one row per synthetic client.
- `Calendar`: deterministic simulated operational dates because carts do not include transaction dates.

See [data model](docs/data-model.md) and [metric dictionary](docs/metrics.md).

## Inventory policy

The source has current stock but no forecast, lead time, service level, or official target. The portfolio therefore uses a transparent demonstration heuristic:

```text
Target Stock = max(10, round up(Units Sold * 1.25))
Reorder Qty  = max(0, Target Stock - Current Stock)
```

Status is calculated, not hardcoded:

- `Out of Stock`: current stock equals zero.
- `Low Stock`: current stock is below target.
- `Healthy`: current stock meets or exceeds target.

## Run locally

1. Install Power BI Desktop with PBIP/PBIR preview support enabled.
2. Open `power_bi/LuminaFlow.pbip`.
3. Allow access to `https://dummyjson.com` when prompted.
4. Refresh the model and open `Operational Overview`.

The included screenshot documents the approved snapshot. API refreshes may change source values.

## Quality controls

- Explicit DAX measures for visible KPIs.
- Single-direction relationships from dimensions to the fact table.
- Revenue reconciliation between gross revenue, discount value, and net revenue.
- No KPI values or comparison percentages written directly in the visual layout.
- Synthetic personal attributes remain hidden from report consumers.
- Reset bookmark is restricted to slicers; visual sort order remains owned by each visual.
- PBIR validation and Power BI Desktop rendering checks completed before portfolio approval.

## Limitations

- DummyJSON contains synthetic demonstration data, not company transactions.
- Operational dates are deterministic simulations and must not be interpreted as real chronology.
- Currency is displayed as `$` because the source does not declare BRL.
- Margin, purchasing cost, lead time, service level, returns, and demand forecasting are unavailable.
- The inventory target is a documented portfolio heuristic, not a production replenishment policy.

## Repository structure

```text
power_bi/   Versionable PBIP, PBIR, and TMDL source
scripts/    Deterministic report builder
docs/       Data model, metrics, decisions, and limitations
assets/     Approved portfolio screenshot
```

## Interview summary

This case demonstrates requirements framing, Power Query ingestion, dimensional modeling, DAX governance, conditional formatting, inventory exception design, PBIR source control, and visual QA. The main design decision was to favor actionable stock comparisons over descriptive fields that do not support replenishment decisions.

## License

Repository code and authored assets are available under the MIT License. Third-party API data remains subject to the source terms.
