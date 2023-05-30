-- CreateTable
CREATE TABLE "Slide" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Ativo',

    CONSTRAINT "Slide_pkey" PRIMARY KEY ("id")
);
