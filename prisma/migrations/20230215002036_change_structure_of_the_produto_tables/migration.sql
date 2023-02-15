/*
  Warnings:

  - You are about to drop the column `valor` on the `Aluguel` table. All the data in the column will be lost.
  - You are about to drop the column `quantidadeEmEstoque` on the `Venda` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `Venda` table. All the data in the column will be lost.
  - Added the required column `valor` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Aluguel" DROP COLUMN "valor",
ALTER COLUMN "data_aluguel" DROP DEFAULT,
ALTER COLUMN "data_expiracao" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "valor" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Venda" DROP COLUMN "quantidadeEmEstoque",
DROP COLUMN "valor",
ALTER COLUMN "data_venda" DROP DEFAULT;
