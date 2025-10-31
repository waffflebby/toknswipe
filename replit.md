# Meme Coin Tinder - Replit Project

## Overview
Meme Coin Tinder is a Next.js application providing a Tinder-style swipe interface for discovering and tracking meme coins on the Solana blockchain. Its primary purpose is to offer an engaging and intuitive platform for users to explore trending and new meme coins, view real-time data, and manage their favorite selections. The project aims to capture the growing interest in meme coins by combining a popular interaction model with robust blockchain data integration.

## User Preferences
None specified yet.

## Recent Changes (October 31, 2025)
- **Replaced 24h Txns with Top Holder % Metric**: Complete replacement across entire application
  - Integrated Moralis top-holders API endpoint to fetch percentage of supply held by largest holder
  - Added `topHolderWeight` property to EnrichedCoin type (replacing deprecated `txns24h`)
  - Updated all UI components to display "Top Holder %" with proper formatting (toFixed(1) or toFixed(2))
  - Implemented explicit null/undefined checks to properly display 0% values
  - Added error handling in `fetchTopHolderWeight` function (try-catch returns undefined on failure) to keep enrichment non-blocking
  - Updated all mock/fallback data with topHolderWeight values
  - Components affected: SwipeCard, CoinInsightsSheet, WatchlistSheet, CoinDetailModal, MatchesList

## Previous Changes (October 29, 2025)
- **Fixed React Hydration Mismatch**: Added `isMounted` state to prevent hydration errors that were blocking UI updates - loading state now only shows after component mounts on client side
- **New Folder-Based Watchlist System**: Complete redesign of coin organization with proper database schema
  - Created `folders` table (supports system folders like Personal/Matched and custom user folders)
  - Created `folderCoins` junction table for many-to-many coin-to-folder relationships
  - System folders automatically created on user signup (Personal ⭐ and Matched 💚)
  - Updated `/api/favorites` and `/api/matches` endpoints to use new folder system internally
  - Created `/api/folders` endpoints for folder management (list, create, delete)
  - Created `/api/folders/[id]/coins` endpoints for coin management (add, remove, list coins in folder)
  - Helper functions in `lib/folder-helpers.ts` for system folder initialization
  - **UI Integration Complete**: WatchlistSheet now fully connected to folder APIs
    - Replaced localStorage with database API calls for custom folders
    - "New" button creates folders via POST /api/folders
    - Custom folder tabs dynamically render from database with emoji support
    - Dropdown menu allows adding coins to any custom folder
    - Delete folder option available in dropdown when viewing custom folder
    - Remove coin works for both system folders (matched/personal) and custom folders
- **Previous Updates**:
  - Subtle Loading Overlay with blur background and purple spinner
  - Real Images for Famous Coins (POPCAT, MEW, BONK, WIF) with Cloudfront CDN URLs
  - Fixed Theme ID Mismatch and standardized to plural format
  - Back Button for themed feeds navigation
  - Theme Feed API with multi-layer fallback

## System Architecture
The application is built on Next.js 15.2.4 (App Router) using React 19 and TypeScript. Styling is handled with Tailwind CSS 4.1.9 and UI components leverage Radix UI. Charting functionalities are provided by Lightweight Charts and Recharts.

**Key Technical Implementations & Design Choices:**
- **State Management & Caching**: Utilizes TanStack Query for data fetching and client-side caching, complemented by TanStack DB for reactive collections and sub-millisecond live queries. Server-side caching is implemented with Upstash Redis, with an in-memory fallback.
- **Data Validation & Security**: All API endpoints employ Zod schemas for input validation. Security architecture prioritizes rate limiting, authentication, and validation before business logic execution.
- **Authentication**: Supabase Auth handles user authentication via email OTP, integrated with Resend for email delivery.
- **Database**: Supabase PostgreSQL is used as the primary database, with Drizzle ORM managing interactions. The schema includes tables for users, swipes (for analytics), coinThemes (for categorization), folders (for organizing saved coins), and folderCoins (junction table connecting coins to folders). The old favorites/matches tables are deprecated in favor of the folder system.
- **Mobile Optimization**: Responsive design with `100dvh` for dynamic viewport height, optimized touch targets, and increased swipe sensitivity for a better mobile user experience.
- **Guest Experience**: Guests can interact with the swipe interface and "star" coins, with non-intrusive toast notifications prompting sign-in to save their actions. Actions are not persisted to the database for unauthenticated users.
- **UI/UX**: Features a swipe-based discovery, real-time price charts, risk level indicators, and theme-based categorization. Watchlist folders (Personal for starred, Matched for swiped-right) are distinct and database-backed.

**Feature Specifications:**
- **Core Swipe Mechanics**: Allows users to swipe left (dismiss) or right (match/like) on meme coins.
- **Coin Data**: Displays real-time data from Moralis API, including price, 24h change, and detailed coin information.
- **Watchlists**: Folder-based organization system with system folders (Personal for starred coins, Matched for swiped-right coins) and support for custom user-created folders. All folders use the unified folders/folderCoins table structure.
- **Theme System**: Comprehensive keyword-based auto-categorization into 17+ themes (e.g., Dog, Cat, Pepe, NFT), with persistent storage in the `coinThemes` table.
- **Trending & Analytics**: "Most Swiped" feed based on 7-day aggregation of user swipes, falling back to general trending data if unavailable.
- **Performance**: Optimized with TanStack Query, TanStack DB, and Redis caching for fast data retrieval and reactive UI updates.
- **Security**: Implements rate limiting on mutations (10 req/10s per IP), authentication checks, and Zod validation across all mutation endpoints.

## External Dependencies
- **Blockchain Data**: Moralis API (for Solana blockchain data)
- **Database**: Supabase PostgreSQL
- **Authentication & Email**: Supabase Auth, Resend (for email OTP delivery)
- **Caching & Rate Limiting**: Upstash Redis
- **ORM**: Drizzle ORM (with `postgres-js` driver)
- **UI Libraries**: Radix UI, Tailwind CSS
- **Charting**: Lightweight Charts, Recharts
- **Data Fetching/State Management**: TanStack Query, TanStack DB