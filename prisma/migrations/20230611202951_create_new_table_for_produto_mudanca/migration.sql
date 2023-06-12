-- CreateTable
CREATE TABLE "produto_mudanca" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "produtoId" INTEGER NOT NULL,

    CONSTRAINT "produto_mudanca_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "produto_mudanca" ADD CONSTRAINT "produto_mudanca_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
