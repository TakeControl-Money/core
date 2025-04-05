"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWeb3 } from "@/hooks/use-web3";
import { useReadContract } from "wagmi";
import { parseUnits, type ContractFunctionParameters } from "viem";
import Orcastrator from "@/abi/Orcastrator";

type SupportedToken = {
  id: string;
  token: string;
  name: string;
  symbol: string;
  decimals: number;
  timestamp: number;
};

type SupportedTokensData = {
  supportedTokens: {
    items: SupportedToken[];
  };
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
  const data = await request<SupportedTokensData>(
    process.env.NEXT_PUBLIC_PONDER_URL || "http://localhost:42069",
    SupportedTokensQuery
  );
  return data;
};

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  fundId: string;
}

function AddTokenModal({ isOpen, onClose, fundId }: AddTokenModalProps) {
  const { writeContract, capabilities, isTransactionPending } = useWeb3();
  const [tokenAddress, setTokenAddress] = useState("");

  async function addToken() {
    const hash = await writeContract({
      contracts: [
        {
          address: Orcastrator.deploymentInfo.address,
          abi: Orcastrator.abi,
          functionName: "addSupportedToken",
          args: [BigInt(fundId), tokenAddress as `0x${string}`],
        } as ContractFunctionParameters<
          typeof Orcastrator.abi,
          "nonpayable",
          "addSupportedToken"
        >,
      ],
      capabilities,
    });
    console.log({ hash });
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Supported Token</DialogTitle>
          <DialogDescription>
            Enter the token address you want to add to the pool
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tokenAddress">Token Address</Label>
            <Input
              id="tokenAddress"
              placeholder="0x..."
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              disabled={isTransactionPending}
            />
            <div className="text-sm text-muted-foreground">
              Enter the ERC20 token address
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={addToken}>Add Token</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ApprovedTokens({ id }: { id: string }) {
  const { data: supportedTokens, isLoading } = useQuery({
    queryKey: ["supportedTokens", id],
    queryFn: () => fetchSupportedTokens(id),
  });
  const [isAddTokenModalOpen, setIsAddTokenModalOpen] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="mb-4 flex items-center justify-between border-b pb-4 last:border-0"
            >
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!supportedTokens || supportedTokens.supportedTokens.items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-center text-muted-foreground">
              No approved tokens found
            </p>
            <Button onClick={() => setIsAddTokenModalOpen(true)}>
              Add Supported Token
            </Button>
          </div>
          <AddTokenModal
            isOpen={isAddTokenModalOpen}
            onClose={() => setIsAddTokenModalOpen(false)}
            fundId={id}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="grid grid-cols-3 gap-4 font-medium px-4">
            <div>Token</div>
            <div>Symbol</div>
            <div>Address</div>
          </div>
          <Button onClick={() => setIsAddTokenModalOpen(true)}>
            Add Supported Token
          </Button>
        </div>
        {supportedTokens.supportedTokens.items.map((token) => (
          <div
            key={token.id}
            className="grid grid-cols-3 gap-4 border-b py-4 px-4 last:border-0"
          >
            <div>{token.name}</div>
            <div>{token.symbol}</div>
            <div className="font-mono text-sm truncate">{token.token}</div>
          </div>
        ))}
        <AddTokenModal
          isOpen={isAddTokenModalOpen}
          onClose={() => setIsAddTokenModalOpen(false)}
          fundId={id}
        />
      </CardContent>
    </Card>
  );
}
