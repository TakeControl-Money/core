import { createConfig } from "ponder";
import { http } from "viem";
import Orcastrator from "../website/abi/Orcastrator";
import { base } from "viem/chains";

const targetNetwork = base;

const networks = {
  [targetNetwork.name]: {
    chainId: targetNetwork.id,
    transport: http(process.env[`PONDER_RPC_URL_${targetNetwork.id}`]),
  },
};

const contracts = {
  Orcastrator: {
    network: targetNetwork.name,
    abi: Orcastrator.abi,
    address: Orcastrator.deploymentInfo.address,
    startBlock: Orcastrator.deploymentInfo.blockNumber,
  },
} as const;

console.log(contracts);

export default createConfig({
  networks,
  contracts,
});
