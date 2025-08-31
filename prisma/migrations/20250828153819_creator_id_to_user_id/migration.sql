/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `Tag` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_creatorId_fkey";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "creatorId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "creatorId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
