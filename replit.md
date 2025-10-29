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
- **ORM**: Drizzle ORM with postgres-js driver (SSL-enabled for production)

### Database Schema (✅ Deployed)
- **users**: User profiles linked to Supabase auth.users (UUID primary key)
  - id (uuid), email, displayName, avatarUrl, isPro, proSince, stripeCustomerId, stripeSubscriptionId
- **favorites**: Personal starred coins
  - id (uuid), userId (FK), coinMint, coinData (jsonb), createdAt
- **matches**: Swiped-right coins
  - id (uuid), userId (FK), coinMint, coinData (jsonb), createdAt
- **swipes**: All swipe tracking for analytics
  - id (uuid), userId (FK), coinMint, direction, createdAt
- **coinThemes**: Keyword-based theme categorization
  - id (uuid), coinMint, theme, matchedKeywords, createdAt

## Environment Variables

### Currently Used
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon/public key (public)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-side only, required)
- `RESEND_API_KEY`: Resend API key for email delivery (server-side only, required)
- `MORALIS_API_KEY`: Moralis API key for Solana blockchain data (server-side only, required)
- `DATABASE_URL`: PostgreSQL connection string for Supabase database (server-side only, required)
- `NODE_ENV`: Environment (development/production)

### Security Note
**IMPORTANT**: Server-side only keys (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `MORALIS_API_KEY`) must be set as Replit secrets and never exposed in client bundles. All sensitive operations are routed through Next.js API routes to keep keys secure.

## Recent Changes

### October 29, 2025 - Watchlist Folder Separation Fix ✅
1. **Fixed Folder Logic**:
   - ✅ Starred coins (search) now only go to Personal folder
   - ✅ Swiped right coins now only go to Matched folder
   - ✅ Folders are completely separate - no cross-contamination
   - ✅ Delete from Personal only removes from favorites table
   - ✅ Delete from Matched only removes from matches table

2. **Improved UX**:
   - ✅ Both folders show price, 24h change %, and full coin details
   - ✅ Consistent card display across all folders
   - ✅ Fixed laggy/glitching folder issue

3. **Database Integration**:
   - ✅ Personal folder loads from `favorites` table (Supabase)
   - ✅ Matched folder loads from `matches` table (Supabase)
   - ✅ Proper data separation at database level

### October 29, 2025 - Mobile Display Optimization ✅
1. **iPhone Rendering Fixes**:
   - ✅ Fixed blurry text on iPhone with font smoothing
   - ✅ Added iOS-specific antialiasing for crisp display
   - ✅ Optimized viewport settings for high-DPI screens
   - ✅ Text rendering set to optimizeLegibility

### October 29, 2025 - Friction-Free Guest Experience with Toast Notifications ✅
1. **Guests Can Swipe & Star Without Blocking**:
   - ✅ Removed authentication blocking - guests can swipe and star freely
   - ✅ Actions work visually but don't save to database unless logged in
   - ✅ Non-intrusive approach - try before you sign up

2. **Helpful Toast Notifications**:
   - ✅ Added Sonner toast system to app layout
   - ✅ Swipes trigger info toast: "Sign in to save your swipes"
   - ✅ Stars trigger info toast: "Sign in to save favorites"
   - ✅ 3-second duration, dismissible, non-blocking

3. **Database-Only Persistence**:
   - ✅ lib/storage-db.ts: All functions return false/empty when unauthenticated
   - ✅ No localStorage fallback - database only for logged-in users
   - ✅ Security: Prevents unauthorized data persistence

4. **Optimal UX Flow**:
   - ✅ Guests can browse, swipe, star, and explore all features
   - ✅ Small notification informs them their actions won't be saved
   - ✅ No blame, no friction - just helpful guidance
   - ✅ Encourages sign-up without forcing it

### October 29, 2025 - Database Integration Complete (Phase 2) ✅
1. **Database-Backed Storage System**:
   - ✅ Swipe tracking automatically saves to database when authenticated
   - ✅ Matched coins (right swipes) save to matches table
   - ✅ Starred coins save to favorites table
   - ✅ Hybrid approach: database for logged-in users, localStorage fallback for guests
   - ✅ Automatic migration from localStorage to database on first login

2. **API Routes Created**:
   - ✅ `/api/favorites` - GET/POST/DELETE for starred coins
   - ✅ `/api/matches` - GET/POST/DELETE for swiped-right coins
   - ✅ `/api/swipes` - POST for swipe analytics tracking
   - ✅ `/api/most-swiped` - GET top coins by swipe count (7-day aggregation)

