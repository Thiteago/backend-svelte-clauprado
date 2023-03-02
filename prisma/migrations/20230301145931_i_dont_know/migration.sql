/*
  Warnings:

  - Added the required column `estado` to the `Endereco` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Endereco" ADD COLUMN     "estado" TEXT NOT NULL;
