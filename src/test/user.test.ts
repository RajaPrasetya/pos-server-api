import { describe, it, expect, afterEach, beforeEach } from 'bun:test';
import app from '..';
import { logger } from '../application/logging';
import { UserTest } from './test-util';

describe('POST /api/users', () => {

    afterEach(async () => {
        await UserTest.delete();
    })

    //reject register if request body is invalid
    it('should reject register if request body is invalid', async () => {
        const res = await app.request('api/users', {
            method: 'POST',
            body: JSON.stringify({
                // Missing required fields
                username: 'testuser',
                password: "",
                email: "",
                role: ""
            }), // Invalid body
        })

        const body = await res.json();
        logger.debug(body);

        expect(res.status).toBe(400);
        expect(body.errors).toBeDefined();


    })

    //rejects register if username already exists
    it('should reject register if username already exists', async () => {
        await UserTest.create();

        const res = await app.request('api/users', {
            method: 'POST',
            body: JSON.stringify({
                // Missing required fields
                username: 'testuser',
                password: "test1234",
                email: "test@gmail.com",
                role: "cashier"
            }), // Invalid body
        })

        const body = await res.json();
        logger.debug(body);

        expect(res.status).toBe(400);
        expect(body.errors || body.message).toBeDefined();
    })

    //rejects register if email already exists
    it('should reject register if email already exists', async () => {
        await UserTest.create();

        const res = await app.request('api/users', {
            method: 'POST',
            body: JSON.stringify({
                // Missing required fields
                username: 'testuser123',
                password: "test1234",
                email: "test@gmail.com",
                role: "cashier"
            }), // Invalid body
        })

        const body = await res.json();
        logger.debug(body);

        expect(res.status).toBe(400);
        expect(body.errors || body.message).toBeDefined();
    })

    //registers user successfully
    it('should register user successfully', async () => {
        const res = await app.request('api/users', {
            method: 'POST',
            body: JSON.stringify({
                // Missing required fields
                username: 'testuser',
                password: "test1234",
                email: "test@gmail.com",
                role: "cashier"
            }), // Invalid body
        })

        const body = await res.json();
        logger.debug(body);

        expect(res.status).toBe(201);
        expect(body.data).toBeDefined();
        expect(body.data.username).toBe('testuser');
        expect(body.data.email).toBe('test@gmail.com');
        expect(body.data.role).toBe('cashier');
    })
})

describe('POST /api/users/login', () => {

    beforeEach(async () => {
        await UserTest.create()
    })

    afterEach(async () => {
        await UserTest.delete();
    })

    //should be able to login
    it('should be able to login', async () => {
        const res = await app.request('/api/users/login', {
            method: "POST",
            body: JSON.stringify({
                username: 'testuser',
                password: "test1234",
            }),
        })

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.data.token).toBeDefined();
    })

    //rejects login if username is wrong
    it('should reject login if username is wrong', async () => {
        const res = await app.request('/api/users/login', {
            method: "POST",
            body: JSON.stringify({
                username: 'salah',
                password: "test1234",
            }),
        })

        expect(res.status).toBe(401);
        const body = await res.json();
        expect(body.errors || body.message).toBeDefined();
    })

    //rejects login if password is wrong
    it('should reject login if password is wrong', async () => {
        const res = await app.request('/api/users/login', {
            method: "POST",
            body: JSON.stringify({
                username: 'testuser',
                password: "test123",
            }),
        })

        expect(res.status).toBe(401);
        const body = await res.json();
        expect(body.errors || body.message).toBeDefined();
    })
})

describe('GET /api/users', () => {

    beforeEach(async () => {
        await UserTest.create()
    })

    afterEach(async () => {
        await UserTest.delete();
    })

    it('should get user details', async () => {
        const res = await app.request('/api/users/current', {
            method: 'GET',
            headers: {
                'Authorization': 'test',
            }
        })

        expect(res.status).toBe(200);

        const body = await res.json();
        logger.debug(body);
        expect(body.data).toBeDefined();
        expect(body.data.username).toBe('testuser');
        expect(body.data.email).toBe('test@gmail.com');
    })

    it('should not be able to get user if token is invalid', async () => {
        const res = await app.request('/api/users/current', {
            method: 'GET',
            headers: {
                'Authorization': 'salah',
            }
        })

        expect(res.status).toBe(401);

        const body = await res.json();
        logger.debug(body);
        expect(body.errors || body.message).toBeDefined();

    })

    it('should not be able to get user if no Authorization Header', async () => {
        const res = await app.request('/api/users/current', {
            method: 'GET',
        })

        expect(res.status).toBe(401);

        const body = await res.json();
        logger.debug(body);
        expect(body.errors || body.message).toBeDefined();

    })
})

