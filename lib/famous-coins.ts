// Famous placeholder coins for each theme to prevent empty results
export const FAMOUS_COINS_BY_THEME = {
  cat: [
    {
      mint: 'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5',
      name: 'cat in a dogs world',
      symbol: 'MEW',
      description: 'The first cat coin on Solana',
    },
    {
      mint: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr',
      name: 'POPCAT',
      symbol: 'POPCAT',
      description: 'The viral cat meme coin',
    },
    {
      mint: 'Bn113WT6rbdgwrm12UJtnmNqGqZjY4it2WoUQuQopFVn',
      name: 'Mog Coin',
      symbol: 'Mog',
      description: 'Mog cat meme coin',
    },
    {
      mint: 'BqvJ5hNqQqvpP6hMYz8Xn4t3t2fZm8TrG5h3D4zXpump',
      name: 'Michi',
      symbol: 'MICHI',
      description: 'Cute cat meme coin',
    },
  ],
  dog: [
    {
      mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      name: 'Bonk',
      symbol: 'BONK',
      description: 'The first Solana dog meme coin',
    },
    {
      mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
      name: 'dogwifhat',
      symbol: 'WIF',
      description: 'Dog with hat meme',
    },
    {
      mint: '8c71AvjQeKKeWRe8jtTGG1bJ2WiYXQdbjqFbUfhHgSVk',
      name: 'samo',
      symbol: 'SAMO',
      description: 'Samoyed dog coin',
    },
  ],
  pepe: [
    {
      mint: 'PepePeJCCJznWo9pxd1pnKpq5vS2JTWqY7E7H7T7pump',
      name: 'PEPE',
      symbol: 'PEPE',
      description: 'The legendary pepe meme',
    },
  ],
  trump: [
    {
      mint: '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN',
      name: 'OFFICIAL TRUMP',
      symbol: 'TRUMP',
      description: 'Official Trump meme coin',
    },
  ],
  ai: [
    {
      mint: 'AiAiAiXy9YP6Cj6m7F5t8T9zPump1234567890abcd',
      name: 'AI Bot',
      symbol: 'AIB',
      description: 'AI-powered meme coin',
    },
  ],
  nft: [
    {
      mint: 'NFTNFTXy9YP6Cj6m7F5t8T9zPump1234567890abcd',
      name: 'NFT Ape',
      symbol: 'NFTAPE',
      description: 'NFT collection meme coin',
    },
  ],
  gaming: [
    {
      mint: 'GameGameXy9YP6Cj6m7F5t8T9zPump1234567890ab',
      name: 'Game Token',
      symbol: 'GAME',
      description: 'Gaming meme coin',
    },
  ],
}

export type ThemeId = keyof typeof FAMOUS_COINS_BY_THEME
