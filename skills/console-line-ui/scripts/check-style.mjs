#!/usr/bin/env node
// console-line-ui linter: flags what falls outside the style's hard boundaries.
// Usage: node check-style.mjs <file-or-dir> [...more]   (exits 1 on any error-level finding)
// Scans .css .scss .less .html .tsx .jsx .ts .js .vue .svelte; skips node_modules, dist, build, vendored hairline kernel.
// Silence one line with a trailing comment containing "line-ui-allow: <reason>".
import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, basename } from "node:path";

const EXT = new Set([".css", ".scss", ".less", ".html", ".tsx", ".jsx", ".ts", ".js", ".vue", ".svelte"]);
const SKIP_DIR = new Set(["node_modules", "dist", "build", ".git", ".next", "coverage", "out"]);
const SKIP_FILE = /(^|[\\/])kernel\.js$|\.min\.(js|css)$|\.d\.ts$/;

// Every part of a border-radius value must be on the scale.
const RADIUS_OK = new Set(["0", "50%", "1rem", "4px", "0.2rem", "inherit", "var(--radius-control)", "var(--radius-panel)"]);
const radius = { test: (line) => [...line.matchAll(/border-radius\s*:\s*([^;"'`}]+)/gi)]
  .some((m) => m[1].trim().split(/\s+/).some((v) => !RADIUS_OK.has(v))) };

// [id, level, regex-or-{test}, message]. Order matters only for output.
const RULES = [
  ["B1", "error", /box-shadow\s*:(?!\s*(none\b|inset\s+0\s+0\s+0\s+1px\s+var\(--(line|ink-faint)\)))[^;"'`}]+/i, "box-shadow other than the inset hairline ring: use a 1px --line border"],
  ["B1", "error", /\bdrop-shadow\(|\btext-shadow\s*:(?!\s*none)/i, "shadow/glow: depth is a line, never a shadow"],
  ["B1", "error", /\bshadow-(sm|md|lg|xl|2xl|inner)\b/, "Tailwind shadow utility: use border border-line"],
  ["B2", "error", /\b(linear|radial|conic)-gradient\(/i, "gradient: only the kill-switch guard stripe may use one"],
  ["B2", "error", /\bbg-gradient-to-|\bfrom-\w+-\d{2,3}\b/, "Tailwind gradient utility"],
  ["B3", "error", /backdrop-filter|\bbackdrop-blur|\bfilter\s*:\s*blur/i, "blur/glass: use an opaque --surface with a line"],
  ["B4", "error", /(?<![\w&-])#[0-9a-fA-F]{3,8}\b(?![\w-])|\brgba?\(\s*\d|\bhsla?\(\s*\d/, "colour literal outside the token blocks: use var(--token)"],
  ["B4", "error", /\b(bg|text|border|ring|fill|stroke|from|to|via)-(red|blue|green|yellow|indigo|purple|pink|orange|amber|emerald|teal|cyan|sky|violet|fuchsia|rose|lime|slate|gray|zinc|neutral|stone)-\d{2,3}\b/, "Tailwind palette colour: map tokens (references/tokens.md)"],
  ["B8", "error", /fonts\.googleapis|fonts\.gstatic|@font-face|use\.typekit|font-awesome|material-icons|material-symbols/i, "web/icon font: use the system --font/--mono stacks"],
  ["B8", "error", /font-family\s*:\s*["']?(Inter|Roboto|Poppins|Montserrat|Open Sans|Lato|Nunito|Geist|Manrope|DM Sans|Plus Jakarta)/i, "named web font: use var(--font) / var(--mono)"],
  ["B9", "error", /font-weight\s*:\s*(bold|bolder|[7-9]00)\b|\bfont-(bold|extrabold|black)\b/, "weight 700+: use 400 or 500 (600 only for the wordmark)"],
  ["B10", "error", /text-transform\s*:\s*(uppercase|capitalize)|\b(uppercase|capitalize)\b(?=[^"'`]*["'`])/, "uppercase/capitalize: labels are lower-case mono"],
  ["B11", "warn", radius, "radius off the scale: 8px control, 14px panel, 1rem pill, 50% dot"],
  ["B11", "warn", /\brounded-(sm|md|lg|xl|2xl|3xl)\b/, "Tailwind radius off the scale: rounded-control / rounded-panel / rounded-pill"],
  ["B12", "error", /border(-(top|right|bottom|left))?(-width)?\s*:\s*([2-9]|\d{2,})px|\bborder-[2-8]\b/, "border thicker than 1px: emphasise by colour (ink), not width"],
  ["B13", "warn", /from\s+["'](lucide-react|react-icons|@heroicons|@mui\/icons-material|@tabler\/icons|phosphor-react|@fortawesome)/, "icon library import: the style uses words, not icons"],
  ["B13", "warn", /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u, "emoji in UI"],
  ["B14", "warn", /\banimate-(spin|pulse|bounce|ping)\b|@keyframes\s+(spin|pulse|bounce|shimmer|skeleton)|class(Name)?=["'][^"']*\b(spinner|skeleton)\b/, "spinner/skeleton/pulse: use 'Loading …' text"],
  ["B14", "warn", /cubic-bezier\([^)]*-\d|cubic-bezier\(\s*[\d.]+\s*,\s*[1-9]/, "overshooting/bouncy easing in UI chrome"],
  ["B17", "warn", /\b(toast|snackbar|react-hot-toast|sonner|notistack)\b/i, "toast/snackbar: use inline role=status text or an error-note"],
  ["B20", "warn", />[^<>{}]*![\s]*</, "exclamation mark in UI copy"],
];

const files = [];
function walk(p) {
  const st = statSync(p);
  if (st.isDirectory()) {
    if (SKIP_DIR.has(basename(p))) return;
    for (const f of readdirSync(p)) walk(join(p, f));
  } else if (EXT.has(extname(p)) && !SKIP_FILE.test(p)) files.push(p);
}
const args = process.argv.slice(2);
if (!args.length) { console.error("usage: node check-style.mjs <file-or-dir> [...]"); process.exit(2); }
for (const a of args) walk(a);

let errors = 0, warns = 0, primaryHits = new Map();
for (const f of files) {
  const lines = readFileSync(f, "utf8").split("\n");
  // Token blocks are where literals belong: skip lines inside :root / [data-theme] blocks of stylesheets.
  let inTokens = false, depth = 0;
  lines.forEach((line, i) => {
    if (/^\s*(:root|@media \(prefers-color-scheme)/.test(line)) inTokens = true;
    if (inTokens) {
      depth += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
      if (depth <= 0 && /}/.test(line)) { inTokens = false; depth = 0; }
      return;
    }
    if (/line-ui-allow:/.test(line)) return;
    if (/kill-switch-guard|repeating-linear-gradient\(-45deg/.test(line) && /gradient/.test(line)) return; // the one allowed gradient
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comments
    for (const [id, level, re, msg] of RULES) {
      if (id === "B4" && /<svg|favicon|data:image\/svg/.test(line)) continue; // brand favicon literal
      if (id === "B4" && /--scrim|::backdrop/.test(line)) continue;
      if (re.test(line)) {
        level === "error" ? errors++ : warns++;
        console.log(`${f}:${i + 1}  ${level.padEnd(5)} ${id}  ${msg}\n    ${line.trim().slice(0, 140)}`);
      }
    }
    const n = (line.match(/button--primary/g) || []).length;
    if (n && !/\.button--primary/.test(line)) primaryHits.set(f, (primaryHits.get(f) || 0) + n);
  });
}
for (const [f, n] of primaryHits) {
  if (n > 2) { warns++; console.log(`${f}  warn  B18  ${n} primary buttons in one file: is there one primary action per view?`); }
}
console.log(`\n${files.length} files · ${errors} errors · ${warns} warnings`);
process.exit(errors ? 1 : 0);
