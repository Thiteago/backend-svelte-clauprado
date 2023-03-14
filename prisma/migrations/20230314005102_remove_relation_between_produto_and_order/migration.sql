/*
  Warnings:

  - You are about to drop the column `produtoId` on the `Pedido` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_produtoId_fkey";

-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "produtoId";
