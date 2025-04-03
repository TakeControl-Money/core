"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

type PoolDetails = {
  id: string
  name: string
  manager: string
  managerType: "human" | "contract" | "ai"
  description: string
  createdAt: string
}

export function PoolHeader({ id }: { id: string }) {
  const [pool, setPool] = useState<PoolDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - would be replaced with API call
    setTimeout(() => {
      setPool({
        id,
        name: "DeFi Yield Optimizer",
        manager: "0xabc...def",
        managerType: "human",
        description:
          "This pool focuses on optimizing yield across various DeFi protocols, dynamically allocating assets to maximize returns while managing risk.",
        createdAt: "2023-10-15",
      })
      setLoading(false)
    }, 500)
  }, [id])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (!pool) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{pool.name}</h1>
          <Badge
            variant={
              pool.managerType === "ai" ? "destructive" : pool.managerType === "contract" ? "secondary" : "default"
            }
          >
            {pool.managerType === "ai" ? "AI" : pool.managerType === "contract" ? "Smart Contract" : "Human"}
          </Badge>
        </div>
        <Button>Invest</Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Managed by: {pool.manager} • Created: {new Date(pool.createdAt).toLocaleDateString()}
      </p>
      <p className="text-muted-foreground">{pool.description}</p>
    </div>
  )
}

