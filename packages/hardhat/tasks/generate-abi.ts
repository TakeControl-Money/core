import { task } from "hardhat/config";
import fs from "node:fs";
import path from "node:path";

interface DeploymentInfo {
  contractAddress: string;
  deploymentBlock: number;
}

function parseJournalFile(
  journalPath: string,
  contractName: string
): DeploymentInfo | null {
  console.log("journalPath", journalPath);
  if (!fs.existsSync(journalPath)) {
    return null;
  }

  console.log("Here");

  const journalContent = fs.readFileSync(journalPath, "utf-8");
  const lines = journalContent.split("\n").filter((line) => line.trim());

  const deploymentInfo: DeploymentInfo = {
    contractAddress: "",
    deploymentBlock: 0,
  };

  for (const entry of lines
    .map((line) => JSON.parse(line))
    .filter(
      (entry) =>
        entry.futureId?.includes(contractName) ||
        entry.artifactId?.includes(contractName)
    )) {
    // Extract deployment address
    if (
      entry.type === "DEPLOYMENT_EXECUTION_STATE_COMPLETE" &&
      entry.result?.address
    ) {
      deploymentInfo.contractAddress = entry.result.address;
    }

    // Extract deployment block
    if (entry.type === "TRANSACTION_CONFIRM" && entry.receipt?.blockNumber) {
      deploymentInfo.deploymentBlock = entry.receipt.blockNumber;
    }
  }

  return deploymentInfo.contractAddress ? deploymentInfo : null;
}

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

    // Get deployment info from journal file
    const journalPath = path.join(
      "ignition",
      "deployments",
      "chain-8453",
      "journal.jsonl"
    );
    const deploymentInfo = parseJournalFile(journalPath, contractName);

    // Prepare the output content
    const outputContent = {
      contractName,
      abi: artifact.abi,
      ...(deploymentInfo && {
        deploymentInfo: {
          address: deploymentInfo.contractAddress,
          blockNumber: deploymentInfo.deploymentBlock,
        },
      }),
    };

    // Write the combined information to a TypeScript file
    const abiPath = path.join(abiDir, `${contractName}.ts`);
    const fileContent = `const contractInfo = ${JSON.stringify(
      outputContent,
      null,
      2
    )} as const;\n\nexport default contractInfo;\n`;
    fs.writeFileSync(abiPath, fileContent);

    console.log(`Contract information file generated at ${abiPath}`);
  });
