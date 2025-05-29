export type CreateTransactionRequest = {
    total_price: number;
    payment_method: number;
    status: string;
}

export type UpdateTransactionRequest = {
    total_price?: number;
    payment_method?: number;
    status?: string;
    updated_at: Date;
}

export type TransactionResponse = {
    id_transaction: number;
    total_price: number;
    payment_method: number;
    status: string;
    id_user: number;
    created_at: Date;
    updated_at: Date;
}

export type UpdateTransactionResponse = {
    id_transaction: number;
    total_price?: number;
    payment_method?: number;
    status?: string;
    id_user: number;
    created_at: Date;
    updated_at: Date;
}

export function toTransactionResponse(transaction: any): TransactionResponse {
    return {
        id_transaction: transaction.id_transaction,
        total_price: transaction.total_price,
        payment_method: transaction.payment_method,
        status: transaction.status,
        id_user: transaction.id_user,
        created_at: transaction.created_at,
        updated_at: transaction.updated_at,
    };
}