/**
 * generate-sitemap.mjs
 * Runs after `vite build` and writes dist/public/sitemap.xml.
 * - Always includes every static route.
 * - Fetches live posts + categories from Firestore REST API (no SDK needed).
 * - Falls back gracefully if Firestore is unreachable.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Config ──────────────────────────────────────────────────────────────────
const SITE_URL = (process.env.VITE_SITE_URL || "https://example.com").replace(/\/$/, "");
const OUT_DIR  = path.resolve(__dirname, "dist/public");
const PROJECT  = process.env.VITE_FIREBASE_PROJECT_ID || "prompt-labs-ba475";
const API_KEY  = process.env.VITE_FIREBASE_API_KEY    || "";

// ── Static routes ────────────────────────────────────────────────────────────
const STATIC_ROUTES = [
  { path: "/",              priority: "1.0", changefreq: "daily"   },
  { path: "/explore",       priority: "0.9", changefreq: "daily"   },
  { path: "/categories",    priority: "0.8", changefreq: "weekly"  },
  { path: "/reels",         priority: "0.7", changefreq: "daily"   },
  { path: "/guides",        priority: "0.7", changefreq: "monthly" },
  { path: "/how-it-works",  priority: "0.6", changefreq: "monthly" },
  { path: "/faq",           priority: "0.6", changefreq: "monthly" },
  { path: "/about",         priority: "0.5", changefreq: "monthly" },
  { path: "/about-us",      priority: "0.5", changefreq: "monthly" },
  { path: "/contact",       priority: "0.5", changefreq: "monthly" },
  { path: "/privacy",       priority: "0.3", changefreq: "yearly"  },
  { path: "/terms",         priority: "0.3", changefreq: "yearly"  },
];

// Guide slugs are hardcoded in source
const GUIDE_SLUGS = [
  "prompt-engineering-basics",
  "beginners-guide",
  "writing-guide",
];

// ── Firestore REST helpers ────────────────────────────────────────────────────
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

async function fetchCollection(collection) {
  if (!API_KEY) return [];
  try {
    const url = `${FIRESTORE_BASE}/${collection}?key=${API_KEY}&pageSize=300`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return [];
    const json = await res.json();
    return json.documents || [];
  } catch {
    return [];
  }
}

function getField(doc, field) {
  const f = doc.fields?.[field];
  if (!f) return undefined;
  return f.stringValue ?? f.booleanValue ?? f.integerValue ?? undefined;
}

// ── Build URL entry ──────────────────────────────────────────────────────────
const today = new Date().toISOString().split("T")[0];

function urlEntry({ loc, lastmod = today, changefreq = "weekly", priority = "0.5" }) {
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function generate() {
  const entries = [];

  // 1. Static routes
  for (const r of STATIC_ROUTES) {
    entries.push(urlEntry({ loc: `${SITE_URL}${r.path}`, ...r }));
  }

  // 2. Guide pages (hardcoded slugs)
  for (const slug of GUIDE_SLUGS) {
    entries.push(urlEntry({ loc: `${SITE_URL}/guide/${slug}`, priority: "0.6", changefreq: "monthly" }));
  }

  // 3. Live categories from Firestore
  const catDocs = await fetchCollection("categories");
  for (const doc of catDocs) {
    const slug = getField(doc, "slug");
    if (slug) {
      entries.push(urlEntry({ loc: `${SITE_URL}/category/${slug}`, priority: "0.7", changefreq: "weekly" }));
    }
  }
  console.log(`  → ${catDocs.length} categories fetched from Firestore`);

  // 4. Live published posts from Firestore
  const postDocs = await fetchCollection("posts");
  let publishedCount = 0;
  for (const doc of postDocs) {
    const published = getField(doc, "published");
    if (published === false) continue;
    // Document name format: projects/.../documents/posts/{id}
    const id = doc.name?.split("/").pop();
    if (id) {
      const createdAt = getField(doc, "createdAt");
      const lastmod   = createdAt ? createdAt.split("T")[0] : today;
      entries.push(urlEntry({ loc: `${SITE_URL}/post/${id}`, priority: "0.8", changefreq: "weekly", lastmod }));
      publishedCount++;
    }
  }
  console.log(`  → ${publishedCount} published posts fetched from Firestore`);

  // 5. Write sitemap.xml
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
  ].join("\n");

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "sitemap.xml"), xml, "utf-8");

  const total = STATIC_ROUTES.length + GUIDE_SLUGS.length + catDocs.length + publishedCount;
  console.log(`✓ sitemap.xml written — ${total} URLs`);
}

generate().catch((err) => {
  console.error("Sitemap generation failed:", err.message);
  process.exit(0); // Don't fail the build if sitemap generation fails
});
