import { describe, it, expect, afterEach, beforeEach } from 'bun:test';
import { CategoryTest, ProductTest, UserTest } from './test-util';
import app from '..';
import { logger } from '../application/logging';

let token: string;

describe('POST /api/products', () => { 
    beforeEach(async () => {
        await CategoryTest.create();
        token = await UserTest.create();
    });

    afterEach(async () => {
        await ProductTest.delete();
        await UserTest.delete();
        await CategoryTest.delete();
    });

    // it should create a new product successfully
    it('should create a new product successfully', async () => {
        const res = await app.request('api/products', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                product_name: "Test Product",
                price: 10000,
                stock: 10,
                description: "This is a test product",
                id_category: 1,
            })
        })

        const body = await res.json();
        logger.debug(body);
        expect(res.status).toBe(201);
        expect(body.data).toBeDefined();
        expect(body.data.product_name).toBe("Test Product");
    })

    // it should fail to create a product if product name already exists
    it('should fail to create a product if product name already exists', async () => {
        await ProductTest.create();

        const res = await app.request('api/products', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                product_name: "Test Product",
                price: 10000,
                stock: 10,
                description: "This is a test product",
                id_category: 1,
            })
        })

        const body = await res.json();
        logger.debug(body);
        expect(res.status).toBe(400);
        expect(body.message).toBe("Product name already exists");
    })

    // it should fail to create a product if product name is empty
    it('should fail to create a product if product name is empty', async () => {
        const res = await app.request('api/products', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                product_name: "",
                price: 10000,
                stock: 10,
                description: "This is a test product",
                id_category: 1,
            })
        })

        const body = await res.json();
        logger.debug(body);
        expect(res.status).toBe(400);
        expect(body.errors).toBeDefined();
    })

    // it should fail to create a product if user is not authenticated
    it('should fail to create a product if user is not authenticated', async () => {
        const res = await app.request('api/products', {
            method: 'POST',
            // Tidak pakai Authorization header
            body: JSON.stringify({
                product_name: "Test Product",
                price: 10000,
                stock: 10,
                description: "This is a test product",
                id_category: 1,
            })
        })

        const body = await res.json();
        logger.debug(body);

        expect(res.status).toBe(401);
        expect(body.message).toBe("Unauthorized");
    })
})

describe('GET /api/products', () => {
    beforeEach(async () => {
        await CategoryTest.create();
        await ProductTest.createMany(10);
    });

    afterEach(async () => {
        await ProductTest.deleteMany();
        await CategoryTest.delete();
    });

    // it should return a list of products
    it('should return a list of products', async () => {
        const res = await app.request('api/products', {
            method: 'GET',
        });

        const body = await res.json();
        logger.debug(body);
        expect(res.status).toBe(200);
        expect(body.data).toBeDefined();
        expect(body.data.products.length).toBeGreaterThan(0);
    })
})

describe('GET /api/products/:id', () => {
    beforeEach(async () => {
        await CategoryTest.create();
        await ProductTest.create();
    });

    afterEach(async () => {
        await ProductTest.delete();
        await CategoryTest.delete();
    });

    // it should return a product by id
    it('should return a product by id', async () => {
        const res = await app.request('api/products/1', {
            method: 'GET',
        });

        const body = await res.json();
        logger.debug(body);
        expect(res.status).toBe(200);
        expect(body.data).toBeDefined();
        expect(body.data.product_name).toBe("Test Product");
    })

    // it should return 404 if product not found
    it('should return 404 if product not found', async () => {
        const res = await app.request('api/products/12345', {
            method: 'GET',
        });

        const body = await res.json();
        logger.debug(body);
        expect(res.status).toBe(404);
        expect(body.message).toBe("Product not found");
    })

    // it should return 400 if id is not a number
    it('should return 400 if id is not a number', async () => {
        const res = await app.request('api/products/abc', {
            method: 'GET',
        });

        const body = await res.json();
        logger.debug(body);
        expect(res.status).toBe(400);
        expect(body.message).toBe("Invalid product ID");
    })
})

