export function authMiddleware(loginService) {
    return async (req, res, next) => {
        const header = req.headers.authorization;
        if(!header?.startsWith("Bearer ")) {
            return res.status(401).json({error: "Unauthorized"});
        }
        const token = header.split(" ")[1];
        const user = await loginService.verifyToken(token);
        if(!user) {
            return res.status(401).json({error: "Unauthorized"});
        }
        req.user = user;
        next();
    }
}