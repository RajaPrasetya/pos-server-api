import { Category, Product, User } from "../generated/prisma"

export type ApplicationVariables = {

    user: User
    category: Category
    product: Product
}