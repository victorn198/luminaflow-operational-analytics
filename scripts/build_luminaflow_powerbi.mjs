import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const reportRoot = path.join(root, "power_bi", "LuminaFlow.Report");
const definitionRoot = path.join(reportRoot, "definition");
const pageId = "75493e09bc3089984a91";
const pageRoot = path.join(definitionRoot, "pages", pageId);
const visualsRoot = path.join(pageRoot, "visuals");
const finalLogoName = "luminaflow-logo-image2.svg";

const ids = {
  netRevenue: "83cd64ffab2c5082c3d4",
  orders: "b6f09722de5f83b5f607",
  units: "94de7500bc3d6193d4e5",
  aov: "1a2b3c4d5e6f708192a3",
  clients: "2b3c4d5e6f708192a3b4",
  discount: "a5ef8611cd4e72a4e5f6",
  categoryChart: "c701a833ef6084c60718",
  stateChart: "d812b944f07195d71829",
  topProducts: "e923ca55a182a6e8293a",
  inventory: "3d4e5f60718293a4b5c6",
  obsoleteTable: "4e5f60718293a4b5c6d7",
  logo: "5f60718293a4b5c6d7e8",
  title: "61ab42fede0a3e60a1b2",
  subtitle: "72bc53efea1b4f71b2c3",
  reset: "c0d1e2f3a4b5c6d7e8f9",
  categorySlicer: "11111111111111111111",
  brandSlicer: "22222222222222222222",
  stateSlicer: "33333333333333333333",
  departmentSlicer: "44444444444444444444",
  source: "55555555555555555555",
};

const obsoleteTextboxes = [
  "f034db66b293b7f93a4b",
  "f145ec77c3a4c8094b5c",
  "f256fd88d4b5d91a5c6d",
  "f3670e99e5c6ea2b6d7e",
];

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
};
const visualPath = (id) => path.join(visualsRoot, id, "visual.json");
const lit = (value) => ({ expr: { Literal: { Value: value } } });
const textLit = (value) => lit(`'${value.replaceAll("'", "''")}'`);
const color = (hex) => ({ solid: { color: textLit(hex) } });
const column = (table, property) => ({
  field: { Column: { Expression: { SourceRef: { Entity: table } }, Property: property } },
  queryRef: `${table}.${property}`,
  nativeQueryRef: property,
});
const measure = (table, property) => ({
  field: { Measure: { Expression: { SourceRef: { Entity: table } }, Property: property } },
  queryRef: `${table}.${property}`,
  nativeQueryRef: property,
});

function position(x, y, width, height, z, tabOrder) {
  return { x, y, z, height, width, tabOrder };
}

function cleanContainer({ title = null, padding = 12 } = {}) {
  const vco = {
    background: [{ properties: { show: lit("true"), color: color("#FFFFFF"), transparency: lit("0D") } }],
    border: [{ properties: { show: lit("true"), color: color("#DCE5F0"), width: lit("1D"), radius: lit("6D") } }],
    visualHeader: [{ properties: { show: lit("false") } }],
    dropShadow: [{ properties: { show: lit("false") } }],
    padding: [{ properties: { top: lit(`${padding}D`), bottom: lit(`${padding}D`), left: lit(`${padding}D`), right: lit(`${padding}D`) } }],
  };
  if (title) {
    vco.title = [{ properties: {
      show: lit("true"), text: textLit(title), fontFamily: textLit("Segoe UI Semibold"),
      fontSize: lit("11D"), fontColor: color("#103A73"), alignment: textLit("left"),
    } }];
  }
  return vco;
}

function setTextbox(id, { text, x, y, width, height, fontSize, colorHex, fontFamily = "Segoe UI", z = 100 }) {
  const json = readJson(visualPath(id));
  json.position = position(x, y, width, height, z, z);
  json.visual.objects.general[0].properties.paragraphs = [{ textRuns: [{
    value: text,
    textStyle: { fontFamily, fontSize: `${fontSize}px`, color: colorHex },
  }] }];
  json.visual.visualContainerObjects = {
    background: [{ properties: { show: lit("false") } }],
    border: [{ properties: { show: lit("false") } }],
    padding: [{ properties: { top: lit("0D"), bottom: lit("0D"), left: lit("0D"), right: lit("0D") } }],
  };
  json.isHidden = false;
  writeJson(visualPath(id), json);
}

