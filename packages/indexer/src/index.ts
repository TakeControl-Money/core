import { ponder } from "ponder:registry";
import { fund, deposit, withdraw, swap, supportedToken } from "ponder:schema";

ponder.on("Orcastrator:FundCreated", async ({ event, context }) => {
  await context.db.insert(fund).values({
    id: event.args.fundId,
    fundAddress: event.args.fundAddress,
    name: event.args.name,
    symbol: event.args.symbol,
    details: event.args.detailsJson,
    owner: event.args.owner,
    timestamp: Number(event.block.timestamp),
  });
});

ponder.on("Orcastrator:Deposited", async ({ event, context }) => {
  await context.db.insert(deposit).values({
    id: event.id,
    fundId: event.args.fundId,
    user: event.args.user,
    shareAmount: event.args.shareAmount,
    amount: event.args.amount,
    timestamp: Number(event.block.timestamp),
  });
});

ponder.on("Orcastrator:Withdrawn", async ({ event, context }) => {
  await context.db.insert(withdraw).values({
    id: event.id,
    fundId: event.args.fundId,
    user: event.args.user,
    shareAmount: event.args.shareAmount,
    amount: event.args.amount,
    timestamp: Number(event.block.timestamp),
  });
});

ponder.on("Orcastrator:Swapped", async ({ event, context }) => {
  await context.db.insert(swap).values({
    id: event.id,
    fundId: event.args.fundId,
    tokenOut: event.args.tokenOut,
    tokenIn: event.args.tokenIn,
    amountOut: event.args.amountOut,
    amountIn: event.args.amountIn,
    timestamp: Number(event.block.timestamp),
  });
});

ponder.on("Orcastrator:AddedSupportedToken", async ({ event, context }) => {
  await context.db.insert(supportedToken).values({
    id: event.id,
    fundId: event.args.fundId,
    token: event.args.token,
    timestamp: Number(event.block.timestamp),
  });
});
