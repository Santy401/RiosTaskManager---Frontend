/*
  Warnings:

  - You are about to drop the `Filters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Filters";

-- CreateTable
CREATE TABLE "CustomFilter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomFilter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CustomFilter_entity_idx" ON "CustomFilter"("entity");

-- CreateIndex
CREATE UNIQUE INDEX "CustomFilter_name_entity_key" ON "CustomFilter"("name", "entity");
