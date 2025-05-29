import { Decimal } from "@prisma/client/runtime/library";
import { Product } from "../generated/prisma";

export type CreateProductRequest = {
    product_name: string;
    price: Decimal;
    stock: number;
    description?: string;
    id_category: number;
    image_url?: string;
}

export type UpdateProductRequest = {
    product_name?: string;
    price?: Decimal;
    stock?: number;
    description?: string;
    id_category?: number;
    image_url?: string;
    updated_at: Date;
}

export type ProductResponse = {
    id_product: number;
    product_name: string;
    price: Decimal;
    stock: number;
    description?: string | null;
    id_category: number;
    image_url?: string | null;
    created_at: Date;
    updated_at: Date;
}

export type UpdateProductResponse = {
    id_product: number;
    product_name?: string;
    price?: Decimal;
    stock?: number;
    description?: string | null;
    id_category?: number;
    image_url?: string | null;
    created_at: Date;
    updated_at: Date;
}

export function toProductResponse(product: Product): ProductResponse {
    return {
        id_product: product.id_product,
        product_name: product.product_name,
        price: product.price,
        stock: product.stock,
        description: product.description,
        id_category: product.id_category,
        image_url: product.image_url || null,
        created_at: product.created_at,
        updated_at: product.updated_at,
    };
}