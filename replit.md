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
├── components/       # React components (including auth/)
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and services (including supabase/)
├── public/          # Static assets
├── shared/          # Shared types and schema
└── styles/          # Global styles
```

## Configuration

### Port Configuration (Replit-specific)
- Development server runs on port 5000 with host 0.0.0.0
- Standard Next.js server (no custom Express)
- Scripts configured in package.json:
  - `npm run dev`: Starts Next.js dev server on port 5000
  - `npm run start`: Starts Next.js production server on port 5000
  - `npm run build`: Builds the Next.js application

### Next.js Configuration
- TypeScript build errors ignored (for development)
- Images unoptimized (for Replit compatibility)
- Cache-Control headers set to no-cache (prevents iframe caching issues)
- Server actions allowed from all origins

## Database

### Supabase PostgreSQL
- **Provider**: Supabase (wcwcrktwrrfpeouqjids.supabase.co)
- **Authentication**: Email OTP via Supabase Auth
- **Email Provider**: Resend (for OTP delivery)

### Planned Schema (to be migrated)
- **users**: User profiles and metadata
- **favorites**: Personal starred coins
- **matches**: Swiped-right coins
- **swipes**: All swipe tracking for analytics
- **coinThemes**: Keyword-based theme categorization

## Environment Variables

### Currently Used
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon/public key (public)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-side only, required)
- `RESEND_API_KEY`: Resend API key for email delivery (server-side only, required)
- `MORALIS_API_KEY`: Moralis API key for Solana blockchain data (server-side only, required)
- `NODE_ENV`: Environment (development/production)

### Security Note
**IMPORTANT**: Server-side only keys (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `MORALIS_API_KEY`) must be set as Replit secrets and never exposed in client bundles. All sensitive operations are routed through Next.js API routes to keep keys secure.

## Recent Changes

### October 29, 2025 - Supabase Migration Complete ✅
1. **Supabase Authentication**:
   - ✅ Migrated from Replit Auth to Supabase Auth
   - ✅ Email OTP (one-time password) authentication
   - ✅ Resend integration for email delivery
   - ✅ Supabase client setup (browser, server, middleware)
   - ✅ Auth session management with automatic cookie refresh
   - ✅ Login UI with email input and code verification
   - ✅ Auth callback route for magic links
   - ✅ useAuth hook integrated with Supabase auth state
   - Removed Express server - now using standard Next.js

2. **Package Installations**:
   - Installed with `--legacy-peer-deps` due to React 19:
     - @supabase/supabase-js, @supabase/ssr
     - Resend connector (Python integration)

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
- **Phase 1**: Database + Authentication ✅ COMPLETE
  - ✅ PostgreSQL database setup
  - ✅ Database schema (users, favorites, matches, swipes, themes)
  - ✅ Replit Auth integration with Google/GitHub/email login
  - ✅ Auth UI with login button and user profile dropdown
  - ✅ Session persistence and user profile storage

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
