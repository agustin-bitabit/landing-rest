import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { TestimonialService } from "../../src/services/testimonial.service.js";
import { SimpleCache } from "../../src/utils/simple-cache.js";

const sampleEntry = {
  sys: { id: "entry-1" },
  fields: {
    name: "María",
    subtitle: "CEO",
    quote: "Excelente servicio",
    rating: 5,
    avatar: {
      sys: { type: "Asset" },
      fields: {
        file: {
          "es-AR": { url: "//images.ctfassets.net/avatar.jpg" },
        },
      },
    },
  },
};

function createMockRepository(items = [sampleEntry]) {
  return {
    locale: "es-AR",
    findAll: async () => items,
  };
}

describe("TestimonialService", () => {
  let repository;
  let cache;
  let service;

  beforeEach(() => {
    repository = createMockRepository();
    cache = new SimpleCache(60_000);
    service = new TestimonialService(repository, cache);
  });

  it("mapea testimonios desde el repositorio", async () => {
    const result = await service.list();

    assert.equal(result.length, 1);
    assert.deepEqual(result[0], {
      id: "entry-1",
      name: "María",
      subtitle: "CEO",
      quote: "Excelente servicio",
      avatar_url: "https://images.ctfassets.net/avatar.jpg",
      rating: 5,
    });
  });

  it("devuelve datos cacheados sin consultar el repositorio de nuevo", async () => {
    let callCount = 0;
    repository.findAll = async () => {
      callCount += 1;
      return [sampleEntry];
    };

    await service.list();
    await service.list();

    assert.equal(callCount, 1);
  });

  it("resuelve campos localizados", async () => {
    repository = createMockRepository([
      {
        sys: { id: "entry-2" },
        fields: {
          name: { "es-AR": "Juan", "en-US": "John" },
          subtitle: { "en-US": "Developer" },
          quote: null,
          rating: "invalid",
        },
      },
    ]);
    service = new TestimonialService(repository, null);

    const result = await service.list();

    assert.equal(result[0].name, "Juan");
    assert.equal(result[0].subtitle, "Developer");
    assert.equal(result[0].quote, null);
    assert.equal(result[0].rating, null);
  });
});
