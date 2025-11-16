# Real Estate Platform - Smart Property Investment Platform

## Project Overview
A comprehensive bilingual (Arabic/English) real estate platform powered by AI to help users make informed property investment decisions. The platform features AI-driven property matching, developer trust scoring, and intelligent conversation assistance.

## Key Features
- **AI Closer**: Intelligent conversational AI to understand user needs and guide property selection
- **Property Matching Engine**: Smart algorithm that matches properties to buyer profiles
- **Developer Trust Scoring**: Comprehensive analysis of developers based on delivery history and reviews
- **Risk Analysis**: Automated detection of risk flags in properties
- **Bilingual Support**: Full RTL/LTR support for Arabic and English
- **Behavior Tracking**: Comprehensive user interaction tracking for better recommendations
- **Admin Dashboard**: Real-time analytics and platform performance monitoring

## Technology Stack
### Frontend
- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn UI components
- i18next for internationalization (Arabic/English with RTL/LTR)
- TanStack Query for data fetching
- Wouter for routing
- React Hook Form with Zod validation

### Backend
- Node.js with Express and TypeScript
- PostgreSQL database with Drizzle ORM
- OpenAI API for AI Closer conversations
- Type-safe API routes with Zod validation

## Database Schema
- **users**: Client information, roles, and buyer profile relationships
- **developers**: Developer companies with trust scores, delivery history, and reviews
- **properties**: Property listings with images, risk flags, and features
- **buyer_profiles**: Psychological profiles, risk tolerance, preferences, budget ranges
- **ai_closer_sessions**: Conversation history, qualification scores, extracted needs
- **property_matches**: Smart property-buyer matching with scores and reasons
- **behavior_tracking**: User interactions, scroll depth, time on page, clicks

## Design System
### Colors (Trust & Authority Theme)
- **Primary**: Deep Navy (#1F2937) - Trust and professionalism
- **Accent**: Rich Gold (#F59E0B) - Premium and attention
- **Success**: Green for high trust scores
- **Warning**: Amber for moderate risk
- **Destructive**: Red for high risk indicators

### Typography
- **Arabic**: Cairo font family
- **English**: Inter font family
- Professional hierarchy with clear visual distinction

### Components
All components follow Shadcn UI patterns with custom theming for the real estate context

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API key for AI Closer
- `SESSION_SECRET`: Session encryption secret

## Development Workflow
1. Schema-first approach: Define data models in `shared/schema.ts`
2. Backend implementation: API routes in `server/routes.ts`
3. Frontend components: React components with TypeScript
4. Integration: Connect frontend to backend with TanStack Query

## Recent Changes
- **Phase 1 - Frontend & Schema (Completed)**: 
  - Comprehensive database schema with all required tables (users, developers, properties, buyer_profiles, ai_closer_sessions, property_matches, behavior_tracking)
  - Complete frontend with Home, Properties, Developers, AI Closer, Buyer Profile, and Admin pages
  - Beautiful, professional UI with gold/navy color scheme following design_guidelines.md
  - Full RTL/LTR language support with i18next (Arabic/English)
  - Property and Developer cards with trust indicators
  - AI chat interface with smooth scrolling and typing indicators
  - Behavior tracking schema for analytics
  - Generated professional hero images for landing page

- **Phase 2 - Backend Implementation (Completed)**:
  - PostgreSQL database fully configured with all tables pushed
  - Complete API endpoints:
    - `/api/properties` - CRUD operations with search filters (city, type, price range)
    - `/api/developers` - Get all developers sorted by trust score
    - `/api/ai-closer/start` - Start AI conversation with OpenAI GPT-5
    - `/api/ai-closer/:sessionId/message` - Continue AI conversation
    - `/api/buyer-profile` - Create/update buyer profiles
    - `/api/property-matches` - Generate smart property matches based on buyer profile
    - `/api/behavior` - Track user behavior for analytics
  - OpenAI GPT-5 integration for AI Closer with intelligent customer qualification
  - Property matching algorithm that scores properties based on buyer preferences (budget, location, size, type)
  - Database seeded with sample data (3 developers, 8 properties, 2 users, 1 buyer profile)
  - All endpoints include proper validation using Zod schemas

- **Phase 3 - Integration (In Progress)**:
  - All frontend pages already connected to backend APIs via TanStack Query
  - PropertiesPage displays real property data with search and filters
  - DevelopersPage shows verified developers with trust scores
  - AICloserPage implements real-time AI chat with OpenAI
  - BuyerProfilePage saves preferences to database
  - Loading states and error handling implemented across all pages

## Next Steps
1. ✅ Backend API implementation - COMPLETED
2. ✅ OpenAI integration for AI Closer - COMPLETED
3. ✅ Property matching algorithm - COMPLETED
4. Comprehensive E2E testing with Playwright
5. Final polish and optimization
6. Production deployment
