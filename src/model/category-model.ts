import { Category } from "../generated/prisma";

export type CreateCategoryRequest = {
    category_name: string;
};

export type CategoryResponse = {
    id_category: number;
    category_name: string;
}

export function toCategoryResponse(category: Category): CategoryResponse {
    return {
        id_category: category.id_category,
        category_name: category.category_name,
    };
}