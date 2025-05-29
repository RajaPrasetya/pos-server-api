export type CreatePaymentMethodRequest = {
    payment_method: string;
}

export type PaymentMethodResponse = {
    id_payment: number;
    payment_method: string;
    created_at: Date;
    updated_at: Date;
}

export function toPaymentMethodResponse(paymentMethod: any): PaymentMethodResponse {
    return {
        id_payment: paymentMethod.id_payment,
        payment_method: paymentMethod.payment_method,
        created_at: paymentMethod.created_at,
        updated_at: paymentMethod.updated_at,
    };
}