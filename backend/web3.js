const { Web3 } = require("web3");
const fs = require("fs");
const { abi } = JSON.parse(fs.readFileSync("./abis/PolicyContract.json"));

// Configuring the connection to an Ethereum node
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
  ),
);

// Creating a signing account from a private key

// Creating a Contract instance
const contract = new web3.eth.Contract(
  abi,
  "0xDEcfEb5601f5ac4Ac9a1a9271a98bDe97E63323E", // address of PolicyContract on Sepolia testnet
);

module.exports = { web3, contract }