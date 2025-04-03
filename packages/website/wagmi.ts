import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

export const cbWalletConnector = coinbaseWallet({
  appName: "TakeControl.Money",
  preference: "smartWalletOnly",
});

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [cbWalletConnector],
  transports: {
    [baseSepolia.id]: http(),
  },
});