function createTextbox(id, options) {
  const source = readJson(visualPath(ids.subtitle));
  source.name = id;
  writeJson(visualPath(id), source);
  setTextbox(id, options);
}

function setCard(id, { label, field, deltaField, deltaColorField, x, formatString, displayUnits = 0, precision = 0 }) {
  const json = readJson(visualPath(id));
  const metadata = field.queryRef;
  const selectorId = `field-${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(0, 12)}`;
  json.position = position(x, 192, 240, 136, 20000, 20000 + x);
  json.visual.query = { queryState: { Data: { projections: [field] } } };
  json.visual.objects = {
    value: [{ selector: { id: "default" }, properties: {
      fontFamily: textLit("Segoe UI Semibold"), fontSize: lit("19D"), fontColor: color("#103A73"),
      customFormatString: textLit(formatString), horizontalAlignment: textLit("left"),
      labelDisplayUnits: lit(`${displayUnits}D`), labelPrecision: lit(`${precision}D`),
      transparency: lit("0D"), textWrap: lit("false"),
    } }],
    outline: [{ selector: { id: "default" }, properties: { show: lit("false") } }],
    label: [{ selector: { id: "default" }, properties: {
      show: lit("false"), text: textLit(label),
    } }],
    fillCustom: [{ properties: { show: lit("false") } }],
    layout: [
      { selector: { id: "default" }, properties: {
        backgroundShow: lit("true"), topOuterMargin: lit("0L"), bottomOuterMargin: lit("0L"),
        leftOuterMargin: lit("0L"), rightOuterMargin: lit("0L"), paddingUniform: lit("6L"),
      } },
      { properties: { alignment: textLit("top"), calloutSize: lit("52D"), contentOrder: textLit("callout_image_referenceLabel") } },
    ],
    cardCalloutArea: [{ selector: { id: "default" }, properties: {
      paddingIndividual: lit("true"), paddingTop: lit("0D"), paddingBottom: lit("0D"),
      paddingLeft: lit("0D"), paddingRight: lit("0D"),
    } }],
    referenceLabel: [
      {
        properties: { value: { expr: deltaField.field } },
        selector: { data: [{ dataViewWildcard: { matchingOption: 0 } }], metadata, id: selectorId },
      },
      { selector: { id: "default" }, properties: {
        backgroundShow: lit("false"), paddingIndividual: lit("true"), paddingTop: lit("0D"),
        paddingBottom: lit("0D"), paddingLeft: lit("0D"), paddingRight: lit("0D"),
      } },
    ],
    referenceLabelValue: [{ selector: { metadata }, properties: {
      show: lit("true"), valueFontFamily: textLit("Segoe UI Semibold"), valueFontSize: lit("9D"),
      valueFontColor: { solid: { color: { expr: deltaColorField.field } } },
      valueDisplayUnits: lit("0D"), valuePrecision: lit("1D"), valueTransparency: lit("0D"),
      showBlankAs: textLit("--"), textWrap: lit("false"),
    } }],
    referenceLabelTitle: [{ selector: { metadata }, properties: {
      show: lit("true"), titleText: textLit("vs. previous month"), titleContentType: textLit("custom"),
      titleFontFamily: textLit("Segoe UI"), titleFontSize: lit("8D"), titleFontColor: color("#66788A"),
      titleTransparency: lit("0D"), textWrap: lit("false"),
    } }],
    referenceLabelDetail: [{ selector: { metadata }, properties: { show: lit("false"), showBlankAs: textLit("--") } }],
    referenceLabelLayout: [{ selector: { id: "default" }, properties: {
      position: textLit("below"), horizontalAlignment: textLit("left"),
    } }],
  };
  json.visual.visualContainerObjects = cleanContainer({ title: label, padding: 8 });
  json.isHidden = false;
  writeJson(visualPath(id), json);
}

