import { MiddlewareHandler } from "hono";
import { UserService } from "../service/user-service";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const authHeader = c.req.header('Authorization');
    const user = await UserService.getToken(authHeader);
    c.set('user', user);
    return next();
};