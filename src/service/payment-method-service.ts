import { HTTPException } from "hono/http-exception";
import { CreatePaymentMethodRequest, PaymentMethodResponse, toPaymentMethodResponse } from "../model/payment-method-model";
import { PaymentMethodValidation } from "../validation/payment-method-validation";
import { prismaClient } from "../application/database";

export class PaymentMethodService {

    static async createPaymentMethod(req: CreatePaymentMethodRequest): Promise<PaymentMethodResponse> {
        req = PaymentMethodValidation.CREATE.parse(req);

        const existing = await prismaClient.payment_Method.findUnique({
            where: { payment_method: req.payment_method }
        });
        if (existing) {
            throw new HTTPException(400, {
                message: "Payment method name already exists",
            });
        }

        const paymentMethod = await prismaClient.payment_Method.create({
            data: req,
        });

        return toPaymentMethodResponse(paymentMethod);
    }

    static async getAllPaymentMethods(): Promise<PaymentMethodResponse[]> {
        const paymentMethods = await prismaClient.payment_Method.findMany();

        return paymentMethods.map(toPaymentMethodResponse);
    }

    static async getPaymentMethodById(id: number): Promise<PaymentMethodResponse> {
        const paymentMethod = await prismaClient.payment_Method.findUnique({
            where: {
                id_payment: id,
            }
        });

        if (!paymentMethod) {
            throw new HTTPException(404, {
                message: "Payment method not found",
            });
        }

        return toPaymentMethodResponse(paymentMethod);
    }

    static async updatePaymentMethod(id: number, req: CreatePaymentMethodRequest): Promise<PaymentMethodResponse> {
        req = PaymentMethodValidation.UPDATE.parse(req);

        const totalPaymentMethodWithSameName = await prismaClient.payment_Method.count({
            where: {
                payment_method: req.payment_method,
                id_payment: {
                    not: id,
                }
            }
        });
        if (totalPaymentMethodWithSameName > 0) {
            throw new HTTPException(400, {
                message: "Payment method name already exists",
            });
        }

        const paymentMethod = await prismaClient.payment_Method.update({
            where: {
                id_payment: id,
            },
            data: req,
        });

        return toPaymentMethodResponse(paymentMethod);
    }

    static async deletePaymentMethod(id: number): Promise<void> {
        const paymentMethod = await prismaClient.payment_Method.findUnique({
            where: {
                id_payment: id,
            }
        });

        if (!paymentMethod) {
            throw new HTTPException(404, {
                message: "Payment method not found",
            });
        }

        await prismaClient.payment_Method.delete({
            where: {
                id_payment: id,
            }
        });
    }

}