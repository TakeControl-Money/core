import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWeb3 } from "@/hooks/use-web3";
import { useReadContract } from "wagmi";
import { parseUnits, formatUnits, type ContractFunctionParameters } from "viem";
import ERC20 from "@/abi/ERC20";
import Orcastrator from "@/abi/Orcastrator";
import { validatePublicEnv } from "@/lib/env";

interface InvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  fundAddress: string;
  fundId: string;
}

const { NEXT_PUBLIC_USDC_ADDRESS } = validatePublicEnv();

export function InvestModal({
  isOpen,
  onClose,
  fundAddress,
  fundId,
}: InvestModalProps) {
  console.log({ isOpen });
  const { address, writeContract, capabilities, isTransactionPending } =
    useWeb3();
  const [amount, setAmount] = useState("");

  // Read USDC balance
  const { data: usdcBalance } = useReadContract({
    address: NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
    abi: ERC20.abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });

  async function invest() {
    const hash = await writeContract({
      contracts: [
        {
          address: NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
          abi: ERC20.abi,
          functionName: "approve",
          args: [fundAddress as `0x${string}`, parseUnits(amount, 6)],
        },
        {
          address: Orcastrator.deploymentInfo.address,
          abi: Orcastrator.abi,
          functionName: "deposit",
          args: [BigInt(fundId), parseUnits(amount, 6)],
        } as ContractFunctionParameters<
          typeof Orcastrator.abi,
          "nonpayable",
          "deposit"
        >,
      ],
      capabilities,
    });
    console.log({ hash });
  }

  const formattedBalance = usdcBalance ? formatUnits(usdcBalance, 6) : "0";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invest in Pool</DialogTitle>
          <DialogDescription>
            Enter the amount of USDC you want to invest
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Your USDC Balance</Label>
            <div className="text-sm text-muted-foreground">
              {formattedBalance} USDC
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Invest</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isTransactionPending}
            />
            <div className="text-sm text-muted-foreground">
              Enter amount in USDC (6 decimals)
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={invest}>Invest</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
