#!/usr/bin/env node
/**
 * index.html から Artifact 用の HTML を生成する。
 * Artifact 側で <!doctype>/<html>/<head>/<body> は付与されるため、
 * <title> と <link>/<style>、body の中身だけを取り出して dist/artifact.html に書き出す。
 *
 *   node scripts/build-artifact.js
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const src = fs.readFileSync(path.join(root, "index.html"), "utf8");

const pick = re => {
  const m = src.match(re);
  if (!m) throw new Error("index.html の構造が変わっています: " + re);
  return m[1].trim();
};

const title = pick(/<title>([\s\S]*?)<\/title>/);
const links = [...src.matchAll(/<link rel="(?:preconnect|stylesheet)"[^>]*>/g)].map(m => m[0]);
const style = pick(/<style>([\s\S]*?)<\/style>/);
const body  = pick(/<body>([\s\S]*?)<\/body>/);

const out = [
  `<title>${title}</title>`,
  ...links,
  `<style>\n${style}\n</style>`,
  "",
  body
].join("\n") + "\n";

fs.mkdirSync(path.join(root, "dist"), {recursive: true});
fs.writeFileSync(path.join(root, "dist", "artifact.html"), out);
console.log(`dist/artifact.html を書き出しました (${(out.length / 1024).toFixed(1)} KB)`);
