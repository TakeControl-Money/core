"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PoolHeader({
  name,
  manager,
  managerType,
  timestamp,
  description,
  onInvestClick,
  userShares,
  sharesWorth,
  onWithdrawClick,
}: {
  name: string;
  manager: string;
  managerType: "human" | "contract" | "ai";
  timestamp: number;
  description: string;
  onInvestClick: () => void;
  userShares: string;
  sharesWorth: string;
  onWithdrawClick: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{name}</h1>
          <Badge
            variant={
              managerType === "ai"
                ? "destructive"
                : managerType === "contract"
                ? "secondary"
                : "default"
            }
          >
            {managerType === "ai"
              ? "AI"
              : managerType === "contract"
              ? "Smart Contract"
              : "Human"}
          </Badge>
        </div>
        <Button onClick={onInvestClick}>Invest</Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Managed by: {manager} • Created:{" "}
        {new Date(timestamp * 1000).toLocaleDateString()}
      </p>
      <p className="text-muted-foreground">{description}</p>

      {/* Investment Information */}
      {userShares !== "0" && (
        <div className="mt-6 p-4 border rounded-lg bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Your Investment</p>
              <div className="mt-1">
                <p className="text-lg font-semibold">
                  {userShares} shares
                  <span className="ml-2 text-sm text-muted-foreground">
                    (${sharesWorth})
                  </span>
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onWithdrawClick}>
              Withdraw
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
