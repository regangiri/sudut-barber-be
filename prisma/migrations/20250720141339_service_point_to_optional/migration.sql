-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "point" DROP NOT NULL,
ALTER COLUMN "point" SET DEFAULT 0;
