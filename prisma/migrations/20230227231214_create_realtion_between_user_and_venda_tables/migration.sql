-- AlterTable
ALTER TABLE "Boleto" ALTER COLUMN "data_venc" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Venda" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
