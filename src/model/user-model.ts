import { User } from "../generated/prisma";

export type RegisterUserRequest = {
    username: string;
    password: string;
    email: string;
    role: string;
};

export type LoginUserRequest = {
    username: string;
    password: string;
}

export type UpdateUserRequest = {
    username?: string;
    password?: string;
    email?: string;
    role?: string;
}

export type UserResponse = {
    idUser: number;
    username: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    token?: string;
};

export function toUserResponse(user: User): UserResponse {
    return {
        idUser: user.id_user,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
    }
}