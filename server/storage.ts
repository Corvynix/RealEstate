import {
  users, developers, properties, buyerProfiles, aiCloserSessions,
  propertyMatches, behaviorTracking,
  type User, type InsertUser,
  type Developer, type InsertDeveloper,
  type Property, type InsertProperty,
  type BuyerProfile, type InsertBuyerProfile,
  type AiCloserSession, type InsertAiCloserSession,
  type PropertyMatch, type InsertPropertyMatch,
  type BehaviorTracking, type InsertBehaviorTracking,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Developers
  getDeveloper(id: string): Promise<Developer | undefined>;
  getAllDevelopers(): Promise<Developer[]>;
  createDeveloper(developer: InsertDeveloper): Promise<Developer>;
  updateDeveloperTrustScore(id: string, score: number): Promise<void>;

  // Properties
  getProperty(id: string): Promise<Property | undefined>;
  getAllProperties(): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  searchProperties(filters: {
    city?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Property[]>;

  // Buyer Profiles
  getBuyerProfile(userId: string): Promise<BuyerProfile | undefined>;
  createBuyerProfile(profile: InsertBuyerProfile): Promise<BuyerProfile>;
  updateBuyerProfile(userId: string, profile: Partial<InsertBuyerProfile>): Promise<BuyerProfile>;

  // AI Closer Sessions
  getAiCloserSession(id: string): Promise<AiCloserSession | undefined>;
  getAllAiCloserSessions(): Promise<AiCloserSession[]>;
  createAiCloserSession(session: InsertAiCloserSession): Promise<AiCloserSession>;
  updateAiCloserSession(id: string, updates: Partial<AiCloserSession>): Promise<AiCloserSession>;

  // Property Matches
  getPropertyMatches(userId: string): Promise<PropertyMatch[]>;
  createPropertyMatch(match: InsertPropertyMatch): Promise<PropertyMatch>;

  // Behavior Tracking
  createBehaviorTracking(tracking: InsertBehaviorTracking): Promise<BehaviorTracking>;
  getBehaviorTrackingByUser(userId: string): Promise<BehaviorTracking[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Developers
  async getDeveloper(id: string): Promise<Developer | undefined> {
    const [developer] = await db.select().from(developers).where(eq(developers.id, id));
    return developer || undefined;
  }

  async getAllDevelopers(): Promise<Developer[]> {
    return await db.select().from(developers).orderBy(desc(developers.trustScore));
  }

  async createDeveloper(insertDeveloper: InsertDeveloper): Promise<Developer> {
    const [developer] = await db.insert(developers).values(insertDeveloper).returning();
    return developer;
  }

  async updateDeveloperTrustScore(id: string, score: number): Promise<void> {
    await db.update(developers)
      .set({ trustScore: score })
      .where(eq(developers.id, id));
  }

  // Properties
  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async getAllProperties(): Promise<Property[]> {
    return await db.select().from(properties).orderBy(desc(properties.createdAt));
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const [property] = await db.insert(properties).values(insertProperty).returning();
    return property;
  }

  async searchProperties(filters: {
    city?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Property[]> {
    let query = db.select().from(properties);
    
    const conditions = [];
    if (filters.city) conditions.push(eq(properties.city, filters.city));
    if (filters.propertyType) conditions.push(eq(properties.propertyType, filters.propertyType));
    if (filters.minPrice) conditions.push(gte(properties.price, filters.minPrice));
    if (filters.maxPrice) conditions.push(lte(properties.price, filters.maxPrice));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return await query.orderBy(desc(properties.createdAt));
  }

  // Buyer Profiles
  async getBuyerProfile(userId: string): Promise<BuyerProfile | undefined> {
    const [profile] = await db.select().from(buyerProfiles).where(eq(buyerProfiles.userId, userId));
    return profile || undefined;
  }

  async createBuyerProfile(insertProfile: InsertBuyerProfile): Promise<BuyerProfile> {
    const [profile] = await db.insert(buyerProfiles).values(insertProfile).returning();
    return profile;
  }

  async updateBuyerProfile(userId: string, updates: Partial<InsertBuyerProfile>): Promise<BuyerProfile> {
    const [profile] = await db.update(buyerProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(buyerProfiles.userId, userId))
      .returning();
    return profile;
  }

  // AI Closer Sessions
  async getAiCloserSession(id: string): Promise<AiCloserSession | undefined> {
    const [session] = await db.select().from(aiCloserSessions).where(eq(aiCloserSessions.id, id));
    return session || undefined;
  }

  async getAllAiCloserSessions(): Promise<AiCloserSession[]> {
    return await db.select().from(aiCloserSessions).orderBy(desc(aiCloserSessions.createdAt));
  }

  async createAiCloserSession(insertSession: InsertAiCloserSession): Promise<AiCloserSession> {
    const [session] = await db.insert(aiCloserSessions).values(insertSession).returning();
    return session;
  }

  async updateAiCloserSession(id: string, updates: Partial<AiCloserSession>): Promise<AiCloserSession> {
    const [session] = await db.update(aiCloserSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(aiCloserSessions.id, id))
      .returning();
    return session;
  }

  // Property Matches
  async getPropertyMatches(userId: string): Promise<PropertyMatch[]> {
    return await db.select().from(propertyMatches)
      .where(eq(propertyMatches.userId, userId))
      .orderBy(desc(propertyMatches.matchScore));
  }

  async createPropertyMatch(insertMatch: InsertPropertyMatch): Promise<PropertyMatch> {
    const [match] = await db.insert(propertyMatches).values(insertMatch).returning();
    return match;
  }

  // Behavior Tracking
  async createBehaviorTracking(insertTracking: InsertBehaviorTracking): Promise<BehaviorTracking> {
    const [tracking] = await db.insert(behaviorTracking).values(insertTracking).returning();
    return tracking;
  }

  async getBehaviorTrackingByUser(userId: string): Promise<BehaviorTracking[]> {
    return await db.select().from(behaviorTracking)
      .where(eq(behaviorTracking.userId, userId))
      .orderBy(desc(behaviorTracking.createdAt));
  }
}

export const storage = new DatabaseStorage();
