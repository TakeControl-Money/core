"use client"

import { useState } from "react"
import { useWeb3 } from "./use-web3"

type TransactionStatus = "idle" | "preparing" | "pending" | "success" | "error"

export function useSmartWalletTransaction() {
  const { smartAccount, isConnected } = useWeb3()
  const [status, setStatus] = useState<TransactionStatus>("idle")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const sendTransaction = async (to: string, data: string, value = "0") => {
    if (!smartAccount || !isConnected) {
      setError(new Error("Wallet not connected"))
      return null
    }

    try {
      setStatus("preparing")

      // Create transaction object
      const tx = {
        to,
        data,
        value,
      }

      // Prepare the transaction
      const preparedTx = await smartAccount.prepareTransaction(tx)

      setStatus("pending")

      // Send the transaction
      const txResponse = await smartAccount.sendTransaction(preparedTx)

      // Get the transaction hash
      const hash = txResponse.hash
      setTxHash(hash)

      // Wait for transaction to be mined
      const receipt = await txResponse.wait()

      setStatus("success")
      return receipt
    } catch (err) {
      console.error("Transaction failed:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
      setStatus("error")
      return null
    }
  }

  return {
    sendTransaction,
    status,
    txHash,
    error,
    isIdle: status === "idle",
    isPreparing: status === "preparing",
    isPending: status === "pending",
    isSuccess: status === "success",
    isError: status === "error",
  }
}

