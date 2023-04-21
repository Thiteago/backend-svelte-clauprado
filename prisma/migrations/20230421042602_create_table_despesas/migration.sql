-- CreateTable
CREATE TABLE "Despesas" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipoDespesa" TEXT NOT NULL,
    "recorrente" BOOLEAN NOT NULL DEFAULT false,
    "tipoDeRecorrencia" TEXT NOT NULL,

    CONSTRAINT "Despesas_pkey" PRIMARY KEY ("id")
);
