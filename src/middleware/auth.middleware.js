export function authMiddleware(loginService) {
  return async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token requerido" });
    }

    const token = header.slice(7).trim();
    if (!token) {
      return res.status(401).json({ error: "Token requerido" });
    }

    const user = await loginService.verifyToken(token);
    if (!user) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }

    req.user = user;
    next();
  };
}