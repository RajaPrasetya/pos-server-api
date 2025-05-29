import { describe, it, expect, afterEach, beforeEach } from 'bun:test';
import app from '..';
import { logger } from '../application/logging';
import { CategoryTest, DetailTransactionTest, PaymentMethodTest, ProductTest, TransactionTest, UserTest } from './test-util';

let token: string;
let transactionId: number;

describe('POST /api/transaction-details', () => {
    beforeEach(async () => {
        token = await UserTest.create();
        await CategoryTest.create();
        await ProductTest.create();
        await PaymentMethodTest.create();
        await TransactionTest.create(token);
        transactionId = (await TransactionTest.get(token))!.id_transaction;
    })

    afterEach(async () => {
        await DetailTransactionTest.delete();
        await TransactionTest.delete(token);
        await PaymentMethodTest.delete();
        await UserTest.delete();
        await ProductTest.delete();
        await CategoryTest.delete();
    })

    it('should create a detail transaction', async () => {
        const response = await app.request('/api/transaction-details', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                id_transaction: transactionId,
                id_product: 1,
                quantity: 2,
            }),
        })

        expect(response.status).toBe(201);
        const body = await response.json();
        logger.debug(body);
        logger.error(body);
        expect(body.success).toBe(true);
        expect(body.message).toBe('Detail transaction created successfully');
    })

    it('should return 401 if token is missing', async () => {
        const transactions = await TransactionTest.get(token);
        expect(transactions!.id_transaction).not.toBeNull();
        const response = await app.request('/api/transaction-details', {
            method: 'POST',
            body: JSON.stringify({
                id_transaction: transactions!.id_transaction,
                id_product: 1,
                quantity: 2,
            }),
        })

        expect(response.status).toBe(401);
        const body = await response.json();
        logger.info(body);
        expect(body.message).toBe('Unauthorized');
    })

    it('should return 400 if request body is invalid', async () => {
        const transactions = await TransactionTest.get(token);
        expect(transactions!.id_transaction).not.toBeNull();
        const response = await app.request('/api/transaction-details', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                id_transaction: transactions!.id_transaction,
                id_product: 1,
                quantity: -2, // Invalid quantity
            }),
        })

        expect(response.status).toBe(400);
        const body = await response.json();
        logger.info(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Validation error');
    })

    it('should return 404 if transaction does not exist', async () => {
        const response = await app.request('/api/transaction-details', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                id_transaction: 9999, // Non-existent transaction
                id_product: 1,
                quantity: 2,
            }),
        })

        expect(response.status).toBe(404);
        const body = await response.json();
        logger.info(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Transaction not found');
    })

    it('should return 404 if product does not exist', async () => {
        const transactions = await TransactionTest.get(token);
        expect(transactions!.id_transaction).not.toBeNull();
        const response = await app.request('/api/transaction-details', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                id_transaction: transactions!.id_transaction,
                id_product: 9999, // Non-existent product
                quantity: 2,
            }),
        })

        expect(response.status).toBe(404);
        const body = await response.json();
        logger.info(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Product not found');
    })
})

