export class SimpleCache {
  constructor(ttlMs) {
    this.ttlMs = ttlMs;
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  set(key, value) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

export function createSimpleCache(ttlSeconds = 60) {
  const seconds = Number(ttlSeconds);
  const ttlMs = (Number.isFinite(seconds) && seconds > 0 ? seconds : 60) * 1000;
  return new SimpleCache(ttlMs);
}
