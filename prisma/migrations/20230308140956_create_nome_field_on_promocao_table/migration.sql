/*
  Warnings:

  - Added the required column `nome` to the `Promocao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Promocao" ADD COLUMN     "nome" TEXT NOT NULL;
