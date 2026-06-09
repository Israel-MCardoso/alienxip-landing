import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const scanRoots = ["src", "index.html", "vite.config.ts", "package.json"];
const textExtensions = new Set([".css", ".html", ".js", ".jsx", ".json", ".ts", ".tsx"]);
const blockedPatterns = [
  { name: "console.log debug output", pattern: /\bconsole\.(log|group|groupEnd|debug|trace)\s*\(/ },
  { name: "debugger statement", pattern: /\bdebugger\b/ },
  { name: "critical TODO marker", pattern: /\b(TODO|FIXME|HACK|XXX)\b/i },
  { name: "hardcoded private credential marker", pattern: /(SUPABASE_SERVICE_ROLE_KEY|PRIVATE_KEY|CLIENT_SECRET|WEBHOOK_SECRET|DATABASE_URL)\s*[:=]\s*['"][^'"]+/i },
];

function extensionOf(path) {
  const match = path.match(/\.[^.]+$/);
  return match ? match[0] : "";
}

function collectFiles(path, files = []) {
  const absolutePath = join(root, path);
  const stats = statSync(absolutePath);

  if (stats.isDirectory()) {
    for (const entry of readdirSync(absolutePath)) {
      collectFiles(join(path, entry), files);
    }
    return files;
  }

  if (textExtensions.has(extensionOf(path))) {
    files.push(path);
  }

  return files;
}

const failures = [];
const files = scanRoots.flatMap((path) => collectFiles(path));

for (const file of files) {
  const content = readFileSync(join(root, file), "utf8");
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const blocked of blockedPatterns) {
      if (blocked.pattern.test(line)) {
        failures.push(`${relative(root, join(root, file))}:${index + 1} - ${blocked.name}`);
      }
    }
  });
}

if (failures.length > 0) {
  console.error("Production lint failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Production lint passed: ${files.length} files scanned.`);
