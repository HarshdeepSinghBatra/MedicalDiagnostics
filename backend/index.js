require('dotenv').config({ path: require('find-config')('.env') })

const express = require('express')
const app = express()
const port = process.env.PORT || 9000

app.use(express.json())

const cors = require('cors')
app.use(cors())

const { web3, contract } = require('./web3')


app.post('/createPolicy', async (req, res) => {
  try {

    const { name, premiumAmount, duration, maturityAmount } = req.body

    const signer = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.SIGNER_PRIVATE_KEY
    );
    // console.log(contract.methods)
    web3.eth.accounts.wallet.add(signer);
    const method_abi = contract.methods.createPolicy(name, premiumAmount, duration, maturityAmount).encodeABI(); // change method name and pass required args
    const tx = {
      from: signer.address,
      to: contract.options.address,
      data: method_abi,
      value: premiumAmount.toString(), // appropriate value if payable function
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
        console.log(`https://sepolia.etherscan.io/tx/${txhash}`);
      });
    // The transaction is now on chain!
    console.log(`Mined in block ${receipt.blockNumber}`);

    // get the emitted event values and send them as response
    await  contract.events.PolicyCreated({ fromBlock: receipt.blockNumber})
    .on('data', async (event) => {
      console.log('inside PolicyCreated event:', event.returnValues);
      const txEventRV = Object.fromEntries(
        Object.entries(event.returnValues).map(([key, value]) => [key, typeof value === 'bigint' ? String(value) : value])
      );
      res.status(200).json({message: "Inserted successfully", rv: txEventRV, txHash: receipt.transactionHash})
    })
    

  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error: " + err.message})
  }
})
app.post('/withdrawFunds', async (req, res) => {
  try {

    const signer = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.SIGNER_PRIVATE_KEY
    );
    // console.log(contract.methods)
    web3.eth.accounts.wallet.add(signer);
    const method_abi = contract.methods.withdraw().encodeABI(); // change method name and pass required args
    const tx = {
      from: signer.address,
      to: contract.options.address,
      data: method_abi,
      value: '0', // appropriate value if payable function
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
        console.log(`https://sepolia.etherscan.io/tx/${txhash}`);
      });
    // The transaction is now on chain!
    console.log(`Mined in block ${receipt.blockNumber}`);
    console.log(receipt)
    
    res.status(200).json({message: "Funds withdrawn successfully", txHash: receipt.transactionHash})


  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error: " + err.message})
  }
})

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
