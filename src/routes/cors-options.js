const DEFAULT_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
];

/** Orígenes: `CORS_ORIGIN` separado por comas; si falta, lista por defecto para Vite/local. */
export function getCorsOptions() {
  const raw = process.env.CORS_ORIGIN;
  const fromEnv = raw
    ? raw.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined;

  return {
    origin: fromEnv?.length ? fromEnv : DEFAULT_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
}
