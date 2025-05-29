import { z, ZodType } from "zod";

export class CategoryValidation {

    static readonly CREATE: ZodType = z.object({
        category_name: z.string()
            .min(3, "Category name must be at least 3 characters long")
            .max(50, "Category name must not exceed 50 characters")
            .refine(value => /^[a-zA-Z0-9\s]+$/.test(value), {
                message: "Category name can only contain alphanumeric characters and spaces",
            })
    })
}