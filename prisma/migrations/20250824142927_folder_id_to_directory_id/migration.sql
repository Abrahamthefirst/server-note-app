/*
  Warnings:

  - You are about to drop the column `folderId` on the `Note` table. All the data in the column will be lost.
  - Added the required column `directoryId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_folderId_fkey";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "folderId",
ADD COLUMN     "directoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_directoryId_fkey" FOREIGN KEY ("directoryId") REFERENCES "Directory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
