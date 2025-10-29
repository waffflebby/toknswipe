export type ThemeCategory = 
  | 'ai' 
  | 'gaming' 
  | 'dog' 
  | 'cat' 
  | 'pepe' 
  | 'elon'
  | 'defi'
  | 'nft'
  | 'sport'
  | 'food'
  | 'anime'
  | 'meme'

export interface ThemeConfig {
  id: ThemeCategory
  name: string
  icon: string
  keywords: string[]
  color: string
}

export const THEME_CONFIGS: ThemeConfig[] = [
  {
    id: 'ai',
    name: 'AI & Tech',
    icon: '🤖',
    keywords: ['ai', 'artificial', 'intelligence', 'robot', 'bot', 'neural', 'machine', 'gpt', 'chatgpt', 'openai', 'tech', 'cyber', 'digital', 'meta', 'quantum'],
    color: 'bg-blue-100 text-blue-700 border-blue-300'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: '🎮',
    keywords: ['game', 'gaming', 'play', 'gamer', 'esport', 'arcade', 'console', 'xbox', 'playstation', 'nintendo', 'steam', 'fps', 'rpg', 'mmo'],
    color: 'bg-purple-100 text-purple-700 border-purple-300'
  },
  {
    id: 'dog',
    name: 'Dog Coins',
    icon: '🐕',
    keywords: ['dog', 'doge', 'shib', 'inu', 'puppy', 'pup', 'corgi', 'husky', 'retriever', 'hound', 'woof', 'bark', 'floki', 'doggo'],
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300'
  },
  {
    id: 'cat',
    name: 'Cat Coins',
    icon: '🐱',
    keywords: ['cat', 'kitten', 'kitty', 'meow', 'feline', 'neko', 'tabby', 'persian', 'siamese', 'grumpy', 'garfield'],
    color: 'bg-pink-100 text-pink-700 border-pink-300'
  },
  {
    id: 'pepe',
    name: 'Pepe',
    icon: '🐸',
    keywords: ['pepe', 'frog', 'kek', 'wojak', 'apu', 'feels', 'ribbit', 'toad'],
    color: 'bg-green-100 text-green-700 border-green-300'
  },
  {
    id: 'elon',
    name: 'Elon',
    icon: '🚀',
    keywords: ['elon', 'musk', 'tesla', 'spacex', 'mars', 'rocket', 'moon', 'x'],
    color: 'bg-gray-100 text-gray-700 border-gray-300'
  },
  {
    id: 'defi',
    name: 'DeFi',
    icon: '💰',
    keywords: ['defi', 'finance', 'swap', 'stake', 'yield', 'farm', 'liquidity', 'dex', 'protocol', 'lending', 'vault'],
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300'
  },
  {
    id: 'nft',
    name: 'NFT',
    icon: '🖼️',
    keywords: ['nft', 'art', 'collectible', 'rare', 'unique', 'mint', 'gallery', 'drop', 'metaverse'],
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300'
  },
  {
    id: 'sport',
    name: 'Sports',
    icon: '⚽',
    keywords: ['sport', 'football', 'soccer', 'basketball', 'baseball', 'tennis', 'racing', 'athlete', 'team', 'champion'],
    color: 'bg-orange-100 text-orange-700 border-orange-300'
  },
  {
    id: 'food',
    name: 'Food & Drink',
    icon: '🍕',
    keywords: ['food', 'pizza', 'burger', 'sushi', 'taco', 'beer', 'wine', 'coffee', 'tea', 'cake', 'cookie', 'banana', 'apple'],
    color: 'bg-red-100 text-red-700 border-red-300'
  },
  {
    id: 'anime',
    name: 'Anime',
    icon: '🎌',
    keywords: ['anime', 'manga', 'otaku', 'waifu', 'kawaii', 'naruto', 'pokemon', 'goku', 'japan', 'ninja', 'samurai'],
    color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300'
  },
  {
    id: 'meme',
    name: 'Meme',
    icon: '😂',
    keywords: ['meme', 'based', 'chad', 'sigma', 'gigachad', 'dank', 'lol', 'lmao', 'kek', 'rekt', 'moon', 'lambo', 'wen'],
    color: 'bg-cyan-100 text-cyan-700 border-cyan-300'
  }
]

export function getThemeById(id: ThemeCategory): ThemeConfig | undefined {
  return THEME_CONFIGS.find(theme => theme.id === id)
}

export function getThemesByIds(ids: ThemeCategory[]): ThemeConfig[] {
  return ids.map(id => getThemeById(id)).filter(Boolean) as ThemeConfig[]
}
