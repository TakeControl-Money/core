"use client"

import { useAccount, useConnect, useDisconnect, useBalance, useWriteContract } from "wagmi"
import { cbWalletConnector } from "@/wagmi"

export function useWeb3() {
  const { isConnected, address } = useAccount()
  const { connect, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address,
  })
  const { writeContractAsync, isPending: isTransactionPending } = useWriteContract()

  const handleConnect = async () => {
    try {
      connect({ connector: cbWalletConnector })
    } catch (error) {
      console.error("Connection error:", error)
    }
  }

  return {
    isConnected,
    address,
    balance,
    connect: handleConnect,
    disconnect,
    isConnecting,
    writeContract: writeContractAsync,
    isTransactionPending,
  }
}

