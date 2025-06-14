import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database";
import { signJwt, verifyJwt } from '../application/jwt';
import { Decimal } from "../generated/prisma/runtime/library";

export class UserTest {
    static async create() {
        const user = await prismaClient.user.create({
            data: {
                username: "testuser",
                password: await Bun.password.hash("test1234", {
                    algorithm: "bcrypt",
                    cost: 10,
                }),
                email: "test@gmail.com",
                role: "cashier",
            }
        });

        // Generate token JWT dengan id_user hasil insert
        const token = await signJwt({
            id_user: user.id_user,
            username: user.username,
            role: user.role,
        });

        // (Opsional) update kolom token di DB jika memang ada
        await prismaClient.user.update({
            where: { id_user: user.id_user },
            data: { token }
        });

        return token;
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

export class ProductTest {
    static async create() {
        await prismaClient.product.create({
            data: {
                id_product: 1,
                product_name: "Test Product",
                price: new Decimal(10000),
                stock: 10,
                description: "This is a test product",
                id_category: 1,
            }
        })
    }

    static async createMany(count: number = 10) {
        const products = [];
        
        for (let i = 0; i < count; i++) {
            products.push({
                product_name: `Test Product ${i}`,
                price: new Decimal(10000 + i * 1000),
                stock: 10 + i,
                description: `This is a test product ${i}`,
                id_category: 1,
            });
        }
        
        await prismaClient.product.createMany({
            data: products,
            skipDuplicates: true, // Skip duplicates if any
        });
    }

    static async delete() {
        await prismaClient.product.deleteMany({
            where: {
                product_name: "Test Product"
            }
        });
    }

    static async deleteMany() {
        await prismaClient.product.deleteMany({
            where: {
                product_name: {
                    startsWith: "Test Product"
                }
            }
        });
    }

}

export class PaymentMethodTest {

    static async create() {
        await prismaClient.payment_Method.create({
            data: {
                id_payment: 1,
                payment_method: "Test Payment Method",
            }
        })
    }

    static async createMany(count: number = 10) {
        const paymentMethods = [];
        
        for (let i = 0; i < count; i++) {
            paymentMethods.push({
                payment_method: `Test Payment Method ${i}`,
            });
        }
        
        await prismaClient.payment_Method.createMany({
            data: paymentMethods,
            skipDuplicates: true, // Skip duplicates if any
        });
    }

    static async delete() {
        await prismaClient.payment_Method.deleteMany({
            where: {
                payment_method: "Test Payment Method"
            }
        });
    }

    static async deleteMany() {
        await prismaClient.payment_Method.deleteMany({
            where: {
                payment_method: {
                    startsWith: "Test Payment Method"
                }
            }
        });
    }
}

export class TransactionTest {
    static async create(token: string) {
        const payload = await verifyJwt(token);
        if (!payload || !payload.id_user) {
            throw new HTTPException(401, {
                message: "Unauthorized"
            });
        }

        const transaction = await prismaClient.transaction.create({
            data: {
                total_price: 10000,
                payment_method: 1,
                status: "pending",
                id_user: Number(payload.id_user),
            }
        });

        return transaction;
    }

    static async createMany(count: number = 10, token: string) {
        const payload = await verifyJwt(token);
        if (!payload || !payload.id_user) {
            throw new HTTPException(401, {
                message: "Unauthorized"
            });
        }

        const transactions = [];
        
        for (let i = 0; i < count; i++) {
            transactions.push({
                total_price: 10000 + i * 1000,
                payment_method: 1,
                status: "pending",
                id_user: Number(payload.id_user),
            });
        }
        
        await prismaClient.transaction.createMany({
            data: transactions,
            skipDuplicates: true, // Skip duplicates if any
        });
    }

    static async get(token: string){
        const payload = await verifyJwt(token);
        if (!payload || !payload.id_user) {
            throw new HTTPException(401, {
                message: "Unauthorized"
            });
        }
        const transaction = await prismaClient.transaction.findFirst({
            where: {
                id_user: Number(payload.id_user),
            },
            orderBy: {
                id_transaction: 'asc',
            },
            select: {
                id_transaction: true,
            },
        });
        return transaction;
    }

    static async delete(token: string) {
        const payload = await verifyJwt(token);
        if (!payload || !payload.id_user) {
            throw new HTTPException(401, {
                message: "Unauthorized"
            });
        }
        await prismaClient.transaction.deleteMany({
            where: {
                id_user: Number(payload.id_user),
            }
        });
    }
}

export class DetailTransactionTest {
    static async create(transactionId: number) {
        await prismaClient.detail_Transaction.create({
            data: {
                id_detail: 1,
                id_transaction: transactionId,
                id_product: 1,
                quantity: 2,
            }
        })
    }

    static async createMany(count: number = 10, transactionId: number) {
        const detailTransactions = [];
        
        for (let i = 0; i < count; i++) {
            detailTransactions.push({
                id_transaction: transactionId,
                id_product: 1,
                quantity: 2 + i,
            });
        }
        
        await prismaClient.detail_Transaction.createMany({
            data: detailTransactions,
            skipDuplicates: true, // Skip duplicates if any
        });
    }

    static async delete() {
        await prismaClient.detail_Transaction.deleteMany({
            where: {
                id_product: 1
            }
        });
    }
}