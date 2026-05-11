export class TestimonialController {
  constructor(service) {
    this.service = service;
  }

  list = async (_req, res) => {
    try {
      const rows = await this.service.list();
      res.status(200).json(rows);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      res.status(500).json({ error: msg });
    }
  };
}
