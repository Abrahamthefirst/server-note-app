/*
  Warnings:

  - The primary key for the `Note` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_NoteToTag` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_NoteToTag" DROP CONSTRAINT "_NoteToTag_A_fkey";

-- AlterTable
ALTER TABLE "Note" DROP CONSTRAINT "Note_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Note_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Note_id_seq";

-- AlterTable
ALTER TABLE "_NoteToTag" DROP CONSTRAINT "_NoteToTag_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ADD CONSTRAINT "_NoteToTag_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "_NoteToTag" ADD CONSTRAINT "_NoteToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
