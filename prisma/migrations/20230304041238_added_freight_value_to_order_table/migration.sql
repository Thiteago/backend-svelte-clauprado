/*
  Warnings:

  - Added the required column `valor_frete` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "valor_frete" DOUBLE PRECISION NOT NULL;
