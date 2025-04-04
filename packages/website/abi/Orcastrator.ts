const contractInfo = {
  "contractName": "Orcastrator",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_usdcAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_uniswapFactoryAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_symbol",
          "type": "string"
        }
      ],
      "name": "createFund",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "fundId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "fundAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "fundCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "funds",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "uniswapFactoryAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "usdcAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "deploymentInfo": {
    "address": "0xD9a78705706322037c0eCA1Ade8110FA3D5c0Fee",
    "blockNumber": 28501737
  }
} as const;

export default contractInfo;
