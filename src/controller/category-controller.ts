import { Hono } from "hono";
import { ApplicationVariables } from "../model/auth-model";
import { CreateCategoryRequest } from "../model/category-model";
import { CategoryService } from "../service/category-service";
import { authMiddleware } from "../middleware/auth-middleware";
import { roleMiddleware } from "../middleware/role-middleware";

export const categoryController = new Hono<{ Variables: ApplicationVariables }>();

// GET ALL CATEGORIES
categoryController.get('/', async (c) => {
    
    const categories = await CategoryService.getAllCategories();

    return c.json({
        success: true,
        message: "Categories retrieved successfully",
        data: categories,
    });
});

// GET CATEGORY BY ID
categoryController.get('/:id_category', async (c) => {
    const id = parseInt(c.req.param('id_category'));

    const category = await CategoryService.getCategoryById(id);

    return c.json({
        success: true,
        message: "Category retrieved successfully",
        data: category,
    });
});

categoryController.use(authMiddleware);
categoryController.use(roleMiddleware(['admin', 'manager']));

// CREATE CATEGORY
categoryController.post('/', async (c) => {
    const req = await c.req.json() as CreateCategoryRequest;

    const res = await CategoryService.createCategory(req);

    return c.json({
        success: true,
        message: "Category created successfully",
        data: res,
    }, 201);
})

// UPDATE CATEGORY
categoryController.put('/:id_category', async (c) => {
    const id = parseInt(c.req.param('id_category'));
    
    const req = await c.req.json() as CreateCategoryRequest;

    const res = await CategoryService.updateCategory(id, req);
    return c.json({
        success: true,
        message: "Category updated successfully",
        data: res,
    });
})

// DELETE CATEGORY
categoryController.delete('/:id_category', async (c) => {
    const id = parseInt(c.req.param('id_category'));

    await CategoryService.deleteCategory(id);

    return c.json({
        success: true,
        message: "Category deleted successfully",
    });
});
    



