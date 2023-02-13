/*
  Warnings:

  - Added the required column `boleto` to the `Pagamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cartao` to the `Pagamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pagamento" ADD COLUMN     "boleto" TEXT NOT NULL,
ADD COLUMN     "cartao" TEXT NOT NULL;
