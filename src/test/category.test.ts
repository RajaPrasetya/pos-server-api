import { describe, it, expect, afterEach, beforeEach } from 'bun:test';
import { CategoryTest, UserTest } from './test-util';
import app from '..';
import { logger } from '../application/logging';

let token: string;

describe('POST /api/categories', () => {
    beforeEach(async () => {
        token = await UserTest.create();
    })
    
    afterEach(async () => {
        await CategoryTest.delete();
        await UserTest.delete();
    })

    // it should create a new category successfully
    it('should create a new category successfully', async () => {
        const res = await app.request('api/categories', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                category_name: "Test Category",
            })
        })
        const body = await res.json();
        logger.debug(body);

        expect(res.status).toBe(201);
        expect(body.data).toBeDefined();
        expect(body.data.category_name).toBe("Test Category");
    });

    // it should failed to create a category if category name already exists
    it('should fail to create a category if category name already exists', async () => {
        await CategoryTest.create();

        const res = await app.request('api/categories', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                category_name: "Test Category",
            })
        });
        const body = await res.json();
        logger.debug(body);

        expect(res.status).toBe(400);
        expect(body.message).toBe("Category name already exists");
    })

    // it should failed to create a category if category name is empty
    it('should fail to create a category if category name is empty', async () => {
        const res = await app.request('api/categories', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                category_name: "",
            })
        });
        const body = await res.json();
        logger.debug(body);

        expect(res.status).toBe(400);
        expect(body.errors).toBeDefined();
    })

    // it should fail to create a category if user is not authenticated
    it('should fail to create a category if user is not authenticated', async () => {
        const res = await app.request('api/categories', {
            method: 'POST',
            body: JSON.stringify({
                category_name: "Test Category",
            })
        });
        const body = await res.json();
        logger.debug(body);

        expect(res.status).toBe(401);
        expect(body.message).toBe("Unauthorized");
    })
})

describe('GET /api/categories', () => {
    beforeEach(async () => {
        await CategoryTest.createMany();
    })

    afterEach(async () => {
        await CategoryTest.deleteMany();
    })

    // it should get all categories successfully
    it('should get all categories successfully', async () => {
        const res = await app.request('api/categories');
        const body = await res.json();
        logger.debug(body);

        expect(res.status).toBe(200);
        expect(body.data).toBeDefined();
        expect(body.data.length).toBeGreaterThan(0);
    });

    // it should get a category by id successfully
    it('should get a category by id successfully', async () => {
        await CategoryTest.create();
        const res = await app.request('api/categories/1');
        const body = await res.json();
        logger.debug(body);

        expect(res.status).toBe(200);
        expect(body.data).toBeDefined();
        expect(body.data.id_category).toBe(1);

        await CategoryTest.delete();
    });

    // it should fail to get a category by id if category does not exist
    it('should fail to get a category by id if category does not exist', async () => {
        const res = await app.request('api/categories/999');
        const body = await res.json();
        logger.debug(body);

        expect(res.status).toBe(404);
        expect(body.message).toBe("Category not found");
    });
});

describe('PUT /api/categories/:id_category', () => {
    beforeEach(async () => {
        token = await UserTest.create();
    })

    afterEach(async () => {
        await UserTest.delete();
    })
    //  it should update a category successfully
    it('should update a category successfully', async () => {
        await CategoryTest.create();
        const res = await app.request('api/categories/1', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                category_name: "Test Category 100",
            })
        });
        const body = await res.json();
        logger.debug(body);

        expect(res.status).toBe(200);
        expect(body.data).toBeDefined();
        expect(body.data.category_name).toBe("Test Category 100");
        expect(body.data.id_category).toBe(1);
        await CategoryTest.deleteMany();
    });

    // it should fail to update a category if category name already exists
    it('should fail to update a category if category name already exists', async () => {
        await CategoryTest.create();
        await CategoryTest.createMany(5);
        const res = await app.request('api/categories/1', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                category_name: "Test Category 3",
            })
        });
        const body = await res.json();
        logger.debug(body);

        expect(res.status).toBe(400);
        expect(body.message).toBe("Category name already exists");

        await CategoryTest.deleteMany();
    });
    // it should fail to update a category if category name is empty
    it('should fail to update a category if category name is empty', async () => {
        await CategoryTest.create();
        const res = await app.request('api/categories/1', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                category_name: "",
            })
        })

        const body = await res.json();
        logger.debug(body);
        expect(res.status).toBe(400);
        expect(body.errors).toBeDefined();

        await CategoryTest.delete();
    })
})

describe('DELETE /api/categories/:id_category', () => {
    beforeEach(async () => {
        token = await UserTest.create();
    })

    afterEach(async () => {
        await CategoryTest.delete();
        await UserTest.delete();
    })

    // it should delete a category successfully
    it('should delete a category successfully', async () => {
        await CategoryTest.create();
        const res = await app.request('api/categories/1', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const body = await res.json();
        logger.debug(body);

        expect(res.status).toBe(200);
        expect(body.message).toBe("Category deleted successfully");
    });

    // it should fail to delete a category if category does not exist
    it('should fail to delete a category if category does not exist', async () => {
        const res = await app.request('api/categories/999', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const body = await res.json();
        logger.debug(body);

        expect(res.status).toBe(404);
        expect(body.message).toBe("Category not found");
    });

    // it should fail to delete a category if user is not authenticated
    it('should fail to delete a category if user is not authenticated', async () => {
        const res = await app.request('api/categories/1', {
            method: 'DELETE',
        });
        const body = await res.json();
        logger.debug(body);

        expect(res.status).toBe(401);
        expect(body.message).toBe("Unauthorized");
    });
});