describe('PUT /api/products/:id', () => {
    beforeEach(async () => {
        token = await UserTest.create();
        await CategoryTest.create();
        await ProductTest.create();
    });

    afterEach(async () => {
        await ProductTest.delete();
        await CategoryTest.delete();
        await UserTest.delete();
    });

    // it should update a product successfully
    it('should update a product successfully', async () => {
        const res = await app.request('api/products/1', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                product_name: "Test Product Updated",
                price: 20000,
                stock: 20,
                description: "This is an updated product",
                id_category: 1,
                updated_at: new Date().toISOString(),
            })
        })

        const body = await res.json();
        logger.debug(body);
        expect(res.status).toBe(200);
        expect(body.data).toBeDefined();
        expect(body.data.product_name).toBe("Test Product Updated");
        expect(body.data.price).toBe("20000");

        await ProductTest.deleteMany();
    })
    
    // it should fail to update a product if product name already exists
    it('should fail to update a product if product name already exists', async () => {
        await ProductTest.createMany(5);

        const res = await app.request('api/products/1', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                product_name: "Test Product 2",
                price: 20000,
                updated_at: new Date().toISOString(),
            })
        })

        const body = await res.json();
        logger.debug(body);
        expect(res.status).toBe(400);
        expect(body.message).toBe("Product name already exists");

        await ProductTest.deleteMany();
    })

    // it should fail to update a product if product not found
    it('should fail to update a product if product not found', async () => {
        const res = await app.request('api/products/12345', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                product_name: "Test Product Updated",
                price: 20000,
                stock: 20,
                description: "This is an updated product",
                id_category: 1,
            })
        })

        const body = await res.json();
        logger.debug(body);
        expect(res.status).toBe(404);
        expect(body.message).toBe("Product not found");
    })

    // it should fail to update a product if id is not a number
    it('should fail to update a product if id is not a number', async () => {
        const res = await app.request('api/products/abc', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                product_name: "Test Product Updated",
                price: 20000,
                stock: 20,
                description: "This is an updated product",
                id_category: 1,
            })
        })

        const body = await res.json();
        logger.debug(body);
        expect(res.status).toBe(400);
        expect(body.message).toBe("Invalid product ID");
    })

    // it should fail to update a product if user is not authenticated
    it('should fail to update a product if user is not authenticated', async () => {
        const res = await app.request('api/products/1', {
            method: 'PUT',
            // Tidak pakai Authorization header
            body: JSON.stringify({
                product_name: "Test Product Updated",
                price: 20000,
                stock: 20,
                description: "This is an updated product",
                id_category: 1,
            })
        })

        const body = await res.json();
        logger.debug(body);
        expect(res.status).toBe(401);
        expect(body.message).toBe("Unauthorized");
    })
})

describe('DELETE /api/products/:id', () => {
    beforeEach(async () => {
        token = await UserTest.create();
        await CategoryTest.create();
        await ProductTest.create();
    });

    afterEach(async () => {
        await ProductTest.delete();
        await CategoryTest.delete();
        await UserTest.delete();
    });

    // it should delete a product successfully
    it('should delete a product successfully', async () => {
        const res = await app.request('api/products/1', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        expect(res.status).toBe(200);
    })

    // it should fail to delete a product if product not found
    it('should fail to delete a product if product not found', async () => {
        const res = await app.request('api/products/12345', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const body = await res.json();
        logger.debug(body);
        expect(res.status).toBe(404);
        expect(body.message).toBe("Product not found");
    })

    // it should fail to delete a product if id is not a number
    it('should fail to delete a product if id is not a number', async () => {
        const res = await app.request('api/products/abc', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const body = await res.json();
        logger.debug(body);
        expect(res.status).toBe(400);
        expect(body.message).toBe("Invalid product ID");
    })

    // it should fail to delete a product if user is not authenticated
    it('should fail to delete a product if user is not authenticated', async () => {
        const res = await app.request('api/products/1', {
            method: 'DELETE',
            // Tidak pakai Authorization header
        })

        const body = await res.json();
        logger.debug(body);
        expect(res.status).toBe(401);
        expect(body.message).toBe("Unauthorized");
    })

    // it should fail to delete a product if user is not authorized
    it('should fail to delete a product if user is not authorized', async () => {
        const res = await app.request('api/products/1', {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer salah'
            }
        })

        const body = await res.json();
        logger.debug(body);
        expect(res.status).toBe(401);
        expect(body.message).toBe("Unauthorized");
    })
})