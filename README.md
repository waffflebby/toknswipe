# Meme Coin Tinder 🚀

A Tinder-style swipe interface for discovering and tracking meme coins on Solana. Built with Next.js, React, and Moralis API.

## Features

- **Swipe Interface**: Tinder-like card swiping for coin discovery
- **Real-time Charts**: Line and candlestick charts with 5 timeframes (1H, 1D, 1W, 1M, ALL)
- **Trending & New Coins**: Fetch trending coins and newly launched tokens
- **Watchlist**: Save favorite coins for later
- **Theme Detection**: Auto-detect coin themes (dogs, cats, AI, etc.)
- **Risk Assessment**: Automatic risk level calculation based on liquidity and age
- **Mobile-Optimized**: Fully responsive design for mobile and desktop

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: TailwindCSS + shadcn/ui components
- **Charts**: Recharts with OHLC candlestick support
- **API**: Moralis Web3 API for token data
- **Storage**: localStorage + IndexedDB for client-side persistence
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ or pnpm
- Moralis API key (get one at [moralis.io](https://moralis.io))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd meme-coin-tinder
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Moralis API key to `.env.local`:
```
NEXT_PUBLIC_MORALIS_API_KEY=your_api_key_here
```

5. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   └── api/               # API routes
├── components/            # React components
│   ├── swipe-view.tsx     # Main swipe interface
│   ├── clean-chart.tsx    # Chart component
│   ├── coin-detail-modal.tsx
│   ├── coin-insights-sheet.tsx
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities and services
│   ├── api-enhanced.ts    # Moralis API integration
│   ├── types.ts           # TypeScript types
│   ├── theme-detector.ts  # Theme detection logic
│   └── storage.ts         # localStorage helpers
├── hooks/                 # Custom React hooks
├── styles/                # Global styles
└── public/                # Static assets
```

## API Integration

### Moralis Endpoints Used

- **Trending Tokens**: `/api/v2.2/tokens/trending?chain=solana`
- **Token Metadata**: `/api/v2.2/erc20/metadata`
- **Token Holders**: `/api/v2.2/erc20/holders`
- **Token Price History**: `/api/v2.2/erc20/price-history`

## Key Components

### SwipeView
Main component that handles the card swiping interface and feed management.

### CleanChart
Displays price charts with multiple timeframes and chart types (line/candlestick).

### CoinDetailModal
Shows detailed information about a selected coin including risk assessment.

### CoinInsightsSheet
Displays advanced metrics and holder information.

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Features

1. Create components in `/components`
2. Add types to `/lib/types.ts`
3. Add API functions to `/lib/api-enhanced.ts`
4. Use hooks from `/hooks` for state management

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_MORALIS_API_KEY=your_moralis_api_key
```

## Database Setup (Replit)

For database integration on Replit:

1. Set up PostgreSQL database
2. Create `.env` with database URL
3. Run migrations
4. Update API routes in `/app/api`

See `REPLIT_SETUP.md` for detailed instructions.

## Performance Optimizations

- **API Caching**: 3-hour cache for trending coins, 1-hour for new coins
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic with Next.js
- **Client-side Storage**: localStorage for user preferences, IndexedDB for coin data

## Known Issues

- Chart data may take time to load for newly launched tokens
- Some tokens may not have complete metadata available

## Future Enhancements

- [ ] Advanced filtering (price range, market cap, etc.)
- [ ] Price alerts
- [ ] Social features (share, vote)
- [ ] User authentication
- [ ] Database integration for user data
- [ ] Mobile app (React Native)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT

## Support

For issues or questions, please open a GitHub issue.

## Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Replit
1. Connect GitHub repository
2. Set environment variables in Replit secrets
3. Deploy automatically on push

### Other Platforms
- Netlify
- Railway
- Heroku

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Moralis Documentation](https://docs.moralis.io)
- [TailwindCSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
