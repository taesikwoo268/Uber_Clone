ALTER TABLE "rides" ADD COLUMN "paymentMethod" varchar(20) DEFAULT 'cash';--> statement-breakpoint
ALTER TABLE "rides" ADD COLUMN "paymentStatus" varchar(20) DEFAULT 'unpaid';