-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "promocaoId" INTEGER;

-- CreateTable
CREATE TABLE "Promocao" (
    "id" SERIAL NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_fim" TIMESTAMP(3) NOT NULL,
    "tipo_desconto" TEXT NOT NULL,
    "valor_desconto" DOUBLE PRECISION NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'Desconto',
    "status" TEXT NOT NULL DEFAULT 'Ativo',

    CONSTRAINT "Promocao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_promocaoId_fkey" FOREIGN KEY ("promocaoId") REFERENCES "Promocao"("id") ON DELETE SET NULL ON UPDATE CASCADE;
