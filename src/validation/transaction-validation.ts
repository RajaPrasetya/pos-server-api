import { z, ZodType } from "zod";

export class TransactionValidation {

    static readonly CREATE: ZodType = z.object({
        total_price: z.number()
            .positive("Total price must be a positive number"),
        payment_method: z.number()
            .int("Payment method ID must be an integer")
            .positive("Payment method ID must be a positive number"),
        status: z.enum(["pending", "completed", "cancelled"], {
            message: "Status must be one of 'pending', 'completed', or 'cancelled'"
        })
    })
    
    static readonly UPDATE: ZodType = z.object({
        total_price: z.number()
            .positive("Total price must be a positive number")
            .optional(),
        payment_method: z.number()
            .int("Payment method ID must be an integer")
            .positive("Payment method ID must be a positive number")
            .optional(),
        status: z.enum(["pending", "completed", "cancelled"], {
            message: "Status must be one of 'pending', 'completed', or 'cancelled'"
        }).optional()
    })
};
