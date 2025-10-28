// Famous coin mappings to themes
export const FAMOUS_COINS: Record<string, string[]> = {
  // Cats
  POPCAT: ["cats"],
  MEW: ["cats"],
  MOG: ["cats"],
  KITTY: ["cats"],
  PURR: ["cats"],
  NEKO: ["cats"],
  
  // Dogs
  DOGE: ["dogs"],
  SHIB: ["dogs"],
  FLOKI: ["dogs"],
  BONK: ["dogs"],
  SAMO: ["dogs"],
  WIF: ["dogs"],
  PUPPY: ["dogs"],
  WOOF: ["dogs"],
  
  // Frogs
  PEPE: ["frogs"],
  RIBBIT: ["frogs"],
  KERMIT: ["frogs"],
  FROG: ["frogs"],
  
  // Political
  TRUMP: ["political"],
  MAGA: ["political"],
  BIDEN: ["political"],
  VOTE: ["political"],
  
  // AI
  GROK: ["ai"],
  NEURAL: ["ai"],
  BOT: ["ai"],
  LLM: ["ai"],
  
  // Celebrity
  ELON: ["celebrity"],
  MUSK: ["celebrity"],
  CELEB: ["celebrity"],
  STAR: ["celebrity"],
  VIP: ["celebrity"],
}

// Get themes for a coin by symbol
export function getThemesForCoin(symbol: string): string[] {
  const upperSymbol = symbol.toUpperCase()
  
  // Direct match
  if (FAMOUS_COINS[upperSymbol]) {
    return FAMOUS_COINS[upperSymbol]
  }
  
  // Partial match
  for (const [coinSymbol, themes] of Object.entries(FAMOUS_COINS)) {
    if (upperSymbol.includes(coinSymbol) || coinSymbol.includes(upperSymbol)) {
      return themes
    }
  }
  
  return []
}

// Get all coins for a theme
export function getCoinsForTheme(themeId: string): string[] {
  return Object.entries(FAMOUS_COINS)
    .filter(([_, themes]) => themes.includes(themeId))
    .map(([symbol]) => symbol)
}
