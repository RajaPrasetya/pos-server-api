import { z, ZodType } from "zod";

export class UserValidation{
    
    static readonly REGISTER : ZodType = z.object({
        username: z.string().min(3, "Username must be at least 3 characters long").max(50, "Username must not exceed 50 characters"),
        password: z.string().min(6, "Password must be at least 6 characters long").max(100, "Password must not exceed 100 characters"),
        email: z.string().email("Invalid email format").max(100, "Email must not exceed 100 characters"),
        role: z.string().optional().default("cashier").refine(value => ["admin", "cashier", "manager"].includes(value), {
            message: "Role must be one of 'admin', 'cashier', or 'manager'",
        })
    })

    static readonly LOGIN : ZodType = z.object({
        username: z.string().min(3, "Username must be at least 3 characters long").max(50, "Username must not exceed 50 characters"),
        password: z.string().min(6, "Password must be at least 6 characters long").max(100, "Password must not exceed 100 characters"),
    })

    static readonly TOKEN : ZodType = z.string().min(1)

    static readonly UPDATE : ZodType = z.object({
        username: z.string().min(3, "Username must be at least 3 characters long").max(50, "Username must not exceed 50 characters").optional(),
        password: z.string().min(6, "Password must be at least 6 characters long").max(100, "Password must not exceed 100 characters").optional(),
        email: z.string().email("Invalid email format").max(100, "Email must not exceed 100 characters").optional(),
        role: z.string().optional().default("cashier").refine(value => ["admin", "cashier", "manager"].includes(value), {
            message: "Role must be one of 'admin', 'cashier', or 'manager'",
        })
    })
}