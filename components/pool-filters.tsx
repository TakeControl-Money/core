"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function PoolFilters() {
  const [apyRange, setApyRange] = useState([0, 30])
  const [tvlRange, setTvlRange] = useState([0, 5])
  const [managerTypes, setManagerTypes] = useState({
    human: true,
    contract: true,
    ai: true,
  })

  const handleManagerTypeChange = (type: keyof typeof managerTypes) => {
    setManagerTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="space-y-4">
          <h3 className="font-medium">APY Range</h3>
          <Slider defaultValue={apyRange} max={30} step={1} onValueChange={setApyRange} />
          <div className="flex items-center justify-between">
            <span className="text-sm">{apyRange[0]}%</span>
            <span className="text-sm">{apyRange[1]}%</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">TVL Range</h3>
          <Slider defaultValue={tvlRange} max={5} step={0.1} onValueChange={setTvlRange} />
          <div className="flex items-center justify-between">
            <span className="text-sm">${tvlRange[0]}M</span>
            <span className="text-sm">${tvlRange[1]}M</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Manager Type</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="human"
                checked={managerTypes.human}
                onCheckedChange={() => handleManagerTypeChange("human")}
              />
              <Label htmlFor="human">Human</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="contract"
                checked={managerTypes.contract}
                onCheckedChange={() => handleManagerTypeChange("contract")}
              />
              <Label htmlFor="contract">Smart Contract</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="ai" checked={managerTypes.ai} onCheckedChange={() => handleManagerTypeChange("ai")} />
              <Label htmlFor="ai">AI Agent</Label>
            </div>
          </div>
        </div>

        <Button variant="outline">Apply Filters</Button>
      </CardContent>
    </Card>
  )
}

