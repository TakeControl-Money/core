"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpRight } from "lucide-react"
import { useWeb3 } from "@/hooks/use-web3"

type UserPool = {
  id: string
  name: string
  tvl: number
  apy: number
}

export function UserPools() {
  const { isConnected, connect } = useWeb3()
  const [pools, setPools] = useState<UserPool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isConnected) {
      // Mock data - would be replaced with API call
      setTimeout(() => {
        setPools([
          {
            id: "pool-1",
            name: "DeFi Yield Optimizer",
            tvl: 1250000,
            apy: 12.5,
          },
          {
            id: "pool-4",
            name: "ETH Maximalist",
            tvl: 980000,
            apy: 15.3,
          },
        ])
        setLoading(false)
      }, 500)
    } else {
      setLoading(false)
    }
  }, [isConnected])

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="mb-4 text-center text-muted-foreground">Connect your wallet to view your pools</p>
          <Button onClick={connect}>Connect Smart Wallet</Button>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="mb-4 flex items-center justify-between border-b pb-4 last:border-0">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (pools.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="mb-4 text-center text-muted-foreground">You haven&apos;t created any pools yet</p>
          <Link href="/create-pool">
            <Button>Create Your First Pool</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        {pools.map((pool) => (
          <div key={pool.id} className="mb-4 flex items-center justify-between border-b pb-4 last:border-0">
            <div>
              <p className="font-medium">{pool.name}</p>
              <div className="flex gap-4">
                <p className="text-sm text-muted-foreground">${(pool.tvl / 1000000).toFixed(2)}M</p>
                <p className="text-sm text-green-500">{pool.apy.toFixed(1)}% APY</p>
              </div>
            </div>
            <Link href={`/pools/${pool.id}`}>
              <Button size="sm" variant="ghost">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

