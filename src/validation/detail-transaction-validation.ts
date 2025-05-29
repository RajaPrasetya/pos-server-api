import { z, ZodType } from "zod";

export class DetailTransactionValidation {

    static readonly CREATE:ZodType = z.object({
        id_transaction: z.number()
            .int("Transaction ID must be an integer")
            .positive("Transaction ID must be a positive integer"),
        id_product: z.number()
            .int("Product ID must be an integer")
            .positive("Product ID must be a positive integer"),
        quantity: z.number()
            .int("Quantity must be an integer")
            .positive("Quantity must be a positive integer"),
    })

    static readonly UPDATE:ZodType = z.object({
        quantity: z.number()
            .int("Quantity must be an integer")
            .positive("Quantity must be a positive integer"),
            
    })
}