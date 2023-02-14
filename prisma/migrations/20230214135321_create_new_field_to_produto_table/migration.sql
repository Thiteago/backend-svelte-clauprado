/*
  Warnings:

  - Added the required column `data_disponibilidade` to the `Produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_expiracao` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "data_disponibilidade" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "data_expiracao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status_aluguel" TEXT NOT NULL DEFAULT 'Disponivel';