function createSlicer(id, { table, property, label, x }) {
  const json = {
    $schema: "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.10.0/schema.json",
    name: id,
    position: position(x, 96, 280, 80, 10000, 10000 + x),
    visual: {
      visualType: "slicer",
      query: { queryState: { Values: { projections: [column(table, property)] } } },
      objects: {
        data: [{ properties: { mode: textLit("Dropdown") } }],
        header: [{ properties: {
          show: lit("true"), text: textLit(label), fontFamily: textLit("Segoe UI Semibold"),
          textSize: lit("10D"), fontColor: color("#103A73"),
        } }],
        items: [{ properties: { fontFamily: textLit("Segoe UI"), textSize: lit("9D"), fontColor: color("#344054") } }],
      },
      visualContainerObjects: cleanContainer({ padding: 0 }),
    },
    isHidden: false,
  };
  writeJson(visualPath(id), json);
}

function topNFilter({ table, property, alias, top }) {
  const categoryColumn = { Column: { Expression: { SourceRef: { Source: alias } }, Property: property } };
  const suffix = { Category: "1", State: "2", "Product Name": "3" }[property] ?? "9";
  return {
    name: `Filter${"0".repeat(23)}${suffix}`,
    field: { Column: { Expression: { SourceRef: { Entity: table } }, Property: property } },
    type: "TopN",
    filter: {
      Version: 2,
      From: [
        {
          Name: "subquery",
          Expression: { Subquery: { Query: {
            Version: 2,
            From: [
              { Name: alias, Entity: table, Type: 0 },
              { Name: "s", Entity: "SalesLines", Type: 0 },
            ],
            Select: [{ Column: categoryColumn.Column, Name: "field" }],
            OrderBy: [{
              Direction: 2,
              Expression: { Aggregation: { Expression: { Column: { Expression: { SourceRef: { Source: "s" } }, Property: "NetRevenue" } }, Function: 0 } },
            }],
            Top: top,
          } } },
          Type: 2,
        },
        { Name: alias, Entity: table, Type: 0 },
      ],
      Where: [{ Condition: { In: { Expressions: [categoryColumn], Table: { SourceRef: { Source: "subquery" } } } } }],
    },
    howCreated: "User",
  };
}

function rangeFilter({ table, property, alias, lower, upper }) {
  return {
    name: `FilterRange${property.replace(/[^A-Za-z0-9]/g, "").padEnd(16, "0").slice(0, 16)}`,
    field: { Column: { Expression: { SourceRef: { Entity: table } }, Property: property } },
    type: "Advanced",
    filter: {
      Version: 2,
      From: [{ Name: alias, Entity: table, Type: 0 }],
      Where: [{ Condition: { Between: {
        Expression: { Column: { Expression: { SourceRef: { Source: alias } }, Property: property } },
        LowerBound: { Literal: { Value: `${lower}L` } },
        UpperBound: { Literal: { Value: `${upper}L` } },
      } } }],
    },
    howCreated: "User",
  };
}

function setChart(id, { title, category, x, width, top, alias }) {
  const json = readJson(visualPath(id));
  json.position = position(x, 344, width, 288, 30000, 30000 + x);
  json.visual.query = {
    queryState: {
      Category: { projections: [{ ...category, active: true }] },
      Y: { projections: [measure("SalesLines", "Net Revenue")] },
    },
    sortDefinition: { sort: [{ field: measure("SalesLines", "Net Revenue").field, direction: "Descending" }], isDefaultSort: false },
  };
  delete json.visual.filterConfig;
  json.filterConfig = { filters: [topNFilter({
    table: category.field.Column.Expression.SourceRef.Entity,
    property: category.field.Column.Property,
    alias,
    top,
  })] };
  json.visual.objects = {
    categoryAxis: [{ properties: {
      fontFamily: textLit("Segoe UI"), fontSize: lit("9D"), labelColor: color("#66788A"),
      showAxisTitle: lit("false"), preferredCategoryWidth: lit("12D"), innerPadding: lit("25D"),
    } }],
    valueAxis: [{ properties: {
      show: lit("true"), fontFamily: textLit("Segoe UI"), fontSize: lit("9D"), labelColor: color("#66788A"),
      gridlineShow: lit("true"), gridlineColor: color("#E9EEF5"), showAxisTitle: lit("false"),
    } }],
    legend: [{ properties: { show: lit("false") } }],
    dataPoint: [{ properties: { defaultColor: color("#1676D2"), borderShow: lit("false") } }],
    labels: [{ properties: {
      show: lit("true"), color: color("#103A73"), fontFamily: textLit("Segoe UI Semibold"),
      fontSize: lit("9D"), labelPosition: textLit("OutsideEnd"), labelDisplayUnits: lit("1000D"), labelPrecision: lit("0D"),
    } }],
  };
  json.visual.visualContainerObjects = cleanContainer({ title, padding: 12 });
  json.isHidden = false;
  writeJson(visualPath(id), json);
}

