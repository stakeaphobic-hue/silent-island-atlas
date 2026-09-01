#!/usr/bin/env node
import { copyFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const client = join(process.cwd(), "dist/client");
const shell = join(client, "_shell.html");
if (!existsSync(shell)) {
  console.error("[pages-finalize] missing dist/client/_shell.html");
  process.exit(1);
}

const assets = join(client, "assets");
const css = readdirSync(assets).find((f) => f.startsWith("styles-") && f.endsWith(".css"));
let html = readFileSync(shell, "utf8");
if (css) {
  html = html.replace(/assets\/styles-[^."]+\.css/g, `assets/${css}`);
}
writeFileSync(join(client, "index.html"), html);
writeFileSync(join(client, "404.html"), html);
console.log("[pages-finalize] wrote index.html and 404.html", css ? `css=${css}` : "");
