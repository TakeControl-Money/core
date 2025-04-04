// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OrcastratorModule = buildModule("OrcastratorModule", (m) => {
  // USDC address on Base
  const usdcAddress = m.getParameter(
    "usdcAddress",
    "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
  );

  // Uniswap V2 Factory address on Base
  const uniswapFactoryAddress = m.getParameter(
    "uniswapFactoryAddress",
    "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6"
  );

  const orcastrator = m.contract("Orcastrator", [
    usdcAddress,
    uniswapFactoryAddress,
  ]);

  return { orcastrator };
});

export default OrcastratorModule;