function setTable(id, { title, fields, x, width, sortField, direction = "Descending", topFilter = null, extraFilters = [], conditionalFontColors = [] }) {
  const json = readJson(visualPath(id));
  json.position = position(x, 640, width, 228, 30000, 40000 + x);
  json.visual.query = {
    queryState: { Values: { projections: fields } },
    sortDefinition: { sort: [{ field: sortField.field, direction }], isDefaultSort: false },
  };
  delete json.filterConfig;
  const filters = [...extraFilters];
  if (topFilter) filters.unshift(topNFilter(topFilter));
  if (filters.length) json.filterConfig = { filters };
  json.visual.objects = {
    columnHeaders: [{ properties: {
      columnAdjustment: textLit("growToFit"), autoSizeColumnWidth: lit("true"), wordWrap: lit("true"),
      fontFamily: textLit("Segoe UI Semibold"), fontSize: lit("8D"), fontColor: color("#103A73"),
      backColor: color("#F2F6FB"),
    } }],
    values: [{ properties: {
      fontFamily: textLit("Segoe UI"), fontSize: lit("8D"), fontColorPrimary: color("#344054"),
      backColorPrimary: color("#FFFFFF"), backColorSecondary: color("#F8FAFC"),
    } }],
    total: [{ properties: { totals: lit("false") } }],
    grid: [{ properties: { gridHorizontal: lit("true"), gridHorizontalColor: color("#E9EEF5"), gridVertical: lit("false"), rowPadding: lit("0D"), textSize: lit("7D") } }],
  };
  for (const { target, colorField } of conditionalFontColors) {
    json.visual.objects.values.push({
      properties: { fontColor: { solid: { color: { expr: colorField.field } } } },
      selector: { data: [{ dataViewWildcard: { matchingOption: 1 } }], metadata: target.queryRef },
    });
  }
  json.visual.visualContainerObjects = { ...cleanContainer({ title, padding: 8 }), stylePreset: [{ properties: { name: textLit("None") } }] };
  json.isHidden = false;
  writeJson(visualPath(id), json);
}

function setResetNavigator() {
  const json = readJson(visualPath(ids.reset));
  json.position = position(1216, 96, 352, 80, 10000, 11216);
  json.isHidden = false;
  json.visual.objects.fill[0].properties.fillColor = color("#EAF3FC");
  json.visual.objects.fill[0].properties.transparency = lit("0D");
  json.visual.objects.outline[0].properties.lineColor = color("#B7D3EE");
  json.visual.objects.text[0].properties.fontColor = color("#103A73");
  json.visual.objects.text[0].properties.fontFamily = textLit("Segoe UI Semibold");
  json.visual.objects.shape[0].properties.tileShape = textLit("rectangleRoundedByPixel");
  json.visual.objects.shape[0].properties.roundEdge = lit("6L");
  json.visual.objects.bookmarks[0].properties.bookmarkGroup = textLit("reset_controls");
  json.visual.objects.bookmarks[0].properties.selectedBookmark = textLit("reset_filters");
  writeJson(visualPath(ids.reset), json);
}

