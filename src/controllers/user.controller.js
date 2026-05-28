export class UserController {
    constructor(service) {
      this.service = service;
    }
  
    list = async (_req, res) => {
      try {
        const rows = await this.service.list();
        res.status(200).json(rows);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error desconocido";
        console.log(err.message);
        res.status(500).json({ error: msg });
      }
    };

    getById = async (req, res) => {
        try {
            const user = await this.service.getById(req.params.id);
            res.status(200).json(user);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error desconocido";
            res.status(500).json({ error: msg });
        }
    };

    create = async (req, res) => {
        try {
            const user = await this.service.create(req.body);
            res.status(201).json(user);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error desconocido";
            res.status(500).json({ error: msg });
        }
    };

    update = async (req, res) => {
        try {
            const user = await this.service.update(req.params.id, req.body);
            res.status(200).json(user);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error desconocido";
            res.status(500).json({ error: msg });
        }
    };

    delete = async (req, res) => {
        try {
            await this.service.delete(req.params.id);
            res.status(204).send();
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error desconocido";
            res.status(500).json({ error: msg });
        }
    };
}
  