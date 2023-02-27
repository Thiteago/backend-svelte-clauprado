-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "dataNascimento" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "numeroRua" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "numeroTel" TEXT NOT NULL,
    "numeroCel" TEXT NOT NULL,
    "cargo" TEXT NOT NULL DEFAULT 'Usuario',
    "status" TEXT NOT NULL DEFAULT 'Ativo',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataFabricacao" TIMESTAMP(3) NOT NULL,
    "dataPublicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantidadeEmEstoque" INTEGER NOT NULL DEFAULT 1,
    "peso" DOUBLE PRECISION NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "altura" TEXT NOT NULL,
    "largura" TEXT NOT NULL,
    "comprimento" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "imagens" TEXT[],

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aluguel" (
    "id" SERIAL NOT NULL,
    "data_aluguel" TIMESTAMP(3),
    "data_disponibilidade" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_expiracao" TIMESTAMP(3),
    "status_aluguel" TEXT NOT NULL DEFAULT 'Disponivel',
    "dias_alugados" INTEGER NOT NULL DEFAULT 0,
    "tipo" TEXT NOT NULL DEFAULT 'Aluguel',
    "pagamentoId" INTEGER NOT NULL,

    CONSTRAINT "Aluguel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venda" (
    "id" SERIAL NOT NULL,
    "data_venda" TIMESTAMP(3),
    "tipo" TEXT NOT NULL DEFAULT 'Venda',
    "status_venda" TEXT NOT NULL DEFAULT 'Disponivel',
    "pagamentoId" INTEGER,

    CONSTRAINT "Venda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pagamento" (
    "id" SERIAL NOT NULL,
    "data_pagamento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor" DOUBLE PRECISION NOT NULL,
    "forma_pagamento" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boleto" (
    "id" SERIAL NOT NULL,
    "data_venc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "linhaDigitavel" TEXT NOT NULL,
    "numeroBoleto" TEXT NOT NULL,
    "nomePDF" TEXT NOT NULL,
    "pagamentoId" INTEGER NOT NULL,

    CONSTRAINT "Boleto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProdutoToVenda" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AluguelToProduto" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Boleto_pagamentoId_key" ON "Boleto"("pagamentoId");

-- CreateIndex
CREATE UNIQUE INDEX "_ProdutoToVenda_AB_unique" ON "_ProdutoToVenda"("A", "B");

-- CreateIndex
CREATE INDEX "_ProdutoToVenda_B_index" ON "_ProdutoToVenda"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AluguelToProduto_AB_unique" ON "_AluguelToProduto"("A", "B");

-- CreateIndex
CREATE INDEX "_AluguelToProduto_B_index" ON "_AluguelToProduto"("B");

-- AddForeignKey
ALTER TABLE "Aluguel" ADD CONSTRAINT "Aluguel_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "Pagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "Pagamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boleto" ADD CONSTRAINT "Boleto_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "Pagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProdutoToVenda" ADD CONSTRAINT "_ProdutoToVenda_A_fkey" FOREIGN KEY ("A") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProdutoToVenda" ADD CONSTRAINT "_ProdutoToVenda_B_fkey" FOREIGN KEY ("B") REFERENCES "Venda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AluguelToProduto" ADD CONSTRAINT "_AluguelToProduto_A_fkey" FOREIGN KEY ("A") REFERENCES "Aluguel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AluguelToProduto" ADD CONSTRAINT "_AluguelToProduto_B_fkey" FOREIGN KEY ("B") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
