import { z, ZodType } from "zod";

export class ProductValidation {

    static readonly CREATE: ZodType = z.object({
        product_name: z.string()
            .min(3, "Product name must be at least 3 characters long")
            .max(50, "Product name must not exceed 50 characters")
            .refine(value => /^[a-zA-Z0-9\s]+$/.test(value), {
                message: "Product name can only contain alphanumeric characters and spaces",
            }),
        price: z.number()
            .positive("Price must be a positive number")
            .max(100000, "Price must not exceed 100,000"),
        stock: z.number()
            .int("Stock must be an integer")
            .nonnegative("Stock cannot be negative"),
        id_category: z.number()
            .int("Category ID must be an integer")
            .positive("Category ID must be a positive number"),
        description: z.string()
            .max(255, "Description must not exceed 255 characters")
            .optional(),
        image_url: z.string()
            .url("Image URL must be a valid URL")
            .max(255, "Image URL must not exceed 255 characters")
            .optional()
    })

    static readonly UPDATE: ZodType = z.object({
        product_name: z.string()
            .min(3, "Product name must be at least 3 characters long")
            .max(50, "Product name must not exceed 50 characters")
            .refine(value => /^[a-zA-Z0-9\s]+$/.test(value), {
                message: "Product name can only contain alphanumeric characters and spaces",
            })
            .optional(),
        price: z.number()
            .positive("Price must be a positive number")
            .max(100000, "Price must not exceed 100,000")
            .optional(),
        stock: z.number()
            .int("Stock must be an integer")
            .nonnegative("Stock cannot be negative")
            .optional(),
        id_category: z.number()
            .int("Category ID must be an integer")
            .positive("Category ID must be a positive number")
            .optional(),
        description: z.string()
            .max(255, "Description must not exceed 255 characters")
            .optional(),
        image_url: z.string()
            .url("Image URL must be a valid URL")
            .max(255, "Image URL must not exceed 255 characters")
            .optional()
    })
}