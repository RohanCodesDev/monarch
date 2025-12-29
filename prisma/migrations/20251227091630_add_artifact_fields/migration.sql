-- AlterTable
ALTER TABLE "Artwork" ADD COLUMN     "artifactType" TEXT,
ADD COLUMN     "civilization" TEXT;

-- CreateIndex
CREATE INDEX "Artwork_artifactType_idx" ON "Artwork"("artifactType");

-- CreateIndex
CREATE INDEX "Artwork_civilization_idx" ON "Artwork"("civilization");
