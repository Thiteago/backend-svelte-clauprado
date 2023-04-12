/*
  Warnings:

  - You are about to drop the column `userId` on the `Visit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_userId_fkey";

-- DropIndex
DROP INDEX "Visit_userId_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "visitId" INTEGER;

-- AlterTable
ALTER TABLE "Visit" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
