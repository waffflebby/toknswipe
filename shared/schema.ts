// Database schema for Meme Coin Tinder
// Using Supabase Auth for authentication

import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
  primaryKey,
  uuid,
} from "drizzle-orm/pg-core";

// User storage table.
// Links to Supabase auth.users via id (UUID)
export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // Links to Supabase auth.users.id
  email: varchar("email").notNull().unique(),
  displayName: varchar("display_name"),
  avatarUrl: varchar("avatar_url"),
  isPro: boolean("is_pro").default(false).notNull(),
  proSince: timestamp("pro_since"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Favorites (personal watchlist) - coins user has starred
export const favorites = pgTable("favorites", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  coinMint: varchar("coin_mint").notNull(), // Solana mint address
  coinData: jsonb("coin_data").notNull(), // Store full coin object
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("favorites_user_id_idx").on(table.userId),
  index("favorites_coin_mint_idx").on(table.coinMint),
]);

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

// Matches - coins user swiped right on
export const matches = pgTable("matches", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  coinMint: varchar("coin_mint").notNull(),
  coinData: jsonb("coin_data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("matches_user_id_idx").on(table.userId),
  index("matches_coin_mint_idx").on(table.coinMint),
]);

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

// Swipes - track all swipe actions for analytics and "Most Swiped"
export const swipes = pgTable("swipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  coinMint: varchar("coin_mint").notNull(),
  direction: varchar("direction").notNull(), // 'left' or 'right'
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("swipes_user_id_idx").on(table.userId),
  index("swipes_coin_mint_idx").on(table.coinMint),
  index("swipes_created_at_idx").on(table.createdAt),
]);

export type Swipe = typeof swipes.$inferSelect;
export type InsertSwipe = typeof swipes.$inferInsert;

// Coin themes - auto-categorization by keywords
export const coinThemes = pgTable("coin_themes", {
  id: uuid("id").primaryKey().defaultRandom(),
  coinMint: varchar("coin_mint").notNull(),
  theme: varchar("theme").notNull(), // 'dogs', 'cats', 'frogs', 'political', 'ai', 'celebrity'
  matchedKeywords: text("matched_keywords").array(), // Which keywords triggered this theme
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("coin_themes_coin_mint_idx").on(table.coinMint),
  index("coin_themes_theme_idx").on(table.theme),
]);

export type CoinTheme = typeof coinThemes.$inferSelect;
export type InsertCoinTheme = typeof coinThemes.$inferInsert;

// Folders - user-created and system folders for organizing coins
export const folders = pgTable("folders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar("name", { length: 100 }).notNull(), // "Personal", "Matched", "Cats", etc.
  type: varchar("type", { length: 20 }).notNull().default('custom'), // 'system' or 'custom'
  icon: varchar("icon", { length: 50 }), // emoji or icon identifier
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("folders_user_id_idx").on(table.userId),
  index("folders_type_idx").on(table.type),
]);

export type Folder = typeof folders.$inferSelect;
export type InsertFolder = typeof folders.$inferInsert;

// Folder Coins - junction table connecting folders to coins
export const folderCoins = pgTable("folder_coins", {
  id: uuid("id").primaryKey().defaultRandom(),
  folderId: uuid("folder_id").notNull().references(() => folders.id, { onDelete: 'cascade' }),
  coinMint: varchar("coin_mint").notNull(), // Solana mint address
  coinData: jsonb("coin_data").notNull(), // Store full enriched coin object
  addedAt: timestamp("added_at").defaultNow(),
}, (table) => [
  index("folder_coins_folder_id_idx").on(table.folderId),
  index("folder_coins_coin_mint_idx").on(table.coinMint),
]);

export type FolderCoin = typeof folderCoins.$inferSelect;
export type InsertFolderCoin = typeof folderCoins.$inferInsert;
