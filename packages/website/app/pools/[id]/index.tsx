"use client";

import { PoolHeader } from "@/components/pool-header";
import { PoolStats } from "@/components/pool-stats";
import { PoolActions } from "@/components/pool-actions";
import { PoolTransactions } from "@/components/pool-transactions";
import { PoolAssets } from "@/components/pool-assets";
import { InvestModal } from "@/components/invest-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { request, gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useReadContract } from "wagmi";
import FundAbi from "@/abi/Fund";
import ERC20 from "@/abi/ERC20";
import { useWeb3 } from "@/hooks/use-web3";
import { formatUnits } from "viem";
import { testMultiplier } from "@/lib/utils";
import { ApprovedTokens } from "@/components/approved-tokens";

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

type SupportedToken = {
  id: string;
  token: string;
  name: string;
  symbol: string;
  decimals: number;
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
  const data = await request<{ fund: Fund | null }>(
    process.env.NEXT_PUBLIC_PONDER_URL || "http://localhost:42069",
    OwnedFundsQuery
  );
  return data;
};

const fetchSupportedTokens = async (fundId: string) => {
  const SupportedTokensQuery = gql`
    query SupportedTokens {
      supportedTokens(where: { fundId: "${fundId}" }) {
        items {
          id
          token
          name
          symbol
          decimals
          timestamp
        }
      }
    }
  `;
  const data = await request<{ supportedTokens: { items: SupportedToken[] } }>(
    process.env.NEXT_PUBLIC_PONDER_URL || "http://localhost:42069",
    SupportedTokensQuery
  );
  return data;
};

export default function PoolPageCode({ id }: { id: string }) {
  const { data: fund, isLoading: isFundLoading } = useQuery({
    queryKey: ["fund", id],
    queryFn: () => fetchFund(id),
  });

  const { data: supportedTokens, isLoading: isTokensLoading } = useQuery({
    queryKey: ["supportedTokens", id],
    queryFn: () => fetchSupportedTokens(id),
  });

  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const { address } = useWeb3();

  const { data: tvl, refetch: refetchTvl } = useReadContract({
    abi: FundAbi.abi,
    address: fund?.fund?.fundAddress as `0x${string}`,
    functionName: "calculateTotalValue",
    args: [],
  });

  const { data: shareTokenAddress } = useReadContract({
    abi: FundAbi.abi,
    address: fund?.fund?.fundAddress as `0x${string}`,
    functionName: "shareToken",
    args: [],
  });

  const { data: userShares } = useReadContract({
    abi: ERC20.abi,
    address: shareTokenAddress,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: totalShares } = useReadContract({
    abi: ERC20.abi,
    address: shareTokenAddress,
    functionName: "totalSupply",
    args: [],
  });

  if (isFundLoading || isTokensLoading) {
    return <div>Loading...</div>;
  }

  if (!fund || !fund.fund) {
    return <div>Fund not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <PoolHeader
        name={fund.fund.name}
        manager={fund.fund.owner}
        timestamp={fund.fund.timestamp}
        managerType={fund.fund.details.managerType}
        description={fund.fund.details.description}
        onInvestClick={() => setIsInvestModalOpen(true)}
        userShares={userShares ? formatUnits(userShares, 18) : "0"}
        sharesWorth={
          totalShares && userShares && tvl
            ? (
                Number(formatUnits((tvl * userShares) / totalShares, 18)) *
                testMultiplier
              ).toString()
            : "0"
        }
        onWithdrawClick={() => setIsWithdrawModalOpen(true)}
      />
      <PoolStats
        id={id}
        address={fund.fund.fundAddress}
        refetchTvl={refetchTvl}
      />
      <div className="mt-8">
        <Tabs defaultValue="assets">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="approved-tokens">Approved Tokens</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          <TabsContent value="assets" className="mt-6">
            <PoolAssets id={id} />
          </TabsContent>
          <TabsContent value="transactions" className="mt-6">
            <PoolTransactions id={id} />
          </TabsContent>
          <TabsContent value="approved-tokens" className="mt-6">
            <ApprovedTokens
              id={id}
              supportedTokens={supportedTokens?.supportedTokens.items || []}
            />
          </TabsContent>
          <TabsContent value="actions" className="mt-6">
            <PoolActions
              id={id}
              supportedTokens={supportedTokens?.supportedTokens.items || []}
            />
          </TabsContent>
        </Tabs>
      </div>
      <InvestModal
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
        fundAddress={fund.fund.fundAddress}
        fundId={id}
      />
    </div>
  );
}
