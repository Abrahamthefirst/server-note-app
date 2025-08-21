/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Directory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Directory" ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Directory_name_userId_key" ON "Directory"("name", "userId");

-- AddForeignKey
ALTER TABLE "Directory" ADD CONSTRAINT "Directory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Directory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
