"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, TrendingUp, Users } from "lucide-react"

type Pool = {
  id: string
  name: string
  manager: string
  managerType: "human" | "contract" | "ai"
  apy: number
  tvl: number
  investors: number
}

export function PoolList({ limit }: { limit?: number }) {
  const [pools, setPools] = useState<Pool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - would be replaced with API call
    const mockPools: Pool[] = [
      {
        id: "pool-1",
        name: "DeFi Yield Optimizer",
        manager: "0xabc...def",
        managerType: "human",
        apy: 12.5,
        tvl: 1250000,
        investors: 48,
      },
      {
        id: "pool-2",
        name: "AI Quant Strategy",
        manager: "AI Agent #42",
        managerType: "ai",
        apy: 18.2,
        tvl: 750000,
        investors: 32,
      },
      {
        id: "pool-3",
        name: "Stablecoin Yield",
        manager: "0x123...456",
        managerType: "contract",
        apy: 8.7,
        tvl: 3200000,
        investors: 124,
      },
      {
        id: "pool-4",
        name: "ETH Maximalist",
        manager: "0xdef...789",
        managerType: "human",
        apy: 15.3,
        tvl: 980000,
        investors: 56,
      },
    ]

    setTimeout(() => {
      setPools(limit ? mockPools.slice(0, limit) : mockPools)
      setLoading(false)
    }, 500)
  }, [limit])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: limit || 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-24 bg-muted/20" />
            <CardContent className="h-32 bg-muted/10" />
            <CardFooter className="h-16 bg-muted/5" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {pools.map((pool) => (
        <Card key={pool.id} className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{pool.name}</h3>
              <Badge
                variant={
                  pool.managerType === "ai" ? "destructive" : pool.managerType === "contract" ? "secondary" : "default"
                }
              >
                {pool.managerType === "ai" ? "AI" : pool.managerType === "contract" ? "Smart Contract" : "Human"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Managed by: {pool.manager}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">APY</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-xl font-bold text-green-500">{pool.apy.toFixed(1)}%</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">TVL</span>
                <span className="text-xl font-bold">${(pool.tvl / 1000000).toFixed(2)}M</span>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{pool.investors} investors</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/pools/${pool.id}`} className="w-full">
              <Button className="w-full" variant="outline">
                View Pool <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

