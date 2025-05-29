import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database";
import { CreateProductRequest, ProductResponse, toProductResponse, UpdateProductRequest } from "../model/product-model";
import { ProductValidation } from "../validation/product-validation";

export class ProductService {

    static async createProduct(req: CreateProductRequest): Promise<ProductResponse> {
        req = ProductValidation.CREATE.parse(req);

        const totalProductWithSameName = await prismaClient.product.count({
            where: {
                product_name: req.product_name,
            }
        });
        if (totalProductWithSameName > 0) {
            throw new HTTPException(400, {
                message: "Product name already exists",
            });
        }

        const product = await prismaClient.product.create({
            data: req,
        });

        return toProductResponse(product);
    }

    static async getAllProducts(): Promise<ProductResponse[]> {
        const products = await prismaClient.product.findMany({
            include: {
                category: true,
            }
        });

        return products.map(toProductResponse);
    }

    static async getProductById(id: number): Promise<ProductResponse> {
        const product = await prismaClient.product.findUnique({
            where: {
                id_product: id,
            },
            include: {
                category: true,
            }
        });

        if (!product) {
            throw new HTTPException(404, {
                message: "Product not found",
            });
        }

        return toProductResponse(product);
    }

    static async updateProduct(id: number, req: UpdateProductRequest): Promise<ProductResponse> {
        req = ProductValidation.UPDATE.parse(req);

        const product = await prismaClient.product.findUnique({
            where: {
                id_product: id,
            }
        });

        if (!product) {
            throw new HTTPException(404, {
                message: "Product not found",
            });
        }
        const totalProductWithSameName = await prismaClient.product.count({
            where: {
                product_name: req.product_name,
                id_product: {
                    not: id,
                }
            }
        });
        if (totalProductWithSameName > 0) {
            throw new HTTPException(400, {
                message: "Product name already exists",
            });
        }

        const updatedProduct = await prismaClient.product.update({
            where: {
                id_product: id,
            },
            data: req,
        });

        return toProductResponse(updatedProduct);
    }

    static async deleteProduct(id: number): Promise<void> {
        const product = await prismaClient.product.findUnique({
            where: {
                id_product: id,
            }
        });

        if (!product) {
            throw new HTTPException(404, {
                message: "Product not found",
            });
        }

        await prismaClient.product.delete({
            where: {
                id_product: id,
            }
        });
    }
}