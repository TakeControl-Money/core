import { ignition, viem } from "hardhat";
import FundModule from "../ignition/modules/Fund";
import { parseEther, parseUnits } from "viem";

import OrcastratorModule from "../ignition/modules/Orcastrator";

const WETH = "0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A";
const USSI = "0x3a46ed8FCeb6eF1ADA2E4600A522AE7e24D2Ed18";
const MAG7ssi = "0x9E6A46f294bB67c20F1D1E7AfB0bBEf614403B55";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

async function main() {
  const { orcastrator } = await ignition.deploy(OrcastratorModule);

  const fundAddress = await orcastrator.read.fundAddressById([0n]);
  console.log({ fundAddress });
  const usdcContract = await viem.getContractAt("ERC20", USDC);
  const walletAddress = (await viem.getWalletClients())[0].account.address;

  /* console.log(await usdcContract.read.allowance([walletAddress, fundAddress]));
  console.log(
    await usdcContract.write.approve([fundAddress, parseEther("1000")])
  );
  console.log(await usdcContract.read.balanceOf([walletAddress])); */

  const hash = await orcastrator.write.deposit([0n, parseUnits("0.0001", 6)]);
  console.log({ hash });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
