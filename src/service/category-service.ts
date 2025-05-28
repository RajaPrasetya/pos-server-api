import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database";
import { CategoryResponse, CreateCategoryRequest, toCategoryResponse } from "../model/category-model";
import { CategoryValidation } from "../validation/category-validation";

export class CategoryService {

    static async createCategory(req: CreateCategoryRequest): Promise<CategoryResponse> {
        req = CategoryValidation.CREATE.parse(req);

        const totalCategoryWithSameName = await prismaClient.category.count({
            where: {
                category_name: req.category_name,
            }
        });
        if (totalCategoryWithSameName > 0) {
            throw new HTTPException(400, {
                message: "Category name already exists",
            })
        }

        const category = await prismaClient.category.create({
            data: req,
        });

        return toCategoryResponse(category);
    }

    static async getAllCategories(): Promise<CategoryResponse[]> {
        const categories = await prismaClient.category.findMany();

        return categories.map(toCategoryResponse);
    }

    static async getCategoryById(id: number): Promise<CategoryResponse> {
        const category = await prismaClient.category.findUnique({
            where: {
                id_category: id,
            }
        });

        if (!category) {
            throw new HTTPException(404, {
                message: "Category not found",
            });
        }

        return toCategoryResponse(category);
    }

    static async updateCategory(id: number, req: CreateCategoryRequest): Promise<CategoryResponse> {
        req = CategoryValidation.CREATE.parse(req);

        const totalCategoryWithSameName = await prismaClient.category.count({
            where: {
                category_name: req.category_name,
                id_category: {
                    not: id,
                }
            }
        });
        if (totalCategoryWithSameName > 0) {
            throw new HTTPException(400, {
                message: "Category name already exists",
            })
        }

        const category = await prismaClient.category.update({
            where: {
                id_category: id,
            },
            data: req,
        });

        return toCategoryResponse(category);
    }

    static async deleteCategory(id: number): Promise<void> {
        const category = await prismaClient.category.findUnique({
            where: {
                id_category: id,
            }
        });

        if (!category) {
            throw new HTTPException(404, {
                message: "Category not found",
            });
        }

        await prismaClient.category.delete({
            where: {
                id_category: id,
            }
        });
    }
}