import type { Contact } from "../entities/contact.js";

/**
 * Puerto secundario (driven): persistencia del dominio.
 * La implementación vive en infrastructure/adapters.
 */
export interface ContactRepository {
  save(contact: Contact): Promise<void>;
}
