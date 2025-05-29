import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth-middleware";
import { PaymentMethodService } from "../service/payment-method-service";
import { CreatePaymentMethodRequest } from "../model/payment-method-model";
import { roleMiddleware } from "../middleware/role-middleware";

export const paymentMethodController = new Hono();


// GET ALL PAYMENT METHODS
paymentMethodController.get('/', async (c) => {
    const paymentMethods = await PaymentMethodService.getAllPaymentMethods();

    return c.json({
        success: true,
        message: "Payment methods retrieved successfully",
        data: {
            payment_methods: paymentMethods,
        },
    });
});

// GET PAYMENT METHOD BY ID
paymentMethodController.get('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
        return c.json({
            success: false,
            message: "Invalid payment method ID",
        }, 400);
    }

    const paymentMethod = await PaymentMethodService.getPaymentMethodById(id);

    return c.json({
        success: true,
        message: "Payment method retrieved successfully",
        data: paymentMethod,
    });
});

// Middleware to check authentication
paymentMethodController.use(authMiddleware);
paymentMethodController.use(roleMiddleware(['admin', 'manager']));

// CREATE PAYMENT METHOD
paymentMethodController.post('/', async (c) => {
    const req = await c.req.json() as CreatePaymentMethodRequest;

    const res = await PaymentMethodService.createPaymentMethod(req);

    return c.json({
        success: true,
        message: "Payment method created successfully",
        data: res,
    }, 201);
});

// UPDATE PAYMENT METHOD
paymentMethodController.put('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
        return c.json({
            success: false,
            message: "Invalid payment method ID",
        }, 400);
    }

    const req = await c.req.json() as CreatePaymentMethodRequest;

    const res = await PaymentMethodService.updatePaymentMethod(id, req);

    return c.json({
        success: true,
        message: "Payment method updated successfully",
        data: res,
    });
});

// DELETE PAYMENT METHOD
paymentMethodController.delete('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
        return c.json({
            success: false,
            message: "Invalid payment method ID",
        }, 400);
    }

    await PaymentMethodService.deletePaymentMethod(id);

    return c.json({
        success: true,
        message: "Payment method deleted successfully",
    });
});