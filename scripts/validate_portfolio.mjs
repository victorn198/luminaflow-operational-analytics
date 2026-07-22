import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const required = [
  "power_bi/LuminaFlow.pbip",
  "power_bi/LuminaFlow.Report/definition.pbir",
  "power_bi/LuminaFlow.Report/definition/pages/pages.json",
  "power_bi/LuminaFlow.SemanticModel/definition/model.tmdl",
  "power_bi/LuminaFlow.SemanticModel/definition/relationships.tmdl",
  "assets/screenshots/operational-overview.png",
  "docs/data-model.md",
  "docs/metrics.md",
];

const failures = [];
for (const relative of required) {
  if (!fs.existsSync(path.join(root, relative))) failures.push(`Missing required file: ${relative}`);
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const reportRoot = path.join(root, "power_bi", "LuminaFlow.Report");
for (const file of walk(reportRoot).filter((item) => item.endsWith(".json"))) {
  try {
    JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    failures.push(`Invalid JSON: ${path.relative(root, file)} (${error.message})`);
  }
}

const forbidden = walk(path.join(root, "power_bi")).filter((file) =>
  ["cache.abf", "localSettings.json"].includes(path.basename(file)) || file.includes(`${path.sep}.pbi${path.sep}`),
);
for (const file of forbidden) failures.push(`Local Power BI state must not be published: ${path.relative(root, file)}`);

const pbip = JSON.parse(fs.readFileSync(path.join(root, "power_bi", "LuminaFlow.pbip"), "utf8"));
if (pbip.artifacts?.[0]?.report?.path !== "LuminaFlow.Report") {
  failures.push("LuminaFlow.pbip does not reference the canonical report folder");
}

const screenshot = path.join(root, "assets", "screenshots", "operational-overview.png");
if (fs.existsSync(screenshot) && fs.statSync(screenshot).size < 100_000) {
  failures.push("Approved screenshot is unexpectedly small");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Portfolio validation passed: ${required.length} required artifacts and valid PBIR JSON.`);
