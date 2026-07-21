# LuminaFlow Operational Analytics

[English](README.md) | [Português](README.pt-BR.md)

Case de portfólio em Power BI para desempenho comercial e priorização de estoque. O relatório transforma dados sintéticos de uma API pública em modelo semântico governado e visão executiva orientada a decisões.

![Visão operacional](assets/screenshots/operational-overview.png)

## Problema de negócio

Gestores comerciais e operacionais precisam entender, em uma única tela, a concentração de receita e os produtos que exigem reposição. A página segue o fluxo:

`Situação -> Exceção -> Causa -> Detalhe -> Ação`

## Perguntas respondidas

- Qual é a receita líquida, volume de pedidos, unidades vendidas, clientes ativos, ticket médio e desconto ponderado do último período simulado?
- Quais categorias e estados de clientes concentram receita?
- Quais produtos lideram receita e volume?
- Quais produtos estão sem estoque ou abaixo da meta documentada?

## Dados e arquitetura

O modelo consome os endpoints sintéticos públicos `products`, `users` e `carts` da [DummyJSON](https://dummyjson.com/). O Power Query realiza ingestão e tratamento dentro do projeto PBIP.

```text
APIs DummyJSON -> Power Query -> Modelo estrela -> Medidas DAX -> Relatório PBIR
```

- `SalesLines`: uma linha por produto dentro de um carrinho.
- `Products`: uma linha por produto.
- `Clients`: uma linha por cliente sintético.
- `Calendar`: datas operacionais simuladas deterministicamente, pois os carrinhos não possuem data transacional.

Consulte o [modelo de dados](docs/data-model.md) e o [dicionário de métricas](docs/metrics.md).

## Política de estoque

A fonte possui estoque atual, mas não fornece previsão, lead time, nível de serviço ou meta oficial. Por isso, o case utiliza uma heurística de demonstração transparente:

```text
Target Stock = max(10, arredondar para cima(Units Sold * 1,25))
Reorder Qty  = max(0, Target Stock - Current Stock)
```

O status é calculado, não escrito manualmente:

- `Out of Stock`: estoque atual igual a zero.
- `Low Stock`: estoque atual abaixo da meta.
- `Healthy`: estoque atual igual ou superior à meta.

## Execução local

1. Instale o Power BI Desktop com suporte a PBIP/PBIR habilitado.
2. Abra `power_bi/LuminaFlow.pbip`.
3. Autorize o acesso a `https://dummyjson.com` quando solicitado.
4. Atualize o modelo e abra `Operational Overview`.

A imagem incluída documenta o snapshot aprovado. Atualizações da API podem alterar os valores.

## Controles de qualidade

- Medidas DAX explícitas para os KPIs visíveis.
- Relacionamentos unidirecionais das dimensões para a tabela fato.
- Reconciliação entre receita bruta, desconto e receita líquida.
- Nenhum KPI ou percentual comparativo escrito diretamente no layout.
- Atributos pessoais sintéticos permanecem ocultos para consumidores do relatório.
- Bookmark de reset restrito aos slicers; a ordenação pertence aos próprios visuais.
- Validação PBIR e inspeção no Power BI Desktop concluídas antes da aprovação.

## Limitações

- DummyJSON contém dados sintéticos, não transações empresariais.
- As datas operacionais são simulações determinísticas e não representam cronologia real.
- A moeda permanece `$`, pois a fonte não declara BRL.
- Margem, custo de compra, lead time, nível de serviço, devoluções e previsão de demanda não estão disponíveis.
- A meta de estoque é uma heurística documentada de portfólio, não uma política de produção.

## Estrutura

```text
power_bi/   Fontes versionáveis PBIP, PBIR e TMDL
scripts/    Gerador determinístico do relatório
docs/       Modelo, métricas, decisões e limitações
assets/     Captura aprovada do portfólio
```

## Resumo para entrevista

O case demonstra levantamento de requisitos, ingestão com Power Query, modelagem dimensional, governança DAX, formatação condicional, desenho de exceções de estoque, versionamento PBIR e QA visual. A principal decisão foi priorizar comparações acionáveis de estoque em vez de atributos descritivos que não orientam reposição.

## Licença

O código e os materiais autorais usam licença MIT. Os dados retornados pela API permanecem sujeitos aos termos da fonte.
