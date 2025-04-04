import { ignition } from "hardhat";
import FundModule from "../ignition/modules/Fund";
import { formatEther } from "viem";

const WETH = "0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A";
const USSI = "0x3a46ed8FCeb6eF1ADA2E4600A522AE7e24D2Ed18";
const MAG7ssi = "0x9E6A46f294bB67c20F1D1E7AfB0bBEf614403B55";

async function main() {
  const { fund } = await ignition.deploy(FundModule);

  console.log(await fund.read.totalTokenIds());
  console.log(await fund.read.tokenIdByAddress([WETH]));
  console.log(await fund.read.tokensHeld([2n]));

  //await fund.write.addSupportedToken([MAG7ssi]);

  console.log(formatEther(await fund.read.getTokenPrice([MAG7ssi])));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
