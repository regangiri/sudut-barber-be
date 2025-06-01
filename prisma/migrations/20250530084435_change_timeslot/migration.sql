/*
  Warnings:

  - You are about to drop the column `endTime` on the `TimeSlot` table. All the data in the column will be lost.
  - Added the required column `duration` to the `TimeSlot` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimeSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "barberId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "startTime" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "TimeSlot_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimeSlot" ("barberId", "date", "id", "isBooked", "startTime") SELECT "barberId", "date", "id", "isBooked", "startTime" FROM "TimeSlot";
DROP TABLE "TimeSlot";
ALTER TABLE "new_TimeSlot" RENAME TO "TimeSlot";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