describe('GET /api/transaction-details', () => {
    beforeEach(async () => {
        token = await UserTest.create();
        await CategoryTest.create();
        await ProductTest.create();
        await PaymentMethodTest.create();
        await TransactionTest.create(token);
        transactionId = (await TransactionTest.get(token))!.id_transaction;
    })

    afterEach(async () => {
        await DetailTransactionTest.delete();
        await TransactionTest.delete(token);
        await PaymentMethodTest.delete();
        await UserTest.delete();
        await ProductTest.delete();
        await CategoryTest.delete();
    })


    it('should get all detail transactions', async () => {
        await DetailTransactionTest.createMany(10, transactionId);

        const response = await app.request('/api/transaction-details', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(true);
        expect(body.data.detail_transactions).toBeDefined();
        expect(Array.isArray(body.data.detail_transactions)).toBe(true);
    })

    it('should return 401 if token is missing', async () => {
        const response = await app.request('/api/transaction-details', {
            method: 'GET',
        });

        expect(response.status).toBe(401);
        const body = await response.json();
        logger.info(body);
        expect(body.message).toBe('Unauthorized');
    })

    it('should return 404 if no detail transactions found', async () => {
        const response = await app.request('/api/transaction-details', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        expect(response.status).toBe(404);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('No detail transactions found');
    })
})

describe('GET /api/transaction-details/:id', () => {
    beforeEach(async () => {
        token = await UserTest.create();
        await CategoryTest.create();
        await ProductTest.create();
        await PaymentMethodTest.create();
        await TransactionTest.create(token);
        transactionId = (await TransactionTest.get(token))!.id_transaction;
    })

    afterEach(async () => {
        await DetailTransactionTest.delete();
        await TransactionTest.delete(token);
        await PaymentMethodTest.delete();
        await UserTest.delete();
        await ProductTest.delete();
        await CategoryTest.delete();
    })

    it('should get detail transaction by id', async () => {
        await DetailTransactionTest.create(transactionId);

        const response = await app.request(`/api/transaction-details/1`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(true);
        expect(body.data.id_product).toBe(1);
    })

    it('should return 400 if id is not a number', async () => {
        const response = await app.request('/api/transaction-details/invalid-id', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        expect(response.status).toBe(400);
        const body = await response.json();
        logger.info(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Invalid ID');
    })

    it('should return 404 if detail transaction does not exist', async () => {
        const response = await app.request('/api/transaction-details/9999', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        expect(response.status).toBe(404);
        const body = await response.json();
        logger.info(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Detail transaction not found');
    })

    it('should return 401 if token is missing', async () => {
        const response = await app.request('/api/transaction-details/1', {
            method: 'GET',
        });

        expect(response.status).toBe(401);
        const body = await response.json();
        logger.info(body);
        expect(body.message).toBe('Unauthorized');
    })

    it('should return 404 if detail transaction not found', async () => {
        const response = await app.request('/api/transaction-details/9999', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        expect(response.status).toBe(404);
        const body = await response.json();
        logger.info(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Detail transaction not found');
    })
})

describe('GET /api/transaction-details/:transactionId', () => {
    beforeEach(async () => {
        token = await UserTest.create();
        await CategoryTest.create();
        await ProductTest.create();
        await PaymentMethodTest.create();
        await TransactionTest.create(token);
        transactionId = (await TransactionTest.get(token))!.id_transaction;
    })

    afterEach(async () => {
        await DetailTransactionTest.delete();
        await TransactionTest.delete(token);
        await PaymentMethodTest.delete();
        await UserTest.delete();
        await ProductTest.delete();
        await CategoryTest.delete();
    })

    it('should get detail transactions by transaction id', async () => {
        await DetailTransactionTest.createMany(10, transactionId);

        const response = await app.request(`/api/transaction-details/transaction/${transactionId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(true);
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data.length).toBeLessThanOrEqual(10);
    })

    it('should return 400 if transaction id is not a number', async () => {
        const response = await app.request('/api/transaction-details/transaction/invalid-id', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        expect(response.status).toBe(400);
        const body = await response.json();
        logger.info(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Invalid Transaction ID');
    })

    it('should return 404 if no detail transactions found for transaction id', async () => {
        const response = await app.request(`/api/transaction-details/transaction/${transactionId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        expect(response.status).toBe(404);
        const body = await response.json();
        logger.info(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('No detail transactions found for this transaction');
    })

    it('should return 401 if token is missing', async () => {
        const response = await app.request(`/api/transaction-details/transaction/${transactionId}`, {
            method: 'GET',
        });

        expect(response.status).toBe(401);
        const body = await response.json();
        logger.info(body);
        expect(body.message).toBe('Unauthorized');
    })
})

describe('PUT /api/transaction-details/:id', () => {
    beforeEach(async () => {
        token = await UserTest.create();
        await CategoryTest.create();
        await ProductTest.create();
        await PaymentMethodTest.create();
        await TransactionTest.create(token);
        transactionId = (await TransactionTest.get(token))!.id_transaction;
    })

    afterEach(async () => {
        await DetailTransactionTest.delete();
        await TransactionTest.delete(token);
        await PaymentMethodTest.delete();
        await UserTest.delete();
        await ProductTest.delete();
        await CategoryTest.delete();
    })

    it('should update a detail transaction', async () => {
        await DetailTransactionTest.create(transactionId);

        const response = await app.request('/api/transaction-details/1', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                quantity: 3,
            }),
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        logger.debug( 'disini debug' +  body);
        expect(body.success).toBe(true);
        expect(body.message).toBe('Detail transaction updated successfully');
    })

    it('should return 400 if id is not a number', async () => {
        const response = await app.request('/api/transaction-details/invalid-id', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                quantity: 3,
            }),
        });

        expect(response.status).toBe(400);
        const body = await response.json();
        logger.info(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Invalid ID');
    })

    it('should return 404 if detail transaction does not exist', async () => {
        const response = await app.request('/api/transaction-details/9999', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                quantity: 3,
            }),
        });

        expect(response.status).toBe(404);
        const body = await response.json();
        logger.info(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Detail transaction not found');
    })

    it('should return 400 if transaction status is not pending', async () => {
        await DetailTransactionTest.create(transactionId);
        // Update the transaction status to something other than pending
        await app.request(`/api/transactions/${transactionId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                status: 'completed', // Change status to completed
            }),
        })
        const response = await app.request('/api/transaction-details/1', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                quantity: 3,
            }),
        });

        expect(response.status).toBe(400);
        const body = await response.json();
        logger.info(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Cannot update detail transaction when transaction status is not pending');
    })
})

describe('DELETE /api/transaction-details/:id', () => {
    beforeEach(async () => {
        token = await UserTest.create();
        await CategoryTest.create();
        await ProductTest.create();
        await PaymentMethodTest.create();
        await TransactionTest.create(token);
        transactionId = (await TransactionTest.get(token))!.id_transaction;
    })

    afterEach(async () => {
        await DetailTransactionTest.delete();
        await TransactionTest.delete(token);
        await PaymentMethodTest.delete();
        await UserTest.delete();
        await ProductTest.delete();
        await CategoryTest.delete();
    })

    it('should delete a detail transaction', async () => {
        await DetailTransactionTest.create(transactionId);

        const response = await app.request('/api/transaction-details/1', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(true);
        expect(body.message).toBe('Detail transaction deleted successfully');
    })

    it('should return 400 if id is not a number', async () => {
        const response = await app.request('/api/transaction-details/invalid-id', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        expect(response.status).toBe(400);
        const body = await response.json();
        logger.info(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Invalid ID');
    })

    it('should return 404 if detail transaction does not exist', async () => {
        const response = await app.request('/api/transaction-details/9999', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        expect(response.status).toBe(404);
        const body = await response.json();
        logger.info(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Detail transaction not found');
    })

    it('should return 401 if token is missing', async () => {
        const response = await app.request('/api/transaction-details/1', {
            method: 'DELETE',
        });

        expect(response.status).toBe(401);
        const body = await response.json();
        logger.info(body);
        expect(body.message).toBe('Unauthorized');
    })

    it('should return 400 if transaction status is not pending', async () => {
        await DetailTransactionTest.create(transactionId);
        // Update the transaction status to something other than pending
        await app.request(`/api/transactions/${transactionId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                status: 'completed', // Change status to completed
            }),
        })
        const response = await app.request('/api/transaction-details/1', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        expect(response.status).toBe(400);
        const body = await response.json();
        logger.info(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Cannot delete detail transaction when transaction status is not pending');
    })
})