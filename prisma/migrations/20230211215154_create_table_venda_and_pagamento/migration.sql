-- CreateTable
CREATE TABLE "Venda" (
    "id" SERIAL NOT NULL,
    "data_venda" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor" DOUBLE PRECISION NOT NULL,
    "pagamentoId" INTEGER NOT NULL,

    CONSTRAINT "Venda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pagamento" (
    "id" SERIAL NOT NULL,
    "data_pagamento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor" DOUBLE PRECISION NOT NULL,
    "forma_pagamento" TEXT NOT NULL,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProdutoToVenda" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProdutoToVenda_AB_unique" ON "_ProdutoToVenda"("A", "B");

-- CreateIndex
CREATE INDEX "_ProdutoToVenda_B_index" ON "_ProdutoToVenda"("B");

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "Pagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProdutoToVenda" ADD CONSTRAINT "_ProdutoToVenda_A_fkey" FOREIGN KEY ("A") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProdutoToVenda" ADD CONSTRAINT "_ProdutoToVenda_B_fkey" FOREIGN KEY ("B") REFERENCES "Venda"("id") ON DELETE CASCADE ON UPDATE CASCADE;
