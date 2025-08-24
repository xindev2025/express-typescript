-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('male', 'female', 'prefer_not_to_say');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('cash_on_delivery');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'user',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "avatar" TEXT,
    "paymentMethod" "public"."PaymentMethod" NOT NULL DEFAULT 'cash_on_delivery',
    "gender" "public"."Gender",
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Address" (
    "userId" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "barangay" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "landmark" TEXT NOT NULL,
    "defaultAddress" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("fullName","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_role_isActive_idx" ON "public"."User"("role", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Address_phoneNumber_key" ON "public"."Address"("phoneNumber");

-- CreateIndex
CREATE INDEX "Address_userId_idx" ON "public"."Address"("userId");

-- CreateIndex
CREATE INDEX "Address_userId_defaultAddress_idx" ON "public"."Address"("userId", "defaultAddress");

-- AddForeignKey
ALTER TABLE "public"."Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
