import { MiddlewareHandler } from "hono";
import { verifyJwt } from "../application/jwt";
import { prismaClient } from "../application/database";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ message: 'Unauthorized' }, 401);
    }
    const token = authHeader.replace('Bearer ', '');
    const payload = await verifyJwt(token);
    if (!payload) {
        return c.json({
            success: false,
            message: 'Unauthorized'
        }, 401);
    }
    // Ambil user dari DB jika perlu
    const user = await prismaClient.user.findUnique({
        where: { id_user: payload.id_user as number }
    });
    if (!user) {
        return c.json({
            success: false,
            message: 'Unauthorized'
        }, 401);
    }
    c.set('user', user);
    return next();
};