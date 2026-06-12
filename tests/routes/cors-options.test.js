import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { getCorsOptions } from "../../src/routes/cors-options.js";

describe("getCorsOptions", () => {
  const originalCorsOrigin = process.env.CORS_ORIGIN;

  afterEach(() => {
    if (originalCorsOrigin === undefined) {
      delete process.env.CORS_ORIGIN;
    } else {
      process.env.CORS_ORIGIN = originalCorsOrigin;
    }
  });

  it("usa orígenes por defecto cuando CORS_ORIGIN no está definido", () => {
    delete process.env.CORS_ORIGIN;
    const options = getCorsOptions();

    assert.ok(options.origin.includes("http://localhost:5173"));
    assert.equal(options.credentials, true);
    assert.ok(options.methods.includes("GET"));
    assert.ok(options.allowedHeaders.includes("Authorization"));
  });

  it("parsea orígenes separados por coma desde CORS_ORIGIN", () => {
    process.env.CORS_ORIGIN = "https://app.example.com, https://admin.example.com";
    const options = getCorsOptions();

    assert.deepEqual(options.origin, [
      "https://app.example.com",
      "https://admin.example.com",
    ]);
  });

  it("ignora entradas vacías en CORS_ORIGIN", () => {
    process.env.CORS_ORIGIN = "https://only.com,,  ,https://other.com";
    const options = getCorsOptions();

    assert.deepEqual(options.origin, [
      "https://only.com",
      "https://other.com",
    ]);
  });
});
