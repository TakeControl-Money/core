// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OrcastratorModule = buildModule("OrcastratorModule", (m) => {
  const orcastrator = m.contract("Orcastrator");

  return { orcastrator };
});

export default OrcastratorModule;
