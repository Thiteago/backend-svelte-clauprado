/*
  Warnings:

  - Added the required column `linhaDigitavel` to the `Boleto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroBoleto` to the `Boleto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Boleto" ADD COLUMN     "linhaDigitavel" TEXT NOT NULL,
ADD COLUMN     "numeroBoleto" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Pendente';
