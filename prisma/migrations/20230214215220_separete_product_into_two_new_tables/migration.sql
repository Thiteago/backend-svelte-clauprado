/*
  Warnings:

  - You are about to drop the `Produto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProdutoToVenda` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProdutoToVenda" DROP CONSTRAINT "_ProdutoToVenda_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProdutoToVenda" DROP CONSTRAINT "_ProdutoToVenda_B_fkey";

-- DropTable
DROP TABLE "Produto";

-- DropTable
DROP TABLE "_ProdutoToVenda";

-- CreateTable
CREATE TABLE "ProdutoAluguel" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL,
    "dataPublicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_disponibilidade" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_expiracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_aluguel" TEXT NOT NULL DEFAULT 'Disponivel',
    "dias_alugados" INTEGER NOT NULL DEFAULT 0,
    "valor" DOUBLE PRECISION NOT NULL,
    "quantidadeEmEstoque" INTEGER NOT NULL DEFAULT 1,
    "peso" DOUBLE PRECISION NOT NULL,
    "altura" TEXT NOT NULL,
    "largura" TEXT NOT NULL,
    "comprimento" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "imagens" TEXT[],

    CONSTRAINT "ProdutoAluguel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoVenda" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataCriacao" TEXT NOT NULL,
    "dataPublicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor" DOUBLE PRECISION NOT NULL,
    "quantidadeEmEstoque" INTEGER NOT NULL DEFAULT 1,
    "peso" DOUBLE PRECISION NOT NULL,
    "altura" TEXT NOT NULL,
    "largura" TEXT NOT NULL,
    "comprimento" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "imagens" TEXT[],

    CONSTRAINT "ProdutoVenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProdutoAluguelToVenda" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ProdutoVendaToVenda" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProdutoAluguelToVenda_AB_unique" ON "_ProdutoAluguelToVenda"("A", "B");

-- CreateIndex
CREATE INDEX "_ProdutoAluguelToVenda_B_index" ON "_ProdutoAluguelToVenda"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProdutoVendaToVenda_AB_unique" ON "_ProdutoVendaToVenda"("A", "B");

-- CreateIndex
CREATE INDEX "_ProdutoVendaToVenda_B_index" ON "_ProdutoVendaToVenda"("B");

-- AddForeignKey
ALTER TABLE "_ProdutoAluguelToVenda" ADD CONSTRAINT "_ProdutoAluguelToVenda_A_fkey" FOREIGN KEY ("A") REFERENCES "ProdutoAluguel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProdutoAluguelToVenda" ADD CONSTRAINT "_ProdutoAluguelToVenda_B_fkey" FOREIGN KEY ("B") REFERENCES "Venda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProdutoVendaToVenda" ADD CONSTRAINT "_ProdutoVendaToVenda_A_fkey" FOREIGN KEY ("A") REFERENCES "ProdutoVenda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProdutoVendaToVenda" ADD CONSTRAINT "_ProdutoVendaToVenda_B_fkey" FOREIGN KEY ("B") REFERENCES "Venda"("id") ON DELETE CASCADE ON UPDATE CASCADE;
