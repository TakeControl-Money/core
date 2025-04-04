"use client";

import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { cbWalletConnector } from "@/wagmi";
import { useCapabilities, useWriteContracts } from "wagmi/experimental";
import { useMemo } from "react";
import { validatePublicEnv } from "@/lib/env";

const { NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT } = validatePublicEnv();

export function useWeb3() {
  const { isConnected, address, chainId } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
  });
  const { writeContractsAsync, isPending: isTransactionPending } =
    useWriteContracts();

  const handleConnect = async () => {
    try {
      connect({ connector: cbWalletConnector });
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  // Check for paymaster capabilities with `useCapabilities`
  const { data: availableCapabilities } = useCapabilities({
    account: address,
  });
  const capabilities = useMemo(() => {
    if (!availableCapabilities || !address || !chainId) return {};
    const capabilitiesForChain = availableCapabilities[chainId];
    if (capabilitiesForChain?.paymasterService?.supported) {
      return {
        paymasterService: {
          url: NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT,
        },
      };
    }
    return {};
  }, [availableCapabilities, address, chainId]);

  return {
    isConnected,
    address,
    balance,
    connect: handleConnect,
    disconnect,
    isConnecting,
    writeContract: writeContractsAsync,
    isTransactionPending,
    capabilities,
  };
}
