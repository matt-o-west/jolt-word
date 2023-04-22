/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserWord` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wordId]` on the table `UserWord` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserWord_userId_key" ON "UserWord"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserWord_wordId_key" ON "UserWord"("wordId");
