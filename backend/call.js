const { Web3 } = require("web3");
require('dotenv').config({ path: require('find-config')('.env') })

// Loading the contract ABI
// (the results of a previous compilation step)
const fs = require("fs");
const { abi } = JSON.parse(fs.readFileSync("./abis/PolicyContract.json"));

async function main() {
  // Configuring the connection to an Ethereum node
  const network = process.env.ETHEREUM_NETWORK;
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`,
    ),
  );
  // Creating a signing account from a private key
  // console.log(process.env.SIGNER_PRIVATE_KEY)
  const signer = web3.eth.accounts.privateKeyToAccount(
    "0x" + process.env.SIGNER_PRIVATE_KEY
  );
  web3.eth.accounts.wallet.add(signer);
  // Creating a Contract instance
  const contract = new web3.eth.Contract(
    abi,
    // Replace this with the address of your deployed contract
    "0x5E798e38a10cBA3c4955BC845E3bC42b65b18E85",
  );
  // Issuing a transaction that calls the `echo` method
  const method_abi = contract.methods.createPolicy(1, 20).encodeABI();
  const tx = {
    from: signer.address,
    to: contract.options.address,
    data: method_abi,
    value: '1',
    gasPrice: '100000000000',
  };
  const gas_estimate = await web3.eth.estimateGas(tx);
  tx.gas = gas_estimate;
  const signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey);
  console.log("Raw transaction data: " + ( signedTx).rawTransaction);
  // Sending the transaction to the network
  const receipt = await web3.eth
    .sendSignedTransaction(signedTx.rawTransaction)
    .once("transactionHash", (txhash) => {
      console.log(`Mining transaction ...`);
      console.log(`https://${network}.etherscan.io/tx/${txhash}`);
    });
  // The transaction is now on chain!
  console.log(`Mined in block ${receipt.blockNumber}`);
}


main();