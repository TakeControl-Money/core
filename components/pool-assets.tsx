"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

type Asset = {
  token: string
  symbol: string
  amount: number
  value: number
  allocation: number
}

export function PoolAssets({ id }: { id: string }) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - would be replaced with API call
    setTimeout(() => {
      setAssets([
        {
          token: "USD Coin",
          symbol: "USDC",
          amount: 250000,
          value: 250000,
          allocation: 20,
        },
        {
          token: "Ethereum",
          symbol: "ETH",
          amount: 125,
          value: 375000,
          allocation: 30,
        },
        {
          token: "Aave USDC",
          symbol: "aUSDC",
          amount: 500000,
          value: 500000,
          allocation: 40,
        },
        {
          token: "Uniswap LP",
          symbol: "UNI-LP",
          amount: 10000,
          value: 125000,
          allocation: 10,
        },
      ])
      setLoading(false)
    }, 800)
  }, [id])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pool Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {assets.map((asset) => (
            <div key={asset.symbol} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {asset.token} ({asset.symbol})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {asset.amount.toLocaleString()} {asset.symbol}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${asset.value.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{asset.allocation}%</p>
                </div>
              </div>
              <Progress value={asset.allocation} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

