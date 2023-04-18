-- CreateTable
CREATE TABLE "createdCart" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cartId" INTEGER NOT NULL,

    CONSTRAINT "createdCart_pkey" PRIMARY KEY ("id")
);