function updateTheme() {
  const themeName = "LuminaFlowClean.json";
  const theme = {
    name: "LuminaFlowClean.json",
    dataColors: ["#1676D2", "#20B8C5", "#103A73", "#60A5FA", "#94A3B8", "#F59E0B", "#DC2626"],
    background: "#F7F9FC",
    foreground: "#103A73",
    tableAccent: "#1676D2",
    textClasses: {
      title: { fontFace: "Segoe UI Semibold", color: "#103A73" },
      header: { fontFace: "Segoe UI Semibold", color: "#103A73" },
      label: { fontFace: "Segoe UI", color: "#344054" },
      callout: { fontFace: "Segoe UI Semibold", color: "#103A73" },
    },
    visualStyles: {
      "*": { "*": {
        visualHeader: [{ show: false }],
        background: [{ show: true, color: { solid: { color: "#FFFFFF" } }, transparency: 0 }],
        border: [{ show: true, color: { solid: { color: "#DCE5F0" } }, radius: 6, width: 1 }],
        dropShadow: [{ show: false }],
      } },
      slicer: { "*": {
        header: [{ fontFamily: "Segoe UI Semibold", textSize: 10, fontColor: { solid: { color: "#103A73" } } }],
        items: [{ fontFamily: "Segoe UI", textSize: 9, fontColor: { solid: { color: "#344054" } } }],
      } },
    },
  };
  writeJson(path.join(reportRoot, "StaticResources", "RegisteredResources", themeName), theme);

  const report = readJson(path.join(definitionRoot, "report.json"));
  report.themeCollection.customTheme.name = themeName;
  const registered = report.resourcePackages.find((item) => item.name === "RegisteredResources");
  registered.items = registered.items.filter((item) => item.type !== "CustomTheme");
  registered.items.unshift({ name: themeName, path: themeName, type: "CustomTheme" });
  registered.items = registered.items.filter((item) => item.name !== finalLogoName);
  registered.items.push({ name: finalLogoName, path: finalLogoName, type: "Image" });
  writeJson(path.join(definitionRoot, "report.json"), report);
}

function updatePage() {
  const file = path.join(pageRoot, "page.json");
  const page = readJson(file);
  page.displayName = "Operational Overview";
  page.objects.background[0].properties.color = color("#F7F9FC");
  page.objects.outspace[0].properties.color = color("#F7F9FC");
  writeJson(file, page);
}

function updateHeader() {
  const logo = readJson(visualPath(ids.logo));
  logo.position = position(32, 20, 180, 56, 100, 100);
  logo.visual.objects.general[0].properties.imageUrl.expr.ResourcePackageItem.ItemName = finalLogoName;
  logo.isHidden = false;
  writeJson(visualPath(ids.logo), logo);

  setTextbox(ids.title, {
    text: "Operational Analytics",
    x: 232, y: 18, width: 700, height: 40, fontSize: 23,
    colorHex: "#103A73", fontFamily: "Segoe UI Semibold", z: 110,
  });
  setTextbox(ids.subtitle, {
    text: "Latest simulated month KPIs vs. prior month | full-history commercial rankings",
    x: 232, y: 54, width: 760, height: 22, fontSize: 11,
    colorHex: "#66788A", z: 111,
  });
  createTextbox(ids.source, {
    text: "Source: DummyJSON public API | deterministic simulated order dates",
    x: 1040, y: 38, width: 528, height: 22, fontSize: 10,
    colorHex: "#66788A", z: 112,
  });
}

function updateBookmarks() {
  const bookmarksRoot = path.join(definitionRoot, "bookmarks");
  for (const name of ["overview_default", "product_focus", "geography_focus"]) {
    fs.rmSync(path.join(bookmarksRoot, `${name}.bookmark.json`), { force: true });
  }
  writeJson(path.join(bookmarksRoot, "bookmarks.json"), {
    $schema: "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/bookmarksMetadata/1.0.0/schema.json",
    items: [{ name: "reset_controls", displayName: "Controls", children: ["reset_filters"] }],
  });
  const slicers = [ids.categorySlicer, ids.brandSlicer, ids.stateSlicer, ids.departmentSlicer];
  const visualContainers = Object.fromEntries(slicers.map((id) => [id, {}]));
  writeJson(path.join(bookmarksRoot, "reset_filters.bookmark.json"), {
    $schema: "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/bookmark/2.1.0/schema.json",
    displayName: "Reset filters",
    name: "reset_filters",
    options: {
      applyOnlyToTargetVisuals: true,
      targetVisualNames: slicers,
      suppressActiveSection: true,
      suppressDisplay: true,
    },
    explorationState: { version: "1.0", activeSection: pageId, sections: { [pageId]: { visualContainers } } },
  });
}

