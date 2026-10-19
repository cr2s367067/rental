ALTER TABLE "Resource" ADD CONSTRAINT "positive_capacity" CHECK (capacity > 0);
ALTER TABLE "Contract" ADD CONSTRAINT "valid_contract_dates" CHECK (start_date < end_date), ADD CONSTRAINT "valid_due_day" CHECK (due_day BETWEEN 1 AND 28), ADD CONSTRAINT "nonnegative_contract_money" CHECK (monthly_rent_twd >= 0 AND deposit_twd >= 0);
ALTER TABLE "RentalObligation" ADD CONSTRAINT "valid_period" CHECK (period_start < period_end AND amount_due_twd >= 0);
ALTER TABLE "PaymentRecord" ADD CONSTRAINT "positive_payment" CHECK (amount_twd > 0), ADD CONSTRAINT "reversal_reference" CHECK ((kind = 'REVERSAL') = (reverses_payment_id IS NOT NULL));
ALTER TABLE "Document" ADD CONSTRAINT "valid_document_size" CHECK (size_bytes >= 0 AND size_bytes <= 10485760);
