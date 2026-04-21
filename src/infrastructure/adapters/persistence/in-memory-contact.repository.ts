import type { Contact } from "../../../domain/entities/contact.js";
import type { ContactRepository } from "../../../domain/ports/contact-repository.port.js";

/**
 * Adaptador secundario de ejemplo (en memoria). Sustituir por Postgres/Mongo/etc.
 */
export class InMemoryContactRepository implements ContactRepository {
  private readonly store = new Map<string, Contact>();

  async save(contact: Contact): Promise<void> {
    this.store.set(contact.id, contact);
  }
}
