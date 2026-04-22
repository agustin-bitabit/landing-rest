import type { LeadRow } from "./lead.model.js";

export interface ILeadRepository {
  save(row: LeadRow): Promise<void>;
}

/**
 * Sustituir por adaptador a tu motor real (Postgres, Mongo, etc.)
 */
export class InMemoryLeadRepository implements ILeadRepository {
  private readonly store = new Map<string, LeadRow>();

  async save(row: LeadRow): Promise<void> {
    this.store.set(row.id, { ...row });
  }
}
