Toknswipe.com

🪙 Toknswipe — Meme Coin Tinder for Solana
CoinSwipe is a Tinder-style swipe interface for discovering, analyzing, and tracking meme coins on Solana.
Built with Next.js 15, React 19, TailwindCSS, shadcn/ui, and Moralis Web3 API.

🚀 Features
🔥 Swipe Discovery


Tinder-like swipe UI for browsing coins


Auto-fetch trending + newly launched tokens


Smooth animations powered by React 19


📊 Real-Time Charts


Line + Candlestick charts (OHLC)


1H, 1D, 1W, 1M, ALL timeframes


Powered by Recharts


📈 Advanced Insights


Token metadata (name, supply, decimals)


Holder concentration via Moralis


Liquidity + age–based risk assessment


Automatic theme detection (dogs, cats, AI, degen, etc.)


⭐ Watchlist


Save favorite tokens


Stored in client-side persistence (localStorage + IndexedDB)


📱 Mobile-Optimized


Fully responsive


Smooth gesture interactions



🧰 Tech Stack
LayerUsedFrameworkNext.js 15UIReact 19, TailwindCSS, shadcn/uiChartsRecharts (line + OHLC candlesticks)APIMoralis Web3 APIStoragelocalStorage + IndexedDBLanguageTypeScriptAuth (optional)**Supabase / Replit DB integrations seen in repo

🔗 Moralis API Endpoints Used


/api/v2.2/tokens/trending?chain=solana — Trending coins


/api/v2.2/erc20/metadata — Token metadata


/api/v2.2/erc20/holders — Holder breakdown


/api/v2.2/erc20/price-history — Price data for charts



📦 Installation
git clone https://github.com/waffflebby/coinswipe
cd coinswipe
npm install     # or pnpm install


🔐 Environment Setup
Create .env.local:
NEXT_PUBLIC_MORALIS_API_KEY=your_api_key_here

Moralis API keys can be generated at https://moralis.io/

▶️ Development
npm run dev

App will open at:
http://localhost:3000
Production Build
npm run build
npm run start


📁 Project Structure
/app                # Next.js pages & routes
/components         # UI + swipe interface + modals
/lib                # API clients, theme detection, types, storage
/hooks              # Custom hooks
/styles             # Global styles
/public             # Static assets

Key components:


swipe-view.tsx — main swipe UI


clean-chart.tsx — charts


coin-detail-modal.tsx — token details


coin-insights-sheet.tsx — advanced insights


api-enhanced.ts — Moralis API wrapper



🧪 Development Notes


Uses aggressive caching for API calls (1–3 hours)


IndexedDB stores historical data for speed


Newly launched tokens sometimes have missing data (Moralis limitation)



🛣️ Roadmap


 Advanced filtering (market cap, price range, time live)


 Price alerts


 Social features (sharing, voting)


 User accounts + cloud sync


 Full backend database


 React Native mobile app



🤝 Contributing


Fork the repo


Create a feature branch


Submit a PR



📜 License
MIT

