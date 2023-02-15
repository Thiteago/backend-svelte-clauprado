-- AlterTable
ALTER TABLE "ProdutoAluguel" ADD COLUMN     "tipo" TEXT NOT NULL DEFAULT 'Aluguel';

-- AlterTable
ALTER TABLE "ProdutoVenda" ADD COLUMN     "tipo" TEXT NOT NULL DEFAULT 'Venda';
