/*
  Warnings:

  - Added the required column `totalLucro` to the `StatisticProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StatisticProduct" ADD COLUMN     "totalLucro" DOUBLE PRECISION NOT NULL;
