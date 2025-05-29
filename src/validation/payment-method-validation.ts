import { z, ZodType } from "zod";

export class PaymentMethodValidation {

    static readonly CREATE: ZodType = z.object({
        payment_method: z.string()
            .min(3, "Payment method name must be at least 3 characters long")
            .max(50, "Payment method name must not exceed 50 characters")
            .refine(value => /^[a-zA-Z0-9\s]+$/.test(value), {
                message: "Payment method name can only contain alphanumeric characters and spaces",
            })
    });

    static readonly UPDATE: ZodType = z.object({
        payment_method: z.string()
            .min(3, "Payment method name must be at least 3 characters long")
            .max(50, "Payment method name must not exceed 50 characters")
            .refine(value => /^[a-zA-Z0-9\s]+$/.test(value), {
                message: "Payment method name can only contain alphanumeric characters and spaces",
            })
            .optional()
    });
}