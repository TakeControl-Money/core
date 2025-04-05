import { onchainTable } from "ponder";

export const fund = onchainTable("fund", (t) => ({
  id: t.bigint().primaryKey(),
  fundAddress: t.text(),
  name: t.text().notNull(),
  symbol: t.text().notNull(),
  details: t.jsonb().default({}).notNull(),
  owner: t.text().notNull(),
  timestamp: t.integer().notNull(),
}));

export const deposit = onchainTable("deposit", (t) => ({
  id: t.text().primaryKey(),
  fundId: t.bigint().notNull(),
  user: t.text().notNull(),
  shareAmount: t.bigint().notNull(),
  amount: t.bigint().notNull(),
  timestamp: t.integer().notNull(),
}));

export const withdraw = onchainTable("withdraw", (t) => ({
  id: t.text().primaryKey(),
  fundId: t.bigint().notNull(),
  user: t.text().notNull(),
  shareAmount: t.bigint().notNull(),
  amount: t.bigint().notNull(),
  timestamp: t.integer().notNull(),
}));

export const swap = onchainTable("swap", (t) => ({
  id: t.text().primaryKey(),
  fundId: t.bigint().notNull(),
  tokenOut: t.text().notNull(),
  tokenIn: t.text().notNull(),
  amountOut: t.bigint().notNull(),
  amountIn: t.bigint().notNull(),
  timestamp: t.integer().notNull(),
}));

export const supportedToken = onchainTable("supportedToken", (t) => ({
  id: t.text().primaryKey(),
  fundId: t.bigint().notNull(),
  token: t.text().notNull(),
  name: t.text().notNull(),
  symbol: t.text().notNull(),
  decimals: t.integer().notNull(),
  timestamp: t.integer().notNull(),
}));
