"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpRight } from "lucide-react"
import { useWeb3 } from "@/hooks/use-web3"

type Investment = {
  poolId: string
  poolName: string
  invested: number
  currentValue: number
  shareTokens: number
  profit: number
}

export function UserInvestments() {
  const { isConnected, connect } = useWeb3()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isConnected) {
      // Mock data - would be replaced with API call
      setTimeout(() => {
        setInvestments([
          {
            poolId: "pool-2",
            poolName: "AI Quant Strategy",
            invested: 10000,
            currentValue: 11500,
            shareTokens: 10000,
            profit: 1500,
          },
          {
            poolId: "pool-3",
            poolName: "Stablecoin Yield",
            invested: 5000,
            currentValue: 5350,
            shareTokens: 5000,
            profit: 350,
          },
        ])
        setLoading(false)
      }, 700)
    } else {
      setLoading(false)
    }
  }, [isConnected])

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="mb-4 text-center text-muted-foreground">Connect your wallet to view your investments</p>
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

  if (investments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="mb-4 text-center text-muted-foreground">You haven&apos;t invested in any pools yet</p>
          <Link href="/pools">
            <Button>Explore Pools</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        {investments.map((investment) => (
          <div key={investment.poolId} className="mb-4 flex items-center justify-between border-b pb-4 last:border-0">
            <div>
              <p className="font-medium">{investment.poolName}</p>
              <div className="flex gap-4">
                <p className="text-sm text-muted-foreground">${investment.currentValue.toLocaleString()}</p>
                <p className={investment.profit >= 0 ? "text-sm text-green-500" : "text-sm text-red-500"}>
                  {investment.profit >= 0 ? "+" : ""}${investment.profit.toLocaleString()}
                </p>
              </div>
            </div>
            <Link href={`/pools/${investment.poolId}`}>
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

