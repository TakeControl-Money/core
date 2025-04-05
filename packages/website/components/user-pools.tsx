"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight } from "lucide-react";
import { useWeb3 } from "@/hooks/use-web3";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";

type OwnedFund = {
  id: string;
  fundAddress: string;
  name: string;
  symbol: string;
  details: object;
};

type OwnedFundsData = { funds: { items: OwnedFund[] } };

const fetchOwnedFunds = async (address?: `0x${string}`) => {
  if (!address) return { funds: { items: [] } };

  const OwnedFundsQuery = gql`
    query OwnedFunds {
      funds(where:{owner:"${address}"}) {
        items{
          id
          fundAddress
          name
          symbol
          details
        }
      }
    }
  `;
  const data = await request<OwnedFundsData>(
    process.env.NEXT_PUBLIC_PONDER_URL || "http://localhost:42069",
    OwnedFundsQuery
  );
  return data;
};

export function UserPools() {
  const { isConnected, connect, address } = useWeb3();

  const { data: ownedFunds, isLoading } = useQuery({
    queryKey: ["ownedFunds", address],
    queryFn: () => fetchOwnedFunds(address),
  });

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="mb-4 text-center text-muted-foreground">
            Connect your wallet to view your pools
          </p>
          <Button onClick={connect}>Connect Smart Wallet</Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="mb-4 flex items-center justify-between border-b pb-4 last:border-0"
            >
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (ownedFunds?.funds.items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="mb-4 text-center text-muted-foreground">
            You haven&apos;t created any pools yet
          </p>
          <Link href="/create-pool">
            <Button>Create Your First Pool</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="py-2 px-6">
        {ownedFunds?.funds.items.map((pool) => (
          <div
            key={pool.id}
            className="flex items-center justify-between border-b last:border-0 py-4"
          >
            <div>
              <p className="font-medium">{pool.name}</p>
              <div className="flex gap-4">
                <p className="text-sm text-muted-foreground">
                  ${(1000000 / 1000000).toFixed(2)}M
                </p>
                <p className="text-sm text-green-500">
                  {(1.78).toFixed(1)}% APY
                </p>
              </div>
            </div>
            <Link href={`/pools/${pool.id}`}>
              <Button size="sm" variant="ghost">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
