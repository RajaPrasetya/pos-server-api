import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth-middleware";
import { DetailTransactionService } from "../service/detail-transaction-service";

export const detailTransactionController = new Hono();

detailTransactionController.use(authMiddleware);

// CREATE DETAIL TRANSACTION
detailTransactionController.post('/', async (c) => {
    const req = await c.req.json();
   
        const detailTransaction = await DetailTransactionService.createDetailTransaction(req);
        return c.json({
            success: true,
            message: "Detail transaction created successfully",
            data: detailTransaction,
        }, 201);

});

// GET ALL DETAIL TRANSACTIONS
detailTransactionController.get('/', async (c) => {
    const detailTransactions = await DetailTransactionService.getAllDetailTransactions();
    return c.json({
        success: true,
        data: {
            detail_transactions: detailTransactions,
        },
    }, 200);
});

// GET DETAIL TRANSACTION BY ID
detailTransactionController.get('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) {
        return c.json({
            success: false,
            message: "Invalid ID",
        }, 400);
    }
    const detailTransaction = await DetailTransactionService.getDetailTransactionById(id);
    return c.json({
        success: true,
        message: "Detail transaction retrieved successfully",
        data: detailTransaction,
    }, 200);
});

// GET DETAIL TRANSACTIONS BY TRANSACTION ID
detailTransactionController.get('/transaction/:transactionId', async (c) => {
    const transactionId = Number(c.req.param('transactionId'));
    if (isNaN(transactionId)) {
        return c.json({
            success: false,
            message: "Invalid Transaction ID",
        }, 400);
    }
    const detailTransactions = await DetailTransactionService.getDetailTransactionsByTransactionId(transactionId);
    return c.json({
        success: true,
        message: "Detail transactions retrieved successfully",
        data: detailTransactions,
    }, 200);
});

// UPDATE DETAIL TRANSACTION
detailTransactionController.put('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) {
        return c.json({
            success: false,
            message: "Invalid ID",
        }, 400);
    }
    const req = await c.req.json();

    const updatedDetailTransaction = await DetailTransactionService.updateDetailTransaction(id, req);
    return c.json({
        success: true,
        message: "Detail transaction updated successfully",
        data: updatedDetailTransaction,
    }, 200);
});

// DELETE DETAIL TRANSACTION
detailTransactionController.delete('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) {
        return c.json({
            success: false,
            message: "Invalid ID",
        }, 400);
    }

    await DetailTransactionService.deleteDetailTransaction(id);
    return c.json({
        success: true,
        message: "Detail transaction deleted successfully",
    }, 200);
});