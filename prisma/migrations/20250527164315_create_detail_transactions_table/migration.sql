-- CreateTable
CREATE TABLE `detail_transactions` (
    `id_detail` INTEGER NOT NULL AUTO_INCREMENT,
    `id_transaction` INTEGER NOT NULL,
    `id_product` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id_detail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `detail_transactions` ADD CONSTRAINT `detail_transactions_id_transaction_fkey` FOREIGN KEY (`id_transaction`) REFERENCES `transactions`(`id_transaction`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_transactions` ADD CONSTRAINT `detail_transactions_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `products`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;
