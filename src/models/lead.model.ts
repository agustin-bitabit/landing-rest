/**
 * Cómo luce un Lead al persistirse (fila en DB / documento en Mongo, etc.)
 */
export type LeadRow = {
  id: string;
  email: string;
  message: string;
  createdAt: Date;
};
