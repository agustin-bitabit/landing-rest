import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { SimpleCache, createSimpleCache } from "../../src/utils/simple-cache.js";

describe("SimpleCache", () => {
  let cache;

  beforeEach(() => {
    cache = new SimpleCache(1000);
  });

  it("devuelve undefined para una clave inexistente", () => {
    assert.equal(cache.get("missing"), undefined);
  });

  it("guarda y recupera un valor", () => {
    cache.set("key", { data: 42 });
    assert.deepEqual(cache.get("key"), { data: 42 });
  });

  it("expira entradas después del TTL", () => {
    const shortCache = new SimpleCache(50);
    shortCache.set("temp", "value");

    const originalNow = Date.now;
    Date.now = () => originalNow() + 100;

    try {
      assert.equal(shortCache.get("temp"), undefined);
    } finally {
      Date.now = originalNow;
    }
  });

  it("elimina una clave con delete", () => {
    cache.set("key", "value");
    cache.delete("key");
    assert.equal(cache.get("key"), undefined);
  });

  it("limpia todo el store con clear", () => {
    cache.set("a", 1);
    cache.set("b", 2);
    cache.clear();
    assert.equal(cache.get("a"), undefined);
    assert.equal(cache.get("b"), undefined);
  });
});

describe("createSimpleCache", () => {
  afterEach(() => {
    delete process.env.CACHE_TTL_SECONDS;
  });

  it("usa 60 segundos por defecto", () => {
    const cache = createSimpleCache();
    cache.set("k", "v");

    const originalNow = Date.now;
    Date.now = () => originalNow() + 59_000;

    try {
      assert.equal(cache.get("k"), "v");
    } finally {
      Date.now = originalNow;
    }
  });

  it("respeta el TTL en segundos indicado", () => {
    const cache = createSimpleCache(2);
    cache.set("k", "v");

    const originalNow = Date.now;
    Date.now = () => originalNow() + 2_500;

    try {
      assert.equal(cache.get("k"), undefined);
    } finally {
      Date.now = originalNow;
    }
  });

  it("usa 60 segundos si el valor no es válido", () => {
    const cache = createSimpleCache("invalid");
    cache.set("k", "v");

    const originalNow = Date.now;
    Date.now = () => originalNow() + 59_000;

    try {
      assert.equal(cache.get("k"), "v");
    } finally {
      Date.now = originalNow;
    }
  });
});
