-- CreateTable
CREATE TABLE "StatisticProduct" (
    "id" SERIAL NOT NULL,
    "qtdeVendida" INTEGER NOT NULL DEFAULT 0,
    "qtdeAlugada" INTEGER NOT NULL DEFAULT 0,
    "qtdeVisualizada" INTEGER NOT NULL DEFAULT 0,
    "qtdeEmPromocao" INTEGER NOT NULL DEFAULT 0,
    "produtoId" INTEGER NOT NULL,

    CONSTRAINT "StatisticProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StatisticProduct_produtoId_key" ON "StatisticProduct"("produtoId");

-- AddForeignKey
ALTER TABLE "StatisticProduct" ADD CONSTRAINT "StatisticProduct_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
