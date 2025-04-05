"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PoolHeader({
  name,
  manager,
  managerType,
  timestamp,
  description,
}: {
  name: string;
  manager: string;
  managerType: "human" | "contract" | "ai";
  timestamp: number;
  description: string;
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
        <Button>Invest</Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Managed by: {manager} • Created:{" "}
        {new Date(timestamp * 1000).toLocaleDateString()}
      </p>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
