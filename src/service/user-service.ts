import { prismaClient } from "../application/database";
import { User } from "../generated/prisma";
import { RegisterUserRequest, toUserResponse, UpdateUserRequest, UserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { HTTPException } from "hono/http-exception";
import { signJwt } from '../application/jwt'

export class UserService {

    static async register(req: RegisterUserRequest): Promise<UserResponse> {
        req = UserValidation.REGISTER.parse(req);
        
        const totalUserWithSameUsername = await prismaClient.user.count({
            where: {
                username: req.username,
            }
        })
        if (totalUserWithSameUsername > 0) {
            throw new HTTPException(400, {
                message: "Username already exists",
            });
        }

        const totalUserWithSameEmail = await prismaClient.user.count({
            where: {
                email: req.email,
            }
        })
        if (totalUserWithSameEmail > 0) {
            throw new HTTPException(400, {
                message: "Email already exists",
            });
        }

        req.password = await Bun.password.hash(req.password, {
            algorithm: "bcrypt",
            cost: 10,
        })

        const user = await prismaClient.user.create({
            data: req,
        })

        return toUserResponse(user);
    }

    static async login(req: { username: string; password: string }): Promise<UserResponse> {
        req = UserValidation.LOGIN.parse(req);

        let user = await prismaClient.user.findUnique({
            where: { username: req.username }
        });

        if (!user) {
            throw new HTTPException(401, { message: "Invalid username or password" });
        }

        const isPasswordValid = await Bun.password.verify(req.password, user.password, "bcrypt");
        if (!isPasswordValid) {
            throw new HTTPException(401, { message: "Invalid username or password" });
        }

        // Generate JWT
        const token = await signJwt({
            id_user: user.id_user,
            username: user.username,
            role: user.role,
        });

        user = await prismaClient.user.update({
            where: { username: req.username },
            data: { token }
        });

        const res = toUserResponse(user);
        res.token = token;
        return res;
    }

    static async getToken(token: string | undefined | null) : Promise<User> {
        const result = UserValidation.TOKEN.safeParse(token);
        
        if (!result.success) {
            throw new HTTPException(401, {
                message: "Unauthorized",
            });
        }

        token = result.data;

        const user = await prismaClient.user.findFirst({
            where: {
                token: token,
            }
        })

        if (!user) {
            throw new HTTPException(401, {
                message: "Unauthorized",
            });
        }

        return user;
    }

    static async getUserByUsername(username: string): Promise<UserResponse> {
        const user = await prismaClient.user.findUnique({
            where: {
                username: username,
            }
        });

        if (!user) {
            throw new HTTPException(404, {
                message: "User not found",
            });
        }

        return toUserResponse(user);
    }

    static async getAllUsers(): Promise<UserResponse[]> {
        const users = await prismaClient.user.findMany();

        return users.map(toUserResponse);
    }

    static async updateUser(username: string, req: UpdateUserRequest): Promise<UserResponse> {

        req = UserValidation.UPDATE.parse(req);

        const user = await prismaClient.user.findUnique({
            where: { username }
        });

        if (!user) {
            throw new HTTPException(404, {
                message: "User not found",
            });
        }

        if (req.username) {
            const totalUserWithSameUsername = await prismaClient.user.count({
                where: {
                    username: req.username,
                    id_user: {
                        not: user.id_user,
                    }
                }
            })
            if (totalUserWithSameUsername > 0) {
                throw new HTTPException(400, {
                    message: "Username already exists",
                });
            }
        }

        if (req.email) {
            const totalUserWithSameEmail = await prismaClient.user.count({
                where: {
                    email: req.email,
                    id_user: {
                        not: user.id_user,
                    }
                }
            })
            if (totalUserWithSameEmail > 0) {
                throw new HTTPException(400, {
                    message: "Email already exists",
                });
            }
        }

        let updateData: any = {};

        if (req.username) updateData.username = req.username;
        if (req.email) updateData.email = req.email;
        if (req.role) updateData.role = req.role;
        if (req.password) {
            updateData.password = await Bun.password.hash(req.password, {
                algorithm: "bcrypt",
                cost: 10,
            });
        }

        const updatedUser = await prismaClient.user.update({
            where: {
                username: user.username,
            },
            data: updateData
        })

        return toUserResponse(updatedUser);
    }

    static async logout(user: User): Promise<boolean> {
        user = await prismaClient.user.update({
            where: {
                id_user: user.id_user
            },
            data: {
                token: null,
            }
        })
        
        return true;
    }
}