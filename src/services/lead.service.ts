import type { LeadRow } from "../models/lead.model.js";
import type { ILeadRepository } from "../models/lead.repository.js";

/**
 * Lógica de negocio: p. ej. “si el email es .es, envía cupón y notifica a Madrid” (aquí reducido a un flag de ejemplo).
 */
export class LeadService {
  constructor(private readonly leads: ILeadRepository) {}

  async createLead(input: { email: string; message: string }): Promise<{
    id: string;
    discountSent: boolean;
  }> {
    const email = input.email.trim();
    const message = input.message.trim();
    if (!email) {
      throw new Error("email es obligatorio");
    }
    if (!message) {
      throw new Error("message es obligatorio");
    }

    const id = crypto.randomUUID();
    const row: LeadRow = {
      id,
      email,
      message,
      createdAt: new Date(),
    };

    const discountSent = this.shouldSendDiscountCoupon(email);
    if (discountSent) {
      // En producción: cola, email, CRM, aviso a comerciales, etc.
    }

    await this.leads.save(row);
    return { id, discountSent };
  }

  private shouldSendDiscountCoupon(email: string): boolean {
    const domain = email.split("@")[1] ?? "";
    return domain.toLowerCase().endsWith(".es");
  }
}
