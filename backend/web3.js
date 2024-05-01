const { Web3 } = require("web3");
const fs = require("fs");
const policyAbi = JSON.parse(fs.readFileSync("./abis/PolicyContract.json"));
const medicalRecordsAbi = JSON.parse(fs.readFileSync("./abis/MedicalRecords.json"));
const claimsAbi = JSON.parse(fs.readFileSync("./abis/ClaimsContract.json"));

// Configuring the connection to an Ethereum node

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
  ),
);

// const web3 = new Web3(
//   new Web3.providers.HttpProvider(
//     `http://127.0.0.1:8545/`,
//   ),
// );  // localhost

// Creating a signing account from a private key

// Creating a Contract instance
const policyContract = new web3.eth.Contract(
  policyAbi.abi,
  "0x973EaCb48790546D44C8a6b1E576dadb16723f10", // address of PolicyContract on Sepolia testnet
  // "0x5FbDB2315678afecb367f032d93F642f64180aa3", // address of PolicyContract on localhost testnet
);

const medicalRecordsContract = new web3.eth.Contract(
  medicalRecordsAbi.abi,
  "0xb3BD8627Dc9961830DF88684F3E12A6A4aCD1bac", // address of MedicalRecordsContract on Sepolia testnet
  // "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // address of MedicalRecordsContract on localhost testnet
);

const claimsContract = new web3.eth.Contract(
  claimsAbi.abi,
  "0x6D25BaaB1B68f7d12d6C9A70105B96a9D9012560", // address of MedicalRecordsContract on Sepolia testnet
  // "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9", // address of MedicalRecordsContract on localhost testnet
);


module.exports = { web3, policyContract, medicalRecordsContract, claimsContract }