3. **Most Swiped Feature**:
   - ✅ SQL analytics query aggregates swipe counts from database
   - ✅ Feed displays most-swiped coins from last 7 days
   - ✅ Falls back to trending if no data available
   - ✅ Integrated into main feed selector

4. **Component Updates**:
   - ✅ swipe-view.tsx: Calls recordSwipe() and addToMatches()
   - ✅ watchlist-sheet.tsx: Loads from getFavorites() and getMatches()
   - ✅ search-bar.tsx: Star button uses addToFavorites()
   - ✅ All components support async database operations

### October 29, 2025 - Mobile Optimization Complete ✅
1. **Viewport & Scaling Fixes**:
   - ✅ Viewport meta tags prevent auto-zoom on input fields (user-scalable=no, maximum-scale=1)
   - ✅ Input font-size set to 16px minimum to prevent iOS automatic zoom
   - ✅ Mobile-first responsive design with proper touch targets

2. **Dynamic Viewport Height (dvh)**:
   - ✅ Replaced all `100vh` with `100dvh` for mobile browser chrome compatibility
   - ✅ Fixes iPhone URL bar cutting off contract info
   - ✅ Smooth transitions when browser chrome appears/disappears
   - ✅ Applied to: body, html, mobile-layout, swipe-card components

3. **Swipe Sensitivity Improvements**:
   - ✅ Increased swipe threshold from 80px to 120px
   - ✅ Reduced accidental swipes when scrolling through coin details
   - ✅ Better distinction between scroll and swipe gestures

4. **Header & Layout Fixes**:
   - ✅ Header stays visible after login/navigation (flex shrink-0, z-index 50)
   - ✅ Proper flex column layout prevents layout shifting
   - ✅ Activity banner, search bar, and theme filters always accessible

### October 29, 2025 - Database Integration Complete ✅
1. **Supabase Authentication**:
   - ✅ Migrated from Replit Auth to Supabase Auth
   - ✅ Email OTP (one-time password) authentication
   - ✅ Resend integration for email delivery (noreply@toknswipe.com)
   - ✅ Supabase client setup (browser, server, middleware)
   - ✅ Auth session management with automatic cookie refresh
   - ✅ Login UI with email input and code verification
   - ✅ Auth callback route for magic links
   - ✅ useAuth hook integrated with Supabase auth state
   - ✅ Profile sync on login (auto-creates user records in database)
   - Removed Express server - now using standard Next.js

2. **Database Schema & ORM**:
   - ✅ Drizzle ORM configured with postgres-js driver
   - ✅ SSL-enabled connection for Supabase production compatibility
   - ✅ Database schema deployed (users, favorites, matches, swipes, coinThemes)
   - ✅ Profile sync API route (`/api/profile/sync`)
   - ✅ Automatic user profile creation on first login
   - ✅ UUID-based primary keys linked to Supabase auth.users

3. **Package Installations**:
   - Installed with `--legacy-peer-deps` due to React 19:
     - @supabase/supabase-js, @supabase/ssr
     - postgres (postgres-js driver for Drizzle)
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
  - ✅ PostgreSQL database setup via Supabase
  - ✅ Database schema (users, favorites, matches, swipes, coinThemes)
  - ✅ Supabase Auth integration with email OTP
  - ✅ Auth UI with login button and code verification
  - ✅ Session persistence and automatic profile sync

- **Phase 2**: Core Features with Database ✅ COMPLETE
  - ✅ Database schema deployed and connected
  - ✅ User profile sync on login
  - ✅ Favorites API (star coins → save to database)
  - ✅ Matches API (swipe right → save to database)
  - ✅ Swipe tracking API for analytics
  - ✅ Most Swiped feed with 7-day aggregation
  - ✅ Hybrid storage (database + localStorage fallback)
  - ✅ Automatic localStorage migration on login
  
- **Phase 3**: Theme System (NEXT)
  - Keyword-based auto-categorization
  - Theme search/filtering
  - Auto-tag new coins
  - coinThemes table integration

- **Phase 4**: Social Features
  - User activity feed
  - Trending by region/category
  - Community insights

- **Phase 5**: Pro Features + Security
  - Stripe subscriptions
  - Rate limiting
  - Anti-spam measures
  - TanStack Query integration
