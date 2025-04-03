"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { cbWalletConnector } from "@/wagmi"
// import { useState } from "react"
import { Loader2 } from "lucide-react"

export function ConnectAndSIWE() {
  const { isConnected, address } = useAccount()
  const { connect, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  // const [isSigningIn, setIsSigningIn] = useState(false)

  const handleConnect = async () => {
    try {
      connect({ connector: cbWalletConnector })
    } catch (error) {
      console.error("Connection error:", error)
    }
  }

  const shortenAddress = (address: string | undefined) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="flex items-center gap-4">
      {isConnected ? (
        <div className="flex items-center gap-2">
          <span className="text-sm">{shortenAddress(address)}</span>
          <Button variant="outline" size="sm" onClick={() => disconnect()}>
            Disconnect
          </Button>
        </div>
      ) : (
        <Button onClick={handleConnect} disabled={isConnecting}>
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            "Connect Smart Wallet"
          )}
        </Button>
      )}
    </div>
  )
}

