const { Web3 } = require("web3");
const fs = require("fs");
const policyAbi = JSON.parse(fs.readFileSync("./abis/PolicyContract.json"));
const medicalRecordsAbi = JSON.parse(fs.readFileSync("./abis/MedicalRecords.json"));

// Configuring the connection to an Ethereum node
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
  ),
);

// Creating a signing account from a private key

// Creating a Contract instance
const policyContract = new web3.eth.Contract(
  policyAbi.abi,
  "0x72112c6dcc644A5949DFba1FaAC29d7d9fdE462B", // address of PolicyContract on Sepolia testnet
);

const medicalRecordsContract = new web3.eth.Contract(
  medicalRecordsAbi.abi,
  "0x06EBEC24eeBddD0df0C71bFC47f023Cb1B95d20b", // address of MedicalRecordsContract on Sepolia testnet
);


module.exports = { web3, policyContract, medicalRecordsContract }