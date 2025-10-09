CREATE TABLE "assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"household_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"value" integer,
	"details" jsonb
);
--> statement-breakpoint
CREATE TABLE "cashflows" (
	"id" serial PRIMARY KEY NOT NULL,
	"household_id" integer NOT NULL,
	"source" varchar(50) NOT NULL,
	"value" integer
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"household_id" integer NOT NULL,
	"category" varchar(50) NOT NULL,
	"value" integer
);
--> statement-breakpoint
CREATE TABLE "family_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"household_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"age" integer,
	"role" varchar(50),
	"assets" varchar(50),
	"income" integer
);
--> statement-breakpoint
CREATE TABLE "liabilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"household_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"value" integer
);
