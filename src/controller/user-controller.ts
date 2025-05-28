import { Hono } from "hono";
import { LoginUserRequest, RegisterUserRequest, UpdateUserRequest } from "../model/user-model";
import { UserService } from "../service/user-service";
import { ApplicationVariables } from "../model/auth-model";
import { User } from "../generated/prisma";

export const userController = new Hono<{Variables: ApplicationVariables}>();

// REGISTER USER
userController.post('/api/users', async (c) => {
    const req = await c.req.json() as RegisterUserRequest;

    const res = await UserService.register(req)

    return c.json({
        success: true,
        message: "User registered successfully",
        data: res,
    }, 201);
});

// LOGIN USER
userController.post('/api/users/login', async (c) => {
    const req = await c.req.json() as LoginUserRequest;

    const res = await UserService.login(req);

    return c.json({
        success: true,
        message: "User logged in successfully",
        data: res,
    });
});

// Middleware to get user from Authorization header
userController.use(async (c, next) => {

    const authHeader = c.req.header('Authorization');
    const user = await UserService.getToken(authHeader);
    
    c.set('user', user);
    
    return next();
})

// GET ALL USERS
userController.get('/api/users', async (c) => {
    const users = await UserService.getAllUsers();

    return c.json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
    });
});

// GET CURRENT USER DETAILS
userController.get('/api/user', async (c) => {
    const user = c.get('user') as User;

    return c.json({
        success: true,
        message: "User details retrieved successfully",
        data: user,
    });
})

// GET USER BY USERNAME
userController.get('/api/users/:username', async (c) => {
    const username = c.req.param('username');
    
    const user = await UserService.getUserByUsername(username);
    
    return c.json({
        success: true,
        message: "User details retrieved successfully",
        data: user,
    });
});

// UPDATE USERS BY USERNAME
userController.put('/api/users/:username', async (c) => {
    const username = c.req.param('username');
    const req = await c.req.json() as UpdateUserRequest;

    const updatedUser = await UserService.updateUser(username, req);

    return c.json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
    });
});

// LOG OUT USER (REMOVE TOKEN)
userController.delete('api/user/logout', async (c) => {
    const user = c.get('user') as User;

    let res = await UserService.logout(user);

    return c.json({
        success: true,
        message: "User logged out successfully",
        data: res,
    });
    
})