import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database";
import { CreateTransactionRequest, toTransactionResponse, TransactionResponse, UpdateTransactionRequest } from "../model/transaction-model";
import { TransactionValidation } from "../validation/transaction-validation";
import { verifyJwt } from "../application/jwt";

export class TransactionService {

    static async createTransaction(req: CreateTransactionRequest, token: string): Promise<TransactionResponse> {
        req = TransactionValidation.CREATE.parse(req);
        const payload = await verifyJwt(token);
        if (!payload || !payload.id_user) {
            throw new HTTPException(401, {
                message: "Unauthorized",
            });
        }
        const transaction = await prismaClient.transaction.create({
            data: {
                ...req,
                id_user: Number(payload.id_user),
            }
        });

        return toTransactionResponse(transaction);
    }

    static async getAllTransactions(): Promise<TransactionResponse[]> {
        const transactions = await prismaClient.transaction.findMany({
            include: {
                paymentMethod: true,
            }
        });

        return transactions.map(toTransactionResponse);
    }

    static async getTransactionById(id: number): Promise<TransactionResponse> {
        const transaction = await prismaClient.transaction.findUnique({
            where: {
                id_transaction: id,
            },
            include: {
                paymentMethod: true,
            }
        });

        if (!transaction) {
            throw new HTTPException(404, {
                message: "Transaction not found",
            });
        }

        return toTransactionResponse(transaction);
    }

    static async updateTransaction(id: number, req: UpdateTransactionRequest): Promise<TransactionResponse> {
        req = TransactionValidation.UPDATE.parse(req);

        const existingTransaction = await prismaClient.transaction.findUnique({
            where: {
                id_transaction: id,
            },
        });
        if (!existingTransaction) {
            throw new HTTPException(404, {
                message: "Transaction not found",
            });
        }
        const transaction = await prismaClient.transaction.update({
            where: {
                id_transaction: id,
            },
            data: {
                ...req,
                updated_at: new Date(),
            },
        });

        return toTransactionResponse(transaction);
    }
    
    static async deleteTransaction(id: number): Promise<void> {
        const existingTransaction = await prismaClient.transaction.findUnique({
            where: {
                id_transaction: id,
            },
        });
        if (!existingTransaction) {
            throw new HTTPException(404, {
                message: "Transaction not found",
            });
        }
        await prismaClient.transaction.delete({
            where: {
                id_transaction: id,
            },
        });
    }
}