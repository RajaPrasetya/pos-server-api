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

export class CategoryTest {

    static async create() {
        await prismaClient.category.create({
            data: {
                id_category: 1,
                category_name: "Test Category",
            }
        })
    }

    static async createMany(count: number = 10) {
        const categories = [];
        
        for (let i = 0; i < count; i++) {
            categories.push({
                category_name: `Test Category ${i}`,
            });
        }
        
        await prismaClient.category.createMany({
            data: categories,
            skipDuplicates: true, // Skip duplicates if any
        });
    }

    static async delete() {
        await prismaClient.category.deleteMany({
            where: {
                category_name: "Test Category"
            }
        });
    }

    static async deleteMany() {
        await prismaClient.category.deleteMany({
            where: {
                category_name: {
                    startsWith: "Test Category"
                }
            }
        });
    }
}