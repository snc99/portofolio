/*
  Warnings:

  - You are about to drop the `Home` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Home";

-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL,
    "motto" TEXT NOT NULL,
    "cvLink" TEXT,
    "cvFilename" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);
