/*
  Warnings:

  - You are about to drop the column `valor` on the `Paypal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Paypal" DROP COLUMN "valor",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Paypal_id_seq";
