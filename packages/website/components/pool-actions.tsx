"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWeb3 } from "@/hooks/use-web3";
import { Loader2 } from "lucide-react";
import { parseEther } from "viem";
import type { SupportedToken } from "./approved-tokens";

// Mock ABI for demonstration purposes
const POOL_ABI = [
  {
    name: "swap",
    type: "function",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "tokenIn", type: "address" },
      { name: "tokenOut", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "lend",
    type: "function",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "token", type: "address" },
      { name: "protocol", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "stake",
    type: "function",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "token", type: "address" },
      { name: "protocol", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

// Mock token addresses
const TOKEN_ADDRESSES: Record<string, `0x${string}`> = {
  usdc: "0x1234567890123456789012345678901234567890",
  eth: "0x2345678901234567890123456789012345678901",
  wbtc: "0x3456789012345678901234567890123456789012",
};

// Mock protocol addresses
const PROTOCOL_ADDRESSES: Record<string, `0x${string}`> = {
  aave: "0x4567890123456789012345678901234567890123",
  compound: "0x5678901234567890123456789012345678901234",
  lido: "0x6789012345678901234567890123456789012345",
  rocketpool: "0x7890123456789012345678901234567890123456",
};

interface PoolActionsProps {
  id: string;
  supportedTokens: SupportedToken[];
}

export function PoolActions({ id, supportedTokens }: PoolActionsProps) {
  const {
    isConnected,
    connect,
    writeContract,
    isTransactionPending,
    capabilities,
  } = useWeb3();
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("");
  const [selectedProtocol, setSelectedProtocol] = useState("");
  const [txStatus, setTxStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [txError, setTxError] = useState<string | null>(null);

  // Mock pool contract address based on the pool ID
  const poolContractAddress = `0x${id.replace("pool-", "")}${"0".repeat(
    40 - id.length
  )}` as `0x${string}`;

  const handleSubmit = async (action: string) => {
    try {
      setTxStatus("idle");
      setTxError(null);

      if (!amount || !selectedToken || !selectedProtocol) return;

      const amountInWei = parseEther(amount);
      const tokenAddress = selectedToken as `0x${string}`;
      const protocolAddress = PROTOCOL_ADDRESSES[selectedProtocol];

      let functionName: string;
      let args: Array<bigint | `0x${string}`>;

      switch (action) {
        case "swap":
          functionName = "swap";
          args = [amountInWei, tokenAddress, selectedProtocol as `0x${string}`];
          break;
        case "lend":
          functionName = "lend";
          args = [amountInWei, tokenAddress, protocolAddress];
          break;
        case "stake":
          functionName = "stake";
          args = [amountInWei, tokenAddress, protocolAddress];
          break;
        default:
          throw new Error("Invalid action");
      }

      const hash = await writeContract({
        contracts: [
          {
            address: poolContractAddress,
            abi: POOL_ABI,
            functionName,
            args,
          },
        ],
        capabilities,
      });

      console.log(`Transaction hash: ${hash}`);
      setTxStatus("success");

      // Reset form
      setAmount("");
      setSelectedToken("");
      setSelectedProtocol("");
    } catch (error) {
      console.error(`Error in ${action}:`, error);
      setTxStatus("error");
      setTxError(error instanceof Error ? error.message : String(error));
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pool Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="mb-4 text-center text-muted-foreground">
            Connect your Smart Wallet to perform actions on this pool
          </p>
          <Button onClick={connect}>Connect Smart Wallet</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Actions</CardTitle>
      </CardHeader>
      <CardContent>
        {txStatus === "success" && (
          <div className="mb-4 rounded-md bg-green-500/10 p-4 text-green-500">
            Transaction successful!
          </div>
        )}

        {txStatus === "error" && (
          <div className="mb-4 rounded-md bg-red-500/10 p-4 text-red-500">
            Transaction failed: {txError}
          </div>
        )}

        <Tabs defaultValue="swap">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="swap">Swap</TabsTrigger>
            <TabsTrigger value="lend">Lend</TabsTrigger>
            <TabsTrigger value="stake">Stake</TabsTrigger>
          </TabsList>

          <TabsContent value="swap" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="swap-amount">Amount</Label>
              <Input
                id="swap-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isTransactionPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token-from">From Token</Label>
              <Select
                value={selectedToken}
                onValueChange={setSelectedToken}
                disabled={isTransactionPending}
              >
                <SelectTrigger id="token-from">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {supportedTokens.map((token) => (
                    <SelectItem key={token.id} value={token.token}>
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="token-to">To Token</Label>
              <Select
                value={selectedProtocol}
                onValueChange={setSelectedProtocol}
                disabled={isTransactionPending}
              >
                <SelectTrigger id="token-to">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {supportedTokens.map((token) => (
                    <SelectItem key={token.id} value={token.token}>
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              onClick={() => handleSubmit("swap")}
              disabled={
                !amount ||
                !selectedToken ||
                !selectedProtocol ||
                isTransactionPending
              }
            >
              {isTransactionPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Swap"
              )}
            </Button>
          </TabsContent>

          <TabsContent value="lend" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="lend-amount">Amount</Label>
              <Input
                id="lend-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isTransactionPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lend-token">Token</Label>
              <Select
                value={selectedToken}
                onValueChange={setSelectedToken}
                disabled={isTransactionPending}
              >
                <SelectTrigger id="lend-token">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {supportedTokens.map((token) => (
                    <SelectItem key={token.id} value={token.token}>
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lend-protocol">Protocol</Label>
              <Select
                value={selectedProtocol}
                onValueChange={setSelectedProtocol}
                disabled={isTransactionPending}
              >
                <SelectTrigger id="lend-protocol">
                  <SelectValue placeholder="Select protocol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aave">Aave</SelectItem>
                  <SelectItem value="compound">Compound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              onClick={() => handleSubmit("lend")}
              disabled={
                !amount ||
                !selectedToken ||
                !selectedProtocol ||
                isTransactionPending
              }
            >
              {isTransactionPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Lending"
              )}
            </Button>
          </TabsContent>

          <TabsContent value="stake" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="stake-amount">Amount</Label>
              <Input
                id="stake-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isTransactionPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stake-token">Token</Label>
              <Select
                value={selectedToken}
                onValueChange={setSelectedToken}
                disabled={isTransactionPending}
              >
                <SelectTrigger id="stake-token">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {supportedTokens.map((token) => (
                    <SelectItem key={token.id} value={token.token}>
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stake-protocol">Protocol</Label>
              <Select
                value={selectedProtocol}
                onValueChange={setSelectedProtocol}
                disabled={isTransactionPending}
              >
                <SelectTrigger id="stake-protocol">
                  <SelectValue placeholder="Select protocol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lido">Lido</SelectItem>
                  <SelectItem value="rocketpool">Rocket Pool</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              onClick={() => handleSubmit("stake")}
              disabled={
                !amount ||
                !selectedToken ||
                !selectedProtocol ||
                isTransactionPending
              }
            >
              {isTransactionPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Staking"
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
