import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database";
import { CreateDetailTransactionRequest, DetailTransactionResponse, toDetailTransactionResponse, UpdateDetailTransactionRequest } from "../model/detail-transaction-model";
import { DetailTransactionValidation } from "../validation/detail-transaction-validation";

export class DetailTransactionService {
    static async createDetailTransaction(req: CreateDetailTransactionRequest): Promise<DetailTransactionResponse> {
        req = DetailTransactionValidation.CREATE.parse(req);

        // Check if transaction exists
        const transaction = await prismaClient.transaction.findUnique({
            where: {
                id_transaction: req.id_transaction,
            },
        });
        if (!transaction) {
            throw new HTTPException(404, {
                message: "Transaction not found",
            });
        }
        // Check if product exists
        const product = await prismaClient.product.findUnique({
            where: {
                id_product: req.id_product,
            },
        });
        if (!product) {
            throw new HTTPException(404, {
                message: "Product not found",
            });
        }
        
        const detailTransaction = await prismaClient.detail_Transaction.create({
            data: req,
        });

        return toDetailTransactionResponse(detailTransaction);
    }

    static async getAllDetailTransactions(): Promise<DetailTransactionResponse[]> {
        const detailTransactions = await prismaClient.detail_Transaction.findMany({
            include: {
                transaction: true,
                product: true,
            }
        });

        if (detailTransactions.length === 0) {
            throw new HTTPException(404, {
                message: "No detail transactions found",
            });
        }

        return detailTransactions.map(toDetailTransactionResponse);
    }

    static async getDetailTransactionById(id: number): Promise<DetailTransactionResponse> {
        const detailTransaction = await prismaClient.detail_Transaction.findUnique({
            where: {
                id_detail: id,
            },
            include: {
                transaction: true,
                product: true,
            }
        });

        if (!detailTransaction) {
            throw new HTTPException(404, {
                message: "Detail transaction not found",
            });
        }

        return toDetailTransactionResponse(detailTransaction);
    }

    // get detail transactions by transaction ID
    static async getDetailTransactionsByTransactionId(transactionId: number): Promise<DetailTransactionResponse[]> {
        const detailTransactions = await prismaClient.detail_Transaction.findMany({
            where: {
                id_transaction: transactionId,
            },
            include: {
                transaction: true,
                product: true,
            }
        });

        if (detailTransactions.length === 0) {
            throw new HTTPException(404, {
                message: "No detail transactions found for this transaction",
            });
        }

        return detailTransactions.map(toDetailTransactionResponse);
    }

    static async updateDetailTransaction(id: number, req: UpdateDetailTransactionRequest): Promise<DetailTransactionResponse> {
        req = DetailTransactionValidation.UPDATE.parse(req);

        // Check if detail transaction exists
        const existingDetailTransaction = await prismaClient.detail_Transaction.findUnique({
            where: {
                id_detail: id,
            },
        });
        if (!existingDetailTransaction) {
            throw new HTTPException(404, {
                message: "Detail transaction not found",
            });
        }
        // Check if transaction exists
        const transaction = await prismaClient.transaction.findUnique({
            where: {
                id_transaction: existingDetailTransaction.id_transaction,
            },
        });
        if (!transaction) {
            throw new HTTPException(404, {
                message: "Transaction not found",
            });
        }

        //only update when transaction status is pending
        if (transaction.status !== "pending") {
            throw new HTTPException(400, {
                message: "Cannot update detail transaction when transaction status is not pending",
            });
        }

        // Check if product exists
        const product = await prismaClient.product.findUnique({
            where: {
                id_product: existingDetailTransaction.id_product,
            },
        });
        if (!product) {
            throw new HTTPException(404, {
                message: "Product not found",
            });
        }

        const detailTransaction = await prismaClient.detail_Transaction.update({
            where: {
                id_detail: id,
            },
            data: req,
        });

        return toDetailTransactionResponse(detailTransaction);
    }

    static async deleteDetailTransaction(id: number): Promise<void> {
        // Check if detail transaction exists
        const existingDetailTransaction = await prismaClient.detail_Transaction.findUnique({
            where: {
                id_detail: id,
            },
        });
        if (!existingDetailTransaction) {
            throw new HTTPException(404, {
                message: "Detail transaction not found",
            });
        }

        // Check if transaction exists
        const transaction = await prismaClient.transaction.findUnique({
            where: {
                id_transaction: existingDetailTransaction.id_transaction,
            },
        });
        if (!transaction) {
            throw new HTTPException(404, {
                message: "Transaction not found",
            });
        }

        //only delete when transaction status is pending
        if (transaction.status !== "pending") {
            throw new HTTPException(400, {
                message: "Cannot delete detail transaction when transaction status is not pending",
            });
        }

        await prismaClient.detail_Transaction.delete({
            where: {
                id_detail: id,
            },
        });
    }
}