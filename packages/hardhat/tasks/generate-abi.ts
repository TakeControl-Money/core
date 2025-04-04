import { task } from "hardhat/config";
import fs from "node:fs";
import path from "node:path";

task("generate-abi", "Generate ABI file for a contract")
  .addParam(
    "contract",
    "The path to the contract file relative to contracts directory"
  )
  .addOptionalParam("abipath", "The path to the ABI file")
  .setAction(async (taskArgs, hre) => {
    const contractPath = path.join("contracts", taskArgs.contract);

    // Verify the contract exists
    if (!fs.existsSync(contractPath)) {
      throw new Error(`Contract file not found at ${contractPath}`);
    }

    // Compile the contract
    await hre.run("compile");

    // Get the contract name from the file path
    const contractName = path.basename(contractPath, ".sol");

    // Get the artifact
    const artifact = await hre.artifacts.readArtifact(contractName);

    // Create abi directory if it doesn't exist
    const abiDir = taskArgs.abipath || "abi";
    if (!fs.existsSync(abiDir)) {
      fs.mkdirSync(abiDir);
    }

    // Write the ABI to a TypeScript file with default export
    const abiPath = path.join(abiDir, `${contractName}.ts`);
    const fileContent = `const abi = ${JSON.stringify(
      artifact.abi,
      null,
      2
    )} as const;\n\nexport default abi;\n`;
    fs.writeFileSync(abiPath, fileContent);

    console.log(`ABI file generated at ${abiPath}`);
  });
