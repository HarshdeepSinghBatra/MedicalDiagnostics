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
  "0x72112c6dcc644A5949DFba1FaAC29d7d9fdE462B", // address of PolicyContract on Sepolia testnet
);

module.exports = { web3, contract }