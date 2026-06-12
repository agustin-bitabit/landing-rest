import express from "express";
import serverless from "serverless-http";
import { connectDatabase } from "./config/database.js";
import { bootstrap } from "./bootstrap.js";

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

let serverlessHandler;

async function init() {
  await connectDatabase();
  const { app } = bootstrap();
  const root = express();
  root.use(stripGatewayPathPrefix);
  root.use(app);
  serverlessHandler = serverless(root);
  return serverlessHandler;
}

let initPromise;

export const handler = async (event, context) => {
  try {
    if (!initPromise) initPromise = init();
    const fn = await initPromise;
    return await fn(event, context);
  } catch (err) {
    console.error("Lambda init error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: err instanceof Error ? err.message : "Error al iniciar la aplicación",
      }),
    };
  }
};
