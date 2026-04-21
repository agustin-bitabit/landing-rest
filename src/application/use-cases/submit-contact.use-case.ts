import { Contact } from "../../domain/entities/contact.js";
import type { ContactRepository } from "../../domain/ports/contact-repository.port.js";

export type SubmitContactInput = {
  email: string;
  message: string;
};

/**
 * Caso de uso: orquesta el dominio y los puertos sin conocer HTTP ni la BD concreta.
 */
export class SubmitContactUseCase {
  constructor(private readonly contacts: ContactRepository) {}

  async execute(input: SubmitContactInput): Promise<{ id: string }> {
    const contact = Contact.create({
      email: input.email,
      message: input.message,
    });
    await this.contacts.save(contact);
    return { id: contact.id };
  }
}
