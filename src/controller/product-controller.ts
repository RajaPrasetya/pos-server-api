import { Hono } from "hono";
import { ApplicationVariables } from "../model/auth-model";
import { authMiddleware } from "../middleware/auth-middleware";
import { CreateProductRequest, UpdateProductRequest } from "../model/product-model";
import { ProductService } from "../service/product-service";

export const productController = new Hono<{Variables: ApplicationVariables}>();

// GET ALL PRODUCTS
productController.get('/', async (c) => {
    const products = await ProductService.getAllProducts();

    return c.json({
        success: true,
        message: "Products retrieved successfully",
        data: {
            products: products,
        },
    }, 200);
});

// GET PRODUCT BY ID
productController.get('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
        return c.json({
            success: false,
            message: "Invalid product ID",
        }, 400);
    }

    const product = await ProductService.getProductById(id);

    return c.json({
        success: true,
        message: "Product retrieved successfully",
        data: product,
    }, 200);
});

// Middleware Authentication
productController.use(authMiddleware);

// CREATE PRODUCT
productController.post('/', async (c) => {
    const req = await c.req.json() as CreateProductRequest;

    // Assuming ProductService.createProduct is defined
    const res = await ProductService.createProduct(req);

    return c.json({
        success: true,
        message: "Product created successfully",
        data: res,
    }, 201);
})

// UPDATE PRODUCT
productController.put('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
        return c.json({
            success: false,
            message: "Invalid product ID",
        }, 400);
    }

    const req = await c.req.json() as UpdateProductRequest;

    // Assuming ProductService.updateProduct is defined
    const res = await ProductService.updateProduct(id, req);

    return c.json({
        success: true,
        message: "Product updated successfully",
        data: res,
    }, 200);
});

// DELETE PRODUCT
productController.delete('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
        return c.json({
            success: false,
            message: "Invalid product ID",
        }, 400);
    }

    await ProductService.deleteProduct(id);

    return c.json({
        success: true,
        message: "Product deleted successfully",
    }, 200);
});