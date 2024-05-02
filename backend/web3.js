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
  "0x9a150d8Bb583eFc8ee3bE74B8c2B4f33AB230754", // address of PolicyContract on Sepolia testnet
  // "0x5FbDB2315678afecb367f032d93F642f64180aa3", // address of PolicyContract on localhost testnet
);

const medicalRecordsContract = new web3.eth.Contract(
  medicalRecordsAbi.abi,
  "0xE76173e361de0d92A63A05548Fd62a73A15e92DB", // address of MedicalRecordsContract on Sepolia testnet
  // "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // address of MedicalRecordsContract on localhost testnet
);

const claimsContract = new web3.eth.Contract(
  claimsAbi.abi,
  "0xb2eC74B68fa7199Be3e9447DcDe89D3dD58285F1", // address of MedicalRecordsContract on Sepolia testnet
  // "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", // address of MedicalRecordsContract on localhost testnet
);


module.exports = { web3, policyContract, medicalRecordsContract, claimsContract }