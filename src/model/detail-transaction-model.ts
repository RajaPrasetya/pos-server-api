export type CreateDetailTransactionRequest = {
    id_transaction: number;
    id_product: number;
    quantity: number;
}

export type UpdateDetailTransactionRequest = {
    quantity: number;
}

export type DetailTransactionResponse = {
    id_detail: number;
    id_transaction: number;
    id_product: number;
    quantity: number;
}

export function toDetailTransactionResponse(detailTransaction: any): DetailTransactionResponse {
    return {
        id_detail: detailTransaction.id_detail_transaction,
        id_transaction: detailTransaction.id_transaction,
        id_product: detailTransaction.id_product,
        quantity: detailTransaction.quantity,
    };
}