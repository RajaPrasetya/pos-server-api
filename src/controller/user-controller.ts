import { Hono } from "hono";
import { LoginUserRequest, RegisterUserRequest, UpdateUserRequest } from "../model/user-model";
import { UserService } from "../service/user-service";
import { ApplicationVariables } from "../model/auth-model";
import { User } from "../generated/prisma";
import { authMiddleware } from "../middleware/auth-middleware";

export const userController = new Hono<{Variables: ApplicationVariables}>();

// REGISTER USER
userController.post('/', async (c) => {
    const req = await c.req.json() as RegisterUserRequest;

    const res = await UserService.register(req)

    return c.json({
        success: true,
        message: "User registered successfully",
        data: res,
    }, 201);
});

// LOGIN USER
userController.post('/login', async (c) => {
    const req = await c.req.json() as LoginUserRequest;

    const res = await UserService.login(req);

    return c.json({
        success: true,
        message: "User logged in successfully",
        data: res,
    });
});

// Middleware to get user from Authorization header
userController.use(authMiddleware);

// GET ALL USERS
userController.get('/', async (c) => {
    const users = await UserService.getAllUsers();

    return c.json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
    });
});

// GET CURRENT USER DETAILS
userController.get('/current', async (c) => {
    const user = c.get('user') as User;

    return c.json({
        success: true,
        message: "User details retrieved successfully",
        data: user,
    });
})

// GET USER BY USERNAME
userController.get('/:username', async (c) => {
    const username = c.req.param('username');
    
    const user = await UserService.getUserByUsername(username);
    
    return c.json({
        success: true,
        message: "User details retrieved successfully",
        data: user,
    });
});

// UPDATE USERS BY USERNAME
userController.put('/:username', async (c) => {
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
userController.delete('/logout', async (c) => {
    const user = c.get('user') as User;

    let res = await UserService.logout(user);

    return c.json({
        success: true,
        message: "User logged out successfully",
        data: res,
    });
    
})