import { describe, it, expect, afterEach, beforeEach } from 'bun:test';
import app from '..';
import { logger } from '../application/logging';
import { PaymentMethodTest, UserTest } from './test-util';

describe('POST /api/payment-methods', () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });


    it('should create a payment method successfully', async () => {
        const response = await app.request('/api/payment-methods', {
            method: 'POST',
            headers: {
                'Authorization': 'test'
            },
            body: JSON.stringify({
                payment_method: 'Test Payment Method'
            }),
        });

        expect(response.status).toBe(201);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(true);
        expect(body.message).toBe('Payment method created successfully');
        expect(body.data.payment_method).toBe('Test Payment Method');

        await PaymentMethodTest.delete();
    });

    it('should return an error if payment method name already exists', async () => {
        await PaymentMethodTest.create();

        const res = await app.request('/api/payment-methods', {
            method: 'POST',
            headers: {
                'Authorization': 'test'
            },
            body: JSON.stringify({
                payment_method: 'Test Payment Method'
            }),
        });

        expect(res.status).toBe(400);
        const body = await res.json();
        logger.debug(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Payment method name already exists');

        // Clean up the test data
        await PaymentMethodTest.delete();
    });

    it('should return an error if payment method name is empty', async () => {
        const response = await app.request('/api/payment-methods', {
            method: 'POST',
            headers: {
                'Authorization': 'test'
            },
            body: JSON.stringify({
                payment_method: ''
            }),
        });

        expect(response.status).toBe(400);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(false);
        expect(body.message).toBeDefined();
    });

    it('should return an error if user is not authenticated', async () => {
        const response = await app.request('/api/payment-methods', {
            method: 'POST',
            body: JSON.stringify({
                payment_method: 'Test Payment Method'
            }),
        });

        expect(response.status).toBe(401);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Unauthorized');
    });
})

describe('GET /api/payment-methods', () => {
    beforeEach(async () => {
        await PaymentMethodTest.createMany(10);
    });

    afterEach(async () => {
        await PaymentMethodTest.deleteMany();
    });

    it('should get all payment methods successfully', async () => {
        const response = await app.request('/api/payment-methods', {
            method: 'GET',
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(true);
        expect(body.message).toBe('Payment methods retrieved successfully');
        expect(body.data.payment_methods.length).toBeGreaterThan(0);
    });
})

describe('GET /api/payment-methods/:id', () => {
    beforeEach(async () => {
        await PaymentMethodTest.create();
    });

    afterEach(async () => {
        await PaymentMethodTest.delete();
    });

    it('should get a payment method by ID successfully', async () => {
        const response = await app.request('/api/payment-methods/1', {
            method: 'GET',
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(true);
        expect(body.message).toBe('Payment method retrieved successfully');
    });

    it('should return an error if payment method ID is invalid', async () => {
        const response = await app.request('/api/payment-methods/invalid', {
            method: 'GET',
        });

        expect(response.status).toBe(400);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Invalid payment method ID');
    });

    it('should return an error if payment method not found', async () => {
        const response = await app.request('/api/payment-methods/999', {
            method: 'GET',
        });

        expect(response.status).toBe(404);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Payment method not found');
    });
})

describe('PUT /api/payment-methods/:id', () => {
    beforeEach(async () => {
        await UserTest.create();
        await PaymentMethodTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
        await PaymentMethodTest.delete();
    });

    it('should update a payment method successfully', async () => {
        const response = await app.request('/api/payment-methods/1', {
            method: 'PUT',
            headers: {
                'Authorization': 'test'
            },
            body: JSON.stringify({
                payment_method: 'Test Payment Method Updated',
            }),
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(true);
        expect(body.message).toBe('Payment method updated successfully');
        expect(body.data.payment_method).toBe('Test Payment Method Updated');

        // Clean up the test data
        await PaymentMethodTest.deleteMany();
    });

    it('should return an error if payment method name already exists', async () => {
        await PaymentMethodTest.createMany();
        const response = await app.request('/api/payment-methods/1', {
            method: 'PUT',
            headers: {
                'Authorization': 'test'
            },
            body: JSON.stringify({
                payment_method: 'Test Payment Method 2',
            }),
        });

        expect(response.status).toBe(400);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Payment method name already exists');

        await PaymentMethodTest.deleteMany();
    });

    it('should return an error if payment method ID is invalid', async () => {
        const response = await app.request('/api/payment-methods/invalid', {
            method: 'PUT',
            headers: {
                'Authorization': 'test'
            },
            body: JSON.stringify({
                payment_method: 'Updated Payment Method'
            }),
        });

        expect(response.status).toBe(400);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Invalid payment method ID');
    });

    it('should return an error if user is not authenticated', async () => {
        const response = await app.request('/api/payment-methods/1', {
            method: 'PUT',
            body: JSON.stringify({
                payment_method: 'Updated Payment Method'
            }),
        });

        expect(response.status).toBe(401);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Unauthorized');
    })

})

describe('DELETE /api/payment-methods/:id', () => {
    beforeEach(async () => {
        await UserTest.create();
        await PaymentMethodTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
        await PaymentMethodTest.delete();
    });

    it('should delete a payment method successfully', async () => {
        const response = await app.request('/api/payment-methods/1', {
            method: 'DELETE',
            headers: {
                'Authorization': 'test'
            },
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(true);
        expect(body.message).toBe('Payment method deleted successfully');

        // Clean up the test data
        await PaymentMethodTest.deleteMany();
    });

    it('should return an error if payment method ID is invalid', async () => {
        const response = await app.request('/api/payment-methods/invalid', {
            method: 'DELETE',
            headers: {
                'Authorization': 'test'
            },
        });

        expect(response.status).toBe(400);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Invalid payment method ID');
    });

    it('should return an error if payment method not found', async () => {
        const response = await app.request('/api/payment-methods/999', {
            method: 'DELETE',
            headers: {
                'Authorization': 'test'
            },
        });

        expect(response.status).toBe(404);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Payment method not found');
    });

    it('should return an error if user is not authenticated', async () => {
        const response = await app.request('/api/payment-methods/1', {
            method: 'DELETE',
        });

        expect(response.status).toBe(401);
        const body = await response.json();
        logger.debug(body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Unauthorized');
    });
})