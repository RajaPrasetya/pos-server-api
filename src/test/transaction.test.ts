import { describe, it, expect, afterEach, beforeEach } from 'bun:test';
import app from '..';
import { logger } from '../application/logging';
import { PaymentMethodTest, TransactionTest, UserTest } from './test-util';

let token: string;

describe('POST /api/transactions', () => {
    beforeEach(async () => {
        await PaymentMethodTest.create();
        token = await UserTest.create();
    })

    afterEach(async () => {
        await TransactionTest.delete(token);
        await PaymentMethodTest.delete();
        await UserTest.delete();
    })
    
    it('should create a transaction successfully', async () => {
        const response = await app.request('/api/transactions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                total_price: 100,
                payment_method: 1,
                status: 'pending',
            }),
        });

        expect(response.status).toBe(201);
        const body = await response.json();
        logger.info(body);
        expect(body.success).toBe(true);
        expect(body.message).toBe('Transaction created successfully');
    });

    it('should return 401 if token is missing', async () => {
        const response = await app.request('/api/transactions', {
            method: 'POST',
            body: JSON.stringify({
                total_price: 100,
                payment_method: 1,
                status: 'pending',
            }),
        });

        expect(response.status).toBe(401);
        const body = await response.json();
        logger.info(body);
        expect(body.message).toBe('Unauthorized');
    });

    it('should return 400 if request body is invalid', async () => {
        const response = await app.request('/api/transactions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                total_price: -100, // Invalid total_price
                payment_method: 1,
                status: 'pending',
            }),
        });

        expect(response.status).toBe(400);
        const body = await response.json();
        logger.info(body);
        expect(body.errors).toBeDefined();
    });
})

describe('GET /api/transactions', () => {
    beforeEach(async () => {
        await PaymentMethodTest.create();
        token = await UserTest.create();
        await TransactionTest.createMany(10, token);
    })

    afterEach(async () => {
        await TransactionTest.delete(token);
        await PaymentMethodTest.delete();
        await UserTest.delete();
    })

    it('should get all transactions successfully', async () => {
        const response = await app.request('/api/transactions', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        logger.info(body);
        expect(body.success).toBe(true);
        expect(body.data.transactions.length).toBeGreaterThan(0);
    });

    it('should return 401 if token is missing', async () => {
        const response = await app.request('/api/transactions', {
            method: 'GET',
        });

        expect(response.status).toBe(401);
        const body = await response.json();
        logger.info(body);
        expect(body.message).toBe('Unauthorized');
    });
})

describe('GET /api/transactions/:id', () => {
    beforeEach(async () => {
        await PaymentMethodTest.create();
        token = await UserTest.create();
        await TransactionTest.create(token);
    })

    afterEach(async () => {
        await TransactionTest.delete(token);
        await PaymentMethodTest.delete();
        await UserTest.delete();
    })

    it('should get a transaction by ID successfully', async () => {
        const transaction = await TransactionTest.get(token);
        expect(transaction).not.toBeNull();
        const response = await app.request(`/api/transactions/${transaction!.id_transaction}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        logger.info(body);
        expect(body.success).toBe(true);
        expect(body.data.id_transaction).toBe(transaction!.id_transaction);
    });

    it('should return 404 if transaction not found', async () => {
        const response = await app.request('/api/transactions/9999', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        expect(response.status).toBe(404);
        const body = await response.json();
        logger.info(body);
        expect(body.message).toBe('Transaction not found');
    });

    it('should return 401 if token is missing', async () => {
        const response = await app.request('/api/transactions/1', {
            method: 'GET',
        });

        expect(response.status).toBe(401);
        const body = await response.json();
        logger.info(body);
        expect(body.message).toBe('Unauthorized');
    });
})

describe('PUT /api/transactions/:id', () => {
    beforeEach(async () => {
        await PaymentMethodTest.create();
        token = await UserTest.create();
        await TransactionTest.create(token);
    })

    afterEach(async () => {
        await TransactionTest.delete(token);
        await PaymentMethodTest.delete();
        await UserTest.delete();
    })

    it('should update a transaction successfully', async () => {
        const transaction = await TransactionTest.get(token);
        expect(transaction).not.toBeNull();

        const response = await app.request(`/api/transactions/${transaction!.id_transaction}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                total_price: 200,
                payment_method: 1,
                status: 'completed',
            }),
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        logger.info(body);
        expect(body.success).toBe(true);
        expect(body.data.total_price).toBe("200");
    });

    it('should return 404 if transaction not found', async () => {
        const response = await app.request('/api/transactions/9999', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                total_price: 200,
                payment_method: 1,
                status: 'completed',
            }),
        });

        expect(response.status).toBe(404);
        const body = await response.json();
        logger.info(body);
        expect(body.message).toBe('Transaction not found');
    });

    it('should return 401 if token is missing', async () => {
        const response = await app.request('/api/transactions/1', {
            method: 'PUT',
            body: JSON.stringify({
                total_price: 200,
                payment_method: 1,
                status: 'completed',
            }),
        });

        expect(response.status).toBe(401);
        const body = await response.json();
        logger.info(body);
        expect(body.message).toBe('Unauthorized');
    });
})

describe('DELETE /api/transactions/:id', () => {
    beforeEach(async () => {
        await PaymentMethodTest.create();
        token = await UserTest.create();
        await TransactionTest.create(token);
    })

    afterEach(async () => {
        await TransactionTest.delete(token);
        await PaymentMethodTest.delete();
        await UserTest.delete();
    })

    it('should delete a transaction successfully', async () => {
        const transaction = await TransactionTest.get(token);
        expect(transaction).not.toBeNull();

        const response = await app.request(`/api/transactions/${transaction!.id_transaction}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        expect(response.status).toBe(200);
    });

    it('should return 404 if transaction not found', async () => {
        const response = await app.request('/api/transactions/9999', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        expect(response.status).toBe(404);
        const body = await response.json();
        logger.info(body);
        expect(body.message).toBe('Transaction not found');
    });

    it('should return 401 if token is missing', async () => {
        const response = await app.request('/api/transactions/1', {
            method: 'DELETE',
        });

        expect(response.status).toBe(401);
        const body = await response.json();
        logger.info(body);
        expect(body.message).toBe('Unauthorized');
    });
})