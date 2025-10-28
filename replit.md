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

## Environment Variables

### Currently Used
- `NEXT_PUBLIC_MORALIS_API_KEY`: Moralis API key for Solana blockchain data (has fallback value)
- `NEXT_PUBLIC_API_URL`: Base URL for API calls (optional)
- `NODE_ENV`: Environment (development/production)
- `DEBUG`: Enable detailed logging (optional)

### Security Note
**IMPORTANT**: The `NEXT_PUBLIC_MORALIS_API_KEY` environment variable is now required. The hardcoded fallback API key has been removed for security reasons. You must set this as a Replit secret before the app will run.

## Recent Changes (Migration)

### October 28, 2025 - Vercel to Replit Migration
1. Updated package.json scripts to bind to port 5000 with host 0.0.0.0
2. Configured Next.js for Replit environment with proper headers
3. Set up Dev Server workflow running on port 5000
4. Configured autoscale deployment for production
5. Installed dependencies using `--legacy-peer-deps` (React 19 peer dependency conflicts)
6. Successfully started application without errors

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
- Swipe interface for discovering meme coins
- Real-time data from Moralis API
- Trending and new coins tracking
- Token search functionality
- Theme-based coin categorization
- Price charts and analytics
- Risk level indicators
