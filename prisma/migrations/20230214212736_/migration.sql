-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "dias_alugados" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "data_disponibilidade" SET DEFAULT CURRENT_TIMESTAMP;
