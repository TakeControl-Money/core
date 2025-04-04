import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "dotenv/config";
import { z } from "zod";
import "./tasks";

const envSchema = z.object({
  ALCHEMY_API_KEY: z.string(),
  PRIVATE_KEY: z.string().startsWith("0x"),
});

const { ALCHEMY_API_KEY, PRIVATE_KEY } = envSchema.parse(process.env);

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    base: {
      url: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
