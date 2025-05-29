import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth-middleware";
import { TransactionService } from "../service/transaction-service";

export const transactionController = new Hono();

transactionController.use(authMiddleware);

// CREATE TRANSACTION
transactionController.post('/', async (c) => {
    const req = await c.req.json();
    const token = c.req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return c.json({
            success: false,
            message: "Unauthorized",
        }, 401);
    }
        const transaction = await TransactionService.createTransaction(req, token);
        return c.json({
            success: true,
            message: "Transaction created successfully",
            data: transaction,
        }, 201);
});

// GET ALL TRANSACTIONS
transactionController.get('/', async (c) => {
    const transactions = await TransactionService.getAllTransactions();
    return c.json({
        success: true,
        message: "Transactions retrieved successfully",
        data: {
            transactions: transactions,
        },
    });
});

// GET TRANSACTION BY ID
transactionController.get('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) {
        return c.json({
            success: false,
            message: "Invalid transaction ID",
        }, 400);
    }
    const transaction = await TransactionService.getTransactionById(id);
    return c.json({
        success: true,
        message: "Transaction retrieved successfully",
        data: transaction,
    });
});

// UPDATE TRANSACTION
transactionController.put('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) {
        return c.json({
            success: false,
            message: "Invalid transaction ID",
        }, 400);
    }
    const req = await c.req.json();
    const updatedTransaction = await TransactionService.updateTransaction(id, req);
    return c.json({
        success: true,
        message: "Transaction updated successfully",
        data: updatedTransaction,
    });
});

// DELETE TRANSACTION
transactionController.delete('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) {
        return c.json({
            success: false,
            message: "Invalid transaction ID",
        }, 400);
    }
    await TransactionService.deleteTransaction(id);
    return c.json({
        success: true,
        message: "Transaction deleted successfully",
    });
});