export const chainlinkConfig = {
  supportedNetworks: [
    {
      id: 1,
      name: "Ethereum Mainnet",
      rpcUrl: "https://ethereum.publicnode.com",
    },
    {
      id: 11155111,
      name: "Sepolia Testnet",
      rpcUrl: "https://ethereum-sepolia.publicnode.com",
    },
    {
      id: 137,
      name: "Polygon Mainnet",
      rpcUrl: "https://polygon-rpc.com",
    },
    {
      id: 80001,
      name: "Mumbai Testnet",
      rpcUrl: "https://rpc-mumbai.maticvigil.com",
    },
  ],
  defaultNetwork: 1, // Ethereum Mainnet
}

