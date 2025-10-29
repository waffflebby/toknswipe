# Meme Coin Tinder - Replit Project

## Overview
A Tinder-style swipe interface for discovering and tracking meme coins on Solana. Successfully migrated from Vercel to Replit on October 28, 2025.

## Project Structure
- **Framework**: Next.js 15.2.4 (App Router)
- **Package Manager**: npm (uses package-lock.json)
- **Language**: TypeScript
- **UI Framework**: React 19 with Radix UI components
- **Styling**: Tailwind CSS 4.1.9
- **Charts**: Lightweight Charts & Recharts
- **Blockchain**: Solana (via Moralis API)

### Directory Structure
```
├── app/              # Next.js app router pages and API routes
├── components/       # React components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and services
├── public/          # Static assets
├── server/          # Backend Express server (auth, database)
├── shared/          # Shared types and schema
└── styles/          # Global styles
```

## Configuration

### Port Configuration (Replit-specific)
- Development server runs on port 5000 with host 0.0.0.0
- Scripts configured in package.json:
  - `npm run dev`: Starts dev server on port 5000
  - `npm run start`: Starts production server on port 5000
  - `npm run build`: Builds the application

### Next.js Configuration
- TypeScript build errors ignored (for development)
- Images unoptimized (for Replit compatibility)
- Cache-Control headers set to no-cache (prevents iframe caching issues)
- Server actions allowed from all origins

## Database

### PostgreSQL (Neon)
- **Provider**: Neon via Replit integration
- **ORM**: Drizzle ORM
- **Migration**: `npm run db:push` (pushes schema changes)

### Schema
- **users**: User accounts (Replit Auth integration)
- **sessions**: Auth session storage
- **favorites**: Personal starred coins
- **matches**: Swiped-right coins
- **swipes**: All swipe tracking for analytics
- **coinThemes**: Keyword-based theme categorization

## Environment Variables

### Currently Used
- `DATABASE_URL`: PostgreSQL connection string (auto-configured)
- `SESSION_SECRET`: Session encryption key (auto-configured)
- `MORALIS_API_KEY`: Moralis API key for Solana blockchain data (server-side only, required)
- `NEXT_PUBLIC_API_URL`: Base URL for API calls (optional)
- `NODE_ENV`: Environment (development/production)
- `DEBUG`: Enable detailed logging (optional)

### Security Note
**IMPORTANT**: The `MORALIS_API_KEY` environment variable is required and must be set as a Replit secret. This key is server-side only (no NEXT_PUBLIC_ prefix) to prevent exposure in client bundles. All Moralis API calls are routed through Next.js API routes to keep the key secure.

## Recent Changes

### October 29, 2025 - Backend Infrastructure (Phase 1)
1. **Database Setup**:
   - Created PostgreSQL database via Replit
   - Set up Drizzle ORM with proper schema
   - Created tables: users, sessions, favorites, matches, swipes, coinThemes
   - Added `npm run db:push` script for schema migrations

2. **Authentication Foundation**:
   - Added Replit Auth integration (supports Google, GitHub, email/password)
   - Created Express backend with passport authentication
   - Set up session management with PostgreSQL storage
   - Created database storage layer with full CRUD operations

3. **Package Installations**:
   - Installed with `--legacy-peer-deps` due to React 19:
     - openid-client, passport, express-session
     - memoizee, connect-pg-simple
     - @neondatabase/serverless, drizzle-orm, drizzle-kit

### October 28, 2025 - Vercel to Replit Migration
1. Updated package.json scripts to bind to port 5000 with host 0.0.0.0
2. Configured Next.js for Replit environment with proper headers
3. Set up Dev Server workflow running on port 5000
4. Configured autoscale deployment for production
5. Installed dependencies using `--legacy-peer-deps` (React 19 peer dependency conflicts)
6. **Security Improvements:**
   - Removed hardcoded Moralis API key fallback
   - Changed environment variable from `NEXT_PUBLIC_MORALIS_API_KEY` to `MORALIS_API_KEY` (server-side only)
   - Created API routes for chart and holders data to prevent client-side API key exposure
   - Updated all client components to use API routes instead of direct Moralis calls
   - Removed wildcard server actions origins configuration
7. Successfully started application without errors

## Deployment

### Development
- Workflow: "Dev Server"
- Command: `npm run dev`
- Port: 5000
- Status: Running

### Production
- Deployment Type: Autoscale (stateless)
- Build Command: `npm run build --no-lint`
- Run Command: `npm run start`
- Note: Suitable for stateless websites; uses databases for state

## Known Issues & Warnings

1. **React 19 Peer Dependencies**: Some packages (e.g., vaul@0.9.9) expect React 18. Installed with `--legacy-peer-deps`.
2. **Next.js Cross-Origin Warning**: Future Next.js versions will require `allowedDevOrigins` configuration. Currently just a warning, not an error.
3. **npm audit**: 1 moderate severity vulnerability reported. Consider running `npm audit fix` if needed.

## User Preferences
None specified yet.

## Features

### Current (Implemented)
- Swipe interface for discovering meme coins
- Real-time data from Moralis API
- Trending and new coins tracking
- Token search functionality
- Theme-based coin categorization
- Price charts and analytics
- Risk level indicators
- Personal folder for starred coins (localStorage)
- Matched folder for swiped coins (localStorage)

### In Progress (Phase 1-5 Rollout)
- **Phase 1**: Database + Authentication
  - ✅ PostgreSQL database setup
  - ✅ Database schema (users, favorites, matches, swipes, themes)
  - ✅ Replit Auth integration
  - ⏳ Auth UI and login flow

- **Phase 2**: Core Features with Database
  - Favorites API (star coins → save to database)
  - Matches API (swipe right → save to database)
  - Migrate localStorage to database
  
- **Phase 3**: Theme System
  - Keyword-based auto-categorization
  - Theme search/filtering
  - Auto-tag new coins

- **Phase 4**: Social Features
  - Most Swiped tracking
  - Trending coins display

- **Phase 5**: Pro Features + Security
  - Stripe subscriptions
  - Rate limiting
  - Anti-spam measures
  - TanStack Query integration