updateTheme();
updatePage();
updateHeader();

setCard(ids.netRevenue, { label: "Net Revenue", field: measure("SalesLines", "Net Revenue Current Month"), deltaField: measure("SalesLines", "Net Revenue MoM"), deltaColorField: measure("SalesLines", "Net Revenue MoM Color"), x: 32, formatString: "$ #,##0", displayUnits: 1000 });
setCard(ids.orders, { label: "Orders", field: measure("SalesLines", "Orders Current Month"), deltaField: measure("SalesLines", "Orders MoM"), deltaColorField: measure("SalesLines", "Orders MoM Color"), x: 288, formatString: "#,##0" });
setCard(ids.units, { label: "Units Sold", field: measure("SalesLines", "Units Sold Current Month"), deltaField: measure("SalesLines", "Units Sold MoM"), deltaColorField: measure("SalesLines", "Units Sold MoM Color"), x: 544, formatString: "#,##0" });
setCard(ids.aov, { label: "Average Order Value", field: measure("SalesLines", "Average Order Value Current Month"), deltaField: measure("SalesLines", "Average Order Value MoM"), deltaColorField: measure("SalesLines", "Average Order Value MoM Color"), x: 800, formatString: "$ #,##0", displayUnits: 1000, precision: 1 });
setCard(ids.clients, { label: "Active Clients", field: measure("SalesLines", "Active Clients Current Month"), deltaField: measure("SalesLines", "Active Clients MoM"), deltaColorField: measure("SalesLines", "Active Clients MoM Color"), x: 1056, formatString: "#,##0" });
setCard(ids.discount, { label: "Weighted Discount Rate", field: measure("SalesLines", "Weighted Discount Rate Current Month"), deltaField: measure("SalesLines", "Weighted Discount Rate MoM"), deltaColorField: measure("SalesLines", "Weighted Discount Rate MoM Color"), x: 1312, formatString: "0.0%", precision: 1 });

createSlicer(ids.categorySlicer, { table: "Products", property: "Category", label: "Category", x: 32 });
createSlicer(ids.brandSlicer, { table: "Products", property: "Brand", label: "Brand", x: 328 });
createSlicer(ids.stateSlicer, { table: "Clients", property: "State", label: "Client State", x: 624 });
createSlicer(ids.departmentSlicer, { table: "Clients", property: "Department", label: "Department", x: 920 });
setResetNavigator();

setChart(ids.categoryChart, { title: "Net Revenue by Category", category: column("Products", "Category"), x: 32, width: 920, top: 10, alias: "p" });
setChart(ids.stateChart, { title: "Net Revenue by Client State", category: column("Clients", "State"), x: 968, width: 600, top: 8, alias: "c" });

setTable(ids.topProducts, {
  title: "Top Products",
  fields: [column("Products", "Product Name"), column("Products", "Category"), measure("SalesLines", "Net Revenue"), measure("SalesLines", "Units Sold"), measure("SalesLines", "Weighted Discount Rate")],
  x: 32, width: 920, sortField: measure("SalesLines", "Net Revenue"),
  topFilter: { table: "Products", property: "Product Name", alias: "p", top: 10 },
});
setTable(ids.inventory, {
  title: "Inventory Watch",
  fields: [column("Products", "Product Name"), measure("SalesLines", "Current Stock"), measure("SalesLines", "Target Stock"), measure("SalesLines", "Reorder Qty"), measure("SalesLines", "Stock Status")],
  x: 968, width: 600, sortField: measure("SalesLines", "Reorder Qty"), direction: "Descending",
  conditionalFontColors: [{ target: measure("SalesLines", "Stock Status"), colorField: measure("SalesLines", "Stock Status Color") }],
});

fs.rmSync(path.join(visualsRoot, ids.obsoleteTable), { recursive: true, force: true });
for (const id of obsoleteTextboxes) fs.rmSync(path.join(visualsRoot, id), { recursive: true, force: true });

updateBookmarks();

console.log("LuminaFlow Power BI report rebuilt from the approved specification.");
