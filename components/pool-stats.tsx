"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, Users, Wallet, Clock } from "lucide-react"

type PoolStats = {
  apy: number
  tvl: number
  investors: number
  sharePrice: number
  lastAction: string
}

export function PoolStats({ id }: { id: string }) {
  const [stats, setStats] = useState<PoolStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - would be replaced with API call
    setTimeout(() => {
      setStats({
        apy: 12.5,
        tvl: 1250000,
        investors: 48,
        sharePrice: 1.25,
        lastAction: "2 hours ago",
      })
      setLoading(false)
    }, 700)
  }, [id])

  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="mt-2 h-8 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">APY</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-green-500">{stats.apy.toFixed(1)}%</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">TVL</span>
          </div>
          <p className="mt-2 text-2xl font-bold">${(stats.tvl / 1000000).toFixed(2)}M</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Investors</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.investors}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last Action</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.lastAction}</p>
        </CardContent>
      </Card>
    </div>
  )
}

