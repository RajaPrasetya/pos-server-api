import { prismaClient } from "../application/database";

export class UserTest {

    static async create(){
        await prismaClient.user.create({
            data: {
                username: "testuser",
                password: await Bun.password.hash("test1234", {
                    algorithm: "bcrypt",
                    cost: 10,
                }),
                email: "test@gmail.com",
                role: "cashier",
                token: "test",
            }
        })
    }

    static async createMany(count: number = 10) {
        const users = [];
        
        for (let i = 0; i < count; i++) {
            users.push({
                username: `testuser${i}`,
                password: await Bun.password.hash("test1234", {
                    algorithm: "bcrypt",
                    cost: 10,
                }),
                email: `test${i}@gmail.com`,
                role: "cashier",
                token: `testtoken`,
            });
        }
        
        await prismaClient.user.createMany({
            data: users,
            skipDuplicates: true, // Skip duplicates if any
        });
    }

    static async delete() {
        await prismaClient.user.deleteMany({
            where: {
                username: "testuser"
            }
        });
    }

    static async deleteMany(count: number = 10) {
        await prismaClient.user.deleteMany({
            where: {
                username: {
                    startsWith: "testuser"
                }
            }
        });
    }
}