-- CreateTable
CREATE TABLE IF NOT EXISTS "PrintfulProduct" (
    "id" INTEGER NOT NULL,
    "printfulId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "variantCount" INTEGER NOT NULL DEFAULT 0,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrintfulProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "PrintfulVariant" (
    "id" SERIAL NOT NULL,
    "printfulId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT,
    "color" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrintfulVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "PrintfulProduct_printfulId_key" ON "PrintfulProduct"("printfulId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "PrintfulVariant_printfulId_key" ON "PrintfulVariant"("printfulId");

-- AddForeignKey
ALTER TABLE "PrintfulVariant" ADD CONSTRAINT "PrintfulVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PrintfulProduct"("printfulId") ON DELETE RESTRICT ON UPDATE CASCADE;
