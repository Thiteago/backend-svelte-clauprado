/*
  Warnings:

  - You are about to drop the `_PedidoToProduto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PedidoToProduto" DROP CONSTRAINT "_PedidoToProduto_A_fkey";

-- DropForeignKey
ALTER TABLE "_PedidoToProduto" DROP CONSTRAINT "_PedidoToProduto_B_fkey";

-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "produtoId" INTEGER;

-- AlterTable
ALTER TABLE "Venda" ADD COLUMN     "pedidoId" INTEGER;

-- DropTable
DROP TABLE "_PedidoToProduto";

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
