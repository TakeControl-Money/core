"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Transaction = {
  id: string;
  type: "swap" | "lend" | "stake" | "withdraw" | "deposit";
  description: string;
  amount: number;
  timestamp: string;
};

export function PoolTransactions({ id }: { id: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - would be replaced with API call
    setTimeout(() => {
      setTransactions([
        {
          id: "tx-1",
          type: "swap",
          description: "Swapped USDC for ETH",
          amount: 50000,
          timestamp: "2023-12-01T14:32:00Z",
        },
        {
          id: "tx-2",
          type: "lend",
          description: "Lent USDC to Aave",
          amount: 100000,
          timestamp: "2023-11-28T09:15:00Z",
        },
        {
          id: "tx-3",
          type: "stake",
          description: "Staked ETH on Lido",
          amount: 10,
          timestamp: "2023-11-25T16:45:00Z",
        },
        {
          id: "tx-4",
          type: "deposit",
          description: "User deposited USDC",
          amount: 25000,
          timestamp: "2023-11-20T11:22:00Z",
        },
        {
          id: "tx-5",
          type: "withdraw",
          description: "User withdrew USDC",
          amount: 5000,
          timestamp: "2023-11-15T13:10:00Z",
        },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const getTransactionBadge = (type: Transaction["type"]) => {
    switch (type) {
      case "swap":
        return <Badge variant="outline">Swap</Badge>;
      case "lend":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
            Lend
          </Badge>
        );
      case "stake":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
            Stake
          </Badge>
        );
      case "deposit":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Deposit
          </Badge>
        );
      case "withdraw":
        return (
          <Badge variant="outline" className="bg-orange-500/10 text-orange-500">
            Withdraw
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b pb-4"
              >
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-6 w-1/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getTransactionBadge(tx.type)}
                  <p className="font-medium">{tx.description}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(tx.timestamp).toLocaleString()}
                </p>
              </div>
              <p className="font-medium">
                {tx.type === "deposit"
                  ? "+"
                  : tx.type === "withdraw"
                  ? "-"
                  : ""}
                {tx.type === "stake"
                  ? `${tx.amount} ETH`
                  : `$${tx.amount.toLocaleString()}`}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
