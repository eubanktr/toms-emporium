-- CreateTable
CREATE TABLE "SaleListing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tcgCardId" TEXT NOT NULL,
    "title" TEXT,
    "note" TEXT,
    "priceCents" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "photoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WantedListing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tcgCardId" TEXT NOT NULL,
    "title" TEXT,
    "note" TEXT,
    "maxPriceCents" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "SaleListing_tcgCardId_idx" ON "SaleListing"("tcgCardId");

-- CreateIndex
CREATE INDEX "WantedListing_tcgCardId_idx" ON "WantedListing"("tcgCardId");
