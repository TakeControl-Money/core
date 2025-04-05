"use client";

import { PoolHeader } from "@/components/pool-header";
import { PoolStats } from "@/components/pool-stats";
import { PoolActions } from "@/components/pool-actions";
import { PoolTransactions } from "@/components/pool-transactions";
import { PoolAssets } from "@/components/pool-assets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { request, gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";

type Fund = {
  id: string;
  fundAddress: string;
  name: string;
  symbol: string;
  details: {
    managerType: "human" | "contract" | "ai";
    description: string;
  };
  owner: string;
  timestamp: number;
};

const fetchFund = async (id: string) => {
  const OwnedFundsQuery = gql`
    query Fund {
      fund(id:"${id}") {
        id
        fundAddress
        name
        symbol
        details
        owner
        timestamp
      }
    }
  `;
  const data = await request<{ fund: Fund }>(
    process.env.NEXT_PUBLIC_PONDER_URL || "http://localhost:42069",
    OwnedFundsQuery
  );
  return data;
};

export default function PoolPageCode({ id }: { id: string }) {
  const { data: fund, isLoading } = useQuery({
    queryKey: ["fund", id],
    queryFn: () => fetchFund(id),
  });

  console.log(fund, isLoading);

  if (isLoading || !fund) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <PoolHeader
        name={fund.fund.name}
        manager={fund.fund.owner}
        timestamp={fund.fund.timestamp}
        managerType={fund.fund.details.managerType}
        description={fund.fund.details.description}
      />
      <PoolStats id={id} />
      <div className="mt-8">
        <Tabs defaultValue="assets">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="investors">Investors</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          <TabsContent value="assets" className="mt-6">
            <PoolAssets id={id} />
          </TabsContent>
          <TabsContent value="transactions" className="mt-6">
            <PoolTransactions id={id} />
          </TabsContent>
          <TabsContent value="investors" className="mt-6">
            <div className="rounded-lg border p-6">
              <h3 className="mb-4 text-xl font-medium">Pool Investors</h3>
              {/* Investor list component would go here */}
            </div>
          </TabsContent>
          <TabsContent value="actions" className="mt-6">
            <PoolActions id={id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
