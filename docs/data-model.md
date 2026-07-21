# Data model

## Grain and relationships

```mermaid
erDiagram
    PRODUCTS ||--o{ SALES_LINES : "ProductId"
    CLIENTS ||--o{ SALES_LINES : "ClientId"
    CALENDAR ||--o{ SALES_LINES : "OrderDate"

    PRODUCTS {
        int ProductId PK
        string ProductName
        string Category
        string Brand
        decimal UnitPrice
        int StockUnits
    }
    CLIENTS {
        int ClientId PK
        string State
        string Department
    }
    CALENDAR {
        date Date PK
        int Year
        int MonthNumber
    }
    SALES_LINES {
        int CartId
        int ProductId FK
        int ClientId FK
        date OrderDate FK
        int Quantity
        decimal GrossRevenue
        decimal NetRevenue
    }
```

- `SalesLines` is the fact table at product-line-in-cart grain.
- `Products`, `Clients`, and `Calendar` filter the fact table through one-to-many, single-direction relationships.
- Technical keys and synthetic personal fields are hidden from report consumers.

## Date caveat

DummyJSON carts do not provide transaction dates. `OrderDate` is generated deterministically from `CartId` to demonstrate period-aware DAX. It is explicitly labeled as simulated operational time and is unsuitable for real trend claims.
