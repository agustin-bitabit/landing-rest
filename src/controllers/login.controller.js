export class LoginController {
  constructor(service) {
    this.service = service;
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await this.service.login(email, password);
      if (!result) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }
      res.status(200).json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      res.status(500).json({ error: msg });
    }
  };

  register = async (req, res) => {
    try {

      console.log("Entra al register");

      const { email, password } = req.body;
      const result = await this.service.createUser(email, password);
      res.status(201).json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      const status = err?.code === 11000 ? 409 : 500;
      res.status(status).json({ error: msg });
    }
  };

  verify = async (req, res) => {
    try {
      const { token } = req.body;
      const user = await this.service.verifyToken(token);
      if (!user) {
        return res.status(401).json({ error: "Token inválido" });
      }
      res.status(200).json(user);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      res.status(500).json({ error: msg });
    }
  };

  logout = async (req, res) => {
    try {
      const { token } = req.body;
      const user = await this.service.logoutUser(token);
      if (!user) {
        return res.status(401).json({ error: "Token inválido" });
      }
      res.status(200).json({ ok: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      res.status(500).json({ error: msg });
    }
  };
}
