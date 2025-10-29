// Database storage operations
// Reference: Replit Auth blueprint integration

import {
  users,
  favorites,
  matches,
  swipes,
  coinThemes,
  type User,
  type UpsertUser,
  type Favorite,
  type InsertFavorite,
  type Match,
  type InsertMatch,
  type Swipe,
  type InsertSwipe,
  type CoinTheme,
  type InsertCoinTheme,
} from "../shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Favorites operations
  addFavorite(userId: string, coinMint: string, coinData: any): Promise<Favorite>;
  removeFavorite(userId: string, coinMint: string): Promise<void>;
  getUserFavorites(userId: string): Promise<Favorite[]>;
  isFavorite(userId: string, coinMint: string): Promise<boolean>;
  
  // Matches operations
  addMatch(userId: string, coinMint: string, coinData: any): Promise<Match>;
  removeMatch(userId: string, coinMint: string): Promise<void>;
  getUserMatches(userId: string): Promise<Match[]>;
  
  // Swipes operations
  recordSwipe(userId: string, coinMint: string, direction: 'left' | 'right'): Promise<Swipe>;
  getUserSwipeCount(userId: string): Promise<number>;
  getMostSwipedCoins(limit?: number): Promise<{ coinMint: string; swipeCount: number }[]>;
  
  // Theme operations
  addCoinTheme(coinMint: string, theme: string, matchedKeywords: string[]): Promise<CoinTheme>;
  getCoinThemes(coinMint: string): Promise<CoinTheme[]>;
  getCoinsByTheme(theme: string, limit?: number): Promise<CoinTheme[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Favorites operations
  async addFavorite(userId: string, coinMint: string, coinData: any): Promise<Favorite> {
    const [favorite] = await db
      .insert(favorites)
      .values({ userId, coinMint, coinData })
      .onConflictDoNothing()
      .returning();
    return favorite;
  }

  async removeFavorite(userId: string, coinMint: string): Promise<void> {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.coinMint, coinMint)));
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));
  }

  async isFavorite(userId: string, coinMint: string): Promise<boolean> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.coinMint, coinMint)));
    return result.count > 0;
  }

  // Matches operations
  async addMatch(userId: string, coinMint: string, coinData: any): Promise<Match> {
    const [match] = await db
      .insert(matches)
      .values({ userId, coinMint, coinData })
      .onConflictDoNothing()
      .returning();
    return match;
  }

  async removeMatch(userId: string, coinMint: string): Promise<void> {
    await db
      .delete(matches)
      .where(and(eq(matches.userId, userId), eq(matches.coinMint, coinMint)));
  }

  async getUserMatches(userId: string): Promise<Match[]> {
    return await db
      .select()
      .from(matches)
      .where(eq(matches.userId, userId))
      .orderBy(desc(matches.createdAt));
  }

  // Swipes operations
  async recordSwipe(userId: string, coinMint: string, direction: 'left' | 'right'): Promise<Swipe> {
    const [swipe] = await db
      .insert(swipes)
      .values({ userId, coinMint, direction })
      .returning();
    return swipe;
  }

  async getUserSwipeCount(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(swipes)
      .where(eq(swipes.userId, userId));
    return result.count;
  }

  async getMostSwipedCoins(limit: number = 10): Promise<{ coinMint: string; swipeCount: number }[]> {
    const results = await db
      .select({
        coinMint: swipes.coinMint,
        swipeCount: sql<number>`count(*)`,
      })
      .from(swipes)
      .where(eq(swipes.direction, 'right'))
      .groupBy(swipes.coinMint)
      .orderBy(desc(sql`count(*)`))
      .limit(limit);
    return results;
  }

  // Theme operations
  async addCoinTheme(coinMint: string, theme: string, matchedKeywords: string[]): Promise<CoinTheme> {
    const [coinTheme] = await db
      .insert(coinThemes)
      .values({ coinMint, theme, matchedKeywords })
      .onConflictDoNothing()
      .returning();
    return coinTheme;
  }

  async getCoinThemes(coinMint: string): Promise<CoinTheme[]> {
    return await db
      .select()
      .from(coinThemes)
      .where(eq(coinThemes.coinMint, coinMint));
  }

  async getCoinsByTheme(theme: string, limit: number = 50): Promise<CoinTheme[]> {
    return await db
      .select()
      .from(coinThemes)
      .where(eq(coinThemes.theme, theme))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
