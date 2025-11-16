import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAIResponse, qualifyBuyer } from "./gemini";
import { 
  insertUserSchema, insertDeveloperSchema, insertPropertySchema,
  insertBuyerProfileSchema, insertAiCloserSessionSchema,
  insertPropertyMatchSchema, insertBehaviorTrackingSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // ============ Users API ============
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validated = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validated);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  // ============ Developers API ============
  app.get("/api/developers", async (req, res) => {
    try {
      const developers = await storage.getAllDevelopers();
      res.json(developers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch developers" });
    }
  });

  app.get("/api/developers/:id", async (req, res) => {
    try {
      const developer = await storage.getDeveloper(req.params.id);
      if (!developer) {
        return res.status(404).json({ error: "Developer not found" });
      }
      res.json(developer);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch developer" });
    }
  });

  app.post("/api/developers", async (req, res) => {
    try {
      const validated = insertDeveloperSchema.parse(req.body);
      const developer = await storage.createDeveloper(validated);
      res.json(developer);
    } catch (error) {
      res.status(400).json({ error: "Invalid developer data" });
    }
  });

  // ============ Properties API ============
  app.get("/api/properties", async (req, res) => {
    try {
      const { city, propertyType, minPrice, maxPrice } = req.query;
      
      if (city || propertyType || minPrice || maxPrice) {
        const properties = await storage.searchProperties({
          city: city as string,
          propertyType: propertyType as string,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
        });
        return res.json(properties);
      }

      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const validated = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(validated);
      res.json(property);
    } catch (error) {
      res.status(400).json({ error: "Invalid property data" });
    }
  });

  // ============ Buyer Profile API ============
  app.get("/api/buyer-profile/:userId", async (req, res) => {
    try {
      const profile = await storage.getBuyerProfile(req.params.userId);
      res.json(profile || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch buyer profile" });
    }
  });

  app.post("/api/buyer-profile", async (req, res) => {
    try {
      const validated = insertBuyerProfileSchema.parse(req.body);
      
      // Check if profile exists
      const existing = await storage.getBuyerProfile(validated.userId);
      
      if (existing) {
        const updated = await storage.updateBuyerProfile(validated.userId, validated);
        return res.json(updated);
      }
      
      const profile = await storage.createBuyerProfile(validated);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ error: "Invalid buyer profile data" });
    }
  });

  // ============ AI Closer API ============
  const AI_CLOSER_SYSTEM_PROMPT = `You are an expert real estate AI assistant. Your role is to:
1. Understand the client's needs (budget, location, property type, urgency)
2. Ask clarifying questions to qualify the buyer
3. Be professional, helpful, and knowledgeable about real estate
4. Guide the conversation to gather: budget range, preferred locations, property type, timeline, must-have features
5. Respond in the same language as the user (Arabic or English)

Keep responses concise and conversational.`;

  app.get("/api/ai-closer/session/:sessionId", async (req, res) => {
    try {
      const session = await storage.getAiCloserSession(req.params.sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  app.post("/api/ai-closer/start", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Create new session
      const session = await storage.createAiCloserSession({
        userId: req.body.userId || 'guest-user', // TODO: Get from auth
        sessionHistory: [],
        status: 'active',
      });

      // Generate AI response
      const aiResponse = await generateAIResponse(
        [{ role: 'user', content: message }],
        AI_CLOSER_SYSTEM_PROMPT
      );

      // Update session with conversation
      const updatedSession = await storage.updateAiCloserSession(session.id, {
        sessionHistory: [
          { role: 'user', content: message, timestamp: new Date().toISOString() },
          { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() },
        ],
      });

      res.json({
        sessionId: session.id,
        messages: [
          { role: 'user', content: message, timestamp: new Date().toISOString() },
          { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() },
        ],
      });
    } catch (error) {
      console.error('AI Closer start error:', error);
      res.json({ error: "Failed to start AI conversation" });
    }
  });

  app.post("/api/ai-closer/:sessionId/message", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const session = await storage.getAiCloserSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      const history = session.sessionHistory as Array<{ role: string; content: string; timestamp: string }>;

      // Generate AI response
      const aiResponse = await generateAIResponse(
        [...history.map(h => ({ role: h.role, content: h.content })), { role: 'user', content: message }],
        AI_CLOSER_SYSTEM_PROMPT
      );

      // Update session
      const newHistory = [
        ...history,
        { role: 'user', content: message, timestamp: new Date().toISOString() },
        { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() },
      ];

      // After 4+ messages, try to qualify the buyer
      let qualification = null;
      if (newHistory.length >= 8) {
        try {
          qualification = await qualifyBuyer(newHistory);
          await storage.updateAiCloserSession(sessionId, {
            sessionHistory: newHistory,
            qualificationScore: qualification.qualificationScore,
            extractedNeeds: qualification.extractedNeeds,
            outcome: qualification.outcome,
            status: qualification.outcome === 'qualified' ? 'completed' : 'active',
          });
        } catch (err) {
          // Continue without qualification
          await storage.updateAiCloserSession(sessionId, {
            sessionHistory: newHistory,
          });
        }
      } else {
        await storage.updateAiCloserSession(sessionId, {
          sessionHistory: newHistory,
        });
      }

      res.json({
        messages: [
          { role: 'user', content: message, timestamp: new Date().toISOString() },
          { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() },
        ],
        qualification,
      });
    } catch (error) {
      console.error('AI Closer message error:', error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  app.get("/api/ai-closer/sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllAiCloserSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.get("/api/ai-closer/session/:sessionId", async (req, res) => {
    try {
      const session = await storage.getAiCloserSession(req.params.sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  // ============ Property Matches API ============
  app.post("/api/property-matches", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      // Get buyer profile
      const profile = await storage.getBuyerProfile(userId);
      if (!profile) {
        return res.status(404).json({ error: "Buyer profile not found" });
      }

      // Get all properties
      const allProperties = await storage.getAllProperties();

      // Calculate matches
      const matches = allProperties.map(property => {
        let score = 50; // Base score
        const reasons: string[] = [];

        // Price match
        if (profile.minPrice && profile.maxPrice) {
          if (property.price >= profile.minPrice && property.price <= profile.maxPrice) {
            score += 20;
            reasons.push('Price within budget');
          } else if (property.price < profile.minPrice) {
            score += 10;
            reasons.push('Below budget - great deal');
          }
        }

        // Size match
        if (profile.minSize && profile.maxSize) {
          if (property.size >= profile.minSize && property.size <= profile.maxSize) {
            score += 15;
            reasons.push('Size matches preferences');
          }
        }

        // City match
        const preferredCities = profile.preferredCities as string[] || [];
        if (preferredCities.length > 0 && preferredCities.includes(property.city)) {
          score += 15;
          reasons.push('Preferred location');
        }

        // Property type match
        const preferredTypes = profile.preferredTypes as string[] || [];
        if (preferredTypes.length > 0 && preferredTypes.includes(property.propertyType)) {
          score += 10;
          reasons.push('Preferred property type');
        }

        return {
          userId,
          propertyId: property.id,
          matchScore: Math.min(score, 100),
          matchReasons: reasons,
        };
      });

      // Save top matches (score > 60)
      const topMatches = matches.filter(m => m.matchScore > 60);
      const savedMatches = await Promise.all(
        topMatches.map(match => storage.createPropertyMatch(match))
      );

      res.json(savedMatches);
    } catch (error) {
      console.error('Property match error:', error);
      res.status(500).json({ error: "Failed to generate property matches" });
    }
  });

  app.get("/api/property-matches/:userId", async (req, res) => {
    try {
      const matches = await storage.getPropertyMatches(req.params.userId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch property matches" });
    }
  });

  // ============ Behavior Tracking API ============
  app.post("/api/behavior", async (req, res) => {
    try {
      const validated = insertBehaviorTrackingSchema.parse(req.body);
      const tracking = await storage.createBehaviorTracking(validated);
      res.json(tracking);
    } catch (error) {
      res.status(400).json({ error: "Invalid behavior tracking data" });
    }
  });

  app.get("/api/behavior/:userId", async (req, res) => {
    try {
      const tracking = await storage.getBehaviorTrackingByUser(req.params.userId);
      res.json(tracking);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch behavior tracking" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
