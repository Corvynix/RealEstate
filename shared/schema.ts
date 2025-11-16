import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - العملاء
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: text("role").notNull().default("client"), // client, agent, admin, developer
  credits: integer("credits").default(0),
  buyerProfileId: varchar("buyer_profile_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Developers table - المطورين العقاريين
export const developers = pgTable("developers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  companyName: text("company_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  logo: text("logo"),
  trustScore: real("trust_score").default(0).notNull(), // 0-100
  deliveryHistory: jsonb("delivery_history").default([]).notNull(), // [{project, date, status}]
  reviews: jsonb("reviews").default([]).notNull(), // [{user, rating, comment, date}]
  legalCases: jsonb("legal_cases").default([]).notNull(), // [{case, status, date}]
  yearsActive: integer("years_active").default(0),
  projectsCompleted: integer("projects_completed").default(0),
  averageRating: real("average_rating").default(0),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Properties table - العقارات
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleAr: text("title_ar"),
  description: text("description"),
  descriptionAr: text("description_ar"),
  city: text("city").notNull(),
  cityAr: text("city_ar"),
  propertyType: text("property_type").notNull(), // apartment, villa, office, land
  price: real("price").notNull(),
  size: real("size").notNull(), // in sqm
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  images: jsonb("images").default([]).notNull(), // [url1, url2, ...]
  developerId: varchar("developer_id").notNull().references(() => developers.id),
  riskFlags: jsonb("risk_flags").default([]).notNull(), // [{type, severity, description}]
  features: jsonb("features").default([]).notNull(), // [feature1, feature2, ...]
  status: text("status").default("available").notNull(), // available, sold, reserved
  latitude: real("latitude"),
  longitude: real("longitude"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Buyer Profiles table - ملفات العملاء النفسية
export const buyerProfiles = pgTable("buyer_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  psychologicalProfile: jsonb("psychological_profile").default({}).notNull(), // {personality_type, preferences}
  riskTolerance: text("risk_tolerance").notNull(), // low, medium, high
  urgencyLevel: text("urgency_level").notNull(), // low, medium, high
  priceSensitivity: text("price_sensitivity").notNull(), // low, medium, high
  preferredCities: jsonb("preferred_cities").default([]).notNull(),
  preferredTypes: jsonb("preferred_types").default([]).notNull(),
  minPrice: real("min_price"),
  maxPrice: real("max_price"),
  minSize: real("min_size"),
  maxSize: real("max_size"),
  mustHaveFeatures: jsonb("must_have_features").default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// AI Closer Sessions table - جلسات المحادثة الذكية
export const aiCloserSessions = pgTable("ai_closer_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionHistory: jsonb("session_history").default([]).notNull(), // [{role, content, timestamp}]
  status: text("status").default("active").notNull(), // active, completed, abandoned
  outcome: text("outcome"), // qualified, not_qualified, needs_followup
  qualificationScore: real("qualification_score"), // 0-100
  extractedNeeds: jsonb("extracted_needs").default({}).notNull(), // {budget, location, type, urgency}
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Property Matches table - مطابقات العقارات مع العملاء
export const propertyMatches = pgTable("property_matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  matchScore: real("match_score").notNull(), // 0-100
  matchReasons: jsonb("match_reasons").default([]).notNull(), // [reason1, reason2, ...]
  viewed: boolean("viewed").default(false),
  interested: boolean("interested").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Behavior Tracking table - تتبع السلوك
export const behaviorTracking = pgTable("behavior_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  sessionId: text("session_id"), // for anonymous tracking
  page: text("page").notNull(),
  scrollDepth: real("scroll_depth"), // 0-100%
  timeOnPage: integer("time_on_page"), // in seconds
  clicks: jsonb("clicks").default([]).notNull(), // [{element, timestamp}]
  interactions: jsonb("interactions").default([]).notNull(), // [{type, data, timestamp}]
  propertyId: varchar("property_id").references(() => properties.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Contracts table - العقود
export const contracts = pgTable("contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  fileUrl: text("file_url"),
  analyzedRisks: jsonb("analyzed_risks").default([]).notNull(), // [{risk, severity, description}]
  hiddenClauses: jsonb("hidden_clauses").default([]).notNull(),
  annualIncreases: jsonb("annual_increases").default({}).notNull(),
  status: text("status").default("pending").notNull(), // pending, analyzed, approved, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Objection Responses table - ردود على الاعتراضات
export const objectionResponses = pgTable("objection_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => aiCloserSessions.id),
  objection: text("objection").notNull(),
  response: text("response").notNull(),
  successRate: real("success_rate"), // 0-100
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Scam Flags table - علامات الاحتيال
export const scamFlags = pgTable("scam_flags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").references(() => properties.id),
  developerId: varchar("developer_id").references(() => developers.id),
  flagType: text("flag_type").notNull(), // pricing_anomaly, delivery_delay, legal_issue, fake_reviews
  severity: text("severity").notNull(), // low, medium, high, critical
  description: text("description").notNull(),
  evidence: jsonb("evidence").default({}).notNull(),
  status: text("status").default("active").notNull(), // active, resolved, false_positive
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Referrals table - الإحالات
export const referrals = pgTable("referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar("referrer_id").notNull().references(() => users.id),
  refereeId: varchar("referee_id").references(() => users.id),
  code: text("code").notNull().unique(),
  status: text("status").default("pending").notNull(), // pending, completed, rewarded
  reward: real("reward").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  buyerProfile: one(buyerProfiles, {
    fields: [users.buyerProfileId],
    references: [buyerProfiles.id],
  }),
  aiCloserSessions: many(aiCloserSessions),
  propertyMatches: many(propertyMatches),
  behaviorTracking: many(behaviorTracking),
}));

export const developersRelations = relations(developers, ({ many }) => ({
  properties: many(properties),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  developer: one(developers, {
    fields: [properties.developerId],
    references: [developers.id],
  }),
  propertyMatches: many(propertyMatches),
  behaviorTracking: many(behaviorTracking),
}));

export const buyerProfilesRelations = relations(buyerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [buyerProfiles.userId],
    references: [users.id],
  }),
}));

export const aiCloserSessionsRelations = relations(aiCloserSessions, ({ one }) => ({
  user: one(users, {
    fields: [aiCloserSessions.userId],
    references: [users.id],
  }),
}));

export const propertyMatchesRelations = relations(propertyMatches, ({ one }) => ({
  user: one(users, {
    fields: [propertyMatches.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [propertyMatches.propertyId],
    references: [properties.id],
  }),
}));

export const behaviorTrackingRelations = relations(behaviorTracking, ({ one }) => ({
  user: one(users, {
    fields: [behaviorTracking.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [behaviorTracking.propertyId],
    references: [properties.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertDeveloperSchema = createInsertSchema(developers).omit({
  id: true,
  createdAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
});

export const insertBuyerProfileSchema = createInsertSchema(buyerProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiCloserSessionSchema = createInsertSchema(aiCloserSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertyMatchSchema = createInsertSchema(propertyMatches).omit({
  id: true,
  createdAt: true,
});

export const insertBehaviorTrackingSchema = createInsertSchema(behaviorTracking).omit({
  id: true,
  createdAt: true,
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  createdAt: true,
});

export const insertObjectionResponseSchema = createInsertSchema(objectionResponses).omit({
  id: true,
  createdAt: true,
});

export const insertScamFlagSchema = createInsertSchema(scamFlags).omit({
  id: true,
  createdAt: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDeveloper = z.infer<typeof insertDeveloperSchema>;
export type Developer = typeof developers.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertBuyerProfile = z.infer<typeof insertBuyerProfileSchema>;
export type BuyerProfile = typeof buyerProfiles.$inferSelect;

export type InsertAiCloserSession = z.infer<typeof insertAiCloserSessionSchema>;
export type AiCloserSession = typeof aiCloserSessions.$inferSelect;

export type InsertPropertyMatch = z.infer<typeof insertPropertyMatchSchema>;
export type PropertyMatch = typeof propertyMatches.$inferSelect;

export type InsertBehaviorTracking = z.infer<typeof insertBehaviorTrackingSchema>;
export type BehaviorTracking = typeof behaviorTracking.$inferSelect;
