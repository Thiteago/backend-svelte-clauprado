/*
  Warnings:

  - You are about to drop the column `categorias` on the `Promocao` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Promocao" DROP COLUMN "categorias";

-- CreateTable
CREATE TABLE "_CategoriasToPromocao" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoriasToPromocao_AB_unique" ON "_CategoriasToPromocao"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoriasToPromocao_B_index" ON "_CategoriasToPromocao"("B");

-- AddForeignKey
ALTER TABLE "_CategoriasToPromocao" ADD CONSTRAINT "_CategoriasToPromocao_A_fkey" FOREIGN KEY ("A") REFERENCES "Categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriasToPromocao" ADD CONSTRAINT "_CategoriasToPromocao_B_fkey" FOREIGN KEY ("B") REFERENCES "Promocao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
