import { MiddlewareHandler } from 'hono'

export const roleMiddleware = (allowedRoles: string[]): MiddlewareHandler => {
    return async (c, next) => {
        // Assume user role is attached to c.get('user') by previous auth middleware
        const user = c.get('user')
        if (!user || !allowedRoles.includes(user.role)) {
            return c.json({ message: 'Forbidden' }, 403)
        }
        await next()
    }
}