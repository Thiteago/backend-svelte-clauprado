/*
  Warnings:

  - You are about to drop the `createdCart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "createdCart";

-- CreateTable
CREATE TABLE "CreatedCart" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cartId" INTEGER NOT NULL,

    CONSTRAINT "CreatedCart_pkey" PRIMARY KEY ("id")
);
