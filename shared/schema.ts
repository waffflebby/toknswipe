// Database schema for Meme Coin Tinder
// Reference: Replit Auth blueprint integration

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
} from "drizzle-orm/pg-core";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
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
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
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
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
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
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
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
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
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
