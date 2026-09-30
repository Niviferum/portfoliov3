/**
 * Génère `out/_headers` après l'export statique.
 *
 * Pourquoi un script plutôt que `headers()` dans next.config : avec
 * `output: 'export'` il n'y a pas de serveur Next, donc `headers()` n'a aucun
 * effet. Les en-têtes sont la responsabilité de l'hébergeur ; le format
 * `_headers` est celui de Netlify et Cloudflare Pages. L'équivalent nginx est
 * documenté dans le README.
 *
 * Next émet deux scripts inline par page (la charge utile RSC) et aucun
 * nonce n'est possible sans serveur. On calcule donc leur empreinte SHA-256
 * à chaque build : la CSP reste sans `script-src 'unsafe-inline'`.
 * Corollaire : l'hébergeur ne doit pas réécrire ni minifier le HTML servi,
 * sinon les empreintes ne correspondent plus et les scripts sont bloqués.
 */

import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = fileURLToPath(new URL("../out", import.meta.url));

/** En-têtes appliqués à toutes les ressources. */
const COMMON_HEADERS = [
  ["Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload"],
  ["X-Content-Type-Options", "nosniff"],
  ["X-Frame-Options", "DENY"],
  ["Referrer-Policy", "no-referrer"],
  [
    "Permissions-Policy",
    [
      "accelerometer=()",
      "autoplay=()",
      "camera=()",
      "display-capture=()",
      "encrypted-media=()",
      "fullscreen=()",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "midi=()",
      "payment=()",
      "usb=()",
      "xr-spatial-tracking=()",
    ].join(", "),
  ],
  ["Cross-Origin-Opener-Policy", "same-origin"],
  ["Cross-Origin-Resource-Policy", "same-origin"],
];

/** Directives fixes de la CSP, dans l'ordre où elles sont écrites. */
function cspDirectives(scriptHashes) {
  return [
    ["default-src", "'none'"],
    ["base-uri", "'none'"],
    ["object-src", "'none'"],
    ["frame-ancestors", "'none'"],
    // Un formulaire de contact éventuel postera vers la même origine.
    ["form-action", "'self'"],
    ["script-src", ["'self'", ...scriptHashes].join(" ")],
    ["style-src", "'self'"],
    ["img-src", "'self' data:"],
    ["font-src", "'self'"],
    // Navigations client : Next récupère les charges utiles RSC en `.txt`.
    ["connect-src", "'self'"],
    ["manifest-src", "'self'"],
    ["upgrade-insecure-requests", ""],
  ]
    .map(([name, value]) => (value ? `${name} ${value}` : name))
    .join("; ");
}

/** Empreintes SHA-256 des `<script>` sans attribut `src` de la page. */
function inlineScriptHashes(html) {
  const hashes = new Set();
  const pattern = /<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/gi;

  for (const [, attrs, body] of html.matchAll(pattern)) {
    if (/\stype=["']?(?!module|text\/javascript|application\/javascript)/i.test(attrs)) {
      // Données structurées (`application/ld+json`) et gabarits : non exécutés.
      continue;
    }
    hashes.add(`'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`);
  }

  return [...hashes];
}

/** Chemin d'URL servi pour un fichier HTML de l'export. */
function urlPathFor(relativePath) {
  const posix = relativePath.split(sep).join("/");
  if (posix === "index.html") return "/";
  if (posix === "404.html") return "/404.html";
  if (posix.endsWith("/index.html")) return `/${posix.slice(0, -"index.html".length)}`;
  return `/${posix}`;
}

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* htmlFiles(full);
    } else if (entry.name.endsWith(".html")) {
      yield full;
    }
  }
}

async function main() {
  const blocks = [
    `/*\n${COMMON_HEADERS.map(([n, v]) => `  ${n}: ${v}`).join("\n")}`,
  ];

  const pages = [];
  for await (const file of htmlFiles(OUT_DIR)) {
    pages.push(file);
  }
  pages.sort();

  for (const file of pages) {
    const html = await readFile(file, "utf8");
    const path = urlPathFor(relative(OUT_DIR, file));
    blocks.push(`${path}\n  Content-Security-Policy: ${cspDirectives(inlineScriptHashes(html))}`);
  }

  const banner = [
    "# Généré par scripts/build-headers.mjs — ne pas éditer à la main.",
    "# Format Netlify / Cloudflare Pages. Équivalent nginx : voir le README.",
    "",
  ].join("\n");

  await writeFile(join(OUT_DIR, "_headers"), `${banner}${blocks.join("\n\n")}\n`, "utf8");

  // `serve` (déploiement Railway) ne lit pas `_headers` : même politique au
  // format `serve.json`, avec une CSP unique qui réunit les empreintes de
  // toutes les pages.
  const allHashes = new Set();
  for (const file of pages) {
    for (const hash of inlineScriptHashes(await readFile(file, "utf8"))) {
      allHashes.add(hash);
    }
  }
  const serveConfig = {
    trailingSlash: true,
    headers: [
      {
        source: "**",
        headers: [
          ...COMMON_HEADERS,
          ["Content-Security-Policy", cspDirectives([...allHashes])],
        ].map(([key, value]) => ({ key, value })),
      },
    ],
  };
  await writeFile(join(OUT_DIR, "serve.json"), `${JSON.stringify(serveConfig, null, 2)}\n`, "utf8");

  console.log(`_headers et serve.json écrits — ${pages.length} page(s) couverte(s).`);
}

await main();
