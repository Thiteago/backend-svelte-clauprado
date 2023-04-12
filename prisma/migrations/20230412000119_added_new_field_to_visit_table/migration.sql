/*
  Warnings:

  - You are about to drop the column `visitId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_visitId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "visitId";

-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
