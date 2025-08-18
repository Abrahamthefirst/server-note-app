/*
  Warnings:

  - Added the required column `name` to the `Directory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Directory" ADD COLUMN     "name" TEXT NOT NULL;
