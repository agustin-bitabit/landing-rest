import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginService } from "../../src/services/login.service.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function createMockRepository(overrides = {}) {
  return {
    findByEmail: async () => null,
    findById: async () => null,
    create: async (data) => ({ _id: "user-1", ...data }),
    ...overrides,
  };
}

describe("LoginService", () => {
  let service;
  let repository;

  beforeEach(() => {
    repository = createMockRepository();
    service = new LoginService(repository);
  });

  describe("login", () => {
    it("devuelve null si el usuario no existe", async () => {
      const result = await service.login("unknown@test.com", "password");
      assert.equal(result, null);
    });

    it("devuelve null si la contraseña no coincide", async () => {
      const hashed = await bcrypt.hash("correct", 10);
      repository.findByEmail = async () => ({
        _id: "1",
        email: "user@test.com",
        password: hashed,
      });

      const result = await service.login("user@test.com", "wrong");
      assert.equal(result, null);
    });

    it("devuelve token y usuario sin contraseña si las credenciales son válidas", async () => {
      const hashed = await bcrypt.hash("secret123", 10);
      repository.findByEmail = async () => ({
        _id: "abc123",
        email: "user@test.com",
        name: "user",
        password: hashed,
      });

      const result = await service.login("user@test.com", "secret123");

      assert.ok(result.token);
      assert.equal(result.user.email, "user@test.com");
      assert.equal(result.user.password, undefined);

      const payload = jwt.verify(result.token, JWT_SECRET);
      assert.equal(payload.email, "user@test.com");
    });
  });

  describe("createUser", () => {
    it("crea un usuario con contraseña hasheada y devuelve token", async () => {
      let createdData;
      repository.create = async (data) => {
        createdData = data;
        return { _id: "new-id", ...data };
      };

      const result = await service.createUser("new@test.com", "mypassword");

      assert.ok(await bcrypt.compare("mypassword", createdData.password));
      assert.equal(createdData.name, "new");
      assert.equal(createdData.email, "new@test.com");
      assert.ok(result.token);
      assert.equal(result.user.password, undefined);
    });
  });

  describe("verifyToken", () => {
    it("devuelve null para un token inválido", async () => {
      const result = await service.verifyToken("invalid-token");
      assert.equal(result, null);
    });

    it("devuelve el usuario sin contraseña para un token válido", async () => {
      const token = jwt.sign({ id: "user-1", email: "a@b.com" }, JWT_SECRET);
      repository.findById = async () => ({
        _id: "user-1",
        email: "a@b.com",
        password: "hashed",
      });

      const result = await service.verifyToken(token);

      assert.equal(result.email, "a@b.com");
      assert.equal(result.password, undefined);
    });
  });
});
