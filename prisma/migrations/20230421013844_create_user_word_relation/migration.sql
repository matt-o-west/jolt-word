/*
  Warnings:

  - You are about to drop the `_UserWords` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_UserWords";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserWord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserWord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserWord_userId_wordId_key" ON "UserWord"("userId", "wordId");
