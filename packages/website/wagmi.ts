import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

export const cbWalletConnector = coinbaseWallet({
  appName: "TakeControl.Money",
  preference: "smartWalletOnly",
});

export const config = createConfig({
  chains: [base],
  connectors: [cbWalletConnector],
  transports: {
    [base.id]: http(),
  },
});
