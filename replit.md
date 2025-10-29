# Meme Coin Tinder - Replit Project

## Overview
Meme Coin Tinder is a Next.js application providing a Tinder-style swipe interface for discovering and tracking meme coins on the Solana blockchain. Its primary purpose is to offer an engaging and intuitive platform for users to explore trending and new meme coins, view real-time data, and manage their favorite selections. The project aims to capture the growing interest in meme coins by combining a popular interaction model with robust blockchain data integration.

## User Preferences
None specified yet.

## System Architecture
The application is built on Next.js 15.2.4 (App Router) using React 19 and TypeScript. Styling is handled with Tailwind CSS 4.1.9 and UI components leverage Radix UI. Charting functionalities are provided by Lightweight Charts and Recharts.

**Key Technical Implementations & Design Choices:**
- **State Management & Caching**: Utilizes TanStack Query for data fetching and client-side caching, complemented by TanStack DB for reactive collections and sub-millisecond live queries. Server-side caching is implemented with Upstash Redis, with an in-memory fallback.
- **Data Validation & Security**: All API endpoints employ Zod schemas for input validation. Security architecture prioritizes rate limiting, authentication, and validation before business logic execution.
- **Authentication**: Supabase Auth handles user authentication via email OTP, integrated with Resend for email delivery.
- **Database**: Supabase PostgreSQL is used as the primary database, with Drizzle ORM managing interactions. The schema includes tables for users, favorites, matches, swipes (for analytics), and `coinThemes` for categorization.
- **Mobile Optimization**: Responsive design with `100dvh` for dynamic viewport height, optimized touch targets, and increased swipe sensitivity for a better mobile user experience.
- **Guest Experience**: Guests can interact with the swipe interface and "star" coins, with non-intrusive toast notifications prompting sign-in to save their actions. Actions are not persisted to the database for unauthenticated users.
- **UI/UX**: Features a swipe-based discovery, real-time price charts, risk level indicators, and theme-based categorization. Watchlist folders (Personal for starred, Matched for swiped-right) are distinct and database-backed.

**Feature Specifications:**
- **Core Swipe Mechanics**: Allows users to swipe left (dismiss) or right (match/like) on meme coins.
- **Coin Data**: Displays real-time data from Moralis API, including price, 24h change, and detailed coin information.
- **Watchlists**: "Personal" folder for favorited coins and "Matched" folder for coins swiped right, with separate database persistence.
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