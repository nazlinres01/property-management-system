import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  nationalId: text("national_id").notNull(),
  address: text("address"),
  emergencyContact: text("emergency_contact"),
  emergencyPhone: text("emergency_phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const landlords = pgTable("landlords", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  nationalId: text("national_id").notNull(),
  address: text("address"),
  bankAccount: text("bank_account"),
  taxNumber: text("tax_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  landlordId: integer("landlord_id").notNull(),
  address: text("address").notNull(),
  type: text("type").notNull(), // "1+1", "2+1", "3+1", etc.
  area: integer("area"), // square meters
  floor: integer("floor"),
  hasBalcony: boolean("has_balcony").default(false),
  hasParking: boolean("has_parking").default(false),
  isAvailable: boolean("is_available").default(true),
  monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  deposit: decimal("deposit", { precision: 10, scale: 2 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull(),
  propertyId: integer("property_id").notNull(),
  landlordId: integer("landlord_id").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  deposit: decimal("deposit", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  terms: text("terms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").notNull(),
  tenantId: integer("tenant_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidDate: timestamp("paid_date"),
  status: text("status").notNull(), // "pending", "paid", "overdue"
  paymentMethod: text("payment_method"), // "cash", "bank_transfer", "credit_card"
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
});

export const insertLandlordSchema = createInsertSchema(landlords).omit({
  id: true,
  createdAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type InsertLandlord = z.infer<typeof insertLandlordSchema>;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type InsertContract = z.infer<typeof insertContractSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Tenant = typeof tenants.$inferSelect;
export type Landlord = typeof landlords.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type Contract = typeof contracts.$inferSelect;
export type Payment = typeof payments.$inferSelect;

export type PropertyWithDetails = Property & {
  landlord: Landlord;
  tenant?: Tenant;
  contract?: Contract;
  lastPayment?: Payment;
};

export type ContractWithDetails = Contract & {
  tenant: Tenant;
  property: Property;
  landlord: Landlord;
};

export type PaymentWithDetails = Payment & {
  tenant: Tenant;
  contract: Contract & {
    property: Property;
  };
};
