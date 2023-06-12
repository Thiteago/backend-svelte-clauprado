/*
  Warnings:

  - You are about to drop the column `produtoId` on the `produto_mudanca` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "produto_mudanca" DROP CONSTRAINT "produto_mudanca_produtoId_fkey";

-- AlterTable
ALTER TABLE "produto_mudanca" DROP COLUMN "produtoId",
ADD COLUMN     "aluguelId" INTEGER,
ADD COLUMN     "vendaId" INTEGER;

-- AddForeignKey
ALTER TABLE "produto_mudanca" ADD CONSTRAINT "produto_mudanca_aluguelId_fkey" FOREIGN KEY ("aluguelId") REFERENCES "Aluguel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto_mudanca" ADD CONSTRAINT "produto_mudanca_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "Venda"("id") ON DELETE SET NULL ON UPDATE CASCADE;
