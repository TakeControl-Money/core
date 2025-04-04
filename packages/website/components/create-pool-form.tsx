"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWeb3 } from "@/hooks/use-web3";
import { Loader2 } from "lucide-react";
import OrcastratorABI from "@/abi/Orcastrator";

export function CreatePoolForm() {
  const router = useRouter();
  const { isConnected, connect, writeContract, isTransactionPending } =
    useWeb3();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    managerType: "",
    commissionPercentage: "",
  });
  const [txStatus, setTxStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [txError, setTxError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      connect();
      return;
    }

    try {
      setTxStatus("idle");
      setTxError(null);

      // Mock pool factory contract address
      const poolFactoryAddress =
        "0x8901234567890123456789012345678901234567" as `0x${string}`;

      // Convert manager type to uint8
      let managerTypeValue = 0; // human
      if (formData.managerType === "contract") managerTypeValue = 1;
      if (formData.managerType === "ai") managerTypeValue = 2;

      // Convert commission percentage to basis points (e.g., 2.5% -> 250)
      const commissionBasisPoints = Math.floor(
        Number.parseFloat(formData.commissionPercentage) * 100
      );

      const hash = await writeContract({
        address: poolFactoryAddress,
        abi: OrcastratorABI,
        functionName: "createFund",
        args: [
          formData.name,
          formData.name,
          /* formData.description,
          managerTypeValue,
          BigInt(commissionBasisPoints), */
        ],
      });

      console.log(`Transaction hash: ${hash}`);
      setTxStatus("success");

      // Navigate to dashboard after successful pool creation
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error creating pool:", error);
      setTxStatus("error");
      setTxError(error instanceof Error ? error.message : String(error));
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create a New Pool</CardTitle>
          <CardDescription>
            Connect your wallet to create a new money management pool
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="mb-4 text-center text-muted-foreground">
            You need to connect your wallet to create a pool
          </p>
          <Button onClick={connect}>Connect Smart Wallet</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create a New Pool</CardTitle>
          <CardDescription>
            Set up your money management pool and start earning commissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {txStatus === "success" && (
            <div className="rounded-md bg-green-500/10 p-4 text-green-500">
              Pool created successfully! Redirecting to dashboard...
            </div>
          )}

          {txStatus === "error" && (
            <div className="rounded-md bg-red-500/10 p-4 text-red-500">
              Error creating pool: {txError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Pool Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., DeFi Yield Optimizer"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isTransactionPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your pool strategy and goals..."
              value={formData.description}
              onChange={handleChange}
              required
              disabled={isTransactionPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="managerType">Manager Type</Label>
            <Select
              value={formData.managerType}
              onValueChange={(value) =>
                handleSelectChange("managerType", value)
              }
              disabled={isTransactionPending}
            >
              <SelectTrigger id="managerType">
                <SelectValue placeholder="Select manager type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="human">Human (You)</SelectItem>
                <SelectItem value="contract">Smart Contract</SelectItem>
                <SelectItem value="ai">AI Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="commissionPercentage">
              Commission Percentage (%)
            </Label>
            <Input
              id="commissionPercentage"
              name="commissionPercentage"
              type="number"
              min="0"
              max="20"
              step="0.1"
              placeholder="e.g., 2.5"
              value={formData.commissionPercentage}
              onChange={handleChange}
              required
              disabled={isTransactionPending}
            />
            <p className="text-xs text-muted-foreground">
              This is the percentage of profits you&apos;ll earn as the pool
              manager. Maximum 20%.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isTransactionPending}
          >
            {isTransactionPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Pool...
              </>
            ) : (
              "Create Pool"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
