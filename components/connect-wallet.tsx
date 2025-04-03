"use client"

import { ConnectAndSIWE } from "@/components/connect-and-siwe"
import { useAccount } from "wagmi"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ConnectWallet() {
  const { isConnected, address } = useAccount()

  const shortenAddress = (address: string | undefined) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <>
      {isConnected && address ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{shortenAddress(address)}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Smart Wallet</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <ConnectAndSIWE />
      )}
    </>
  )
}

