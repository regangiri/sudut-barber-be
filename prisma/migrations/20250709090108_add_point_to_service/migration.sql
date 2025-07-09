/*
  Warnings:

  - Added the required column `point` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "point" INTEGER NOT NULL;