describe('DELETE /api/users/logout', () => {
    beforeEach(async () => {
        await UserTest.create()
    })

    afterEach(async () => {
        await UserTest.delete();
    })

    it('should revoke user token', async()=> {
        const res = await app.request('/api/users/logout', {
            method: 'delete',
            headers: {
                'Authorization': 'test',
            }
        })

        expect(res.status).toBe(200);

        const body = await res.json();
        expect(body.data).toBeDefined();
        expect(body.message).toBe('User logged out successfully');
    })

    it('should not be able to logout if token is invalid', async()=> {
        let res = await app.request('/api/users/logout', {
            method: 'delete',
            headers: {
                'Authorization': 'test',
            }
        })

        expect(res.status).toBe(200);
        let body = await res.json();
        expect(body.data).toBeDefined();
        expect(body.message).toBe('User logged out successfully');

        res = await app.request('/api/users/logout', {
            method: 'delete',
            headers: {
                'Authorization': 'test',
            }
        })
        expect(res.status).toBe(401);
        body = await res.json();
        expect(body.errors || body.message).toBeDefined();
    })
}) 

describe('GET /api/users/:username', () => {
    beforeEach(async () => {
        await UserTest.create()
    })

    afterEach(async () => {
        await UserTest.delete();
    })

   it('should get user by username', async () => {
        const res = await app.request('/api/users/testuser', {
            method: 'GET',
            headers: {
                'Authorization' : 'test',
            }
        })
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.data).toBeDefined();
        expect(body.data.username).toBe('testuser');
   })
})

describe('GET /api/users', () => {
    beforeEach(async () => {
        await UserTest.createMany(10);
    })

    afterEach(async () => {
        await UserTest.deleteMany(10);
    })

    it('should get all users', async () => {
        const res = await app.request('/api/users', {
            method: 'GET',
            headers: {
                'Authorization': 'testtoken',
            }
        })

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.data).toBeDefined();
        expect(body.data.length).toBeGreaterThan(0);
    })

    it('should not be able to get all users if token is invalid', async () => {
        const res = await app.request('/api/users', {
            method: 'GET',
            headers: {
                'Authorization': 'salah',
            }
        })

        expect(res.status).toBe(401);
        const body = await res.json();
        expect(body.errors || body.message).toBeDefined();
    })
})

describe('PUT /api/users/:username', () => {
    beforeEach(async () => {
        await UserTest.create()
    })

    afterEach(async () => {
        await UserTest.delete();
    })

    it('should update user details', async () => {
        const res = await app.request('/api/users/testuser', {
            method: 'PUT',
            headers: {
                'Authorization': 'test',
            },
            body: JSON.stringify({
                password: 'updatedPassword123',
            })
        })
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.data).toBeDefined();
        expect(body.data.username).toBe('testuser');
        expect(body.data.email).toBe('test@gmail.com');

        // Verify that the password is updated
        const loginRes = await app.request('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({
                username: 'testuser',
                password: 'updatedPassword123',
            }),
        })

        expect(loginRes.status).toBe(200);
        const loginBody = await loginRes.json();
        expect(loginBody.data.token).toBeDefined();
        expect(loginBody.data.username).toBe('testuser');
    })
        
    it('should not be able to update user details if token is invalid', async () => {
        const res = await app.request('/api/users/testuser', {
            method: 'PUT',
            headers: {
                'Authorization': 'salah',
            },
            body: JSON.stringify({
                email: 'updatedEmail@gmail.com',
            })
        })

        expect(res.status).toBe(401);
        const body = await res.json();
        expect(body.errors || body.message).toBeDefined();
    })

    it('should not be able to update user details if no data is provided', async () => {
        const res = await app.request('/api/users/testuser', {
            method: 'PUT',
            headers: {
                'Authorization': 'test',
            },
            body: JSON.stringify({
                email: '',
            })
        })

        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.errors || body.message).toBeDefined();
    })
})


