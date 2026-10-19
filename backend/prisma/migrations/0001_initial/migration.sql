-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'MANAGER', 'VIEWER');

-- CreateEnum
CREATE TYPE "RentalMode" AS ENUM ('ROOMS', 'WHOLE_PROPERTY');

-- CreateEnum
CREATE TYPE "ResourceKind" AS ENUM ('ROOM', 'WHOLE_PROPERTY');

-- CreateEnum
CREATE TYPE "PaymentKind" AS ENUM ('PAYMENT', 'REVERSAL');

-- CreateEnum
CREATE TYPE "EntryMode" AS ENUM ('FULL_MONTH', 'MANUAL_PARTIAL_PERIOD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "session_version" INTEGER NOT NULL DEFAULT 1,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyAccess" (
    "user_id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,

    CONSTRAINT "PropertyAccess_pkey" PRIMARY KEY ("user_id","property_id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "owner_user_id" TEXT NOT NULL,
    "rental_mode" "RentalMode" NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "ResourceKind" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "termination_date" DATE,
    "monthly_rent_twd" DECIMAL(12,0) NOT NULL,
    "deposit_twd" DECIMAL(12,0) NOT NULL,
    "due_day" INTEGER NOT NULL DEFAULT 1,
    "primary_document_id" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalObligation" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "due_date" DATE NOT NULL,
    "amount_due_twd" DECIMAL(12,0) NOT NULL,
    "entry_mode" "EntryMode" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RentalObligation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentRecord" (
    "id" TEXT NOT NULL,
    "obligation_id" TEXT NOT NULL,
    "amount_twd" DECIMAL(12,0) NOT NULL,
    "kind" "PaymentKind" NOT NULL,
    "reverses_payment_id" TEXT,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_key" TEXT NOT NULL,

    CONSTRAINT "PaymentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdempotencyRecord" (
    "id" TEXT NOT NULL,
    "principal_id" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "request_key" TEXT NOT NULL,
    "request_hash" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdempotencyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "contract_id" TEXT,
    "payment_id" TEXT,
    "tenant_id" TEXT,
    "property_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sha256" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentContent" (
    "document_id" TEXT NOT NULL,
    "bytes" BYTEA NOT NULL,

    CONSTRAINT "DocumentContent_pkey" PRIMARY KEY ("document_id")
);

-- CreateTable
CREATE TABLE "DemoContext" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "business_date" DATE NOT NULL,

    CONSTRAINT "DemoContext_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Resource_property_id_idx" ON "Resource"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_primary_document_id_key" ON "Contract"("primary_document_id");

-- CreateIndex
CREATE INDEX "Contract_resource_id_start_date_end_date_idx" ON "Contract"("resource_id", "start_date", "end_date");

-- CreateIndex
CREATE INDEX "Contract_tenant_id_idx" ON "Contract"("tenant_id");

-- CreateIndex
CREATE INDEX "RentalObligation_due_date_idx" ON "RentalObligation"("due_date");

-- CreateIndex
CREATE UNIQUE INDEX "RentalObligation_contract_id_period_start_period_end_key" ON "RentalObligation"("contract_id", "period_start", "period_end");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentRecord_reverses_payment_id_key" ON "PaymentRecord"("reverses_payment_id");

-- CreateIndex
CREATE INDEX "PaymentRecord_obligation_id_idx" ON "PaymentRecord"("obligation_id");

-- CreateIndex
CREATE UNIQUE INDEX "IdempotencyRecord_principal_id_operation_request_key_key" ON "IdempotencyRecord"("principal_id", "operation", "request_key");

-- CreateIndex
CREATE INDEX "Document_property_id_contract_id_tenant_id_idx" ON "Document"("property_id", "contract_id", "tenant_id");

-- AddForeignKey
ALTER TABLE "PropertyAccess" ADD CONSTRAINT "PropertyAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAccess" ADD CONSTRAINT "PropertyAccess_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_primary_document_id_fkey" FOREIGN KEY ("primary_document_id") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalObligation" ADD CONSTRAINT "RentalObligation_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRecord" ADD CONSTRAINT "PaymentRecord_obligation_id_fkey" FOREIGN KEY ("obligation_id") REFERENCES "RentalObligation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRecord" ADD CONSTRAINT "PaymentRecord_reverses_payment_id_fkey" FOREIGN KEY ("reverses_payment_id") REFERENCES "PaymentRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdempotencyRecord" ADD CONSTRAINT "IdempotencyRecord_principal_id_fkey" FOREIGN KEY ("principal_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "PaymentRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentContent" ADD CONSTRAINT "DocumentContent_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

