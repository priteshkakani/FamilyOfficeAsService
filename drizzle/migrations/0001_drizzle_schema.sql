-- Migration generated for Drizzle ORM schema (see drizzle/schema.ts)

CREATE TABLE "users"
(
    "id" uuid PRIMARY KEY,
    "name" text,
    "email" text,
    "phone" text,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "family_members"
(
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" uuid REFERENCES "users"("id"),
    "name" text,
    "relation" text,
    "dob" date,
    "gender" text,
    "email" text,
    "phone" text,
    "created_at" timestamp DEFAULT now()
);

CREATE TABLE "assets"
(
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" uuid REFERENCES "users"("id"),
    "member_id" uuid REFERENCES "family_members"("id"),
    "category" text,
    "name" text,
    "identifier" text,
    "quantity" numeric,
    "current_value" numeric,
    "purchase_value" numeric,
    "purchase_date" date,
    "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "liabilities"
(
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" uuid REFERENCES "users"("id"),
    "member_id" uuid REFERENCES "family_members"("id"),
    "type" text,
    "lender" text,
    "amount" numeric,
    "outstanding" numeric,
    "interest_rate" numeric,
    "emi" numeric,
    "tenure_months" integer,
    "start_date" date,
    "end_date" date
);

CREATE TABLE "insurance"
(
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" uuid REFERENCES "users"("id"),
    "member_id" uuid REFERENCES "family_members"("id"),
    "type" text,
    "provider" text,
    "policy_number" text,
    "sum_assured" numeric,
    "premium" numeric,
    "start_date" date,
    "end_date" date,
    "status" text
);

CREATE TABLE "income"
(
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" uuid REFERENCES "users"("id"),
    "member_id" uuid REFERENCES "family_members"("id"),
    "source" text,
    "amount" numeric,
    "frequency" text,
    "date" date,
    "notes" text
);

CREATE TABLE "expenses"
(
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" uuid REFERENCES "users"("id"),
    "member_id" uuid REFERENCES "family_members"("id"),
    "category" text,
    "amount" numeric,
    "date" date,
    "recurring" boolean DEFAULT false,
    "notes" text
);

CREATE TABLE "bank_accounts"
(
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" uuid REFERENCES "users"("id"),
    "bank_name" text,
    "account_type" text,
    "account_number" text,
    "balance" numeric,
    "ifsc" text,
    "linked" boolean DEFAULT false,
    "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "esops_rsus"
(
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" uuid REFERENCES "users"("id"),
    "member_id" uuid REFERENCES "family_members"("id"),
    "company" text,
    "grant_date" date,
    "vesting_date" date,
    "quantity" integer,
    "vested_quantity" integer,
    "current_value" numeric,
    "currency" text
);

CREATE TABLE "documents"
(
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" uuid REFERENCES "users"("id"),
    "member_id" uuid REFERENCES "family_members"("id"),
    "category" text,
    "file_url" text,
    "uploaded_at" timestamp DEFAULT now()
);
