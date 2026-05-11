"use strict";

const { createClient } = require("contentful");
const cors = require("cors");
const express = require("express");
const serverless = require("serverless-http");

/** Valor de campo Contentful según locale */
function pick(raw, locale) {
  if (raw == null) return undefined;
  if (typeof raw === "string" || typeof raw === "number") return raw;
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw[locale] ?? raw["en-US"] ?? Object.values(raw)[0];
  }
  return undefined;
}

/** Una fila de testimonio para la API */
function mapEntry(fields, locale, id) {
  const name = String(pick(fields.name, locale) ?? "");
  const subtitle = String(pick(fields.subtitle, locale) ?? "");
  const q = pick(fields.quote, locale);
  const quote = q == null || q === "" ? null : String(q);
  const r = pick(fields.rating, locale);
  const rating = typeof r === "number" && !Number.isNaN(r) ? r : null;

  let avatar_url = null;
  const av = fields.avatar;
  if (av?.sys?.type === "Asset" && av.fields?.file) {
    const file = pick(av.fields.file, locale);
    const u = file?.url;
    if (u) avatar_url = u.startsWith("//") ? `https:${u}` : u;
  }

  return { id, name, subtitle, quote, avatar_url, rating };
}

function createContentfulClient() {
  const space = process.env.CONTENTFUL_SPACE_ID?.trim();
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN?.trim();
  if (!space || !accessToken) {
    throw new Error(
      "Definí CONTENTFUL_SPACE_ID y CONTENTFUL_ACCESS_TOKEN en la configuración de Lambda",
    );
  }
  return createClient({
    space,
    accessToken,
    environment: process.env.CONTENTFUL_ENVIRONMENT?.trim() || "master",
  });
}

async function listTestimonials(client, contentType, locale) {
  const { items } = await client.getEntries({
    content_type: contentType,
    include: 2,
    locale,
    order: ["sys.createdAt"],
  });
  return items.map((entry) =>
    mapEntry(entry.fields, locale, entry.sys.id),
  );
}

function corsSettings() {
  const raw = process.env.CORS_ORIGIN;
  const origins = raw
    ? raw.split(",").map((s) => s.trim()).filter(Boolean)
    : [
        "http://localhost:5173",
        "http://localhost:4173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://d3ltjbgcp4q663.cloudfront.net"
      ];
  return { origin: origins, credentials: true };
}

/**
 * API Gateway suele mandar el path con stage y/o prefijo, p. ej.
 * /default/landing-back/health. Express solo define /health → hay que quitar prefijos.
 * En Lambda: API_GATEWAY_STAGE=default y API_BASE_PATH=landing-back (sin slashes).
 */
function stripGatewayPathPrefix(req, _res, next) {
  const stages = (process.env.API_GATEWAY_STAGE || "")
    .split(",")
    .map((s) => s.trim().replace(/^\/+|\/+$/g, ""))
    .filter(Boolean);
  const bases = (process.env.API_BASE_PATH || "")
    .split(",")
    .map((s) => s.trim().replace(/^\/+|\/+$/g, ""))
    .filter(Boolean);
  const prefixes = [...stages, ...bases];
  if (prefixes.length === 0) return next();

  const raw = req.url || "/";
  const q = raw.includes("?") ? raw.slice(raw.indexOf("?")) : "";
  let pathOnly = raw.includes("?") ? raw.slice(0, raw.indexOf("?")) : raw;

  for (const seg of prefixes) {
    const p = `/${seg}`;
    if (pathOnly === p) {
      pathOnly = "/";
    } else if (pathOnly.startsWith(`${p}/`)) {
      pathOnly = pathOnly.slice(p.length) || "/";
    }
  }

  req.url = pathOnly + q;
  next();
}

function createApp() {
  const client = createContentfulClient();
  const contentType =
    process.env.CONTENTFUL_TESTIMONIAL_CONTENT_TYPE?.trim() || "testimonios";
  const locale = process.env.CONTENTFUL_LOCALE?.trim() || "en-US";

  const app = express();
  app.use(stripGatewayPathPrefix);
  app.use(cors(corsSettings()));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/testimonials", async (_req, res) => {
    try {
      const rows = await listTestimonials(client, contentType, locale);
      res.status(200).json(rows);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      res.status(500).json({ error: msg });
    }
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}

const app = createApp();
exports.handler = serverless(app);
