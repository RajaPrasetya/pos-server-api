-- CreateTable
CREATE TABLE `transactions` (
    `id_transaction` INTEGER NOT NULL AUTO_INCREMENT,
    `total_price` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `id_user` INTEGER NOT NULL,
    `payment_method` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_transaction`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_payment_method_fkey` FOREIGN KEY (`payment_method`) REFERENCES `payment_methods`(`id_payment`) ON DELETE RESTRICT ON UPDATE CASCADE;
