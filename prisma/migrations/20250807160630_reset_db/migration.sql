/*
  Warnings:

  - Added the required column `userId` to the `Directory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Directory" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Directory" ADD CONSTRAINT "Directory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
